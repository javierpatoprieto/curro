"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { createAdminClient } from "@/lib/supabase/admin";
import { crearAssistant } from "@/lib/vapi/assistant";
import { crearCheckout } from "@/lib/stripe/client";

const schema = z.object({
  nombre: z.string().min(2, "Nombre demasiado corto"),
  ciudad: z.string().optional(),
  email: z.email("Email no válido"),
  whatsapp: z.string().optional(),
  cal_link: z.union([z.url(), z.literal("")]).optional(),
  plan: z.enum(["starter", "pro", "premium"]),
});

export async function crearNegocio(formData: FormData) {
  const parsed = schema.safeParse({
    nombre: formData.get("nombre"),
    ciudad: formData.get("ciudad") || undefined,
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp") || undefined,
    cal_link: formData.get("cal_link") || "",
    plan: formData.get("plan"),
  });
  if (!parsed.success) redirect("/onboarding?error=validacion");
  const d = parsed.data;

  // 1) Crear el assistant de Vapi (mock si no hay API key / modo mock).
  const assistantId = await crearAssistant({
    negocio: d.nombre,
    ciudad: d.ciudad ?? null,
  });

  // 2) Persistir el negocio + owner (salvo en demo sin Supabase).
  let businessId = "demo";
  if (!isDemoMode()) {
    const user = await getSessionUser();
    if (!user) redirect("/login?next=/onboarding");

    const admin = createAdminClient();
    const { data: biz, error } = await admin
      .from("businesses")
      .insert({
        nombre: d.nombre,
        ciudad: d.ciudad ?? null,
        cal_link: d.cal_link || null,
        vapi_assistant_id: assistantId,
        plan: "trial",
        activo: true,
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

  // 3) Suscripción: Stripe Checkout (o pantalla de éxito en demo).
  const url = await crearCheckout({
    plan: d.plan,
    businessId,
    email: d.email,
  });
  redirect(url);
}
