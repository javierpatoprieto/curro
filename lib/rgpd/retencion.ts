/**
 * Plazos de retención (RGPD) y helpers de fecha de corte.
 *
 * Módulo PURO (sin red ni DB) para poder testear la lógica de vencimiento.
 * Las constantes son CONFIGURABLES: si mañana cambia la política de retención,
 * se tocan aquí (o vía env, más abajo) y el resto del código las respeta.
 *
 * Criterio de "vencido": un dato está vencido cuando su antigüedad supera el
 * plazo de su categoría. `fechaCorte(categoria)` devuelve el instante límite:
 * todo lo creado ANTES de esa fecha está vencido y debe anonimizarse/borrarse.
 */

/** Categorías de datos con plazo de retención propio. */
export type CategoriaRetencion =
  | "audio" // grabación de la llamada
  | "transcripcion" // transcripción + lead (PII de la persona que llama)
  | "raw_payload" // metadatos crudos residuales del webhook de Vapi
  | "facturacion" // datos de facturación (obligación legal)
  | "cuenta" // datos de la cuenta del suscriptor
  | "logs"; // logs técnicos

const DIA = 24 * 60 * 60 * 1000;
const MES = 30 * DIA; // aproximación de mes a 30 días (suficiente para cortes)
const ANIO = 365 * DIA;

/**
 * Plazos en milisegundos por categoría. Datos canónicos de la política:
 *  - audio: 30 días
 *  - transcripción + lead: 12 meses
 *  - raw_payload residual (solo metadatos): purga a 30 días
 *  - facturación: 6 años
 *  - cuenta: durante la relación + 5 años (aquí, el "+5 años" tras la baja)
 *  - logs: ≤ 90 días
 *
 * Configurable por entorno con RETENCION_<CATEGORIA>_DIAS (número de días).
 */
function diasEnv(clave: string, pordefectoMs: number): number {
  const v = process.env[clave];
  if (v) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return Math.round(n) * DIA;
  }
  return pordefectoMs;
}

export const PLAZOS_MS: Record<CategoriaRetencion, number> = {
  audio: diasEnv("RETENCION_AUDIO_DIAS", 30 * DIA),
  transcripcion: diasEnv("RETENCION_TRANSCRIPCION_DIAS", 12 * MES),
  raw_payload: diasEnv("RETENCION_RAW_PAYLOAD_DIAS", 30 * DIA),
  facturacion: diasEnv("RETENCION_FACTURACION_DIAS", 6 * ANIO),
  cuenta: diasEnv("RETENCION_CUENTA_DIAS", 5 * ANIO),
  logs: diasEnv("RETENCION_LOGS_DIAS", 90 * DIA),
};

/** Plazo en días (redondeado) de una categoría; útil para textos/UI. */
export function plazoDias(categoria: CategoriaRetencion): number {
  return Math.round(PLAZOS_MS[categoria] / DIA);
}

/**
 * Fecha de corte de una categoría: instante a partir del cual los datos siguen
 * vigentes. Todo lo creado ANTES está vencido. `ahora` se inyecta para testear.
 */
export function fechaCorte(
  categoria: CategoriaRetencion,
  ahora: Date = new Date(),
): Date {
  return new Date(ahora.getTime() - PLAZOS_MS[categoria]);
}

/**
 * ¿Está vencido un dato creado en `creadoEn` para una categoría dada?
 * Vencido = creado estrictamente antes de la fecha de corte.
 */
export function estaVencido(
  categoria: CategoriaRetencion,
  creadoEn: Date | string,
  ahora: Date = new Date(),
): boolean {
  const creado = typeof creadoEn === "string" ? new Date(creadoEn) : creadoEn;
  if (Number.isNaN(creado.getTime())) return false;
  return creado.getTime() < fechaCorte(categoria, ahora).getTime();
}
