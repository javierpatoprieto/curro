import { createClient } from "@/lib/supabase/server";
import { getCurrentContext } from "@/lib/auth";
import { isDemoMode, DEMO_LEADS } from "@/lib/demo";
import type { Lead } from "@/lib/types";

// Reexportado por comodidad; la definición vive en el módulo puro lib/types.
export { ESTADO_LABEL } from "@/lib/types";

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

/** Un lead por id (respeta RLS en modo real; demo desde datos de ejemplo). */
export async function getLeadById(id: string): Promise<Lead | null> {
  if (isDemoMode()) return DEMO_LEADS.find((l) => l.id === id) ?? null;

  const context = await getCurrentContext();
  if (!context) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as Lead | null) ?? null;
}

export interface LeadStats {
  total: number;
  pendientes: number;
  visitas: number;
  mes: number;
}

const HACE_30_DIAS = 30 * 24 * 60 * 60 * 1000;

/** Métricas rápidas para el resumen del panel. */
export function computeStats(leads: Lead[]): LeadStats {
  const ahora = Date.now();
  return {
    total: leads.length,
    pendientes: leads.filter(
      (l) => l.estado === "nuevo" || l.estado === "contactado",
    ).length,
    visitas: leads.filter((l) => l.estado === "visita_agendada").length,
    mes: leads.filter(
      (l) => ahora - new Date(l.created_at).getTime() <= HACE_30_DIAS,
    ).length,
  };
}
