/**
 * Importar un número de Twilio en Vapi para que ATIENDA las llamadas entrantes
 * (Fase 2, telefonía). Es el patrón recomendado por Vapi para "Bring Your Own"
 * número de Twilio: en vez de un webhook TwiML propio, se registra el número +
 * credenciales de Twilio en Vapi y Vapi configura el webhook de voz del número.
 *
 * ENRUTADO POR HORARIO: en vez de fijar un `assistantId` en el número (que haría
 * que Vapi atendiera SIEMPRE con Curro), apuntamos el `server` del número a
 * nuestro endpoint `/api/vapi/inbound`. Al no tener assistantId, Vapi manda un
 * `assistant-request` a ese server al entrar una llamada y NOSOTROS decidimos por
 * llamada: transferir al móvil del dueño (dentro de su horario) o atender con
 * Curro (fuera). Mecanismo verificado en docs.vapi.ai (server messages). Ver
 * lib/horario.ts y app/api/vapi/inbound/route.ts.
 *
 * GATE: igual que el resto de adaptadores, corre en MOCK por defecto. Solo llama
 * a la API real de Vapi si `MOCK_PROVIDERS=false`, hay `VAPI_API_KEY` y están las
 * credenciales de Twilio (cuenta). El número ES real, además, exige el bundle
 * regulatorio (ver lib/twilio/numeros.ts) — por eso todo esto sigue mockeado
 * hasta que exista.
 *
 * ⚠️ SIN VERIFICAR EN VIVO: no se ha probado contra un número +34 real todavía
 * (no hay bundle). Confirmar con una llamada real antes de fiarse (en particular,
 * que Vapi emite el assistant-request contra el `server` del número).
 */

import { env } from "@/lib/env";

const VAPI_API = "https://api.vapi.ai";

const appUrl = () =>
  env.APP_URL || env.NEXT_PUBLIC_APP_URL || "https://curro-kappa.vercel.app";

/** `server` del número: apunta el enrutado de entrantes a nuestro endpoint. */
export function serverInbound() {
  const url = `${appUrl()}/api/vapi/inbound`;
  return env.VAPI_WEBHOOK_SECRET
    ? { url, headers: { "x-vapi-secret": env.VAPI_WEBHOOK_SECRET } }
    : { url };
}

function vapiActivo(): boolean {
  return !env.mockProviders && Boolean(env.VAPI_API_KEY);
}

/** ¿Podemos importar de verdad? Necesitamos Vapi + credenciales de Twilio. */
export function importarNumerosActivo(): boolean {
  return (
    vapiActivo() &&
    Boolean(env.TWILIO_ACCOUNT_SID) &&
    Boolean(env.TWILIO_AUTH_TOKEN)
  );
}

export interface NumeroVapi {
  /** id del phone-number en Vapi (para desasignarlo al borrar el cliente). */
  id: string;
}

/**
 * Cuerpo para POST /phone-number (provider Twilio). Puro y testeable. NO fija
 * `assistantId`: en su lugar pone el `server` apuntando a /api/vapi/inbound, de
 * modo que cada entrante dispara un `assistant-request` y decidimos el enrutado
 * por horario (transferir al dueño o atender con Curro). Ver serverInbound().
 */
export function buildImportBody(p: { numero: string; name?: string }) {
  return {
    provider: "twilio",
    number: p.numero,
    twilioAccountSid: env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: env.TWILIO_AUTH_TOKEN,
    server: serverInbound(),
    ...(p.name ? { name: p.name } : {}),
  };
}

/**
 * Registra el número de Twilio en Vapi con el `server` de enrutado por horario
 * (/api/vapi/inbound). Devuelve el id del phone-number de Vapi. En mock devuelve
 * un id simulado. POST https://api.vapi.ai/phone-number
 */
export async function importarNumeroEnVapi(p: {
  numero: string;
  name?: string;
}): Promise<NumeroVapi> {
  if (!importarNumerosActivo()) {
    return { id: `vapi_pn_mock_${Date.now()}` };
  }

  const res = await fetch(`${VAPI_API}/phone-number`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.VAPI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(buildImportBody(p)),
  });
  const json = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
  };
  if (!res.ok || !json.id) {
    throw new Error(
      `Vapi importar número ${res.status}: ${json.message ?? "error desconocido"}`,
    );
  }
  return { id: json.id };
}

/**
 * Desasigna un número de Vapi (al borrar un cliente) para no dejar coste/rutas
 * huérfanas. No-op en mock; ignora 404 (ya no existe).
 * DELETE https://api.vapi.ai/phone-number/{id}
 */
export async function eliminarNumeroVapi(id: string): Promise<void> {
  if (!vapiActivo() || !id || id.startsWith("vapi_pn_mock_")) return;

  const res = await fetch(`${VAPI_API}/phone-number/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${env.VAPI_API_KEY}` },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Vapi borrar número ${res.status}: ${await res.text()}`);
  }
}
