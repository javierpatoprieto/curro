import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentContext } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import type { Plan } from "@/lib/types";

/** Límite de llamadas incluidas al mes por plan. */
export const LIMITE_LLAMADAS: Record<Plan, number> = {
  trial: 15,
  starter: 35,
  pro: 75,
  premium: 225,
  cancelado: 0,
};

export function limiteDe(plan: Plan): number {
  return LIMITE_LLAMADAS[plan] ?? 0;
}

/** ¿Se puede atender una llamada más con este plan? (lógica pura, testeable) */
export function dentroDelLimite(llamadasUsadas: number, plan: Plan): boolean {
  return llamadasUsadas < limiteDe(plan);
}

/** Límite de minutos incluidos al mes por plan (los packs se definen en minutos). */
export const LIMITE_MINUTOS: Record<Plan, number> = {
  trial: 30,
  starter: 75,
  pro: 150,
  premium: 450,
  cancelado: 0,
};

export function limiteMinutosDe(plan: Plan): number {
  return LIMITE_MINUTOS[plan] ?? 0;
}

/** ¿Quedan minutos disponibles en el plan? (lógica pura, testeable) */
export function dentroDelLimiteMinutos(
  minutosUsados: number,
  plan: Plan,
): boolean {
  return minutosUsados < limiteMinutosDe(plan);
}

/**
 * Porcentaje de uso (0-100) de minutos sobre el límite del plan.
 * Con límite 0 (p. ej. plan cancelado) evita la división por cero:
 * 100% si hay minutos usados, 0% si no hay ninguno.
 */
export function porcentajeUso(minutosUsados: number, plan: Plan): number {
  const limite = limiteMinutosDe(plan);
  if (limite <= 0) return minutosUsados > 0 ? 100 : 0;
  const pct = (minutosUsados / limite) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

export interface Uso {
  llamadas: number;
  minutos: number;
  coste: number;
}

/**
 * Inicio del mes actual en ISO (UTC). Se calcula con componentes UTC para
 * evitar el bug de zona horaria: usar la hora LOCAL del servidor metía/quitaba
 * horas del mes anterior al convertir a ISO/UTC en servidores con offset != 0.
 */
export function inicioDeMesISO(): string {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
}

type Admin = ReturnType<typeof createAdminClient>;

/** Cuenta las llamadas del mes de un negocio (para el webhook, con service_role). */
export async function contarLlamadasMes(
  admin: Admin,
  businessId: string,
): Promise<number> {
  const { count } = await admin
    .from("call_events")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", inicioDeMesISO());
  return count ?? 0;
}

/** Cuenta los minutos del mes de un negocio (para el webhook, con service_role). */
export async function contarMinutosMes(
  admin: Admin,
  businessId: string,
): Promise<number> {
  const { data } = await admin
    .from("call_events")
    .select("duracion_seg")
    .eq("business_id", businessId)
    .gte("created_at", inicioDeMesISO());

  const segundos = (data ?? []).reduce(
    (s, e) => s + (e.duracion_seg ?? 0),
    0,
  );
  return Math.round(segundos / 60);
}

/** Uso del mes del negocio actual (para el panel; respeta RLS). */
export async function getUso(): Promise<Uso> {
  if (isDemoMode()) return { llamadas: 12, minutos: 34, coste: 3.12 };

  const context = await getCurrentContext();
  if (!context) return { llamadas: 0, minutos: 0, coste: 0 };

  const supabase = await createClient();
  const { data } = await supabase
    .from("call_events")
    .select("duracion_seg, coste_estimado")
    .eq("business_id", context.business.id)
    .gte("created_at", inicioDeMesISO());

  const eventos = data ?? [];
  const segundos = eventos.reduce((s, e) => s + (e.duracion_seg ?? 0), 0);
  const coste = eventos.reduce((s, e) => s + Number(e.coste_estimado ?? 0), 0);

  return {
    llamadas: eventos.length,
    minutos: Math.round(segundos / 60),
    coste: Math.round(coste * 100) / 100,
  };
}
