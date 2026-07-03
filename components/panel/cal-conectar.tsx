"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2, CalendarCheck } from "lucide-react";
import { conectarCal, desconectarCal } from "@/app/panel/ajustes/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * Conecta la cuenta de Cal.com del negocio para que Curro pueda agendar visitas
 * en la propia llamada. La API key NO se muestra nunca (solo el estado conectado).
 */
export function CalConectar({ conectado }: { conectado: boolean }) {
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [pendiente, startTransition] = useTransition();

  function onConectar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setEstado("idle");
    startTransition(async () => {
      const r = await conectarCal(fd);
      setEstado(r.ok ? "ok" : "error");
    });
  }

  function onDesconectar() {
    setEstado("idle");
    startTransition(async () => {
      const r = await desconectarCal();
      setEstado(r.ok ? "ok" : "error");
    });
  }

  if (conectado) {
    return (
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CalendarCheck className="size-4" /> Cal.com conectado — Curro agenda las
          visitas en la llamada.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onDesconectar}
          disabled={pendiente}
        >
          {pendiente && <Loader2 className="size-4 animate-spin" />}
          Desconectar Cal.com
        </Button>
        {estado === "error" && (
          <span className="block text-sm text-[var(--destructive)]">
            No se pudo actualizar. Inténtalo de nuevo.
          </span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onConectar} className="space-y-4">
      <p className="text-sm text-[var(--muted-foreground)]">
        Pega tu API key de Cal.com y el ID del tipo de evento «visita». Con esto
        Curro propone huecos libres y reserva la cita durante la llamada. La key se
        guarda cifrada y no se muestra.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="cal_api_key">API key de Cal.com</Label>
          <Input
            id="cal_api_key"
            name="cal_api_key"
            type="password"
            required
            placeholder="cal_live_..."
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cal_event_type_id">ID del tipo de evento</Label>
          <Input
            id="cal_event_type_id"
            name="cal_event_type_id"
            required
            placeholder="123456"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pendiente}>
          {pendiente && <Loader2 className="size-4 animate-spin" />}
          Conectar Cal.com
        </Button>
        {estado === "ok" && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
            <CheckCircle2 className="size-4" /> Conectado
          </span>
        )}
        {estado === "error" && (
          <span className="text-sm text-[var(--destructive)]">
            Revisa la API key y el ID del evento.
          </span>
        )}
      </div>
    </form>
  );
}
