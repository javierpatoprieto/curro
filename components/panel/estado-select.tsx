"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { LEAD_ESTADOS, ESTADO_LABEL, type LeadEstado } from "@/lib/types";
import { cambiarEstadoLead } from "@/app/panel/leads/actions";
import { cn } from "@/lib/utils";

export function EstadoSelect({
  id,
  estadoInicial,
}: {
  id: string;
  estadoInicial: LeadEstado;
}) {
  const [estado, setEstado] = useState<LeadEstado>(estadoInicial);
  const [pendiente, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevo = e.target.value as LeadEstado;
    const anterior = estado;
    setEstado(nuevo); // optimista
    startTransition(async () => {
      try {
        await cambiarEstadoLead(id, nuevo);
      } catch {
        setEstado(anterior); // revertir si falla
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={estado}
        onChange={onChange}
        disabled={pendiente}
        className={cn(
          "h-9 rounded-md border border-[var(--input)] bg-transparent px-3 text-sm font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          pendiente && "opacity-60",
        )}
      >
        {LEAD_ESTADOS.map((e) => (
          <option key={e} value={e}>
            {ESTADO_LABEL[e]}
          </option>
        ))}
      </select>
      {pendiente && (
        <Loader2 className="size-4 animate-spin text-[var(--muted-foreground)]" />
      )}
    </div>
  );
}
