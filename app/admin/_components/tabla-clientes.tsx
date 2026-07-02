import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatoEuros,
  formatoFecha,
  etiquetaPlan,
  ESTADO_CLIENTE_LABEL,
  ESTADO_CLIENTE_VARIANTE,
} from "@/lib/metrics/format";
import type { FilaCliente } from "@/lib/metrics/rows";

/** Tabla de clientes (una fila por negocio), ya ordenada por MRR desc. */
export function TablaClientes({ filas }: { filas: FilaCliente[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes ({filas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {filas.length === 0 ? (
          <p className="py-4 text-sm text-[var(--muted-foreground)]">
            Todavía no hay negocios dados de alta.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                  <th className="py-2 pr-4 font-medium">Negocio</th>
                  <th className="py-2 pr-4 font-medium">Ciudad</th>
                  <th className="py-2 pr-4 font-medium">Plan</th>
                  <th className="py-2 pr-4 font-medium">Estado</th>
                  <th className="py-2 pr-4 text-right font-medium">MRR</th>
                  <th className="py-2 pr-4 text-right font-medium">Llamadas</th>
                  <th className="py-2 pr-4 text-right font-medium">Leads</th>
                  <th className="py-2 text-right font-medium">Alta</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">{f.nombre}</td>
                    <td className="py-3 pr-4 text-[var(--muted-foreground)]">
                      {f.ciudad ?? "—"}
                    </td>
                    <td className="py-3 pr-4">{etiquetaPlan(f.plan)}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={ESTADO_CLIENTE_VARIANTE[f.estado]}>
                        {ESTADO_CLIENTE_LABEL[f.estado]}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">
                      {formatoEuros(f.mrr)}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">
                      {f.llamadasMes}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">
                      {f.leadsMes}
                    </td>
                    <td className="py-3 text-right text-[var(--muted-foreground)]">
                      {formatoFecha(f.altaISO)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
