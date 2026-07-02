import {
  Euro,
  TrendingUp,
  Users,
  Hourglass,
  UserX,
  UserPlus,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatoEuros, formatoPorcentaje } from "@/lib/metrics/format";
import type { AdminDashboard } from "@/lib/admin/data";

/** Tarjetas de KPIs del backend de control. */
export function Kpis({ data }: { data: AdminDashboard }) {
  const tarjetas = [
    {
      label: "MRR",
      valor: formatoEuros(data.mrr),
      icon: Euro,
      nota: data.mrrDesdeStripeFlag ? "Fuente: Stripe" : "Estimado (BD)",
    },
    { label: "ARR", valor: formatoEuros(data.arr), icon: TrendingUp },
    { label: "Clientes activos", valor: data.conteos.activos, icon: Users },
    { label: "En prueba", valor: data.conteos.enPrueba, icon: Hourglass },
    { label: "Cancelados", valor: data.conteos.cancelados, icon: UserX },
    { label: "Altas este mes", valor: data.altasEsteMes, icon: UserPlus },
    {
      label: "Churn del mes",
      valor: formatoPorcentaje(data.churn),
      icon: ArrowDownRight,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tarjetas.map(({ label, valor, icon: Icon, nota }) => (
        <Card key={label}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
              {label}
            </CardTitle>
            <Icon className="size-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{valor}</div>
            {nota ? (
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {nota}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
