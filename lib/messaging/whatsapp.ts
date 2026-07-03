import { env } from "@/lib/env";
import { PLANTILLA_CLIENTE, PLANTILLA_DUENO } from "@/lib/messaging/templates";

export type WhatsAppMessage =
  | { kind: "template"; to: string; template: string; variables: string[]; texto: string }
  | { kind: "text"; to: string; body: string };

export interface WhatsAppResult {
  id: string | null;
  request: unknown;
}

export interface WhatsAppClient {
  readonly modo: "real" | "mock";
  send(msg: WhatsAppMessage): Promise<WhatsAppResult>;
}

const GRAPH_VERSION = "v21.0";

/** WhatsApp Cloud API espera el número solo con dígitos (sin +, espacios, etc.). */
export function normalizeTo(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

function buildBody(msg: WhatsAppMessage) {
  if (msg.kind === "text") {
    return {
      messaging_product: "whatsapp",
      to: normalizeTo(msg.to),
      type: "text",
      text: { body: msg.body },
    };
  }
  return {
    messaging_product: "whatsapp",
    to: normalizeTo(msg.to),
    type: "template",
    template: {
      name: msg.template,
      language: { code: "es" },
      components: [
        {
          type: "body",
          parameters: msg.variables.map((text) => ({ type: "text", text })),
        },
      ],
    },
  };
}

class RealWhatsAppClient implements WhatsAppClient {
  readonly modo = "real" as const;
  constructor(
    private token: string,
    private phoneNumberId: string,
  ) {}

  async send(msg: WhatsAppMessage): Promise<WhatsAppResult> {
    const body = buildBody(msg);
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${this.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    const json = (await res.json().catch(() => ({}))) as {
      messages?: { id?: string }[];
      error?: { message?: string };
    };
    if (!res.ok) {
      throw new Error(
        `WhatsApp API ${res.status}: ${json.error?.message ?? "error desconocido"}`,
      );
    }
    return { id: json.messages?.[0]?.id ?? null, request: body };
  }
}

const TWILIO_API = "https://api.twilio.com/2010-04-01";

/** Asegura el prefijo whatsapp: y el + en el número destino para Twilio. */
export function twilioTo(phone: string): string {
  return `whatsapp:+${normalizeTo(phone)}`;
}

/**
 * Cuerpo (form-urlencoded) para la API de Twilio. Si hay ContentSid de plantilla,
 * usa la plantilla aprobada con ContentVariables ({"1":.., "2":..}); si no, manda
 * el texto libre (válido en sandbox y dentro de la ventana de 24 h).
 */
export function buildTwilioParams(
  msg: WhatsAppMessage,
  from: string,
  contentSid?: string,
): URLSearchParams {
  const params = new URLSearchParams({ From: from, To: twilioTo(msg.to) });
  if (msg.kind === "template" && contentSid) {
    params.set("ContentSid", contentSid);
    const vars: Record<string, string> = {};
    msg.variables.forEach((v, i) => {
      vars[String(i + 1)] = v;
    });
    params.set("ContentVariables", JSON.stringify(vars));
  } else {
    params.set("Body", msg.kind === "text" ? msg.body : msg.texto);
  }
  return params;
}

class TwilioWhatsAppClient implements WhatsAppClient {
  readonly modo = "real" as const;
  constructor(
    private accountSid: string,
    private authToken: string,
    private from: string,
    private contentSids: Record<string, string>,
  ) {}

  async send(msg: WhatsAppMessage): Promise<WhatsAppResult> {
    const contentSid =
      msg.kind === "template" ? this.contentSids[msg.template] : undefined;
    const params = buildTwilioParams(msg, this.from, contentSid);
    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString(
      "base64",
    );
    const res = await fetch(
      `${TWILIO_API}/Accounts/${this.accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );
    const json = (await res.json().catch(() => ({}))) as {
      sid?: string;
      message?: string;
    };
    if (!res.ok) {
      throw new Error(
        `Twilio WhatsApp ${res.status}: ${json.message ?? "error desconocido"}`,
      );
    }
    return { id: json.sid ?? null, request: Object.fromEntries(params) };
  }
}

class MockWhatsAppClient implements WhatsAppClient {
  readonly modo = "mock" as const;
  async send(msg: WhatsAppMessage): Promise<WhatsAppResult> {
    const preview = msg.kind === "text" ? msg.body : msg.texto;
    console.info(`[whatsapp:mock] → ${msg.to}\n${preview}`);
    return { id: `mock_wa_${Date.now()}`, request: buildBody(msg) };
  }
}

export function getWhatsAppClient(): WhatsAppClient {
  if (env.mockProviders) return new MockWhatsAppClient();

  // Twilio tiene prioridad si está configurado (proveedor elegido).
  if (
    env.TWILIO_ACCOUNT_SID &&
    env.TWILIO_AUTH_TOKEN &&
    env.TWILIO_WHATSAPP_FROM
  ) {
    const contentSids: Record<string, string> = {};
    if (env.TWILIO_WA_CONTENT_CLIENTE)
      contentSids[PLANTILLA_CLIENTE] = env.TWILIO_WA_CONTENT_CLIENTE;
    if (env.TWILIO_WA_CONTENT_DUENO)
      contentSids[PLANTILLA_DUENO] = env.TWILIO_WA_CONTENT_DUENO;
    return new TwilioWhatsAppClient(
      env.TWILIO_ACCOUNT_SID,
      env.TWILIO_AUTH_TOKEN,
      env.TWILIO_WHATSAPP_FROM,
      contentSids,
    );
  }

  // Meta directo (WhatsApp Cloud API) como alternativa.
  if (env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID) {
    return new RealWhatsAppClient(
      env.WHATSAPP_TOKEN,
      env.WHATSAPP_PHONE_NUMBER_ID,
    );
  }

  return new MockWhatsAppClient();
}
