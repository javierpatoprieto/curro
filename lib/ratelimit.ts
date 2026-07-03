import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * Rate limiting para los webhooks públicos, con dos modos:
 *
 * 1) DURABLE (recomendado en producción): si UPSTASH_REDIS_REST_URL y
 *    UPSTASH_REDIS_REST_TOKEN están definidos, el contador vive en Upstash (Redis
 *    por REST), así que el límite es GLOBAL entre todas las instancias serverless.
 * 2) EN MEMORIA (por defecto en dev/tests o si no hay Upstash): un contador por
 *    instancia. No es un límite global exacto, pero corta ráfagas contra una misma
 *    instancia. Es también el fallback si Upstash falla (fail-open: preferimos no
 *    tirar tráfico legítimo si Redis tiene un hipo).
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
 * Decisión pura de rate limit: dado un recuento en la ventana, ¿bloquear? Devuelve
 * una respuesta 429 con `retry-after` o null si se permite. Compartida por ambos
 * modos para que la política sea idéntica.
 */
export function evaluar(
  count: number,
  limite: number,
  ttlMs: number,
): NextResponse | null {
  if (count <= limite) return null;
  const retryAfter = Math.max(1, Math.ceil(ttlMs / 1000));
  return NextResponse.json(
    { error: "demasiadas peticiones" },
    { status: 429, headers: { "retry-after": String(retryAfter) } },
  );
}

/** ¿Hay Upstash configurado para el modo durable? */
function upstashListo(): boolean {
  return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Contador en Redis (Upstash) por REST. Un pipeline atómico:
 *  - INCR clave        → recuento en la ventana actual
 *  - PEXPIRE clave NX  → fija el TTL solo la primera vez (ventana fija)
 *  - PTTL clave        → TTL restante (para el retry-after)
 * Devuelve { count, ttlMs } o null si la llamada falla (el caller hace fallback).
 */
async function contarEnUpstash(
  clave: string,
  ventanaMs: number,
): Promise<{ count: number; ttlMs: number } | null> {
  try {
    const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", clave],
        ["PEXPIRE", clave, ventanaMs, "NX"],
        ["PTTL", clave],
      ]),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Array<{ result?: unknown; error?: string }>;
    const count = Number(json?.[0]?.result);
    const ttl = Number(json?.[2]?.result);
    if (!Number.isFinite(count)) return null;
    // PTTL devuelve -1 (sin expiración) o -2 (no existe) en casos raros: usa la
    // ventana completa como retry-after de reserva.
    const ttlMs = Number.isFinite(ttl) && ttl > 0 ? ttl : ventanaMs;
    return { count, ttlMs };
  } catch {
    return null;
  }
}

/** Contador en memoria por instancia (dev/tests y fallback). */
function contarEnMemoria(
  clave: string,
  ventanaMs: number,
): { count: number; ttlMs: number } {
  const ahora = Date.now();
  const actual = contadores.get(clave);
  if (!actual || actual.reset <= ahora) {
    contadores.set(clave, { count: 1, reset: ahora + ventanaMs });
    barrerCaducados(ahora);
    return { count: 1, ttlMs: ventanaMs };
  }
  actual.count += 1;
  return { count: actual.count, ttlMs: Math.max(0, actual.reset - ahora) };
}

/**
 * Devuelve una respuesta 429 si se supera el límite, o null si se permite.
 * Uso: `const bloqueo = await rateLimit(request, "vapi"); if (bloqueo) return bloqueo;`
 */
export async function rateLimit(
  request: NextRequest,
  bucket: string,
  { limite = 120, ventanaMs = 10_000 }: RateLimitOpts = {},
): Promise<NextResponse | null> {
  const clave = `rl:${bucket}:${ipDe(request)}`;

  if (upstashListo()) {
    const durable = await contarEnUpstash(clave, ventanaMs);
    if (durable) return evaluar(durable.count, limite, durable.ttlMs);
    // Fallback fail-open a memoria si Upstash no responde.
  }

  const memoria = contarEnMemoria(clave, ventanaMs);
  return evaluar(memoria.count, limite, memoria.ttlMs);
}

/** Limpieza perezosa para que el mapa no crezca sin fin. */
function barrerCaducados(ahora: number): void {
  if (contadores.size < 1000) return;
  for (const [clave, v] of contadores) {
    if (v.reset <= ahora) contadores.delete(clave);
  }
}
