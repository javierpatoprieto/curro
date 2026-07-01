import { getCurrentContext } from "@/lib/auth";
import { AjustesForm } from "@/components/panel/ajustes-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AjustesPage() {
  const context = await getCurrentContext();
  const b = context?.business;

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Ajustes del negocio</h1>
        <p className="text-[var(--muted-foreground)]">
          Personaliza cómo atiende Curro. Los cambios se aplican a tu asistente al
          guardar.
        </p>
      </header>

      {b ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Tu negocio
              <Badge variant={b.activo ? "default" : "destructive"}>
                {b.activo ? "Activo" : "Inactivo"}
              </Badge>
              <Badge variant="secondary">Plan {b.plan}</Badge>
            </CardTitle>
            <CardDescription>
              Asistente de Vapi: {b.vapi_assistant_id ?? "sin asignar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AjustesForm business={b} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-[var(--muted-foreground)]">
            Aún no tienes un negocio configurado.{" "}
            <a href="/onboarding" className="font-semibold underline">
              Darlo de alta
            </a>
            .
          </CardContent>
        </Card>
      )}
    </div>
  );
}
