import Link from "next/link";
import { Inbox, Phone, MapPin, Flame, ChevronRight } from "lucide-react";
import { getLeads, computeStats } from "@/lib/leads";
import { LEAD_ESTADOS, ESTADO_LABEL, type LeadEstado } from "@/lib/types";
import { EstadoBadge } from "@/components/panel/estado-badge";
import { AutoRefresh } from "@/components/panel/auto-refresh";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function href(estado: string, urgencia: boolean) {
  const q = new URLSearchParams();
  if (estado && estado !== "todos") q.set("estado", estado);
  if (urgencia) q.set("urgencia", "1");
  const s = q.toString();
  return `/panel/leads${s ? `?${s}` : ""}`;
}

function Chip({
  activo,
  href: h,
  children,
}: {
  activo: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={h}
      className={cn(
        "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        activo
          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
          : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]",
      )}
    >
      {children}
    </Link>
  );
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; urgencia?: string }>;
}) {
  const sp = await searchParams;
  const estadoFiltro = sp.estado;
  const soloUrgentes = sp.urgencia === "1";

  const todos = await getLeads();
  const stats = computeStats(todos);

  let leads = todos;
  if (estadoFiltro && LEAD_ESTADOS.includes(estadoFiltro as LeadEstado)) {
    leads = leads.filter((l) => l.estado === estadoFiltro);
  }
  if (soloUrgentes) leads = leads.filter((l) => l.urgencia);

  return (
    <div className="space-y-6">
      <AutoRefresh />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-[var(--muted-foreground)]">
            {stats.total} en total · {stats.mes} en los últimos 30 días
          </p>
        </div>
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip activo={!estadoFiltro} href={href("todos", soloUrgentes)}>
          Todos
        </Chip>
        {LEAD_ESTADOS.map((e) => (
          <Chip
            key={e}
            activo={estadoFiltro === e}
            href={href(e, soloUrgentes)}
          >
            {ESTADO_LABEL[e]}
          </Chip>
        ))}
        <span className="mx-1 h-5 w-px bg-[var(--border)]" />
        <Chip activo={soloUrgentes} href={href(estadoFiltro ?? "todos", !soloUrgentes)}>
          🔥 Solo urgentes
        </Chip>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[var(--secondary)]">
              <Inbox className="size-6 text-[var(--muted-foreground)]" />
            </div>
            <p className="font-medium">No hay leads con estos filtros</p>
            <p className="max-w-sm text-sm text-[var(--muted-foreground)]">
              Prueba a quitar filtros. Cuando entre una llamada, el lead aparece
              aquí automáticamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {leads.map((lead) => (
            <Link key={lead.id} href={`/panel/leads/${lead.id}`}>
              <Card className="transition-colors hover:border-[var(--ring)]">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="min-w-0 flex-1 space-y-1">
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
                        <Phone className="size-3" />{" "}
                        {lead.cliente_telefono ?? "—"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" /> {lead.zona ?? "—"}
                      </span>
                      <span>{fmtFecha(lead.created_at)}</span>
                    </div>
                  </div>
                  <EstadoBadge estado={lead.estado} />
                  <ChevronRight className="size-4 shrink-0 text-[var(--muted-foreground)]" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
