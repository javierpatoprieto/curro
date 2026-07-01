import type { Plan } from "@/lib/types";

/** Estados de suscripción de Stripe que consideramos "cuenta activa". */
const ESTADOS_ACTIVOS = new Set(["active", "trialing"]);

export function esEstadoActivo(status: string): boolean {
  return ESTADOS_ACTIVOS.has(status);
}

/** Resuelve el plan a partir del priceId usando el mapa de precios. */
export function planDesdePrice(
  priceId: string | null | undefined,
  mapa: Record<string, Plan>,
): Plan | null {
  if (!priceId) return null;
  return mapa[priceId] ?? null;
}

/**
 * Lógica PURA de activación: dado el estado de la suscripción y el plan,
 * decide si la cuenta queda activa y con qué plan. Es lo que testeamos.
 */
export function resolverCuenta(
  status: string,
  plan: Plan | null,
): { plan: Plan; activo: boolean } {
  if (!esEstadoActivo(status)) {
    return { plan: "cancelado", activo: false };
  }
  return { plan: plan ?? "pro", activo: true };
}
