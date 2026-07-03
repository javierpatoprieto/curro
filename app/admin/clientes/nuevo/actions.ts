"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { crearAssistant } from "@/lib/vapi/assistant";

const schema = z.object({
  nombre: z.string().min(2),
  email: z.email(),
  ciudad: z.string().optional(),
  actividad: z.string().max(120).optional(),
  plan: z.enum(["trial", "starter", "pro", "premium"]),
  activo: z.boolean(),
  voz: z.enum(["femenina", "masculina"]),
  whatsapp: z.string().optional(),
  cal_link: z.union([z.url(), z.literal("")]).optional(),
  tono: z.enum(["cercano", "profesional", "comercial"]).or(z.literal("")).optional(),
  servicios: z.string().max(1000).optional(),
  zonas: z.string().max(1000).optional(),
  horario: z.string().max(200).optional(),
  preguntas_clave: z.string().max(1000).optional(),
  conocimiento: z.string().max(4000).optional(),
});

/**
 * Alta de cliente desde el panel de admin: crea el assistant de Vapi con la
 * personalización (incluida la voz) e inserta el negocio + su propietario. Un solo
 * volcado de datos → todo montado. Sin Stripe (alta manual del superadmin).
 */
export async function crearClienteAdmin(formData: FormData) {
  await exigirAdmin();

  const g = (k: string) => (formData.get(k) as string) || undefined;
  const parsed = schema.safeParse({
    nombre: g("nombre"),
    email: g("email"),
    ciudad: g("ciudad"),
    actividad: g("actividad"),
    plan: g("plan"),
    activo: formData.get("activo") === "on",
    voz: g("voz"),
    whatsapp: g("whatsapp"),
    cal_link: formData.get("cal_link") || "",
    tono: g("tono"),
    servicios: g("servicios"),
    zonas: g("zonas"),
    horario: g("horario"),
    preguntas_clave: g("preguntas_clave"),
    conocimiento: g("conocimiento"),
  });
  if (!parsed.success) redirect("/admin/clientes/nuevo?error=validacion");
  const d = parsed.data;

  const config = {
    negocio: d.nombre,
    ciudad: d.ciudad ?? null,
    actividad: d.actividad ?? null,
    voz: d.voz,
    servicios: d.servicios ?? null,
    zonas: d.zonas ?? null,
    horario: d.horario ?? null,
    tono: d.tono || null,
    preguntas_clave: d.preguntas_clave ?? null,
    conocimiento: d.conocimiento ?? null,
  };

  // 1) Crear el assistant de Vapi (mock si no hay VAPI_API_KEY). Si falla, abortamos
  //    para no dejar un negocio a medias sin assistant.
  let assistantId: string;
  try {
    assistantId = await crearAssistant(config);
  } catch (e) {
    console.error("[admin] no se pudo crear el assistant de Vapi:", e);
    redirect("/admin/clientes/nuevo?error=vapi");
  }

  // 2) Insertar el negocio ya con su assistant.
  const admin = createAdminClient();
  const { data: biz, error } = await admin
    .from("businesses")
    .insert({
      nombre: d.nombre,
      ciudad: d.ciudad ?? null,
      actividad: d.actividad ?? null,
      voz: d.voz,
      plan: d.plan,
      activo: d.activo,
      cal_link: d.cal_link || null,
      vapi_assistant_id: assistantId,
      servicios: d.servicios ?? null,
      zonas: d.zonas ?? null,
      horario: d.horario ?? null,
      tono: d.tono || null,
      preguntas_clave: d.preguntas_clave ?? null,
      conocimiento: d.conocimiento ?? null,
    })
    .select("id")
    .single();
  if (error || !biz) {
    console.error("[admin] no se pudo crear el negocio:", error);
    redirect("/admin/clientes/nuevo?error=db");
  }

  // 3) Crear el propietario (se enlazará a su usuario al primer login por email).
  await admin.from("owners").insert({
    business_id: biz.id,
    email: d.email,
    whatsapp: d.whatsapp ?? null,
    rol: "owner",
  });

  revalidatePath("/admin");
  redirect(`/admin/clientes/${biz.id}?ok=1`);
}
