import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { ejecutarRetencion } from "@/lib/rgpd/retencion-job";

export const runtime = "nodejs";

const supabaseListo = () =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * ¿Autorizado el cron? Vercel Cron envía `Authorization: Bearer <CRON_SECRET>`.
 * Función pura y testeable.
 *  - Si hay CRON_SECRET: se exige que el header coincida.
 *  - Si NO hay CRON_SECRET: solo se permite fuera de producción (dev/manual);
 *    en producción se rechaza (fail-closed) para no dejar el endpoint abierto.
 */
export function cronAutorizado(
  authHeader: string | null,
  opts: { secret?: string; isProd: boolean },
): boolean {
  if (opts.secret) return authHeader === `Bearer ${opts.secret}`;
  return !opts.isProd;
}

/**
 * Job de retención RGPD. Protegido con CRON_SECRET (Vercel Cron).
 * Anonimiza/borra transcripción+PII de leads vencidos, purga raw_payload
 * residual y borra grabaciones de Vapi vencidas, según lib/rgpd/retencion.ts.
 *
 * TODO(humano): activar el cron en Vercel (ver vercel.json) y definir CRON_SECRET
 * en el entorno de producción.
 */
export async function GET(request: NextRequest) {
  if (
    !cronAutorizado(request.headers.get("authorization"), {
      secret: env.CRON_SECRET,
      isProd: env.isProd,
    })
  ) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  if (!supabaseListo()) {
    return NextResponse.json({ ok: true, skipped: "sin-supabase" });
  }

  try {
    const admin = createAdminClient();
    const resultado = await ejecutarRetencion(admin);
    return NextResponse.json({ ok: true, ...resultado });
  } catch (e) {
    console.error("[rgpd:cron] error ejecutando la retención:", e);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }
}
