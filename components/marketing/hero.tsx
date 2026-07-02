"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, Check, MessageCircle } from "lucide-react";
import { btnPrimaryLg, btnGhost } from "./ui";

const FASES = ["Entra", "Contesta", "Apunta", "Avisa"] as const;

function Waveform() {
  return (
    <span aria-hidden className="flex h-4 items-end gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-0.5 rounded-full bg-verde"
          style={{
            height: "100%",
            animation: "float 0.9s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </span>
  );
}

/** Tarjeta que cicla el flujo real de Curro con movimiento. */
function LiveCard() {
  const [fase, setFase] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Sin animación: mostramos directamente el resultado final.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFase(3);
      return;
    }
    const dur = [2200, 3200, 2800, 3200];
    const id = setTimeout(() => setFase((f) => (f + 1) % 4), dur[fase]);
    return () => clearTimeout(id);
  }, [fase]);

  return (
    <div className="w-full max-w-sm">
      <div className="card-fresh overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/6 px-5 py-3 text-xs font-medium text-ink-soft">
          <span className="inline-flex items-center gap-2">
            <span className="live-dot" /> En vivo
          </span>
          <span>9:41</span>
        </div>
        <div className="flex h-72 flex-col p-5">
          {fase === 0 && (
            <div className="animate-rise-in flex flex-1 flex-col items-center justify-center text-center">
              <div className="relative flex size-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-verde/25" />
                <span className="relative flex size-16 items-center justify-center rounded-full bg-ink text-white">
                  <PhoneCall className="size-6" />
                </span>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
                Llamada entrante
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">
                +34 6·· ··· ···
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Estás liado. No llegas al teléfono.
              </p>
            </div>
          )}
          {fase === 1 && (
            <div className="flex flex-1 flex-col">
              <div className="mb-3 inline-flex items-center gap-2 self-start rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white">
                <PhoneCall className="size-3.5 text-verde" /> Curro está contestando
                <Waveform />
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { de: "c", t: "Hola, necesito que me arreglen una fuga" },
                  { de: "b", t: "Claro. ¿En qué zona y para cuándo?" },
                  { de: "c", t: "En Chamberí, y me corre prisa" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className={`animate-rise-in max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      b.de === "b"
                        ? "self-end bg-verde/15 text-ink"
                        : "self-start bg-mist text-ink"
                    }`}
                    style={{ animationDelay: `${i * 0.6}s` }}
                  >
                    {b.t}
                  </div>
                ))}
              </div>
            </div>
          )}
          {fase === 2 && (
            <div className="flex flex-1 flex-col justify-center">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-verde-dark">
                Datos apuntados
              </p>
              <div className="flex flex-col gap-3">
                {[
                  ["Cliente", "María López"],
                  ["Trabajo", "Reparar fuga"],
                  ["Zona", "Chamberí"],
                  ["Urgencia", "Alta"],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className="animate-rise-in flex items-center gap-3"
                    style={{ animationDelay: `${i * 0.45}s` }}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-verde/15 text-verde-dark">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm">
                      <span className="text-ink-soft">{k}: </span>
                      <span className="font-semibold text-ink">{v}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {fase === 3 && (
            <div className="animate-rise-in flex flex-1 flex-col justify-center">
              <div className="rounded-2xl border border-verde/20 bg-verde-soft p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-verde-dark">
                  <MessageCircle className="size-4" /> WhatsApp · nuevo cliente
                </div>
                <p className="mt-2 text-sm font-semibold text-ink">María López</p>
                <p className="text-sm text-ink-soft">Reparar fuga · Chamberí</p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                <Check className="size-4 text-verde-dark" strokeWidth={3} />
                Te avisamos al instante.
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {FASES.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium transition-colors ${
              i === fase ? "text-ink" : "text-ink-soft/40"
            }`}
          >
            {label}
            {i < FASES.length - 1 && (
              <span className="ml-2 text-ink-soft/20">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[38rem] rounded-full bg-verde/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-52 size-[28rem] rounded-full bg-violeta/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-verde-soft px-3 py-1.5 text-xs font-semibold text-ink">
            <span className="live-dot" />
            Recepcionista con IA · para autónomos y gremios
          </span>
          <h1 className="headline mt-6 text-5xl text-ink sm:text-6xl lg:text-[4.1rem]">
            Tú a lo tuyo.
            <br />
            Curro coge <span className="grad">el teléfono</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            La recepcionista con IA para autónomos y pequeños gremios. Contesta
            cada llamada, apunta al cliente y te lo pasa por WhatsApp. Estés donde
            estés, con las manos ocupadas o en plena faena.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/registro" className={btnPrimaryLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
            <a href="#como-funciona" className={btnGhost}>
              Ver cómo funciona
            </a>
          </div>
          <p className="mt-6 text-sm text-ink-soft/70">
            Sin permanencia · Listo en 10 minutos · Cancelas cuando quieras
          </p>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <LiveCard />
        </div>
      </div>
    </section>
  );
}
