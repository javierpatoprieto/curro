import { env } from "@/lib/env";

/**
 * Borrado de la grabación (audio) de una llamada en Vapi.
 *
 * RGPD: cumplido el plazo de retención del audio (30 días por defecto) o ante
 * una solicitud de supresión (DSAR), debemos eliminar la grabación en Vapi, no
 * solo la `audio_url` que guardamos en nuestra base.
 *
 * Espejo del patrón de `lib/messaging/whatsapp.ts` y `lib/vapi/assistant.ts`:
 * en modo mock (por defecto) o sin API key, es un no-op que solo registra la
 * intención; en real llama a la API de Vapi. Gated con
 * `!env.mockProviders && VAPI_API_KEY`.
 *
 * Nota (endpoint): Vapi expone `DELETE https://api.vapi.ai/call/{id}`, que borra
 * la llamada y sus artefactos (incluida la grabación). Si en el futuro Vapi
 * ofrece un endpoint específico solo-audio que conserve las métricas, cámbialo
 * aquí. TODO(humano): confirmar en la cuenta real que este DELETE elimina el
 * audio del almacenamiento de Vapi (y no solo la referencia).
 */

export interface BorradoGrabacion {
  readonly modo: "real" | "mock";
  /** true si Vapi confirmó el borrado (o el call ya no existía → 404). */
  readonly borrada: boolean;
  /** Código HTTP en modo real (null en mock). */
  readonly status: number | null;
}

const vapiActivo = () => !env.mockProviders && Boolean(env.VAPI_API_KEY);

const VAPI_API = "https://api.vapi.ai";

/**
 * Borra la grabación de una llamada de Vapi por su callId.
 * No lanza ante 404 (la llamada ya no existe → objetivo cumplido).
 * En mock/sin key devuelve `{ modo: "mock", borrada: true }` sin tocar la red.
 */
export async function borrarGrabacionVapi(
  callId: string | null | undefined,
): Promise<BorradoGrabacion> {
  const id = callId?.trim();
  if (!id) return { modo: "mock", borrada: false, status: null };

  if (!vapiActivo()) {
    console.info(`[vapi:mock] borrarGrabacionVapi(${id}) (no-op)`);
    return { modo: "mock", borrada: true, status: null };
  }

  const res = await fetch(`${VAPI_API}/call/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${env.VAPI_API_KEY}` },
  });

  // 404 = la llamada/grabación ya no existe: lo tratamos como éxito.
  if (!res.ok && res.status !== 404) {
    throw new Error(`Vapi ${res.status}: ${await res.text()}`);
  }
  return { modo: "real", borrada: true, status: res.status };
}
