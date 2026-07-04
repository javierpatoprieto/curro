"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { crearAssistant } from "@/lib/vapi/assistant";
import { guardarCalIntegracion } from "@/lib/cal/integracion";
import { capacidadesEfectivas } from "@/lib/plans";

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
  agenda: z.boolean().optional(),
  confirmacion_cliente: z.boolean().optional(),
  cal_api_key: z.string().optional(),
  cal_event_type_id: z.string().optional(),
  phone_mode: z.enum(["forward", "new", "none"]).optional(),
  telefono_entrante: z.string().max(32).optional(),
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
    agenda: formData.get("agenda") === "on",
    confirmacion_cliente: formData.get("confirmacion_cliente") === "on",
    cal_api_key: g("cal_api_key"),
    cal_event_type_id: g("cal_event_type_id"),
    phone_mode: g("phone_mode"),
    telefono_entrante: g("telefono_entrante"),
  });
  if (!parsed.success) redirect("/admin/clientes/nuevo?error=validacion");
  const d = parsed.data;

  // Gating por plan: lo pedido en el formulario solo se aplica si el plan lo
  // incluye (starter no puede acabar con agenda aunque el admin la marque).
  const caps = capacidadesEfectivas(d.plan, {
    agenda: d.agenda,
    confirmacionCliente: d.confirmacion_cliente,
  });
  const calConectado = caps.agenda && Boolean(d.cal_api_key && d.cal_event_type_id);

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
    calConectado,
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
      telefono_entrante: d.telefono_entrante ?? null,
    })
    .select("id")
    .single();
  if (error || !biz) {
    console.error("[admin] no se pudo crear el negocio:", error);
    redirect("/admin/clientes/nuevo?error=db");
  }

  // 2b) Si el plan permite agenda y nos dieron credenciales de Cal.com, las
  // guardamos ya. No abortamos el alta si esto falla: el dueño puede
  // conectarlo luego desde su panel.
  if (caps.agenda && d.cal_api_key && d.cal_event_type_id) {
    try {
      await guardarCalIntegracion(admin, biz.id, {
        cal_api_key: d.cal_api_key,
        cal_event_type_id: d.cal_event_type_id,
      });
    } catch (e) {
      console.error("[admin] no se pudo guardar la integración de Cal.com:", e);
    }
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
