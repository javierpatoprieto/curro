"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentContext, type CurrentContext } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { actualizarAssistant } from "@/lib/vapi/assistant";
import { configDesdeNegocio } from "@/lib/vapi/config-negocio";
import {
  calConectado as leerCalConectado,
  guardarCalIntegracion,
} from "@/lib/cal/integracion";
import {
  parseContactoDueno,
  normalizarContactoDueno,
} from "@/lib/owners/contacto";

const schema = z.object({
  nombre: z.string().min(2),
  ciudad: z.string().optional(),
  cal_link: z.union([z.url(), z.literal("")]).optional(),
  servicios: z.string().optional(),
  zonas: z.string().optional(),
  horario: z.string().optional(),
  tono: z.string().optional(),
  preguntas_clave: z.string().optional(),
  conocimiento: z.string().optional(),
});

/**
 * Guarda los ajustes del negocio y re-sincroniza el guion del assistant de Vapi.
 * En modo demo no persiste (no hay Supabase).
 */
export async function guardarAjustes(formData: FormData) {
  const g = (k: string) => (formData.get(k) as string) || undefined;
  const parsed = schema.safeParse({
    nombre: g("nombre"),
    ciudad: g("ciudad"),
    cal_link: formData.get("cal_link") || "",
    servicios: g("servicios"),
    zonas: g("zonas"),
    horario: g("horario"),
    tono: g("tono"),
    preguntas_clave: g("preguntas_clave"),
    conocimiento: g("conocimiento"),
  });
  if (!parsed.success) return { ok: false, error: "validacion" as const };
  const d = parsed.data;

  if (isDemoMode()) return { ok: true, demo: true } as const;

  const context = await getCurrentContext();
  if (!context) return { ok: false, error: "no-autorizado" as const };

  const supabase = await createClient();
  const { error } = await supabase
    .from("businesses")
    .update({
      nombre: d.nombre,
      ciudad: d.ciudad ?? null,
      cal_link: d.cal_link || null,
      servicios: d.servicios ?? null,
      zonas: d.zonas ?? null,
      horario: d.horario ?? null,
      tono: d.tono ?? null,
      preguntas_clave: d.preguntas_clave ?? null,
      conocimiento: d.conocimiento ?? null,
    })
    .eq("id", context.business.id);
  if (error) return { ok: false, error: "db" as const };

  // Re-sincroniza el guion en Vapi (no-op en mock o sin assistant real).
  // Incluimos calConectado para NO perder las tools de agendado al editar ajustes.
  try {
    if (context.business.vapi_assistant_id) {
      const calCon = await leerCalConectado(createAdminClient(), context.business.id);
      await actualizarAssistant(context.business.vapi_assistant_id, {
        negocio: d.nombre,
        ciudad: d.ciudad ?? null,
        servicios: d.servicios ?? null,
        zonas: d.zonas ?? null,
        horario: d.horario ?? null,
        tono: d.tono ?? null,
        preguntas_clave: d.preguntas_clave ?? null,
        conocimiento: d.conocimiento ?? null,
        calConectado: calCon,
      });
    }
  } catch (e) {
    console.error("[ajustes] no se pudo re-sincronizar el assistant:", e);
  }

  revalidatePath("/panel/ajustes");
  return { ok: true } as const;
}

/**
 * El propio dueño edita su contacto de avisos (email/whatsapp) sobre `owners`.
 * `owners` no tiene policy de UPDATE para usuarios (ver supabase/schema.sql), así
 * que escribimos con service_role, acotado a la fila del dueño autenticado. En
 * demo no persiste.
 */
export async function guardarContactoDueno(formData: FormData) {
  const parsed = parseContactoDueno(formData);
  if (!parsed.success) return { ok: false, error: "validacion" as const };

  if (isDemoMode()) return { ok: true, demo: true } as const;

  const context = await getCurrentContext();
  if (!context) return { ok: false, error: "no-autorizado" as const };

  const admin = createAdminClient();
  const { error } = await admin
    .from("owners")
    .update(normalizarContactoDueno(parsed.data))
    .eq("id", context.owner.id);
  if (error) return { ok: false, error: "db" as const };

  revalidatePath("/panel/ajustes");
  return { ok: true } as const;
}

const calSchema = z.object({
  cal_api_key: z.string().min(8),
  cal_event_type_id: z.string().min(1),
});

/**
 * Conecta Cal.com para el negocio: guarda la API key + tipo de evento (solo las
 * ve el service_role) y re-sincroniza el assistant para que gane las tools de
 * agendado. En demo no persiste.
 */
export async function conectarCal(formData: FormData) {
  const parsed = calSchema.safeParse({
    cal_api_key: (formData.get("cal_api_key") as string)?.trim(),
    cal_event_type_id: (formData.get("cal_event_type_id") as string)?.trim(),
  });
  if (!parsed.success) return { ok: false, error: "validacion" as const };

  if (isDemoMode()) return { ok: true, demo: true } as const;

  const context = await getCurrentContext();
  if (!context) return { ok: false, error: "no-autorizado" as const };

  const admin = createAdminClient();
  try {
    await guardarCalIntegracion(admin, context.business.id, parsed.data);
  } catch (e) {
    console.error("[ajustes] no se pudo guardar la integración de Cal.com:", e);
    return { ok: false, error: "db" as const };
  }

  await resincronizar(context, true);
  revalidatePath("/panel/ajustes");
  return { ok: true } as const;
}

/** Desconecta Cal.com: borra la key y quita las tools del assistant. */
export async function desconectarCal() {
  if (isDemoMode()) return { ok: true, demo: true } as const;

  const context = await getCurrentContext();
  if (!context) return { ok: false, error: "no-autorizado" as const };

  const admin = createAdminClient();
  try {
    await guardarCalIntegracion(admin, context.business.id, {
      cal_api_key: null,
      cal_event_type_id: null,
    });
  } catch (e) {
    console.error("[ajustes] no se pudo desconectar Cal.com:", e);
    return { ok: false, error: "db" as const };
  }

  await resincronizar(context, false);
  revalidatePath("/panel/ajustes");
  return { ok: true } as const;
}

/** Re-sincroniza el assistant con el estado de Cal.com (no-op en mock/sin id). */
async function resincronizar(context: CurrentContext, calConectado: boolean) {
  try {
    if (context.business.vapi_assistant_id) {
      await actualizarAssistant(
        context.business.vapi_assistant_id,
        configDesdeNegocio(context.business, calConectado),
      );
    }
  } catch (e) {
    console.error("[ajustes] no se pudo re-sincronizar el assistant:", e);
  }
}
