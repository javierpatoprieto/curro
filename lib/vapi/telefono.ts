/**
 * Importar un número de Twilio en Vapi para que ATIENDA las llamadas entrantes
 * con el assistant (Fase 2, telefonía). Es el patrón recomendado por Vapi para
 * "Bring Your Own" número de Twilio: en vez de un webhook TwiML propio, se
 * registra el número + credenciales de Twilio en Vapi y Vapi configura el
 * webhook de voz del número y responde las entrantes con el assistant indicado.
 *
 * GATE: igual que el resto de adaptadores, corre en MOCK por defecto. Solo llama
 * a la API real de Vapi si `MOCK_PROVIDERS=false`, hay `VAPI_API_KEY` y están las
 * credenciales de Twilio (cuenta). El número ES real, además, exige el bundle
 * regulatorio (ver lib/twilio/numeros.ts) — por eso todo esto sigue mockeado
 * hasta que exista.
 *
 * ⚠️ SIN VERIFICAR EN VIVO: no se ha probado contra un número +34 real todavía
 * (no hay bundle). Confirmar con una llamada real antes de fiarse.
 */

import { env } from "@/lib/env";

const VAPI_API = "https://api.vapi.ai";

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
 * Cuerpo para POST /phone-number (provider Twilio). Puro y testeable. `assistantId`
 * hace que Vapi atienda las ENTRANTES a ese número con ese assistant.
 */
export function buildImportBody(p: {
  numero: string;
  assistantId: string;
  name?: string;
}) {
  return {
    provider: "twilio",
    number: p.numero,
    twilioAccountSid: env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: env.TWILIO_AUTH_TOKEN,
    assistantId: p.assistantId,
    ...(p.name ? { name: p.name } : {}),
  };
}

/**
 * Registra el número de Twilio en Vapi y lo ata al assistant para inbound.
 * Devuelve el id del phone-number de Vapi. En mock devuelve un id simulado.
 * POST https://api.vapi.ai/phone-number
 */
export async function importarNumeroEnVapi(p: {
  numero: string;
  assistantId: string;
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
