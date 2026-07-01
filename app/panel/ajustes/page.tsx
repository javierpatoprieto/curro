import { getCurrentContext } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Campo({ label, valor }: { label: string; valor: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--border)] py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
      <span className="text-sm font-medium">
        {valor?.trim() ? valor : "—"}
      </span>
    </div>
  );
}

export default async function AjustesPage() {
  const context = await getCurrentContext();
  const b = context?.business;

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Ajustes del negocio</h1>
        <p className="text-[var(--muted-foreground)]">
          Datos de tu empresa. La edición y el alta completa llegan en la Fase 5.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {b?.nombre ?? "Sin negocio"}
            {b && (
              <Badge variant={b.activo ? "default" : "destructive"}>
                {b.activo ? "Activo" : "Inactivo"}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Plan actual: {b?.plan ?? "—"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Campo label="Ciudad" valor={b?.ciudad ?? null} />
          <Campo label="Teléfono entrante" valor={b?.telefono_entrante ?? null} />
          <Campo label="Enlace de Cal.com" valor={b?.cal_link ?? null} />
          <Campo
            label="Asistente de Vapi"
            valor={b?.vapi_assistant_id ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
