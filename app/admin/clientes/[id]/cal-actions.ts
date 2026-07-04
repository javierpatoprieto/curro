"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { actualizarAssistant } from "@/lib/vapi/assistant";
import { configDesdeNegocio } from "@/lib/vapi/config-negocio";
import { guardarCalIntegracion } from "@/lib/cal/integracion";
import { calPermitidoParaPlan } from "@/lib/plans";

const calSchema = z.object({
  cal_api_key: z.string().min(8),
  cal_event_type_id: z.string().min(1),
});

/**
 * El ADMIN conecta Cal.com para un cliente desde su ficha (mismo mecanismo que
 * /panel/ajustes). Gated por plan: solo si el plan del negocio incluye "agenda".
 */
export async function guardarCalAdmin(businessId: string, formData: FormData) {
  await exigirAdmin();

  const admin = createAdminClient();
  const { data: biz } = await admin
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();
  if (!biz) redirect("/admin");

  if (!calPermitidoParaPlan(biz.plan)) {
    redirect(`/admin/clientes/${businessId}?error=plan_agenda`);
  }

  const parsed = calSchema.safeParse({
    cal_api_key: (formData.get("cal_api_key") as string)?.trim(),
    cal_event_type_id: (formData.get("cal_event_type_id") as string)?.trim(),
  });
  if (!parsed.success) redirect(`/admin/clientes/${businessId}?error=validacion`);

  await guardarCalIntegracion(admin, businessId, parsed.data);

  try {
    if (biz.vapi_assistant_id) {
      await actualizarAssistant(biz.vapi_assistant_id, {
        ...configDesdeNegocio(biz, true),
        calConectado: true,
      });
    }
  } catch (e) {
    console.error("[admin] no se pudo re-sincronizar el assistant:", e);
  }

  revalidatePath(`/admin/clientes/${businessId}`);
  redirect(`/admin/clientes/${businessId}?ok=1`);
}

/**
 * El ADMIN desconecta Cal.com de un cliente desde su ficha: borra la key + tipo
 * de evento y re-sincroniza el assistant para quitarle las tools de agendado.
 * Admin-scoped por businessId (NO usa getCurrentContext).
 */
export async function desconectarCalAdmin(businessId: string) {
  await exigirAdmin();

  const admin = createAdminClient();
  const { data: biz } = await admin
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();
  if (!biz) redirect("/admin");

  await guardarCalIntegracion(admin, businessId, {
    cal_api_key: null,
    cal_event_type_id: null,
  });

  try {
    if (biz.vapi_assistant_id) {
      await actualizarAssistant(biz.vapi_assistant_id, {
        ...configDesdeNegocio(biz, false),
        calConectado: false,
      });
    }
  } catch (e) {
    console.error("[admin] no se pudo re-sincronizar el assistant:", e);
  }

  revalidatePath(`/admin/clientes/${businessId}`);
  redirect(`/admin/clientes/${businessId}?ok=1`);
}
