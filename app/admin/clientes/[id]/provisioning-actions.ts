"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { aprovisionarNegocio } from "@/lib/onboarding/aprovisionar";
import { PASOS, type PasoOnboarding } from "@/lib/onboarding/estado";

const PASOS_SET = new Set<string>(PASOS);

/**
 * Reintenta un solo paso del aprovisionamiento desde la ficha del cliente
 * (botón "Reintentar" cuando un paso queda en error). Admin-scoped por
 * businessId; re-ejecuta ese paso y re-evalúa la activación.
 */
export async function reintentarPaso(businessId: string, paso: string) {
  await exigirAdmin();

  if (!PASOS_SET.has(paso)) return;

  const admin = createAdminClient();
  try {
    await aprovisionarNegocio(admin, businessId, {
      soloPaso: paso as PasoOnboarding,
    });
  } catch (e) {
    console.error("[admin] fallo reintentando el paso de aprovisionamiento:", e);
  }

  revalidatePath(`/admin/clientes/${businessId}`);
}
