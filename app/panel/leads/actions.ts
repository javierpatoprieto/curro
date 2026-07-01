"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentContext } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { LEAD_ESTADOS, type LeadEstado } from "@/lib/types";

/**
 * Cambia el estado de un lead. En modo demo no persiste (no hay Supabase); en
 * real, RLS garantiza que solo se puede tocar un lead del propio negocio.
 */
export async function cambiarEstadoLead(id: string, estado: LeadEstado) {
  if (!LEAD_ESTADOS.includes(estado)) {
    throw new Error("Estado no válido");
  }

  if (isDemoMode()) return { ok: true, demo: true };

  const context = await getCurrentContext();
  if (!context) throw new Error("No autorizado");

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ estado })
    .eq("id", id)
    .eq("business_id", context.business.id);

  if (error) throw error;

  revalidatePath("/panel");
  revalidatePath("/panel/leads");
  revalidatePath(`/panel/leads/${id}`);
  return { ok: true };
}
