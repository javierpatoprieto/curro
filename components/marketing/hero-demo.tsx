"use client";

import { useEffect, useState } from "react";
import {
  PhoneCall,
  MessageCircle,
  Check,
  Flame,
  CalendarCheck,
} from "lucide-react";

const FASES = ["Suena", "Atiende", "Captura", "Avisa"] as const;

function Waveform() {
  return (
    <span className="flex h-4 items-end gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="wave-bar w-0.5 rounded-full bg-brand"
          style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

export function HeroDemo() {
  const [fase, setFase] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Sin animación: mostramos directamente el resultado final.
      const t = setTimeout(() => setFase(3), 0);
      return () => clearTimeout(t);
    }
    const duraciones = [2200, 3400, 2600, 3200]; // ms por fase
    const id = setTimeout(
      () => setFase((f) => (f + 1) % FASES.length),
      duraciones[fase],
    );
    return () => clearTimeout(id);
  }, [fase]);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rotate-1 rounded-[2rem] border border-ink/10 bg-ink p-3 shadow-2xl">
        <div className="rounded-[1.6rem] bg-cream p-5">
          {/* Barra de estado */}
          <div className="flex items-center justify-between text-xs text-ink/50">
            <span>9:41</span>
            <span className="inline-flex items-center gap-1">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              En directo
            </span>
          </div>

          {/* Cuerpo: altura fija para que el móvil no salte entre fases */}
          <div className="mt-4 flex h-72 flex-col">
            {fase === 0 && <FaseSuena />}
            {fase === 1 && <FaseAtiende />}
            {fase === 2 && <FaseCaptura />}
            {fase === 3 && <FaseAvisa />}
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {FASES.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={
                i === fase
                  ? "text-xs font-semibold text-ink"
                  : "text-xs font-medium text-ink/40"
              }
            >
              {label}
            </span>
            {i < FASES.length - 1 && (
              <span className="text-ink/20">·</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FaseSuena() {
  return (
    <div className="phase-in flex flex-1 flex-col items-center justify-center text-center">
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/30" />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-ink text-cream">
          <PhoneCall className="size-6" />
        </span>
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink/40">
        Llamada entrante
      </p>
      <p className="mt-1 font-display text-2xl font-bold">+34 6·· ··· ···</p>
      <p className="mt-2 text-sm text-ink/50">Estás en la obra. No llegas.</p>
    </div>
  );
}

function FaseAtiende() {
  const bubbles = [
    { de: "cliente", texto: "Hola, quiero reformar el baño entero" },
    { de: "curro", texto: "Genial. ¿En qué zona y para cuándo?" },
    { de: "cliente", texto: "En Chamberí, y me corre prisa" },
  ];
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 inline-flex items-center gap-2 self-start rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cream">
        <PhoneCall className="size-3.5 text-brand" />
        Curro está atendiendo
        <Waveform />
      </div>
      <div className="flex flex-col gap-2">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className={`phase-in max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              b.de === "curro"
                ? "self-end bg-fresh text-white"
                : "self-start bg-white text-ink shadow-sm"
            }`}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            {b.texto}
          </div>
        ))}
      </div>
    </div>
  );
}

function FaseCaptura() {
  const datos = [
    { k: "Cliente", v: "María López" },
    { k: "Trabajo", v: "Reforma de baño completo" },
    { k: "Zona", v: "Chamberí, Madrid" },
    { k: "Urgencia", v: "Alta" },
  ];
  return (
    <div className="flex flex-1 flex-col justify-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-fresh-strong">
        Datos capturados
      </p>
      <div className="flex flex-col gap-3">
        {datos.map((d, i) => (
          <div
            key={d.k}
            className="phase-in flex items-center gap-3"
            style={{ animationDelay: `${i * 0.45}s` }}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fresh/15 text-fresh-strong">
              <Check className="size-3.5" />
            </span>
            <span className="text-sm">
              <span className="text-ink/50">{d.k}: </span>
              <span className="font-medium">{d.v}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaseAvisa() {
  return (
    <div className="phase-in flex flex-1 flex-col justify-center">
      <div className="rounded-2xl border border-emerald-600/20 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <MessageCircle className="size-4" />
          WhatsApp · nuevo lead
        </div>
        <p className="mt-2 text-sm font-semibold">María López</p>
        <p className="text-sm text-ink/70">Reforma de baño completo · Chamberí</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-strong">
          <Flame className="size-3" /> Urgente
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-ink/70">
        <Check className="size-4 text-fresh-strong" />
        Avisado el dueño al instante
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-ink/70">
        <CalendarCheck className="size-4 text-fresh-strong" />
        Visita: enlace enviado al cliente
      </div>
    </div>
  );
}
