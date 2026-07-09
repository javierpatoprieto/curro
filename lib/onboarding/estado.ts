/**
 * Estado del onboarding por pasos (Fase 2). Módulo PURO (sin I/O): se puede
 * importar desde cliente y servidor. Vive en la columna `onboarding_status`
 * (JSONB) de `businesses` y describe en qué punto está el aprovisionamiento.
 *
 * Cada paso tiene un `estado`:
 *  - `pendiente`: aún no se ha ejecutado (o hay que reintentarlo).
 *  - `hecho`: completado con éxito.
 *  - `error`: falló; se puede reintentar desde la ficha del cliente.
 *  - `omitido`: no aplica a este negocio (el plan no lo incluye o el modo de
 *    teléfono no lo requiere). No bloquea el "todo listo".
 */

import type { Plan, PhoneMode } from "@/lib/types";
import { puede } from "@/lib/plans";

/** Pasos del aprovisionamiento, en orden de ejecución. */
export const PASOS = [
  "assistant",
  "telefono",
  "agenda",
  "whatsapp",
  "activo",
] as const;

export type PasoOnboarding = (typeof PASOS)[number];

export type EstadoPaso = "pendiente" | "hecho" | "error" | "omitido";

export interface PasoEstado {
  estado: EstadoPaso;
  /** ISO 8601 del último cambio de estado (se rellena en `marcarPaso`). */
  at?: string;
  /** Detalle legible: id creado, mensaje de error, etc. */
  detalle?: string;
}

/**
 * Estado completo del onboarding. Es un objeto pequeño y parcial: la columna
 * arranca en `{}` y se va rellenando. Por eso los pasos son opcionales al leer,
 * aunque `estadoInicial` los crea todos.
 */
export type OnboardingStatus = Partial<Record<PasoOnboarding, PasoEstado>>;

/** Etiqueta legible (ES) de cada paso, para la checklist del admin. */
export const PASOS_LABEL: Record<PasoOnboarding, string> = {
  assistant: "Asistente de voz (Vapi)",
  telefono: "Teléfono",
  agenda: "Agenda (Cal.com)",
  whatsapp: "Avisos por WhatsApp",
  activo: "Cuenta activa",
};

/** Símbolo simple por estado (sin dependencias de iconos), para UI y logs. */
export function iconoDeEstado(estado: EstadoPaso): string {
  switch (estado) {
    case "hecho":
      return "✓";
    case "error":
      return "✕";
    case "omitido":
      return "–";
    case "pendiente":
    default:
      return "…";
  }
}

/**
 * Estado inicial del onboarding para un negocio recién creado. Usa `puede()`
 * para marcar como `omitido` lo que el plan no incluye, y `phone_mode` +
 * `numeroDedicado` para decidir si el paso de teléfono aplica:
 *  - agenda: `omitido` si el plan no incluye "agenda".
 *  - whatsapp: `omitido` si el plan no incluye "confirmacionCliente".
 *  - telefono: `omitido` si `phone_mode` es 'none', o si es 'new' pero el plan
 *    no incluye "numeroDedicado".
 * El resto (assistant, activo) arrancan en `pendiente`.
 */
export function estadoInicial(
  plan: Plan,
  phoneMode: PhoneMode,
): Record<PasoOnboarding, PasoEstado> {
  const p = (estado: EstadoPaso): PasoEstado => ({ estado });

  const agenda = puede(plan, "agenda") ? p("pendiente") : p("omitido");
  const whatsapp = puede(plan, "confirmacionCliente")
    ? p("pendiente")
    : p("omitido");

  const telefonoOmitido =
    phoneMode === "none" ||
    (phoneMode === "new" && !puede(plan, "numeroDedicado"));
  const telefono = telefonoOmitido ? p("omitido") : p("pendiente");

  return {
    assistant: p("pendiente"),
    telefono,
    agenda,
    whatsapp,
    activo: p("pendiente"),
  };
}

/** Devuelve una copia del estado con `paso` actualizado (inmutable). */
export function marcarPaso(
  status: OnboardingStatus,
  paso: PasoOnboarding,
  estado: EstadoPaso,
  extra?: { detalle?: string },
): OnboardingStatus {
  return {
    ...status,
    [paso]: {
      estado,
      at: new Date().toISOString(),
      ...(extra?.detalle !== undefined ? { detalle: extra.detalle } : {}),
    },
  };
}

/**
 * ¿Están todos los pasos aplicables completados? Ignora los `omitido`; un paso
 * `pendiente` o `error` (o cualquiera que no sea `hecho`/`omitido`) devuelve
 * false. Un estado vacío `{}` se considera "listo" (no hay pasos que bloqueen).
 */
export function todoListo(status: OnboardingStatus): boolean {
  return PASOS.every((paso) => {
    const e = status[paso]?.estado;
    return e === undefined || e === "hecho" || e === "omitido";
  });
}
