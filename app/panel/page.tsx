import { Inbox, Clock, CheckCircle2 } from "lucide-react";
import { getCurrentContext } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PanelHome() {
  const context = await getCurrentContext();
  const nombre = context?.owner.nombre?.split(" ")[0];

  // Los contadores reales llegan en la Fase 4 (panel de leads funcional).
  const stats = [
    { label: "Leads este mes", valor: "—", icon: Inbox },
    { label: "Pendientes de contactar", valor: "—", icon: Clock },
    { label: "Visitas agendadas", valor: "—", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Hola{nombre ? `, ${nombre}` : ""} 👋
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Este es tu panel. Aquí verás cada llamada que atiende tu recepcionista
          con IA.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, valor, icon: Icon }) => (
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
        <CardContent className="py-6 text-sm text-[var(--muted-foreground)]">
          Aún no hay datos reales. Cuando conectemos el webhook de Vapi (Fase 2),
          cada llamada aparecerá aquí automáticamente como un lead.
        </CardContent>
      </Card>
    </div>
  );
}
