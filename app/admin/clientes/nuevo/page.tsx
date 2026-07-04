import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { exigirAdmin } from "@/lib/admin/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardAlta } from "@/components/admin/wizard-alta";
import { crearClienteAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function NuevoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await exigirAdmin();
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-4" /> Volver al panel
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alta de cliente</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Rellena los datos y Curro se monta solo: se crea el asistente de voz
            con la personalización y la cuenta del cliente.
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
            {error === "validacion"
              ? "Revisa los datos: nombre, email y plan son obligatorios."
              : error === "vapi"
                ? "No se pudo crear el asistente de voz (Vapi). Revisa la API key e inténtalo de nuevo."
                : "No se pudo crear el cliente. Inténtalo de nuevo."}
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Datos del cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <WizardAlta action={crearClienteAdmin} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
