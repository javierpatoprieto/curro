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
 * `onboarding_status` y ofrece una acción de reintento. Las acciones se pasan
 * como props (server actions) para no acoplar el componente.
 *
 * Defect 6: ofrecemos acción no solo en `error`, también en `pendiente` (un
 * paso que se quedó a medias — o el estado vacío `{}` por un throw temprano — no
 * puede quedarse sin salida en la UI). Además, un botón GLOBAL "Reintentar
 * aprovisionamiento" que re-ejecuta el orquestador entero, para arrancar/rehacer
 * un negocio atascado sin ningún paso en error concreto.
 */
export function OnboardingChecklist({
  businessId,
  status,
  reintentar,
  reaprovisionar,
}: {
  businessId: string;
  status: OnboardingStatus;
  /** Server action: reintenta un paso concreto. */
  reintentar: (businessId: string, paso: string) => Promise<void>;
  /** Server action: re-ejecuta el aprovisionamiento completo (opcional). */
  reaprovisionar?: (businessId: string) => Promise<void>;
}) {
  return (
    <div className="space-y-3">
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
      {reaprovisionar && (
        <ReaprovisionarBoton
          businessId={businessId}
          reaprovisionar={reaprovisionar}
        />
      )}
    </div>
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
      {/* Defect 6: acción también en `pendiente`, no solo en `error`. Un paso a
          medias (o el default vacío) necesita una vía para completarse. */}
      {(estado === "error" || estado === "pendiente") && (
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
          {estado === "error" ? "Reintentar" : "Completar"}
        </button>
      )}
    </li>
  );
}

/** Botón global: re-ejecuta el aprovisionamiento completo (defect 6). */
function ReaprovisionarBoton({
  businessId,
  reaprovisionar,
}: {
  businessId: string;
  reaprovisionar: (businessId: string) => Promise<void>;
}) {
  const [pendiente, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() =>
        startTransition(async () => {
          await reaprovisionar(businessId);
        })
      }
      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--muted)] disabled:opacity-60"
    >
      {pendiente && <Loader2 className="size-3.5 animate-spin" />}
      Reintentar aprovisionamiento
    </button>
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
