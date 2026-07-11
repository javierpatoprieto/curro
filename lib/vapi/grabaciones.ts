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

/**
 * Devuelve una URL firmada de corta duración para la grabación (audio mono) de
 * una llamada de Vapi, o `null` si no se puede obtener.
 *
 * Por qué: Vapi deja de servir las URLs públicas de grabación (`lead.audio_url`)
 * el 15 jul. El acceso pasa a hacerse por su endpoint autenticado
 * `GET /call/{id}/mono-recording`, que responde un **302** con la URL firmada en
 * la cabecera `Location`. Usamos `redirect: "manual"` para capturar ese 302 sin
 * que fetch lo siga (así leemos el `Location`) y devolvemos esa URL firmada, que
 * el navegador puede descargar directamente. La API key es server-side y nunca
 * llega al cliente (esta función solo corre en el servidor).
 *
 * Gated igual que `borrarGrabacionVapi`: en modo mock (por defecto) o sin API
 * key NO toca la red y devuelve una URL simulada. Ante cualquier respuesta que
 * no sea un 3xx con `Location` (o un no-2xx/3xx), registra y devuelve `null`.
 *
 * TODO(humano): probarlo EN VIVO con un `call_id` real antes del 15 jul —
 * confirmar que Vapi responde 302 con la URL firmada en `Location`, tal y como
 * anuncia su email de deprecación.
 */
export async function urlFirmadaGrabacion(
  callId: string | null | undefined,
): Promise<string | null> {
  const id = callId?.trim();
  if (!id) return null;

  if (!vapiActivo()) {
    console.info(`[vapi:mock] urlFirmadaGrabacion(${id}) (no-op)`);
    return `https://mock.vapi.local/recording/${encodeURIComponent(id)}.wav`;
  }

  try {
    const res = await fetch(
      `${VAPI_API}/call/${encodeURIComponent(id)}/mono-recording`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${env.VAPI_API_KEY}` },
        // Capturamos el 302 nosotros para leer su `Location` (la URL firmada).
        redirect: "manual",
      },
    );

    // Camino esperado: 3xx con la URL firmada en `Location`.
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      return location;
    }

    // Algunos entornos podrían devolver la URL en el cuerpo (200 con JSON).
    // No lo asumimos como contrato: registramos y devolvemos null si no hubo 302.
    console.error(
      `[vapi] urlFirmadaGrabacion(${id}): respuesta inesperada ${res.status} (sin Location)`,
    );
    return null;
  } catch (e) {
    console.error(`[vapi] urlFirmadaGrabacion(${id}): fallo de red`, e);
    return null;
  }
}
