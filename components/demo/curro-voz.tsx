"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, PhoneOff, Loader2, TriangleAlert } from "lucide-react";

/**
 * Botón de demo: llamada de voz REAL a Curro desde el navegador (WebRTC vía
 * Vapi), sin necesidad de un número de teléfono. La clave pública y el ID del
 * assistant son valores de cliente (van al navegador a propósito).
 *
 * El SDK de Vapi se carga desde CDN en tiempo de ejecución para no añadir una
 * dependencia npm (el build con node_modules symlinkeado no la toleraría).
 */

// Valores PUBLISHABLE de cliente (viajan al navegador de cualquier visitante):
// la clave pública/share de Vapi y el assistant de DEMO (una copia NO ligada a
// ningún negocio, así que las llamadas de demo no generan leads ni avisos al
// dueño). Se pueden sobreescribir por env; el fallback deja la demo lista.
const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ||
  "af83d160-0179-4935-bc99-cd915c743062";
const ASSISTANT_ID =
  process.env.NEXT_PUBLIC_VAPI_DEMO_ASSISTANT_ID ||
  "a78c38fc-bd19-4c22-a37d-ed0a72fd732b";

type Estado = "inactivo" | "cargando" | "en-llamada" | "error";
type Linea = { role: "user" | "assistant"; text: string };

export function CurroVoz() {
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const vapiRef = useRef<unknown>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const configurada = Boolean(PUBLIC_KEY && ASSISTANT_ID);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lineas]);

  // Al desmontar, corta cualquier llamada activa.
  useEffect(() => {
    return () => {
      try {
        (vapiRef.current as { stop?: () => void } | null)?.stop?.();
      } catch {
        /* noop */
      }
    };
  }, []);

  const cargarVapi = useCallback(async () => {
    if (vapiRef.current) return vapiRef.current;
    // Import dinámico oculto al bundler (URL en variable) → lo resuelve el navegador.
    const importar = new Function("u", "return import(u)") as (u: string) => Promise<{ default: new (k: string) => unknown }>;
    const mod = await importar("https://esm.sh/@vapi-ai/web");
    const Vapi = mod.default;
    const vapi = new Vapi(PUBLIC_KEY as string) as {
      on: (ev: string, cb: (arg: unknown) => void) => void;
      start: (id: string) => Promise<unknown>;
      stop: () => void;
    };

    vapi.on("call-start", () => setEstado("en-llamada"));
    vapi.on("call-end", () => setEstado("inactivo"));
    vapi.on("error", (e: unknown) => {
      console.error("[curro-voz] vapi error", e);
      setError("Se cortó la llamada. Inténtalo de nuevo.");
      setEstado("error");
    });
    vapi.on("message", (m: unknown) => {
      const msg = m as { type?: string; role?: string; transcriptType?: string; transcript?: string };
      if (msg.type === "transcript" && msg.transcriptType === "final" && msg.transcript) {
        const role = msg.role === "assistant" ? "assistant" : "user";
        setLineas((prev) => [...prev, { role, text: msg.transcript as string }]);
      }
    });

    vapiRef.current = vapi;
    return vapi;
  }, []);

  const empezar = async () => {
    if (!configurada) {
      setError("La demo aún no está configurada.");
      setEstado("error");
      return;
    }
    setError(null);
    setLineas([]);
    setEstado("cargando");
    try {
      const vapi = (await cargarVapi()) as { start: (id: string) => Promise<unknown> };
      await vapi.start(ASSISTANT_ID as string);
      // El estado pasa a "en-llamada" con el evento call-start.
    } catch (e) {
      console.error("[curro-voz] no se pudo iniciar", e);
      setError("No se pudo iniciar la llamada. Revisa el permiso del micrófono.");
      setEstado("error");
    }
  };

  const colgar = () => {
    try {
      (vapiRef.current as { stop?: () => void } | null)?.stop?.();
    } catch {
      /* noop */
    }
    setEstado("inactivo");
  };

  const enLlamada = estado === "en-llamada";
  const cargando = estado === "cargando";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
      {/* Botón principal */}
      <button
        type="button"
        onClick={enLlamada ? colgar : empezar}
        disabled={cargando || !configurada}
        aria-live="polite"
        className={`group relative flex size-40 flex-col items-center justify-center gap-2 rounded-full text-center font-semibold transition-all disabled:opacity-60 ${
          enLlamada
            ? "bg-bosque text-lima"
            : "bg-lima text-bosque hover:bg-lima-dark hover:-translate-y-0.5"
        }`}
      >
        {enLlamada && (
          <span className="absolute inset-0 animate-ping rounded-full bg-bosque/20" aria-hidden />
        )}
        {cargando ? (
          <Loader2 className="size-9 animate-spin" strokeWidth={2.25} />
        ) : enLlamada ? (
          <PhoneOff className="size-9" strokeWidth={2.25} />
        ) : (
          <Mic className="size-9" strokeWidth={2.25} />
        )}
        <span className="px-4 text-sm leading-tight">
          {cargando ? "Conectando…" : enLlamada ? "Colgar" : "Habla con Curro"}
        </span>
      </button>

      <p className="min-h-5 text-center text-sm text-bosque-soft">
        {enLlamada
          ? "En llamada · háblale como si fueras un cliente"
          : "Pulsa, permite el micrófono y cuéntale tu avería"}
      </p>

      {error && (
        <p className="flex items-center gap-2 rounded-lg border border-bosque/15 bg-white px-3 py-2 text-sm text-bosque">
          <TriangleAlert className="size-4 shrink-0 text-lima-ink" />
          {error}
        </p>
      )}

      {/* Transcripción en vivo */}
      {lineas.length > 0 && (
        <div
          ref={scrollRef}
          className="max-h-64 w-full space-y-2 overflow-y-auto rounded-2xl border border-linea3 bg-white p-4"
        >
          {lineas.map((l, i) => (
            <div key={i} className={l.role === "assistant" ? "text-left" : "text-right"}>
              <span
                className={`inline-block max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${
                  l.role === "assistant"
                    ? "bg-nieve text-bosque"
                    : "bg-bosque text-nieve"
                }`}
              >
                {l.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {!configurada && (
        <p className="text-center text-xs text-bosque-soft/70">
          Demo pendiente de configurar (falta la clave pública de Vapi).
        </p>
      )}
    </div>
  );
}
