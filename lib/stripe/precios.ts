/**
 * Precios mensuales (en euros) por plan — ÚNICA fuente de verdad.
 *
 * Módulo PURO: NO importa `@/lib/env` ni ningún cliente, para que pueda ser
 * consumido tanto por `lib/stripe/plans.ts` (que sí usa env) como por
 * `lib/metrics/mrr.ts` (módulo puro y testeable en aislamiento).
 *
 * Si cambia un precio, cámbialo aquí y se propaga a plans.ts y a las métricas.
 */
import type { Plan } from "@/lib/types";

/** Precio mensual (en euros) de cada plan. */
export const PRECIO_MENSUAL: Record<Plan, number> = {
  trial: 0,
  starter: 99,
  pro: 149,
  premium: 199,
  cancelado: 0,
};
