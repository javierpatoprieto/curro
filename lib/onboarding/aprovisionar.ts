/**
 * Orquestador del aprovisionamiento (Fase 2). SOLO servidor: llama a los
 * adaptadores de proveedores (Vapi, Twilio) y persiste el estado por pasos en
 * `businesses.onboarding_status` tras cada paso. En mock (por defecto) cada paso
 * es instantáneo; en real, la cola/cron se difiere (ver el plan).
 *
 * Gating: usa `puede()` (fuente única de verdad) para saber qué pasos aplican.
 * Todo lo que necesite el número/bundle real de Twilio corre gated y mockable
 * (ver lib/twilio/numeros.ts).
 */

import type { createAdminClient } from "@/lib/supabase/admin";
import type { Business, Plan } from "@/lib/types";
import { env } from "@/lib/env";
import { puede } from "@/lib/plans";
import { crearAssistant, actualizarAssistant } from "@/lib/vapi/assistant";
import { configDesdeNegocio } from "@/lib/vapi/config-negocio";
import { getCalIntegracion } from "@/lib/cal/integracion";
import { buscarNumeroES, comprarNumero } from "@/lib/twilio/numeros";
import {
  PASOS,
  estadoInicial,
  marcarPaso,
  type OnboardingStatus,
  type PasoOnboarding,
  type PasoEstado,
} from "@/lib/onboarding/estado";

type Admin = ReturnType<typeof createAdminClient>;

/** Fila mínima del negocio que necesita el orquestador. */
type BizRow = Business;

const appUrl = () =>
  env.APP_URL || env.NEXT_PUBLIC_APP_URL || "https://curro-kappa.vercel.app";

/** Endpoint inbound al que apuntamos el VoiceUrl del número dedicado. */
const inboundUrl = () => `${appUrl()}/api/webhooks/twilio/inbound`;

interface Opciones {
  /** Si se indica, reintenta SOLO ese paso (conserva el resto del estado). */
  soloPaso?: PasoOnboarding;
}

/**
 * Aprovisiona (o reaprovisiona) un negocio: crea el assistant, configura el
 * teléfono, marca agenda/whatsapp según plan+credenciales y activa la cuenta.
 * Devuelve el estado final (ya persistido). Idempotente.
 */
export async function aprovisionarNegocio(
  admin: Admin,
  businessId: string,
  opts: Opciones = {},
): Promise<Record<PasoOnboarding, PasoEstado>> {
  const { data: bizData } = await admin
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();
  const biz = bizData as BizRow | null;
  if (!biz) {
    throw new Error(`aprovisionarNegocio: negocio ${businessId} no encontrado`);
  }

  const plan = biz.plan as Plan;
  const phoneMode = biz.phone_mode ?? "none";

  // Estado de partida: si reintentamos un solo paso, arrancamos del estado
  // guardado (rellenando huecos); si no, del estado inicial calculado por plan.
  const base = estadoInicial(plan, phoneMode);
  let status: OnboardingStatus = opts.soloPaso
    ? { ...base, ...(biz.onboarding_status ?? {}) }
    : base;

  // Persiste el estado en la BD (tras cada paso). Actualiza también el `store`
  // local (biz) para que los pasos siguientes lean lo recién escrito.
  async function persistir(extra?: Record<string, unknown>) {
    const patch = { onboarding_status: status, ...(extra ?? {}) };
    Object.assign(biz as object, patch);
    await admin.from("businesses").update(patch).eq("id", businessId);
  }

  const debeEjecutar = (paso: PasoOnboarding) =>
    (!opts.soloPaso || opts.soloPaso === paso) &&
    status[paso]?.estado !== "omitido";

  // --- (a) assistant ---------------------------------------------------------
  if (debeEjecutar("assistant")) {
    try {
      let assistantId = biz.vapi_assistant_id;
      if (assistantId) {
        // Idempotente: si ya existe, re-sincronizamos en vez de recrear.
        await actualizarAssistant(
          assistantId,
          configDesdeNegocio(biz, false),
        );
      } else {
        assistantId = await crearAssistant(configDesdeNegocio(biz, false));
      }
      status = marcarPaso(status, "assistant", "hecho", { detalle: assistantId });
      await persistir({ vapi_assistant_id: assistantId });
    } catch (e) {
      status = marcarPaso(status, "assistant", "error", { detalle: msg(e) });
      await persistir();
    }
  }

  // --- (b) teléfono ----------------------------------------------------------
  if (debeEjecutar("telefono")) {
    try {
      if (phoneMode === "forward") {
        // Desvío: el número que ya tiene el cliente es el que atiende Curro.
        const destino = biz.forward_target ?? biz.telefono_entrante ?? null;
        status = marcarPaso(status, "telefono", "hecho", {
          detalle: destino ? `desvío a ${destino}` : "desvío",
        });
        await persistir({
          forward_target: destino,
          telefono_entrante: biz.telefono_entrante ?? destino,
        });
      } else if (phoneMode === "new" && puede(plan, "numeroDedicado")) {
        if (biz.vapi_phone_number_id) {
          // Idempotente: ya hay número comprado, no recompramos.
          status = marcarPaso(status, "telefono", "hecho", {
            detalle: biz.telefono_entrante ?? biz.vapi_phone_number_id,
          });
          await persistir();
        } else {
          const numero = await buscarNumeroES();
          const comprado = await comprarNumero(numero, {
            voiceUrl: inboundUrl(),
          });
          status = marcarPaso(status, "telefono", "hecho", {
            detalle: comprado.phoneNumber,
          });
          await persistir({
            vapi_phone_number_id: comprado.sid,
            telefono_entrante: comprado.phoneNumber,
          });
        }
      } else {
        // 'none' o 'new' sin numeroDedicado en el plan → no aplica.
        status = marcarPaso(status, "telefono", "omitido");
        await persistir();
      }
    } catch (e) {
      status = marcarPaso(status, "telefono", "error", { detalle: msg(e) });
      await persistir();
    }
  }

  // --- (c) agenda ------------------------------------------------------------
  if (debeEjecutar("agenda")) {
    if (!puede(plan, "agenda")) {
      status = marcarPaso(status, "agenda", "omitido");
    } else {
      try {
        const cal = await getCalIntegracion(admin, businessId);
        const conectado = Boolean(cal?.cal_api_key && cal?.cal_event_type_id);
        status = marcarPaso(
          status,
          "agenda",
          conectado ? "hecho" : "pendiente",
          conectado ? undefined : { detalle: "sin credenciales de Cal.com" },
        );
      } catch (e) {
        status = marcarPaso(status, "agenda", "error", { detalle: msg(e) });
      }
    }
    await persistir();
  }

  // --- (d) whatsapp ----------------------------------------------------------
  if (debeEjecutar("whatsapp")) {
    status = marcarPaso(
      status,
      "whatsapp",
      puede(plan, "confirmacionCliente") ? "hecho" : "omitido",
    );
    await persistir();
  }

  // --- (e) activo ------------------------------------------------------------
  // La cuenta se activa si el assistant está hecho y el teléfono está hecho u
  // omitido (omitido = no bloquea). Si no, queda pendiente.
  if (debeEjecutar("activo") || opts.soloPaso === undefined) {
    const assistantOk = status.assistant?.estado === "hecho";
    const telefonoOk =
      status.telefono?.estado === "hecho" ||
      status.telefono?.estado === "omitido";
    if (assistantOk && telefonoOk) {
      status = marcarPaso(status, "activo", "hecho");
      await persistir({ activo: true });
    } else {
      status = marcarPaso(status, "activo", "pendiente");
      await persistir();
    }
  }

  // Devolvemos el estado completo (todos los pasos presentes).
  return completarEstado(status);
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/** Garantiza que los 5 pasos estén presentes (para consumidores tipados). */
function completarEstado(
  status: OnboardingStatus,
): Record<PasoOnboarding, PasoEstado> {
  const out = {} as Record<PasoOnboarding, PasoEstado>;
  for (const paso of PASOS) {
    out[paso] = status[paso] ?? { estado: "pendiente" };
  }
  return out;
}
