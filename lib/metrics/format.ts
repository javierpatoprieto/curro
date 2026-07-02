/**
 * Formateadores puros para el panel de admin (euros, porcentaje, fecha, estado).
 * Sin dependencias de UI: se pueden testear y reutilizar.
 */

import type { EstadoCliente } from "@/lib/metrics/customers";

/** Euros con separador español y 0 decimales por defecto. */
export function formatoEuros(n: number, decimales = 0): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n);
}

/** Fracción [0,1] → porcentaje con 1 decimal, p.ej. 0.083 → "8,3 %". */
export function formatoPorcentaje(fraccion: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(fraccion);
}

/** Fecha ISO → "1 jul 2026" (es-ES). */
export function formatoFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Etiqueta legible del estado de cliente. */
export const ESTADO_CLIENTE_LABEL: Record<EstadoCliente, string> = {
  activo: "Activo",
  prueba: "En prueba",
  cancelado: "Cancelado",
};

/** Variante de Badge por estado (alineada con components/ui/badge). */
export const ESTADO_CLIENTE_VARIANTE: Record<
  EstadoCliente,
  "default" | "secondary" | "destructive" | "outline"
> = {
  activo: "default",
  prueba: "secondary",
  cancelado: "destructive",
};

/** Etiqueta legible del plan (espejo de lib/stripe/plans y lib/types). */
export const PLAN_LABEL: Record<string, string> = {
  trial: "Prueba",
  starter: "Básico",
  pro: "Pro",
  premium: "Premium",
  cancelado: "Cancelado",
};

export function etiquetaPlan(plan: string): string {
  return PLAN_LABEL[plan] ?? plan;
}
