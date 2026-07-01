import { NextResponse, type NextRequest } from "next/server";

/**
 * Rate limiting best-effort para los webhooks públicos.
 *
 * IMPORTANTE: es un contador EN MEMORIA por instancia. En serverless (Vercel)
 * cada instancia caliente tiene su propio mapa, así que no es un límite global
 * exacto: sirve para cortar ráfagas de peticiones inválidas contra una misma
 * instancia (p. ej. un flood de firmas falsas), no como cuota estricta.
 * Para un límite duradero y compartido, mover a Upstash/Redis.
 *
 * Los umbrales son ALTOS a propósito: el tráfico legítimo de Vapi/Stripe llega
 * desde sus propias IPs (compartidas entre tenants), y no queremos tirar leads
 * reales. Solo frenamos avalanchas claramente anómalas.
 */

interface Ventana {
  count: number;
  reset: number; // epoch ms en que se reinicia la ventana
}

const contadores = new Map<string, Ventana>();

export interface RateLimitOpts {
  /** Peticiones permitidas por ventana. */
  limite?: number;
  /** Tamaño de la ventana en milisegundos. */
  ventanaMs?: number;
}

/** IP de origen a partir de las cabeceras del proxy (Vercel). */
function ipDe(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "desconocida";
}

/**
 * Devuelve una respuesta 429 si se supera el límite, o null si se permite.
 * Uso: `const bloqueo = rateLimit(request, "vapi"); if (bloqueo) return bloqueo;`
 */
export function rateLimit(
  request: NextRequest,
  bucket: string,
  { limite = 120, ventanaMs = 10_000 }: RateLimitOpts = {},
): NextResponse | null {
  const ahora = Date.now();
  const clave = `${bucket}:${ipDe(request)}`;
  const actual = contadores.get(clave);

  if (!actual || actual.reset <= ahora) {
    contadores.set(clave, { count: 1, reset: ahora + ventanaMs });
    barrerCaducados(ahora);
    return null;
  }

  actual.count += 1;
  if (actual.count > limite) {
    const retryAfter = Math.ceil((actual.reset - ahora) / 1000);
    return NextResponse.json(
      { error: "demasiadas peticiones" },
      { status: 429, headers: { "retry-after": String(retryAfter) } },
    );
  }
  return null;
}

/** Limpieza perezosa para que el mapa no crezca sin fin. */
function barrerCaducados(ahora: number): void {
  if (contadores.size < 1000) return;
  for (const [clave, v] of contadores) {
    if (v.reset <= ahora) contadores.delete(clave);
  }
}
