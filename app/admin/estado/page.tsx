import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleDashed, AlertTriangle, MinusCircle } from "lucide-react";
import { exigirAdmin } from "@/lib/admin/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import {
  construirDiagnostico,
  bloqueosParaLlamadaReal,
  type EstadoCapacidad,
} from "@/lib/admin/diagnostico";

// Lee process.env en vivo: nunca cachear.
export const dynamic = "force-dynamic";

const ESTILO: Record<
  EstadoCapacidad,
  { etiqueta: string; clase: string; Icono: typeof CheckCircle2 }
> = {
  real: {
    etiqueta: "En real",
    clase: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Icono: CheckCircle2,
  },
  mock: {
    etiqueta: "Simulado",
    clase: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Icono: CircleDashed,
  },
  incompleto: {
    etiqueta: "Falta configurar",
    clase: "bg-[var(--destructive)]/10 text-[var(--destructive)]",
    Icono: AlertTriangle,
  },
  off: {
    etiqueta: "Desactivado",
    clase: "bg-[var(--muted)] text-[var(--muted-foreground)]",
    Icono: MinusCircle,
  },
};

/**
 * Estado de configuración del sistema. Responde de un vistazo a la única
 * pregunta que importa antes de vender: si un cliente llamara ahora mismo,
 * ¿acabaría en un aviso real? Solo muestra qué variables FALTAN, nunca valores.
 */
export default async function EstadoPage() {
  await exigirAdmin();

  const caps = construirDiagnostico({
    vars: process.env as Record<string, string | undefined>,
    mockProviders: env.mockProviders,
  });
  const bloqueos = bloqueosParaLlamadaReal(caps);

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
          <h1 className="text-2xl font-bold tracking-tight">
            Estado del sistema
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Qué está funcionando de verdad y qué sigue simulado, según las
            variables de entorno de este despliegue.
          </p>
        </div>

        <Card
          className={
            bloqueos.length === 0
              ? "border-emerald-500/40"
              : "border-[var(--destructive)]/40"
          }
        >
          <CardHeader>
            <CardTitle className="text-base">
              {bloqueos.length === 0
                ? "Listo para atender llamadas reales"
                : "Todavía no atiende llamadas reales"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {bloqueos.length === 0 ? (
              <p className="text-[var(--muted-foreground)]">
                El camino completo está en real: llamada → agente de voz → lead →
                aviso al dueño. Haz una llamada de prueba de punta a punta antes
                de dar de alta al primer cliente.
              </p>
            ) : (
              <>
                <p className="text-[var(--muted-foreground)]">
                  Falta esto para que la llamada de un cliente acabe en un aviso
                  real:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {bloqueos.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {caps.map((c) => {
            const { etiqueta, clase, Icono } = ESTILO[c.estado];
            return (
              <div
                key={c.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="font-semibold">{c.nombre}</h2>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${clase}`}
                  >
                    <Icono className="size-3.5" /> {etiqueta}
                  </span>
                </div>

                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {c.resumen}
                </p>

                {c.faltan.length > 0 && (
                  <p className="mt-2 text-sm">
                    <span className="text-[var(--muted-foreground)]">
                      Falta en Vercel:{" "}
                    </span>
                    {c.faltan.map((v, i) => (
                      <span key={v}>
                        {i > 0 && ", "}
                        <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-xs">
                          {v}
                        </code>
                      </span>
                    ))}
                  </p>
                )}

                {c.aviso && (
                  <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                    {c.aviso}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-[var(--muted-foreground)]">
          Esta página solo comprueba si cada variable existe; nunca muestra su
          valor. Tras cambiar variables en Vercel hay que volver a desplegar para
          que el cambio se aplique.
        </p>
      </div>
    </div>
  );
}
