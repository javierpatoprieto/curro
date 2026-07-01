import { env } from "@/lib/env";
import type { Plan } from "@/lib/types";

/** Planes de pago (los que aparecen en la landing). */
export type PlanPago = "starter" | "pro" | "premium";

export interface PlanDef {
  id: PlanPago;
  nombre: string;
  precio: number;
  priceId: string | undefined;
}

export const PLANES_PAGO: Record<PlanPago, PlanDef> = {
  starter: {
    id: "starter",
    nombre: "Básico",
    precio: 99,
    priceId: env.STRIPE_PRICE_STARTER,
  },
  pro: { id: "pro", nombre: "Pro", precio: 149, priceId: env.STRIPE_PRICE_PRO },
  premium: {
    id: "premium",
    nombre: "Premium",
    precio: 199,
    priceId: env.STRIPE_PRICE_PREMIUM,
  },
};

/** Mapa priceId → plan, para el webhook de Stripe. */
export function mapaPreciosAPlan(): Record<string, Plan> {
  const mapa: Record<string, Plan> = {};
  for (const p of Object.values(PLANES_PAGO)) {
    if (p.priceId) mapa[p.priceId] = p.id;
  }
  return mapa;
}
