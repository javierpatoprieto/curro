import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Flame,
  Clock,
  FileAudio,
} from "lucide-react";
import { getLeadById } from "@/lib/leads";
import { EstadoSelect } from "@/components/panel/estado-select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default async function LeadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  const datos: [React.ReactNode, string][] = [
    [<Phone key="t" className="size-4" />, lead.cliente_telefono ?? "—"],
    [<MapPin key="z" className="size-4" />, lead.zona ?? "—"],
    [<Clock key="f" className="size-4" />, fmtFecha(lead.created_at)],
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/panel/leads"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="size-4" /> Volver a leads
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {lead.cliente_nombre ?? "Sin nombre"}
            </h1>
            {lead.urgencia && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--destructive)]/10 px-2 py-0.5 text-xs font-medium text-[var(--destructive)]">
                <Flame className="size-3" /> Urgente
              </span>
            )}
          </div>
          <p className="mt-1 text-[var(--muted-foreground)]">
            {lead.tipo_trabajo ?? "Trabajo sin especificar"}
          </p>
        </div>
        <EstadoSelect id={lead.id} estadoInicial={lead.estado} />
      </header>

      <Card>
        <CardContent className="flex flex-wrap gap-x-8 gap-y-3 py-4 text-sm">
          {datos.map(([icon, valor], i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-[var(--muted-foreground)]"
            >
              {icon}
              <span className="text-[var(--foreground)]">{valor}</span>
            </span>
          ))}
        </CardContent>
      </Card>

      {lead.audio_url && (
        <Card>
          <CardContent className="py-4">
            <a
              href={lead.audio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              <FileAudio className="size-4" /> Escuchar la grabación
            </a>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Transcripción de la llamada</CardTitle>
        </CardHeader>
        <CardContent>
          {lead.transcripcion ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--foreground)]">
              {lead.transcripcion}
            </pre>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">
              No hay transcripción disponible para esta llamada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
