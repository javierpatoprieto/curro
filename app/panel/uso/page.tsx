import { Phone, Clock, Euro } from "lucide-react";
import { getCurrentContext } from "@/lib/auth";
import { getUso, limiteDe } from "@/lib/usage";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Plan } from "@/lib/types";

const PLAN_LABEL: Record<Plan, string> = {
  trial: "Prueba",
  starter: "Básico",
  pro: "Pro",
  premium: "Premium",
  cancelado: "Cancelado",
};

export default async function UsoPage() {
  const context = await getCurrentContext();
  const uso = await getUso();
  const plan = (context?.business.plan ?? "trial") as Plan;
  const limite = limiteDe(plan);
  const pct = limite > 0 ? Math.min(100, Math.round((uso.llamadas / limite) * 100)) : 0;
  const cerca = pct >= 80;

  const tarjetas = [
    { label: "Llamadas este mes", valor: uso.llamadas, icon: Phone },
    { label: "Minutos", valor: uso.minutos, icon: Clock },
    { label: "Coste estimado", valor: `${uso.coste.toFixed(2)} €`, icon: Euro },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Uso</h1>
        <p className="text-[var(--muted-foreground)]">
          Consumo del mes actual. Plan {PLAN_LABEL[plan]}.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {tarjetas.map(({ label, valor, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                {label}
              </CardTitle>
              <Icon className="size-4 text-[var(--muted-foreground)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{valor}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Llamadas incluidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">
              {uso.llamadas} de {limite} llamadas
            </span>
            <span className={cerca ? "font-semibold text-[var(--destructive)]" : ""}>
              {pct}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
            <div
              className={
                cerca
                  ? "h-full rounded-full bg-[var(--destructive)]"
                  : "h-full rounded-full bg-[var(--primary)]"
              }
              style={{ width: `${pct}%` }}
            />
          </div>
          {cerca && (
            <p className="text-sm text-[var(--destructive)]">
              Estás cerca del límite de tu plan. Al superarlo, seguimos guardando
              tus leads pero se pausan los avisos automáticos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
