import { env } from "@/lib/env";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  id: string | null;
  request: unknown;
}

export interface EmailClient {
  readonly modo: "real" | "mock";
  send(msg: EmailMessage): Promise<EmailResult>;
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
    return { id: json.id ?? null, request: { ...body, html: "[html]" } };
  }
}

class MockEmailClient implements EmailClient {
  readonly modo = "mock" as const;
  async send(msg: EmailMessage): Promise<EmailResult> {
    console.info(`[email:mock] → ${msg.to} · ${msg.subject}\n${msg.text}`);
    return {
      id: `mock_email_${Date.now()}`,
      request: { to: msg.to, subject: msg.subject },
    };
  }
}

export function getEmailClient(): EmailClient {
  if (!env.mockProviders && env.RESEND_API_KEY) {
    return new RealEmailClient(env.RESEND_API_KEY);
  }
  return new MockEmailClient();
}
