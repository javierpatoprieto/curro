import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Webhook de WhatsApp Cloud API (Meta).
 *
 * - GET  → verificación del webhook al configurarlo en Meta: Meta llama con
 *          hub.mode=subscribe, hub.verify_token y hub.challenge; si el token
 *          coincide con WHATSAPP_VERIFY_TOKEN, devolvemos el challenge en texto.
 * - POST → eventos (estados de entrega y mensajes entrantes). De momento solo
 *          acusamos recibo (200) y registramos un resumen; el envío de avisos ya
 *          ocurre desde el webhook de Vapi. Meta exige 200 rápido para no reintentar.
 */

/** Lógica pura de la verificación de Meta. Devuelve el challenge o null. */
export function retoMeta(
  params: {
    mode: string | null;
    token: string | null;
    challenge: string | null;
  },
  verifyToken: string | undefined,
): string | null {
  if (
    params.mode === "subscribe" &&
    verifyToken &&
    params.token === verifyToken
  ) {
    return params.challenge ?? "";
  }
  return null;
}

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const challenge = retoMeta(
    {
      mode: q.get("hub.mode"),
      token: q.get("hub.verify_token"),
      challenge: q.get("hub.challenge"),
    },
    env.WHATSAPP_VERIFY_TOKEN,
  );

  if (challenge === null) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return new NextResponse(challenge, {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  try {
    const payload = JSON.parse(raw) as unknown;
    console.info("[whatsapp] evento:", resumenEvento(payload));
  } catch {
    // Ignoramos payloads que no sean JSON.
  }
  // Siempre 200: Meta reintenta si no respondemos rápido con éxito.
  return NextResponse.json({ received: true });
}

/** Resumen legible de un evento de Meta para el log (sin volcar todo el payload). */
export function resumenEvento(payload: unknown): string {
  const entry = (payload as { entry?: unknown[] })?.entry;
  if (!Array.isArray(entry)) return "evento sin entry";
  const tipos: string[] = [];
  for (const e of entry) {
    const changes = (e as { changes?: unknown[] })?.changes;
    if (!Array.isArray(changes)) continue;
    for (const c of changes) {
      const value = (c as { value?: Record<string, unknown> })?.value ?? {};
      if (Array.isArray(value.statuses)) {
        for (const s of value.statuses as { status?: string }[]) {
          tipos.push(`status:${s.status ?? "?"}`);
        }
      }
      if (Array.isArray(value.messages)) {
        tipos.push(`entrante:${(value.messages as unknown[]).length}`);
      }
    }
  }
  return tipos.length ? tipos.join(", ") : "evento sin cambios relevantes";
}
