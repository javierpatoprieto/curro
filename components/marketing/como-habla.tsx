"use client";

import { useEffect, useMemo, useState } from "react";
import { PhoneCall } from "lucide-react";

type Turno = { s: "curro" | "cliente"; t: string };

const CONVERSACION: Turno[] = [
  { s: "curro", t: "Reformas García, le atiende Curro. ¿En qué puedo ayudarle?" },
  { s: "cliente", t: "Hola, tengo una fuga en el baño y me corre prisa." },
  { s: "curro", t: "Entendido. ¿Su nombre y en qué zona está?" },
  { s: "cliente", t: "María López, en Chamberí." },
  { s: "curro", t: "Perfecto, María. Le paso el aviso al técnico ahora mismo." },
];

/** Onda de voz: barras que oscilan como un audio en vivo. */
function Onda({ activo, curro }: { activo: boolean; curro: boolean }) {
  // Alturas base deterministas (patrón de onda) para no romper la hidratación.
  const barras = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => {
        const base = 24 + Math.round(60 * Math.abs(Math.sin(i * 0.7)));
        const dur = 0.6 + ((i * 37) % 60) / 100; // 0.6–1.2s
        const delay = ((i * 53) % 50) / 100; // 0–0.5s
        return { base, dur, delay };
      }),
    [],
  );

  return (
    <div
      aria-hidden
      className="flex h-24 items-center justify-center gap-[3px] sm:gap-1"
    >
      {barras.map((b, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-colors sm:w-1.5 ${
            curro ? "bg-lima" : "bg-nieve/45"
          }`}
          style={{
            height: `${b.base}%`,
            animation: activo
              ? `curro-wave ${b.dur}s ease-in-out ${b.delay}s infinite`
              : "none",
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

export function ComoHabla() {
  const [i, setI] = useState(0);
  const turno = CONVERSACION[i];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dur = mq.matches ? 4000 : 1800 + turno.t.length * 45;
    const id = setTimeout(
      () => setI((n) => (n + 1) % CONVERSACION.length),
      dur,
    );
    return () => clearTimeout(id);
  }, [i, turno.t.length]);

  const esCurro = turno.s === "curro";
  // Ventana de transcripción: turno actual y el anterior.
  const visibles = CONVERSACION.slice(Math.max(0, i - 2), i + 1);

  return (
    <section className="bg-bosque text-nieve">
      <div className="mx-auto max-w-5xl px-5 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-nieve/15 bg-nieve/5 px-3 py-1.5 text-xs font-semibold text-nieve">
            <span className="size-1.5 rounded-full bg-lima" />
            Cómo habla
          </span>
          <h2 className="titular mt-6 text-4xl text-nieve sm:text-5xl">
            No parece un robot. Habla{" "}
            <span className="text-lima">como una persona</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-nieve/70">
            Conversa con naturalidad, en español, y toma nota de todo. Escúchalo:
          </p>
        </div>

        {/* Panel de la llamada en vivo */}
        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-nieve/10 bg-nieve/[0.04] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-nieve">
              <span className="flex size-9 items-center justify-center rounded-full bg-lima text-bosque">
                <PhoneCall className="size-4" strokeWidth={2.5} />
              </span>
              {esCurro ? "Curro está hablando" : "Escuchando al cliente"}
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-nieve/60">
              <span className="size-1.5 rounded-full bg-lima" />
              En vivo · 00:14
            </span>
          </div>

          <div className="my-7">
            <Onda activo curro={esCurro} />
          </div>

          {/* Transcripción en vivo */}
          <div className="min-h-[132px] space-y-2.5">
            {visibles.map((t, idx) => {
              const actual = idx === visibles.length - 1;
              return (
                <div
                  key={`${i}-${idx}`}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm transition-opacity ${
                    t.s === "curro"
                      ? "ml-auto rounded-br-sm bg-lima text-bosque"
                      : "mr-auto rounded-bl-sm bg-nieve/10 text-nieve"
                  } ${actual ? "opacity-100" : "opacity-45"}`}
                >
                  {t.t}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
