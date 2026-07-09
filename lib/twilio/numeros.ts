/**
 * Aprovisionamiento de números de teléfono en Twilio (Fase 2). Espeja el patrón
 * de `lib/messaging/whatsapp.ts`: cliente real (Basic auth, form-urlencoded
 * contra `https://api.twilio.com/2010-04-01`) + fallback mock, elegidos por un
 * gate de entorno.
 *
 * GATE DOBLE — comprar un número español (ES) exige, además de la cuenta Twilio,
 * un Address (AddressSid) y un Regulatory Bundle (BundleSid) aprobados. Ese
 * bundle AÚN NO EXISTE, así que por defecto TODO corre en mock; solo se pasa a
 * real cuando `MOCK_PROVIDERS=false` Y están las cuatro variables:
 * `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_ADDRESS_SID`,
 * `TWILIO_BUNDLE_SID`. Sin tocar código, igual que Vapi/WhatsApp.
 */

import { env } from "@/lib/env";

const TWILIO_API = "https://api.twilio.com/2010-04-01";

export interface ComprarOpciones {
  voiceUrl: string;
}

export interface NumeroComprado {
  /** SID del IncomingPhoneNumber (PN…) — se guarda en vapi_phone_number_id. */
  sid: string;
  /** El número en formato E.164 (+34…). */
  phoneNumber: string;
}

/**
 * Gate doble: solo se llama a la API real de Twilio si no estamos en modo mock
 * y están las cuatro credenciales (cuenta + Address + Bundle regulatorio ES).
 */
export function twilioNumerosActivo(): boolean {
  return (
    !env.mockProviders &&
    Boolean(env.TWILIO_ACCOUNT_SID) &&
    Boolean(env.TWILIO_AUTH_TOKEN) &&
    Boolean(env.TWILIO_ADDRESS_SID) &&
    Boolean(env.TWILIO_BUNDLE_SID)
  );
}

function authHeader(): string {
  const auth = Buffer.from(
    `${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`,
  ).toString("base64");
  return `Basic ${auth}`;
}

/**
 * Cuerpo (form-urlencoded) para comprar un IncomingPhoneNumber español. Puro y
 * testeable: ES exige AddressSid + BundleSid; además cableamos el VoiceUrl al
 * endpoint inbound para que la llamada entre a nuestra app.
 */
export function buildComprarParams(
  phoneNumber: string,
  opts: { voiceUrl: string; addressSid: string; bundleSid: string },
): URLSearchParams {
  return new URLSearchParams({
    PhoneNumber: phoneNumber,
    VoiceUrl: opts.voiceUrl,
    VoiceMethod: "POST",
    AddressSid: opts.addressSid,
    BundleSid: opts.bundleSid,
  });
}

/**
 * Busca un número local español disponible y devuelve el primero (E.164). En
 * mock devuelve un número simulado sin tocar la red.
 * GET /Accounts/{SID}/AvailablePhoneNumbers/ES/Local.json
 */
export async function buscarNumeroES(): Promise<string> {
  if (!twilioNumerosActivo()) {
    return "+34910000000";
  }

  const res = await fetch(
    `${TWILIO_API}/Accounts/${env.TWILIO_ACCOUNT_SID}/AvailablePhoneNumbers/ES/Local.json?PageSize=1`,
    { headers: { Authorization: authHeader() } },
  );
  const json = (await res.json().catch(() => ({}))) as {
    available_phone_numbers?: { phone_number?: string }[];
    message?: string;
  };
  if (!res.ok) {
    throw new Error(
      `Twilio números ${res.status}: ${json.message ?? "error desconocido"}`,
    );
  }
  const numero = json.available_phone_numbers?.[0]?.phone_number;
  if (!numero) throw new Error("Twilio: no hay números ES disponibles");
  return numero;
}

/**
 * Compra un número (IncomingPhoneNumber) y le cablea el VoiceUrl. Devuelve su
 * SID (PN…), que guardamos en `vapi_phone_number_id`. En mock devuelve un SID
 * simulado sin tocar la red.
 * POST /Accounts/{SID}/IncomingPhoneNumbers.json
 */
export async function comprarNumero(
  phoneNumber: string,
  opts: ComprarOpciones,
): Promise<NumeroComprado> {
  if (!twilioNumerosActivo()) {
    return { sid: `mock_pn_${Date.now()}`, phoneNumber };
  }

  const params = buildComprarParams(phoneNumber, {
    voiceUrl: opts.voiceUrl,
    addressSid: env.TWILIO_ADDRESS_SID!,
    bundleSid: env.TWILIO_BUNDLE_SID!,
  });
  const res = await fetch(
    `${TWILIO_API}/Accounts/${env.TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers.json`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );
  const json = (await res.json().catch(() => ({}))) as {
    sid?: string;
    phone_number?: string;
    message?: string;
  };
  if (!res.ok || !json.sid) {
    throw new Error(
      `Twilio comprar número ${res.status}: ${json.message ?? "error desconocido"}`,
    );
  }
  return { sid: json.sid, phoneNumber: json.phone_number ?? phoneNumber };
}

/**
 * Re-cablea el VoiceUrl de un número ya comprado (idempotente). En mock es un
 * no-op. POST /Accounts/{SID}/IncomingPhoneNumbers/{Sid}.json
 */
export async function asignarWebhookVoz(
  sid: string,
  voiceUrl: string,
): Promise<void> {
  if (!twilioNumerosActivo() || sid.startsWith("mock_pn_")) return;

  const params = new URLSearchParams({ VoiceUrl: voiceUrl, VoiceMethod: "POST" });
  const res = await fetch(
    `${TWILIO_API}/Accounts/${env.TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers/${sid}.json`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );
  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(
      `Twilio webhook voz ${res.status}: ${json.message ?? "error desconocido"}`,
    );
  }
}
