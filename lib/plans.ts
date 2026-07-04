import type { Plan } from "@/lib/types";

/** Capacidades que un plan puede incluir (el aviso al dueño va SIEMPRE, no se lista). */
export type Capacidad =
  | "agenda"
  | "confirmacionCliente"
  | "numeroDedicado"
  | "multiNumero";

type Entitlement = Record<Capacidad, boolean>;

const NINGUNA: Entitlement = {
  agenda: false,
  confirmacionCliente: false,
  numeroDedicado: false,
  multiNumero: false,
};

const PRO: Entitlement = {
  agenda: true,
  confirmacionCliente: true,
  numeroDedicado: true,
  multiNumero: false,
};

export const ENTITLEMENTS: Record<Plan, Entitlement> = {
  trial: PRO, // el trial deja probar el "wow" (agenda incluida)
  starter: NINGUNA,
  pro: PRO,
  premium: { ...PRO, multiNumero: true },
  cancelado: NINGUNA,
};

/** ¿El plan incluye esta capacidad? Fuente única de verdad para el gating. */
export function puede(plan: Plan, cap: Capacidad): boolean {
  return ENTITLEMENTS[plan]?.[cap] ?? false;
}

/** ¿El plan del cliente incluye la capacidad "agenda"? (helper de conveniencia). */
export function calPermitidoParaPlan(plan: Plan): boolean {
  return puede(plan, "agenda");
}

/**
 * Aplica el gating por plan a las capacidades pedidas en el alta: si el plan no
 * incluye "agenda"/"confirmacionCliente", se ignoran aunque el admin las marque.
 * Pura y testeable (vive aquí, NO en un fichero "use server").
 */
export function capacidadesEfectivas(
  plan: Plan,
  pedidas: { agenda?: boolean; confirmacionCliente?: boolean },
) {
  return {
    agenda: Boolean(pedidas.agenda) && puede(plan, "agenda"),
    confirmacionCliente:
      Boolean(pedidas.confirmacionCliente) && puede(plan, "confirmacionCliente"),
  };
}
