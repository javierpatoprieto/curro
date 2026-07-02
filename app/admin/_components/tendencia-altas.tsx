import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AltasMes } from "@/lib/metrics/customers";

/**
 * Gráfico de barras simple (divs) de altas por mes. Sin librerías externas.
 * Server component: recibe la serie ya calculada.
 */
export function TendenciaAltas({ serie }: { serie: AltasMes[] }) {
  const maximo = Math.max(1, ...serie.map((p) => p.altas));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Altas por mes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3 pt-2">
          {serie.map((p) => {
            const alturaPct = Math.round((p.altas / maximo) * 100);
            return (
              <div
                key={p.clave}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="text-xs font-semibold tabular-nums text-[var(--foreground)]">
                  {p.altas}
                </span>
                <div className="flex h-32 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-[var(--primary)] transition-all"
                    style={{ height: `${Math.max(alturaPct, p.altas > 0 ? 6 : 2)}%` }}
                    aria-hidden
                  />
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {p.etiqueta}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
