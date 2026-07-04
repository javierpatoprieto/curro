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
