import { Inbox, Clock, CalendarCheck } from "lucide-react";
import { getCurrentContext } from "@/lib/auth";
import { getLeads, computeStats } from "@/lib/leads";
import { EstadoBadge } from "@/components/panel/estado-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PanelHome() {
  const [context, leads] = await Promise.all([getCurrentContext(), getLeads()]);
  const nombre = context?.owner.nombre?.split(" ")[0];
  const stats = computeStats(leads);
  const recientes = leads.slice(0, 4);

  const tarjetas = [
    { label: "Leads en total", valor: stats.total, icon: Inbox },
    { label: "Pendientes de contactar", valor: stats.pendientes, icon: Clock },
    { label: "Visitas agendadas", valor: stats.visitas, icon: CalendarCheck },
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
          <CardTitle>Últimos leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {recientes.length === 0 ? (
            <p className="py-4 text-sm text-[var(--muted-foreground)]">
              Aún no hay leads. Cuando entre la primera llamada aparecerá aquí.
            </p>
          ) : (
            recientes.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {lead.cliente_nombre ?? "Sin nombre"}
                  </p>
                  <p className="truncate text-sm text-[var(--muted-foreground)]">
                    {lead.tipo_trabajo ?? "—"} · {lead.zona ?? "—"}
                  </p>
                </div>
                <EstadoBadge estado={lead.estado} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
