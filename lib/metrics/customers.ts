/**
 * Métricas transversales de clientes (tenants) para el panel de superadmin.
 * Funciones PURAS: reciben los datos ya leídos y calculan KPIs, conteos, churn
 * y la tendencia de altas. Sin dependencias de Supabase/Stripe (testeables).
 */

/** Estado de cuenta que mostramos en el panel de admin. */
export type EstadoCliente = "activo" | "prueba" | "cancelado";

/** Negocio (tenant) en la forma mínima que necesitan estas métricas. */
export interface NegocioAdmin {
  id: string;
  nombre: string;
  ciudad: string | null;
  plan: string;
  activo: boolean;
  created_at: string;
}

/**
 * Deriva el estado mostrable de un negocio a partir de su plan y su flag activo.
 * - activo y plan "trial"          → prueba
 * - activo y plan de pago          → activo
 * - resto (inactivo o "cancelado") → cancelado
 */
export function estadoDeNegocio(negocio: {
  plan: string;
  activo: boolean;
}): EstadoCliente {
  if (!negocio.activo || negocio.plan === "cancelado") return "cancelado";
  if (negocio.plan === "trial") return "prueba";
  return "activo";
}

export interface ConteosClientes {
  activos: number;
  enPrueba: number;
  cancelados: number;
  total: number;
}

/** Cuenta negocios por estado (activo / prueba / cancelado). */
export function contarPorEstado(negocios: NegocioAdmin[]): ConteosClientes {
  const c: ConteosClientes = {
    activos: 0,
    enPrueba: 0,
    cancelados: 0,
    total: negocios.length,
  };
  for (const n of negocios) {
    const estado = estadoDeNegocio(n);
    if (estado === "activo") c.activos++;
    else if (estado === "prueba") c.enPrueba++;
    else c.cancelados++;
  }
  return c;
}

/** ¿La fecha ISO cae dentro del mismo mes natural (UTC) que `ref`? */
export function esDelMes(fechaISO: string, ref: Date): boolean {
  const d = new Date(fechaISO);
  return (
    d.getUTCFullYear() === ref.getUTCFullYear() &&
    d.getUTCMonth() === ref.getUTCMonth()
  );
}

/** Nº de negocios dados de alta en el mes de `ref` (por created_at). */
export function altasEsteMes(negocios: NegocioAdmin[], ref: Date): number {
  return negocios.filter((n) => esDelMes(n.created_at, ref)).length;
}

/**
 * Churn aproximado del mes = cancelados / (base a inicio de mes).
 *
 * No persistimos histórico de estado ni fecha de cancelación, así que hacemos
 * una aproximación razonable y explícita:
 *  - `cancelados`  = negocios en estado "cancelado" (todos; el volumen es bajo).
 *  - `baseInicioMes` = clientes que ya existían antes de que empezara el mes
 *    (created_at anterior al mes de `ref`). Esos son los que podían darse de
 *    baja durante el mes.
 *
 * Devuelve una fracción en [0, 1]. Si la base es 0, devuelve 0.
 */
export function churnDelMes(negocios: NegocioAdmin[], ref: Date): number {
  const inicioMes = new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1),
  );
  const preexistentes = negocios.filter(
    (n) => new Date(n.created_at) < inicioMes,
  );
  const base = preexistentes.length;
  if (base === 0) return 0;
  const cancelados = preexistentes.filter(
    (n) => estadoDeNegocio(n) === "cancelado",
  ).length;
  return redondear(cancelados / base);
}

/** Punto de la serie de altas por mes. */
export interface AltasMes {
  /** Clave "AAAA-MM" del mes. */
  clave: string;
  /** Etiqueta corta en español, p.ej. "jul 26". */
  etiqueta: string;
  /** Nº de altas ese mes. */
  altas: number;
}

const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/**
 * Serie de altas por mes para los últimos `meses` meses (incluyendo el de `ref`),
 * en orden cronológico ascendente. Cuenta por `created_at`.
 */
export function altasPorMes(
  negocios: NegocioAdmin[],
  ref: Date,
  meses = 6,
): AltasMes[] {
  const serie: AltasMes[] = [];
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - i, 1));
    const anio = d.getUTCFullYear();
    const mes = d.getUTCMonth();
    const clave = `${anio}-${String(mes + 1).padStart(2, "0")}`;
    const altas = negocios.filter((n) => {
      const c = new Date(n.created_at);
      return c.getUTCFullYear() === anio && c.getUTCMonth() === mes;
    }).length;
    serie.push({
      clave,
      etiqueta: `${MESES_CORTOS[mes]} ${String(anio).slice(2)}`,
      altas,
    });
  }
  return serie;
}

function redondear(n: number): number {
  return Math.round(n * 10000) / 10000;
}
