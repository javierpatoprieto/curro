/**
 * Capa de datos (IMPURA) del panel de superadmin. SOLO servidor.
 *
 * Lee TODOS los negocios con el cliente service_role (salta RLS) y, para el mes
 * en curso, cuenta llamadas (call_events) y leads (leads) por negocio. El MRR
 * sale de Stripe si está configurado; si no, se deriva de la BD. Toda la lógica
 * de cálculo vive en funciones puras de lib/metrics/** (testeadas aparte).
 */

// Módulo SOLO servidor: usa el cliente service_role (salta RLS) y la clave de
// Stripe. NUNCA debe importarse desde un componente de cliente.
import type { Business } from "@/lib/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, stripeConfigurado } from "@/lib/stripe/client";
import { esEstadoActivo } from "@/lib/stripe/activation";
import {
  mrrDesdeStripe,
  mrrDesdeBaseDatos,
  arrDesdeMrr,
  mrrDeSuscripcion,
  type SuscripcionMRR,
} from "@/lib/metrics/mrr";
import {
  contarPorEstado,
  altasEsteMes,
  churnDelMes,
  altasPorMes,
  type NegocioAdmin,
  type AltasMes,
  type ConteosClientes,
} from "@/lib/metrics/customers";
import {
  construirFilas,
  type FilaCliente,
  type ConteoPorNegocio,
  type MrrPorNegocio,
} from "@/lib/metrics/rows";

export interface AdminDashboard {
  mrr: number;
  arr: number;
  conteos: ConteosClientes;
  altasEsteMes: number;
  /** Churn del mes como fracción [0, 1]. */
  churn: number;
  filas: FilaCliente[];
  tendencia: AltasMes[];
  /** true si el MRR viene de Stripe; false si se derivó de la BD. */
  mrrDesdeStripeFlag: boolean;
}

function inicioDeMesISO(ref: Date): string {
  return new Date(
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1),
  ).toISOString();
}

/** Lee todos los negocios (tenants) con service_role. */
async function leerNegocios(): Promise<NegocioAdmin[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("businesses")
    .select("id, nombre, ciudad, plan, activo, created_at")
    .order("created_at", { ascending: false });
  return (data as NegocioAdmin[] | null) ?? [];
}

/** Cuenta filas por business_id de una tabla en el mes en curso. */
async function contarPorNegocioDelMes(
  tabla: "call_events" | "leads",
  desdeISO: string,
): Promise<ConteoPorNegocio> {
  const admin = createAdminClient();
  const { data } = await admin
    .from(tabla)
    .select("business_id")
    .gte("created_at", desdeISO);
  const conteo: ConteoPorNegocio = {};
  for (const fila of (data as { business_id: string }[] | null) ?? []) {
    conteo[fila.business_id] = (conteo[fila.business_id] ?? 0) + 1;
  }
  return conteo;
}

/**
 * Trae las suscripciones vivas de Stripe (active/trialing) y calcula:
 *  - MRR total (euros/mes)
 *  - MRR por business_id (según subscription.metadata.business_id)
 * Devuelve null si Stripe no está configurado.
 */
async function leerMrrStripe(): Promise<{
  total: number;
  porNegocio: MrrPorNegocio;
} | null> {
  if (!stripeConfigurado()) return null;

  const stripe = getStripe();
  const subs: SuscripcionMRR[] = [];
  const porNegocio: MrrPorNegocio = {};

  // status "all" y filtramos por estado con esEstadoActivo (Stripe no permite
  // filtrar por trialing+active en una sola llamada). Paginamos con auto-paging.
  for await (const sub of stripe.subscriptions.list({
    status: "all",
    limit: 100,
    expand: ["data.items.data.price"],
  })) {
    if (!esEstadoActivo(sub.status)) continue;
    const s = sub as unknown as SuscripcionMRR & {
      metadata?: Record<string, string> | null;
    };
    subs.push(s);
    const bizId = sub.metadata?.business_id;
    if (bizId) {
      porNegocio[bizId] = (porNegocio[bizId] ?? 0) + mrrDeSuscripcion(s);
    }
  }

  return { total: mrrDesdeStripe(subs), porNegocio };
}

/** Reúne todo el dashboard de superadmin. */
export async function getAdminDashboard(
  ref: Date = new Date(),
): Promise<AdminDashboard> {
  const desdeISO = inicioDeMesISO(ref);

  const [negocios, llamadas, leads, stripeMrr] = await Promise.all([
    leerNegocios(),
    contarPorNegocioDelMes("call_events", desdeISO),
    contarPorNegocioDelMes("leads", desdeISO),
    leerMrrStripe(),
  ]);

  const mrr = stripeMrr ? stripeMrr.total : mrrDesdeBaseDatos(negocios);
  const mrrPorNegocio = stripeMrr ? stripeMrr.porNegocio : null;

  return {
    mrr,
    arr: arrDesdeMrr(mrr),
    conteos: contarPorEstado(negocios),
    altasEsteMes: altasEsteMes(negocios, ref),
    churn: churnDelMes(negocios, ref),
    filas: construirFilas(negocios, llamadas, leads, mrrPorNegocio),
    tendencia: altasPorMes(negocios, ref, 6),
    mrrDesdeStripeFlag: stripeMrr !== null,
  };
}

export interface ClienteDetalle {
  business: Business;
  llamadasMes: number;
  leadsMes: number;
  owners: { id: string; nombre: string | null; email: string; whatsapp: string | null }[];
}

/** Detalle de un negocio para la gestión de admin (fila completa + uso del mes). */
export async function getClienteDetalle(
  id: string,
  ref: Date = new Date(),
): Promise<ClienteDetalle | null> {
  const admin = createAdminClient();
  const { data: business } = await admin
    .from("businesses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!business) return null;

  const desdeISO = inicioDeMesISO(ref);
  const [llamadas, leads, owners] = await Promise.all([
    admin
      .from("call_events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", id)
      .gte("created_at", desdeISO),
    admin
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("business_id", id)
      .gte("created_at", desdeISO),
    admin.from("owners").select("id, nombre, email, whatsapp").eq("business_id", id),
  ]);

  return {
    business: business as Business,
    llamadasMes: llamadas.count ?? 0,
    leadsMes: leads.count ?? 0,
    owners:
      (owners.data as ClienteDetalle["owners"] | null) ?? [],
  };
}
