"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentContext } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import { actualizarAssistant } from "@/lib/vapi/assistant";

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
  try {
    if (context.business.vapi_assistant_id) {
      await actualizarAssistant(context.business.vapi_assistant_id, {
        negocio: d.nombre,
        ciudad: d.ciudad ?? null,
        servicios: d.servicios ?? null,
        zonas: d.zonas ?? null,
        horario: d.horario ?? null,
        tono: d.tono ?? null,
        preguntas_clave: d.preguntas_clave ?? null,
        conocimiento: d.conocimiento ?? null,
      });
    }
  } catch (e) {
    console.error("[ajustes] no se pudo re-sincronizar el assistant:", e);
  }

  revalidatePath("/panel/ajustes");
  return { ok: true } as const;
}
