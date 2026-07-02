/**
 * Cálculo de MRR (Monthly Recurring Revenue) — funciones PURAS y testeables.
 *
 * La fuente de verdad preferida es Stripe (suscripciones reales). Si Stripe no
 * está configurado, derivamos el MRR de la base de datos (negocios activos y su
 * plan → precio). Ambas rutas normalizan a euros/mes.
 *
 * No importa `@/lib/env` ni clientes: recibe todo por parámetro para poder
 * probarse en aislamiento (ver lib/metrics/mrr.test.ts).
 *
 * Los precios por plan vienen de `lib/stripe/precios` (módulo PURO, sin env),
 * ÚNICA fuente de verdad compartida con `lib/stripe/plans`.
 */
import { PRECIO_MENSUAL } from "@/lib/stripe/precios";

/**
 * Alias retrocompatible: otros módulos (p. ej. lib/metrics/rows) importan este
 * nombre desde aquí. Ya NO es una copia hardcodeada, sino la única fuente de
 * verdad reexportada desde lib/stripe/precios.
 */
export const PRECIO_MENSUAL_PLAN = PRECIO_MENSUAL;

/** Forma mínima de un ítem de precio de una suscripción de Stripe. */
export interface PrecioSuscripcion {
  /** Importe en la unidad mínima de la moneda (céntimos). */
  unit_amount: number | null;
  /** Recurrencia; null en compras de una sola vez. */
  recurring: { interval: "day" | "week" | "month" | "year" } | null;
}

export interface ItemSuscripcion {
  quantity?: number | null;
  price: PrecioSuscripcion | null;
}

export interface SuscripcionMRR {
  status: string;
  items: { data: ItemSuscripcion[] };
}

/** Estados de Stripe que cuentan como ingreso recurrente vivo. */
const ESTADOS_CON_INGRESO = new Set(["active", "trialing"]);

/**
 * Normaliza el importe de un ítem a euros/mes.
 * - Céntimos → euros.
 * - interval "year" se divide entre 12; "week"/"day" se aproximan a mes.
 * - Multiplica por la cantidad (por defecto 1).
 */
export function importeMensualItem(item: ItemSuscripcion): number {
  const precio = item.price;
  if (!precio || precio.unit_amount == null || !precio.recurring) return 0;

  const cantidad = item.quantity ?? 1;
  const euros = (precio.unit_amount / 100) * cantidad;

  switch (precio.recurring.interval) {
    case "year":
      return euros / 12;
    case "week":
      return (euros * 52) / 12;
    case "day":
      return (euros * 365) / 12;
    case "month":
    default:
      return euros;
  }
}

/** MRR aportado por una sola suscripción (0 si su estado no genera ingreso). */
export function mrrDeSuscripcion(sub: SuscripcionMRR): number {
  if (!ESTADOS_CON_INGRESO.has(sub.status)) return 0;
  return sub.items.data.reduce((total, item) => total + importeMensualItem(item), 0);
}

/** MRR total (euros/mes) sumando todas las suscripciones de Stripe. */
export function mrrDesdeStripe(subs: SuscripcionMRR[]): number {
  const total = subs.reduce((acc, sub) => acc + mrrDeSuscripcion(sub), 0);
  return redondear(total);
}

/** Negocio mínimo para derivar MRR de la BD cuando no hay Stripe. */
export interface NegocioMRR {
  plan: string;
  activo: boolean;
}

/**
 * MRR derivado de la base de datos: suma el precio del plan de cada negocio
 * activo. Fallback cuando Stripe no está configurado.
 */
export function mrrDesdeBaseDatos(negocios: NegocioMRR[]): number {
  const total = negocios.reduce((acc, n) => {
    if (!n.activo) return acc;
    return acc + (PRECIO_MENSUAL[n.plan as keyof typeof PRECIO_MENSUAL] ?? 0);
  }, 0);
  return redondear(total);
}

/** ARR = MRR × 12. */
export function arrDesdeMrr(mrr: number): number {
  return redondear(mrr * 12);
}

/** Redondeo a 2 decimales para evitar arrastre de coma flotante. */
function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}
