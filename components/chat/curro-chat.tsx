"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Send, Sparkles } from "lucide-react";

type Msg = { from: "bot" | "user"; text: string };

const FAQS: { q: string; keywords: string[]; a: string }[] = [
  {
    q: "¿Para qué gremios sirve?",
    keywords: ["gremio", "oficio", "fontan", "electri", "pintor", "reforma", "sirve", "quién", "quien"],
    a: "Para cualquier autónomo o pequeño gremio: fontaneros, electricistas, reformas, pintores, cerrajeros, climatización, carpinteros… Si recibes llamadas de clientes, Curro te sirve.",
  },
  {
    q: "¿Suena natural o parece un robot?",
    keywords: ["natural", "robot", "voz", "suena", "humano"],
    a: "Suena natural. Conversa en español con un guion adaptado a tu negocio; nada de menús ni «pulse 1». Entiende lo que necesita el cliente y le responde.",
  },
  {
    q: "¿Cuánto cuesta?",
    keywords: ["precio", "cuesta", "cuánto", "cuanto", "plan", "euro", "€", "pago", "gratis"],
    a: "Desde 99€/mes, con 7 días gratis y sin permanencia. Tienes los planes completos en la sección de Precios.",
  },
  {
    q: "¿Tengo que cambiar mi número?",
    keywords: ["número", "numero", "teléfono", "telefono", "cambiar", "desvío", "desvio"],
    a: "No. Puedes desviar a Curro solo las llamadas que no cojas, o usar un número nuevo para tus anuncios. Tú eliges cómo encajarlo.",
  },
  {
    q: "¿Cuánto tardo en ponerlo en marcha?",
    keywords: ["tardo", "poner", "marcha", "empezar", "alta", "rápido", "rapido", "instalar"],
    a: "Unos 10 minutos. Nos dices tu tipo de negocio y tus datos, creamos tu asistente con su guion y listo.",
  },
  {
    q: "¿Se avisa de que la llamada se graba?",
    keywords: ["graba", "legal", "aviso", "grabación", "grabacion", "rgpd"],
    a: "Sí. Al inicio de cada llamada, Curro se presenta como asistente virtual e informa de que la llamada se graba, para cumplir con la normativa.",
  },
];

const SALUDO =
  "¡Hola! Soy Curro 👋 Pregúntame lo que quieras sobre el servicio, o toca una de estas:";

function responder(texto: string): string {
  const t = texto.toLowerCase();
  const hit = FAQS.find((f) => f.keywords.some((k) => t.includes(k)));
  if (hit) return hit.a;
  return "Buena pregunta. Eso lo vemos mejor en 2 minutos: puedes probarlo gratis 7 días (sin tarjeta hasta el final) o escribirnos. ¿Te registro?";
}

function Typing() {
  return (
    <div className="flex w-max items-center gap-1 rounded-2xl bg-mist px-3 py-2.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-ink-soft/50"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function CurroChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: SALUDO }]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e6, behavior: "smooth" });
  }, [msgs, typing, open]);

  function enviar(texto: string) {
    const t = texto.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTyping(true);
    const respuesta = responder(t);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: respuesta }]);
    }, 700);
  }

  return (
    <>
      {/* Botón flotante */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-ink py-2 pl-2 pr-4 text-sm font-semibold text-white shadow-xl shadow-ink/20 transition-transform hover:-translate-y-0.5"
          aria-label="Abrir chat con Curro"
        >
          <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-verde-soft ring-2 ring-white/20">
            <Image
              src="/currito/cabeza.webp"
              alt=""
              width={32}
              height={32}
              className="size-7 object-contain"
            />
          </span>
          Habla con Curro
          <span className="live-dot ml-0.5" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[60] flex h-[520px] max-h-[calc(100vh-2.5rem)] w-[370px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl shadow-ink/20">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-ink/6 bg-ink px-4 py-3 text-white">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-verde-soft">
              <Image
                src="/currito/cabeza.webp"
                alt="Currito"
                width={36}
                height={36}
                className="size-8 object-contain"
              />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Curro</p>
              <p className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="live-dot" /> en línea
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto text-white/70 hover:text-white"
              aria-label="Cerrar chat"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-mist/40 p-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`animate-rise-in max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.from === "bot"
                    ? "bg-white text-ink shadow-sm"
                    : "ml-auto bg-verde text-ink"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && <Typing />}

            {/* Respuestas rápidas (solo al principio) */}
            {msgs.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {FAQS.slice(0, 4).map((f) => (
                  <button
                    key={f.q}
                    type="button"
                    onClick={() => enviar(f.q)}
                    className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-verde hover:text-verde-dark"
                  >
                    {f.q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(input);
            }}
            className="flex items-center gap-2 border-t border-ink/6 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="min-w-0 flex-1 rounded-full bg-mist px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:ring-2 focus:ring-verde/40"
            />
            <button
              type="submit"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-verde text-ink transition-colors hover:bg-verde-dark"
              aria-label="Enviar"
            >
              <Send className="size-4" />
            </button>
          </form>
          <p className="flex items-center justify-center gap-1 pb-2 text-[10px] text-ink-soft/50">
            <Sparkles className="size-3" /> Respuestas automáticas de Curro
          </p>
        </div>
      )}
    </>
  );
}
