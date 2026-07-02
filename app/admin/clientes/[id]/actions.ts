"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { actualizarAssistant, eliminarAssistant } from "@/lib/vapi/assistant";
import { getStripe, stripeConfigurado } from "@/lib/stripe/client";

const schema = z.object({
  nombre: z.string().min(2),
  ciudad: z.string().optional(),
  plan: z.enum(["trial", "starter", "pro", "premium", "cancelado"]),
  activo: z.boolean(),
  cal_link: z.union([z.url(), z.literal("")]).optional(),
  // Campos de texto libre: se concatenan al system prompt del assistant, así que
  // se acotan para evitar prompts gigantes o inyección sobre el propio tenant.
  servicios: z.string().max(1000).optional(),
  zonas: z.string().max(1000).optional(),
  horario: z.string().max(200).optional(),
  // tono: solo los 3 valores que entiende el assistant (ver lib/vapi/assistant.ts).
  tono: z.enum(["cercano", "profesional", "comercial"]).or(z.literal("")).optional(),
  preguntas_clave: z.string().max(1000).optional(),
  conocimiento: z.string().max(4000).optional(),
});

/** Edita/personaliza un cliente y re-sincroniza su assistant de Vapi. */
export async function guardarCliente(id: string, formData: FormData) {
  await exigirAdmin();

  const g = (k: string) => (formData.get(k) as string) || undefined;
  const parsed = schema.safeParse({
    nombre: g("nombre"),
    ciudad: g("ciudad"),
    plan: g("plan"),
    activo: formData.get("activo") === "on",
    cal_link: formData.get("cal_link") || "",
    servicios: g("servicios"),
    zonas: g("zonas"),
    horario: g("horario"),
    tono: g("tono"),
    preguntas_clave: g("preguntas_clave"),
    conocimiento: g("conocimiento"),
  });
  if (!parsed.success) redirect(`/admin/clientes/${id}?error=validacion`);
  const d = parsed.data;

  const admin = createAdminClient();
  const { data: biz, error } = await admin
    .from("businesses")
    .update({
      nombre: d.nombre,
      ciudad: d.ciudad ?? null,
      plan: d.plan,
      activo: d.activo,
      cal_link: d.cal_link || null,
      servicios: d.servicios ?? null,
      zonas: d.zonas ?? null,
      horario: d.horario ?? null,
      tono: d.tono ?? null,
      preguntas_clave: d.preguntas_clave ?? null,
      conocimiento: d.conocimiento ?? null,
    })
    .eq("id", id)
    .select("vapi_assistant_id")
    .maybeSingle();
  if (error) redirect(`/admin/clientes/${id}?error=db`);

  // Re-sincroniza el guion en Vapi (no-op en mock/sin key).
  try {
    if (biz?.vapi_assistant_id) {
      await actualizarAssistant(biz.vapi_assistant_id, {
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
    console.error("[admin] no se pudo re-sincronizar el assistant:", e);
  }

  revalidatePath(`/admin/clientes/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/clientes/${id}?ok=1`);
}

/**
 * Borra un cliente por completo. Confirmación por nombre. Además:
 *  - cancela su suscripción de Stripe (deja de facturar),
 *  - borra su assistant de Vapi (evita coste huérfano),
 *  - elimina la fila de businesses (las tablas hijas caen por ON DELETE CASCADE).
 */
export async function borrarCliente(id: string, formData: FormData) {
  await exigirAdmin();

  const confirmacion = String(formData.get("confirm") ?? "").trim();
  const admin = createAdminClient();

  const { data: biz } = await admin
    .from("businesses")
    .select("nombre, vapi_assistant_id, stripe_subscription_id")
    .eq("id", id)
    .maybeSingle();
  if (!biz) redirect("/admin");
  if (confirmacion !== biz.nombre) {
    redirect(`/admin/clientes/${id}?error=confirm`);
  }

  try {
    if (stripeConfigurado() && biz.stripe_subscription_id) {
      await getStripe().subscriptions.cancel(biz.stripe_subscription_id);
    }
  } catch (e) {
    console.error("[admin] no se pudo cancelar la suscripción:", e);
  }

  try {
    if (biz.vapi_assistant_id) await eliminarAssistant(biz.vapi_assistant_id);
  } catch (e) {
    console.error("[admin] no se pudo borrar el assistant:", e);
  }

  // Las FKs de las tablas hijas (owners, leads, messages, call_events,
  // business_integrations) declaran ON DELETE CASCADE: basta con borrar la fila
  // de businesses para que Postgres elimine el resto de forma atómica.
  await admin.from("businesses").delete().eq("id", id);

  revalidatePath("/admin");
  redirect("/admin?borrado=1");
}
