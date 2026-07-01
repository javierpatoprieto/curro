import { env } from "@/lib/env";

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

class MockWhatsAppClient implements WhatsAppClient {
  readonly modo = "mock" as const;
  async send(msg: WhatsAppMessage): Promise<WhatsAppResult> {
    const preview = msg.kind === "text" ? msg.body : msg.texto;
    console.info(`[whatsapp:mock] → ${msg.to}\n${preview}`);
    return { id: `mock_wa_${Date.now()}`, request: buildBody(msg) };
  }
}

export function getWhatsAppClient(): WhatsAppClient {
  if (
    !env.mockProviders &&
    env.WHATSAPP_TOKEN &&
    env.WHATSAPP_PHONE_NUMBER_ID
  ) {
    return new RealWhatsAppClient(
      env.WHATSAPP_TOKEN,
      env.WHATSAPP_PHONE_NUMBER_ID,
    );
  }
  return new MockWhatsAppClient();
}
