import { FileText, CreditCard, Ban, ExternalLink } from "lucide-react";
import { getCurrentContext } from "@/lib/auth";
import { abrirPortalFacturacion } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function FacturacionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const context = await getCurrentContext();
  const tieneSuscripcion = Boolean(context?.business.stripe_customer_id);

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Facturación</h1>
        <p className="text-[var(--muted-foreground)]">
          Descarga tus facturas, cambia la tarjeta o gestiona tu suscripción.
        </p>
      </header>

      {error === "sin-suscripcion" && (
        <p className="rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-700">
          Aún no tienes una suscripción activa. Cuando completes el alta con
          tarjeta, aquí podrás descargar tus facturas.
        </p>
      )}
      {error === "demo" && (
        <p className="rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-700">
          En modo demo no hay facturación real.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Portal de facturación</CardTitle>
          <CardDescription>
            Gestionado de forma segura por Stripe. Se abre en la misma ventana.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <li className="flex items-center gap-2">
              <FileText className="size-4 text-[var(--primary)]" />
              Descarga tus facturas en PDF (con tu NIF, para desgravar).
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="size-4 text-[var(--primary)]" />
              Cambia la tarjeta o los datos de pago.
            </li>
            <li className="flex items-center gap-2">
              <Ban className="size-4 text-[var(--primary)]" />
              Cancela la suscripción cuando quieras.
            </li>
          </ul>

          <form action={abrirPortalFacturacion}>
            <Button type="submit" disabled={!tieneSuscripcion}>
              <ExternalLink className="size-4" />
              Abrir portal de facturación
            </Button>
          </form>
          {!tieneSuscripcion && (
            <p className="text-xs text-[var(--muted-foreground)]">
              El portal estará disponible cuando tengas una suscripción activa.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
