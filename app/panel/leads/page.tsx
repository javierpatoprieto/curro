import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-[var(--muted-foreground)]">
          Todas las oportunidades captadas por tu recepcionista con IA.
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--secondary)]">
            <Inbox className="size-6 text-[var(--muted-foreground)]" />
          </div>
          <p className="font-medium">Aún no hay leads</p>
          <p className="max-w-sm text-sm text-[var(--muted-foreground)]">
            En cuanto entre la primera llamada, aparecerá aquí con su
            transcripción y sus datos. El listado en tiempo real llega en la
            Fase 4.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
