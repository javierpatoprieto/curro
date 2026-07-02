/**
 * Construcción de las filas de la tabla de clientes del panel de admin.
 * Funciones PURAS: combinan un negocio con sus conteos del mes y su MRR aportado
 * en una fila lista para pintar, y ordenan por MRR descendente.
 */

import { estadoDeNegocio, type EstadoCliente, type NegocioAdmin } from "@/lib/metrics/customers";
import { PRECIO_MENSUAL_PLAN } from "@/lib/metrics/mrr";

export interface FilaCliente {
  id: string;
  nombre: string;
  ciudad: string | null;
  plan: string;
  estado: EstadoCliente;
  /** MRR (euros/mes) que aporta este negocio. */
  mrr: number;
  /** Llamadas del mes en curso. */
  llamadasMes: number;
  /** Leads del mes en curso. */
  leadsMes: number;
  /** Fecha de alta (ISO). */
  altaISO: string;
}

/** Conteos del mes por negocio (business_id → nº). */
export type ConteoPorNegocio = Record<string, number>;

/** MRR aportado por negocio (business_id → euros/mes), si viene de Stripe. */
export type MrrPorNegocio = Record<string, number>;

/**
 * MRR aportado por un negocio: usa el valor real de Stripe si lo hay para ese
 * business_id; si no, lo deriva del plan (y solo si el negocio está activo).
 */
export function mrrDeNegocio(
  negocio: NegocioAdmin,
  mrrStripe: MrrPorNegocio | null,
): number {
  if (mrrStripe && negocio.id in mrrStripe) {
    return redondear(mrrStripe[negocio.id]);
  }
  if (!negocio.activo || negocio.plan === "cancelado") return 0;
  return redondear(PRECIO_MENSUAL_PLAN[negocio.plan] ?? 0);
}

/**
 * Construye las filas de la tabla y las ordena por MRR desc (desempate por
 * nombre). `llamadas` y `leads` son mapas business_id → nº del mes en curso;
 * `mrrStripe` es opcional (null si el MRR se deriva de la BD).
 */
export function construirFilas(
  negocios: NegocioAdmin[],
  llamadas: ConteoPorNegocio,
  leads: ConteoPorNegocio,
  mrrStripe: MrrPorNegocio | null,
): FilaCliente[] {
  const filas = negocios.map<FilaCliente>((n) => ({
    id: n.id,
    nombre: n.nombre,
    ciudad: n.ciudad,
    plan: n.plan,
    estado: estadoDeNegocio(n),
    mrr: mrrDeNegocio(n, mrrStripe),
    llamadasMes: llamadas[n.id] ?? 0,
    leadsMes: leads[n.id] ?? 0,
    altaISO: n.created_at,
  }));

  return filas.sort((a, b) => {
    if (b.mrr !== a.mrr) return b.mrr - a.mrr;
    return a.nombre.localeCompare(b.nombre, "es");
  });
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}
