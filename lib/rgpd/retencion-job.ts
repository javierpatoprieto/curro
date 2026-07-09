import type { createAdminClient } from "@/lib/supabase/admin";
import { fechaCorte } from "@/lib/rgpd/retencion";
import { borrarGrabacionVapi } from "@/lib/vapi/grabaciones";

type Admin = ReturnType<typeof createAdminClient>;

/**
 * Job de retención (RGPD). Ejecuta la política de `lib/rgpd/retencion.ts`:
 *  - audio (30d): borra la grabación en Vapi y limpia `audio_url`.
 *  - transcripción + lead (12m): anonimiza el lead (borra PII, conserva la fila
 *    con métricas mínimas para estadística agregada).
 *  - raw_payload residual (30d): pone a null el `raw_payload` de call_events.
 *
 * La SELECCIÓN de vencidos (qué fecha de corte aplica a cada categoría) se
 * calcula en `cortesRetencion(ahora)`, función pura y testeable. El runner
 * (`ejecutarRetencion`) hace las escrituras con el admin client (service_role).
 */

export interface CortesRetencion {
  /** Leads con audio anterior a esta fecha → borrar grabación + limpiar url. */
  audioCorteISO: string;
  /** Leads anteriores a esta fecha → anonimizar (borrar PII). */
  transcripcionCorteISO: string;
  /** call_events anteriores a esta fecha → purgar raw_payload. */
  rawPayloadCorteISO: string;
}

/** Fechas de corte por categoría en ISO. Pura: `ahora` inyectable para testear. */
export function cortesRetencion(ahora: Date = new Date()): CortesRetencion {
  return {
    audioCorteISO: fechaCorte("audio", ahora).toISOString(),
    transcripcionCorteISO: fechaCorte("transcripcion", ahora).toISOString(),
    rawPayloadCorteISO: fechaCorte("raw_payload", ahora).toISOString(),
  };
}

export interface ResultadoRetencion {
  audioBorrados: number;
  leadsAnonimizados: number;
  rawPayloadPurgados: number;
}

/**
 * Ejecuta la retención. Devuelve un recuento por categoría. No lanza por fallos
 * de borrado remoto (Vapi): los registra y continúa, para no dejar el job a medias.
 */
export async function ejecutarRetencion(
  admin: Admin,
  ahora: Date = new Date(),
): Promise<ResultadoRetencion> {
  const cortes = cortesRetencion(ahora);

  const audioBorrados = await purgarAudioVencido(admin, cortes.audioCorteISO);
  const leadsAnonimizados = await anonimizarLeadsVencidos(
    admin,
    cortes.transcripcionCorteISO,
  );
  const rawPayloadPurgados = await purgarRawPayloadVencido(
    admin,
    cortes.rawPayloadCorteISO,
  );

  return { audioBorrados, leadsAnonimizados, rawPayloadPurgados };
}

/**
 * Audio vencido (>30d): por cada lead con audio_url y con call_events con
 * vapi_call_id, borra la grabación en Vapi y limpia la audio_url del lead.
 */
async function purgarAudioVencido(
  admin: Admin,
  corteISO: string,
): Promise<number> {
  const { data: leads } = await admin
    .from("leads")
    .select("id")
    .not("audio_url", "is", null)
    .lt("created_at", corteISO);

  const vencidos = (leads ?? []) as { id: string }[];
  if (vencidos.length === 0) return 0;

  const ids = vencidos.map((l) => l.id);

  // Grabaciones asociadas (por call_events del lead) → borrar en Vapi.
  const { data: eventos } = await admin
    .from("call_events")
    .select("vapi_call_id")
    .in("lead_id", ids);

  const callIds = (eventos ?? [])
    .map((e: { vapi_call_id: string | null }) => e.vapi_call_id)
    .filter((v: string | null): v is string => Boolean(v));

  for (const callId of callIds) {
    try {
      await borrarGrabacionVapi(callId);
    } catch (e) {
      console.error("[rgpd:cron] fallo al borrar grabación en Vapi:", callId, e);
    }
  }

  // Limpiar la referencia local al audio.
  await admin.from("leads").update({ audio_url: null }).in("id", ids);
  return ids.length;
}

/**
 * Leads vencidos (>12m): anonimiza borrando la PII (nombre, teléfono,
 * transcripción, zona, audio). Conserva la fila (métricas agregadas) sin datos
 * personales. Selecciona los creados antes del corte que aún tengan PII.
 */
async function anonimizarLeadsVencidos(
  admin: Admin,
  corteISO: string,
): Promise<number> {
  const { data: leads } = await admin
    .from("leads")
    .select("id")
    .lt("created_at", corteISO)
    .or(
      "cliente_nombre.not.is.null,cliente_telefono.not.is.null,transcripcion.not.is.null,audio_url.not.is.null",
    );

  const vencidos = (leads ?? []) as { id: string }[];
  if (vencidos.length === 0) return 0;
  const ids = vencidos.map((l) => l.id);

  await admin
    .from("leads")
    .update({
      cliente_nombre: null,
      cliente_telefono: null,
      transcripcion: null,
      audio_url: null,
      zona: null,
    })
    .in("id", ids);

  return ids.length;
}

/**
 * raw_payload residual (>30d): pone a null el raw_payload de los call_events
 * vencidos (defensa en profundidad: aunque ya no guardamos PII cruda, purgamos
 * cualquier metadato residual antiguo).
 */
async function purgarRawPayloadVencido(
  admin: Admin,
  corteISO: string,
): Promise<number> {
  const { data: eventos } = await admin
    .from("call_events")
    .select("id")
    .not("raw_payload", "is", null)
    .lt("created_at", corteISO);

  const vencidos = (eventos ?? []) as { id: string }[];
  if (vencidos.length === 0) return 0;
  const ids = vencidos.map((e) => e.id);

  await admin.from("call_events").update({ raw_payload: null }).in("id", ids);
  return ids.length;
}
