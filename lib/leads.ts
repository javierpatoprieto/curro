import { createClient } from "@/lib/supabase/server";
import { getCurrentContext } from "@/lib/auth";
import { isDemoMode, DEMO_LEADS } from "@/lib/demo";
import type { Lead, LeadEstado } from "@/lib/types";

export const ESTADO_LABEL: Record<LeadEstado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  visita_agendada: "Visita agendada",
  presupuestado: "Presupuestado",
  ganado: "Ganado",
  perdido: "Perdido",
};

/** Leads del negocio actual, más recientes primero. */
export async function getLeads(): Promise<Lead[]> {
  if (isDemoMode()) return DEMO_LEADS;

  const context = await getCurrentContext();
  if (!context) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", context.business.id)
    .order("created_at", { ascending: false });

  return (data as Lead[] | null) ?? [];
}

export interface LeadStats {
  total: number;
  pendientes: number;
  visitas: number;
}

/** Métricas rápidas para el resumen del panel. */
export function computeStats(leads: Lead[]): LeadStats {
  return {
    total: leads.length,
    pendientes: leads.filter(
      (l) => l.estado === "nuevo" || l.estado === "contactado",
    ).length,
    visitas: leads.filter((l) => l.estado === "visita_agendada").length,
  };
}
