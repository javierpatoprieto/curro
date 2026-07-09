"use client";

import { useTransition } from "react";
import { Loader2, Check, X, Minus, Clock } from "lucide-react";
import {
  PASOS,
  PASOS_LABEL,
  type EstadoPaso,
  type OnboardingStatus,
  type PasoOnboarding,
} from "@/lib/onboarding/estado";

/**
 * Checklist de aprovisionamiento (Fase 2). Muestra el estado por paso leyendo
 * `onboarding_status` y ofrece "Reintentar" en los pasos en error. La acción de
 * reintento se pasa como prop (server action) para no acoplar el componente.
 */
export function OnboardingChecklist({
  businessId,
  status,
  reintentar,
}: {
  businessId: string;
  status: OnboardingStatus;
  /** Server action: reintenta un paso concreto. */
  reintentar: (businessId: string, paso: string) => Promise<void>;
}) {
  return (
    <ul className="space-y-2">
      {PASOS.map((paso) => (
        <PasoFila
          key={paso}
          businessId={businessId}
          paso={paso}
          estado={status[paso]?.estado ?? "pendiente"}
          detalle={status[paso]?.detalle}
          reintentar={reintentar}
        />
      ))}
    </ul>
  );
}

function PasoFila({
  businessId,
  paso,
  estado,
  detalle,
  reintentar,
}: {
  businessId: string;
  paso: PasoOnboarding;
  estado: EstadoPaso;
  detalle?: string;
  reintentar: (businessId: string, paso: string) => Promise<void>;
}) {
  const [pendiente, startTransition] = useTransition();

  return (
    <li className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2">
      <IconoEstado estado={estado} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{PASOS_LABEL[paso]}</p>
        {detalle && (
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            {detalle}
          </p>
        )}
      </div>
      <span className="text-xs text-[var(--muted-foreground)]">
        {ETIQUETA_ESTADO[estado]}
      </span>
      {estado === "error" && (
        <button
          type="button"
          disabled={pendiente}
          onClick={() =>
            startTransition(async () => {
              await reintentar(businessId, paso);
            })
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium hover:bg-[var(--muted)] disabled:opacity-60"
        >
          {pendiente && <Loader2 className="size-3.5 animate-spin" />}
          Reintentar
        </button>
      )}
    </li>
  );
}

const ETIQUETA_ESTADO: Record<EstadoPaso, string> = {
  hecho: "Hecho",
  pendiente: "Pendiente",
  error: "Error",
  omitido: "No aplica",
};

function IconoEstado({ estado }: { estado: EstadoPaso }) {
  switch (estado) {
    case "hecho":
      return <Check className="size-4 shrink-0 text-emerald-600" />;
    case "error":
      return <X className="size-4 shrink-0 text-[var(--destructive)]" />;
    case "omitido":
      return <Minus className="size-4 shrink-0 text-[var(--muted-foreground)]" />;
    case "pendiente":
    default:
      return <Clock className="size-4 shrink-0 text-amber-500" />;
  }
}
