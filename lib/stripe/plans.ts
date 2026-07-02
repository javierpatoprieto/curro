import { env } from "@/lib/env";
import type { Plan } from "@/lib/types";
import { PRECIO_MENSUAL } from "@/lib/stripe/precios";

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
    precio: PRECIO_MENSUAL.starter,
    priceId: env.STRIPE_PRICE_STARTER,
  },
  pro: {
    id: "pro",
    nombre: "Pro",
    precio: PRECIO_MENSUAL.pro,
    priceId: env.STRIPE_PRICE_PRO,
  },
  premium: {
    id: "premium",
    nombre: "Premium",
    precio: PRECIO_MENSUAL.premium,
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
