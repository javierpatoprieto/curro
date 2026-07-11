import { env } from "@/lib/env";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  id: string | null;
  /**
   * Metadatos NO personales del envío (para auditar en `messages.payload`).
   * RGPD (minimización): NO incluimos el destinatario (`to`) ni el asunto
   * (`subject`), que contienen PII del interesado (email del dueño, y el asunto
   * lleva el nombre del lead y el tipo de trabajo — ver `emailDueno` en
   * `templates.ts`). Solo canal, proveedor y modo. Espejo de `resumenEnvio`
   * (WhatsApp).
   */
  request: unknown;
}

export interface EmailClient {
  readonly modo: "real" | "mock";
  send(msg: EmailMessage): Promise<EmailResult>;
}

/**
 * Resumen sin PII de un envío de email: qué canal/proveedor, no a quién ni el
 * asunto. Se guarda en `messages.payload` en lugar del request crudo con `to` y
 * `subject` (que contienen PII del interesado). Espejo de `resumenEnvio` de
 * WhatsApp.
 */
export function resumenEnvioEmail(
  proveedor: "resend" | "mock",
): { canal: "email"; proveedor: string } {
  return { canal: "email", proveedor };
}

// Debe ser un dominio verificado en Resend. Configurable con EMAIL_FROM.
const remitente = () => env.EMAIL_FROM || "Curro <avisos@curro.app>";

class RealEmailClient implements EmailClient {
  readonly modo = "real" as const;
  constructor(private apiKey: string) {}

  async send(msg: EmailMessage): Promise<EmailResult> {
    const body = {
      from: remitente(),
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };
    if (!res.ok) {
      throw new Error(`Resend ${res.status}: ${json.message ?? "error"}`);
    }
    // RGPD (minimización): no persistimos ni el cuerpo (html/text) ni el
    // destinatario/asunto (que llevan PII del interesado), solo metadatos.
    return { id: json.id ?? null, request: resumenEnvioEmail("resend") };
  }
}

class MockEmailClient implements EmailClient {
  readonly modo = "mock" as const;
  async send(msg: EmailMessage): Promise<EmailResult> {
    console.info(`[email:mock] → ${msg.to} · ${msg.subject}\n${msg.text}`);
    // RGPD: mismo resumen sin PII que el cliente real (sin `to` ni `subject`).
    return { id: `mock_email_${Date.now()}`, request: resumenEnvioEmail("mock") };
  }
}

export function getEmailClient(): EmailClient {
  if (!env.mockProviders && env.RESEND_API_KEY) {
    return new RealEmailClient(env.RESEND_API_KEY);
  }
  return new MockEmailClient();
}
