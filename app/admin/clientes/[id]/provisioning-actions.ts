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

/**
 * Re-ejecuta el aprovisionamiento COMPLETO desde la ficha del cliente (botón
 * global "Reintentar aprovisionamiento"). Para negocios atascados sin un paso en
 * error concreto (estado vacío por un throw temprano, o pasos `pendiente`).
 * Idempotente; no crea assistants/números duplicados (ver aprovisionar.ts).
 */
export async function reaprovisionar(businessId: string) {
  await exigirAdmin();

  const admin = createAdminClient();
  try {
    await aprovisionarNegocio(admin, businessId);
  } catch (e) {
    // Un fallo duro (assistant/persistencia) queda reflejado en la checklist en
    // "error"; aquí solo evitamos que reviente la server action.
    console.error("[admin] fallo re-aprovisionando el negocio:", e);
  }

  revalidatePath(`/admin/clientes/${businessId}`);
}
