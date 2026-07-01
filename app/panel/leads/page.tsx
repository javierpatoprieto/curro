import { Inbox, Phone, MapPin, Flame } from "lucide-react";
import { getLeads } from "@/lib/leads";
import { EstadoBadge } from "@/components/panel/estado-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-[var(--muted-foreground)]">
            Todas las oportunidades captadas por tu recepcionista con IA.
          </p>
        </div>
        <Badge variant="secondary">{leads.length} en total</Badge>
      </header>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[var(--secondary)]">
              <Inbox className="size-6 text-[var(--muted-foreground)]" />
            </div>
            <p className="font-medium">Aún no hay leads</p>
            <p className="max-w-sm text-sm text-[var(--muted-foreground)]">
              En cuanto entre la primera llamada, aparecerá aquí con su
              transcripción y sus datos. Los filtros y el detalle llegan en la
              Fase 4.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {lead.cliente_nombre ?? "Sin nombre"}
                    </p>
                    {lead.urgencia && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--destructive)]/10 px-2 py-0.5 text-xs font-medium text-[var(--destructive)]">
                        <Flame className="size-3" /> Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {lead.tipo_trabajo ?? "—"}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3" /> {lead.cliente_telefono ?? "—"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" /> {lead.zona ?? "—"}
                    </span>
                    <span>{formatFecha(lead.created_at)}</span>
                  </div>
                </div>
                <EstadoBadge estado={lead.estado} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
