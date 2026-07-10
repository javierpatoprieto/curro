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
import { importarNumeroEnVapi } from "@/lib/vapi/telefono";
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
 * Error DURO de aprovisionamiento: un paso crítico (el assistant) falló, así que
 * la cuenta NO puede quedar activa. Lo lanzamos para que el llamante decida:
 *  - el webhook de Stripe lo re-lanza → responde !=200 → Stripe reintenta
 *    (self-healing: un cliente que pagó no se queda inactivo para siempre).
 *  - las server actions de admin lo capturan y lo dejan en "error" en la
 *    checklist (el admin reintenta desde la ficha).
 * Un paso NO crítico pendiente (telefono/agenda) NO lanza: no bloquea el pago.
 */
export class AprovisionamientoError extends Error {
  constructor(
    message: string,
    /** Estado final ya persistido (para inspección/logging). */
    readonly status: Record<PasoOnboarding, PasoEstado>,
  ) {
    super(message);
    this.name = "AprovisionamientoError";
  }
}

/**
 * Aprovisiona (o reaprovisiona) un negocio: crea el assistant, configura el
 * teléfono, marca agenda/whatsapp según plan+credenciales y activa la cuenta.
 * Devuelve el estado final (ya persistido). Idempotente.
 *
 * LANZA `AprovisionamientoError` si el paso crítico (assistant) falla y la
 * cuenta no queda activa: así el webhook de Stripe puede responder !=200 y
 * reintentar (self-healing). Un teléfono/agenda pendiente NO lanza.
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
  //
  // Defect 9: NO ignoramos el error del update. Un fallo de escritura (columna
  // que falta porque no se aplicó la migración 005, RLS, constraint) dejaría el
  // paso "hecho" en memoria pero SIN persistir → cuenta rota en silencio.
  // Lanzamos para que el fallo sea RUIDOSO: en el webhook eso fuerza un !=200 y
  // Stripe reintenta; en local, la columna que falta se detecta de inmediato.
  async function persistir(extra?: Record<string, unknown>) {
    const patch = { onboarding_status: status, ...(extra ?? {}) };
    Object.assign(biz as object, patch);
    const { error } = await admin
      .from("businesses")
      .update(patch)
      .eq("id", businessId);
    if (error) {
      throw new Error(
        `aprovisionarNegocio: no se pudo persistir el negocio ${businessId}: ${
          error.message ?? String(error)
        }`,
      );
    }
  }

  const debeEjecutar = (paso: PasoOnboarding) =>
    (!opts.soloPaso || opts.soloPaso === paso) &&
    status[paso]?.estado !== "omitido";

  // --- (a) assistant ---------------------------------------------------------
  if (debeEjecutar("assistant")) {
    try {
      let assistantId = biz.vapi_assistant_id;
      if (assistantId) {
        // Idempotente: si ya existe, re-sincronizamos en vez de recrear (no
        // creamos un segundo assistant de pago). Cubre el caso del defect 10:
        // si una ejecución anterior creó el assistant y persistió su id, el
        // reintento hace UPDATE, nunca un CREATE duplicado.
        await actualizarAssistant(assistantId, configDesdeNegocio(biz, false));
      } else {
        assistantId = await crearAssistant(configDesdeNegocio(biz, false));
        // Defect 10: persistimos el id recién creado INMEDIATAMENTE, en su
        // propia escritura comprobada, ANTES de tocar el estado. Así, si una
        // escritura posterior falla y se reintenta, ya encontramos el id y
        // hacemos UPDATE (arriba) en vez de crear un assistant duplicado.
        await persistir({ vapi_assistant_id: assistantId });
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
        // 1) Asegurar el NÚMERO comprado en Twilio (idempotente).
        // Defect 8: idempotencia best-effort (read-then-act, NO atómico). Nos
        // protege del reintento secuencial habitual; NO de dos aprovisionamientos
        // concurrentes del mismo negocio (caso muy raro: alta única + webhook).
        let sid = biz.vapi_phone_number_id;
        let telefono = biz.telefono_entrante;
        if (!sid) {
          const numero = await buscarNumeroES();
          // Re-leemos la fila JUSTO antes de comprar: si otra ejecución compró
          // entre medias, evitamos el doble cobro (double-buy) del número.
          const { data: fresco } = await admin
            .from("businesses")
            .select("vapi_phone_number_id, telefono_entrante")
            .eq("id", businessId)
            .maybeSingle();
          const yaComprado = (fresco as BizRow | null)?.vapi_phone_number_id;
          if (yaComprado) {
            sid = yaComprado;
            telefono = (fresco as BizRow | null)?.telefono_entrante ?? yaComprado;
          } else {
            const comprado = await comprarNumero(numero, {
              voiceUrl: inboundUrl(),
            });
            sid = comprado.sid;
            telefono = comprado.phoneNumber;
          }
          await persistir({
            vapi_phone_number_id: sid,
            telefono_entrante: telefono,
          });
        }

        // 2) Importar el número a Vapi para que atienda las ENTRANTES con el
        // assistant (BYO Twilio: Vapi configura el webhook de voz del número).
        // Idempotente: solo si aún no está importado. Si el paso (1) fue bien pero
        // esto falla, el `catch` lo deja en "error" y el reintento re-importa
        // (el número ya está comprado, no se recompra).
        if (!biz.vapi_phone_id && biz.vapi_assistant_id && telefono) {
          const vapiPhone = await importarNumeroEnVapi({
            numero: telefono,
            assistantId: biz.vapi_assistant_id,
            name: biz.nombre,
          });
          await persistir({ vapi_phone_id: vapiPhone.id });
        }

        status = marcarPaso(status, "telefono", "hecho", {
          detalle: telefono ?? sid ?? "número dedicado",
        });
        await persistir();
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
  //
  // Defect 4: SIEMPRE re-evaluamos la puerta de activación tras ejecutar
  // cualquier paso — también en un reintento `soloPaso` (p. ej. arreglas el
  // teléfono → la cuenta debe activarse). Antes, un `soloPaso` no re-evaluaba
  // `activo` y una cuenta arreglada se quedaba inactiva.
  const assistantOk = status.assistant?.estado === "hecho";
  const telefonoOk =
    status.telefono?.estado === "hecho" ||
    status.telefono?.estado === "omitido";
  const listo = assistantOk && telefonoOk;
  if (listo) {
    status = marcarPaso(status, "activo", "hecho");
    // Defect 5: el paso `activo` es AUTORITATIVO: solo aquí ponemos activo:true.
    await persistir({ activo: true });
  } else {
    status = marcarPaso(status, "activo", "pendiente");
    // Defect 5: escribimos activo:false EXPLÍCITAMENTE. Un negocio insertado con
    // activo:true (default del alta admin) cuyo assistant falle NO puede quedar
    // activo sin asistente. Nunca dejamos un `true` obsoleto.
    await persistir({ activo: false });
  }

  const estadoCompleto = completarEstado(status);

  // Defect 1: si el paso CRÍTICO (assistant) falló, la cuenta no queda activa.
  // Lanzamos un error DURO para que el webhook de Stripe responda !=200 y
  // reintente (self-healing). Un teléfono/agenda pendiente NO es crítico: no
  // lanza (la cuenta puede activarse igual y el resto se reintenta a mano).
  if (status.assistant?.estado === "error") {
    throw new AprovisionamientoError(
      `aprovisionarNegocio: el assistant falló para ${businessId}; la cuenta no se activó` +
        (status.assistant?.detalle ? ` (${status.assistant.detalle})` : ""),
      estadoCompleto,
    );
  }

  // Devolvemos el estado completo (todos los pasos presentes).
  return estadoCompleto;
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
