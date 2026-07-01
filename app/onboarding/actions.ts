"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { crearCheckout } from "@/lib/stripe/client";

const schema = z.object({
  nombre: z.string().min(2, "Nombre demasiado corto"),
  ciudad: z.string().optional(),
  email: z.email("Email no válido"),
  whatsapp: z.string().optional(),
  cal_link: z.union([z.url(), z.literal("")]).optional(),
  plan: z.enum(["starter", "pro", "premium"]),
  // Personalización del guion (opcional).
  servicios: z.string().optional(),
  zonas: z.string().optional(),
  horario: z.string().optional(),
  tono: z.string().optional(),
  preguntas_clave: z.string().optional(),
  conocimiento: z.string().optional(),
});

export async function crearNegocio(formData: FormData) {
  const g = (k: string) => (formData.get(k) as string) || undefined;
  const parsed = schema.safeParse({
    nombre: g("nombre"),
    ciudad: g("ciudad"),
    email: g("email"),
    whatsapp: g("whatsapp"),
    cal_link: formData.get("cal_link") || "",
    plan: g("plan"),
    servicios: g("servicios"),
    zonas: g("zonas"),
    horario: g("horario"),
    tono: g("tono"),
    preguntas_clave: g("preguntas_clave"),
    conocimiento: g("conocimiento"),
  });
  if (!parsed.success) redirect("/onboarding?error=validacion");
  const d = parsed.data;

  // Persistimos el negocio como INACTIVO y SIN assistant de Vapi. El alta real
  // (crear el assistant + activar la cuenta) la hace el webhook de Stripe cuando
  // el pago se confirma. Así, si el usuario abandona el checkout, no dejamos ni
  // un assistant huérfano (coste) ni una cuenta activa gratis para siempre.
  let businessId = "demo";
  if (!isDemoMode()) {
    const user = await getSessionUser();
    if (!user) redirect("/login?next=/onboarding");

    const admin = createAdminClient();

    // Anti-duplicados: si el usuario ya tiene un negocio, al panel.
    const { data: yaExiste } = await admin
      .from("owners")
      .select("business_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (yaExiste) redirect("/panel");

    const { data: biz, error } = await admin
      .from("businesses")
      .insert({
        nombre: d.nombre,
        ciudad: d.ciudad ?? null,
        cal_link: d.cal_link || null,
        vapi_assistant_id: null, // lo crea el webhook de Stripe tras el pago
        plan: "trial",
        activo: false, // se activa al confirmarse el checkout
        servicios: d.servicios ?? null,
        zonas: d.zonas ?? null,
        horario: d.horario ?? null,
        tono: d.tono ?? null,
        preguntas_clave: d.preguntas_clave ?? null,
        conocimiento: d.conocimiento ?? null,
      })
      .select("id")
      .single();
    if (error || !biz) redirect("/onboarding?error=db");
    businessId = biz.id;

    await admin.from("owners").insert({
      business_id: businessId,
      user_id: user.id,
      email: d.email,
      whatsapp: d.whatsapp ?? null,
      rol: "owner",
    });
  }

  // Suscripción: Stripe Checkout (o pantalla de éxito en demo).
  const url = await crearCheckout({
    plan: d.plan,
    businessId,
    email: d.email,
  });
  redirect(url);
}
