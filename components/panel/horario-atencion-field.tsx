"use client";

import { useMemo, useState } from "react";
import {
  DIAS,
  PRESETS_HORARIO,
  TZ_POR_DEFECTO,
  type DiaSemana,
  type HorarioAtencion,
} from "@/lib/horario";

const ETIQUETA_DIA: Record<DiaSemana, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábado",
  dom: "Domingo",
};

const inputCls =
  "rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm outline-none focus:border-[var(--ring)] disabled:opacity-40";

type Fila = { activo: boolean; ini: string; fin: string };

function filasDesde(horario: HorarioAtencion | null | undefined): Record<DiaSemana, Fila> {
  const out = {} as Record<DiaSemana, Fila>;
  for (const d of DIAS) {
    const rango = horario?.dias?.[d]?.[0];
    out[d] = rango
      ? { activo: true, ini: rango[0], fin: rango[1] }
      : { activo: false, ini: "07:00", fin: "18:00" };
  }
  return out;
}

/**
 * Editor del "Horario de atención" del dueño + su móvil. Reutilizable en el alta
 * admin, la ficha del cliente y /panel/ajustes. Es un componente cliente que
 * escribe en dos inputs ocultos (`horario_atencion` como JSON y `telefono_agente`)
 * dentro del <form> que lo contiene; la server action los valida con
 * parseHorarioAtencion / normalizarE164 (lib/horario.ts).
 *
 * Sencillez a propósito: una franja por día (cubre el caso habitual "L–V 7–18").
 * El modelo de datos admite varias franjas por día, pero la UI usa una.
 */
export function HorarioAtencionField({
  defaultHorario,
  defaultTelefonoAgente,
  tz = TZ_POR_DEFECTO,
}: {
  defaultHorario?: HorarioAtencion | null;
  defaultTelefonoAgente?: string | null;
  tz?: string;
}) {
  const [filas, setFilas] = useState<Record<DiaSemana, Fila>>(() =>
    filasDesde(defaultHorario),
  );
  const [tel, setTel] = useState(defaultTelefonoAgente ?? "");

  const horarioJson = useMemo(() => {
    const dias: Partial<Record<DiaSemana, [string, string][]>> = {};
    for (const d of DIAS) {
      const f = filas[d];
      if (f.activo && f.ini && f.fin) dias[d] = [[f.ini, f.fin]];
    }
    return JSON.stringify({ tz, dias });
  }, [filas, tz]);

  const set = (d: DiaSemana, patch: Partial<Fila>) =>
    setFilas((prev) => ({ ...prev, [d]: { ...prev[d], ...patch } }));

  const aplicarPreset = (horario: HorarioAtencion) => setFilas(filasDesde(horario));

  const limpiar = () =>
    setFilas((prev) => {
      const out = {} as Record<DiaSemana, Fila>;
      for (const d of DIAS) out[d] = { ...prev[d], activo: false };
      return out;
    });

  return (
    <div className="space-y-4">
      {/* Inputs ocultos que viajan con el form. */}
      <input type="hidden" name="horario_atencion" value={horarioJson} />

      <div className="space-y-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">
            Móvil del dueño (para transferirle las llamadas en su horario)
          </span>
          <input
            name="telefono_agente"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="+34600111222"
            inputMode="tel"
            className={`w-full ${inputCls} py-2`}
          />
        </label>
        <p className="text-xs text-[var(--muted-foreground)]">
          Dentro del horario que marques abajo, la llamada entrante se transfiere a
          este móvil. Fuera de horario (tardes, noches y fines de semana), la
          atiende Curro. Si dejas el horario vacío, Curro atiende siempre.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS_HORARIO).map(([clave, { etiqueta, horario }]) => (
          <button
            key={clave}
            type="button"
            onClick={() => aplicarPreset(horario)}
            className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium hover:bg-[var(--muted)]"
          >
            {etiqueta}
          </button>
        ))}
        <button
          type="button"
          onClick={limpiar}
          className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium hover:bg-[var(--muted)]"
        >
          Limpiar (Curro 24/7)
        </button>
      </div>

      <div className="space-y-1.5">
        {DIAS.map((d) => {
          const f = filas[d];
          return (
            <div key={d} className="flex flex-wrap items-center gap-2 text-sm">
              <label className="flex w-28 items-center gap-2">
                <input
                  type="checkbox"
                  checked={f.activo}
                  onChange={(e) => set(d, { activo: e.target.checked })}
                  className="size-4"
                />
                {ETIQUETA_DIA[d]}
              </label>
              <input
                type="time"
                value={f.ini}
                disabled={!f.activo}
                onChange={(e) => set(d, { ini: e.target.value })}
                className={inputCls}
                aria-label={`${ETIQUETA_DIA[d]}: desde`}
              />
              <span className="text-[var(--muted-foreground)]">–</span>
              <input
                type="time"
                value={f.fin}
                disabled={!f.activo}
                onChange={(e) => set(d, { fin: e.target.value })}
                className={inputCls}
                aria-label={`${ETIQUETA_DIA[d]}: hasta`}
              />
              {!f.activo && (
                <span className="text-xs text-[var(--muted-foreground)]">
                  atiende Curro
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
