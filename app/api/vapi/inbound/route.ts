import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyVapiSecret } from "@/lib/vapi/verify";
import { rateLimit } from "@/lib/ratelimit";
import {
  decidirEnrutado,
  respuestaVapi,
  parseHorarioAtencion,
  type NegocioEnrutado,
} from "@/lib/horario";

export const runtime = "nodejs";

/**
 * Enrutado de la LLAMADA ENTRANTE (feature "Horario de atención").
 *
 * Mecanismo de Vapi verificado en docs.vapi.ai (server messages → assistant-request):
 * cuando un phone-number de Vapi NO tiene assistantId fijo, Vapi manda un
 * `assistant-request` a su `server.url` (este endpoint) al entrar una llamada, y
 * respondemos (en < 7,5 s) con UNA de:
 *   - { destination: { type: "number", number } } → Vapi TRANSFIERE al número e
 *     ignora cualquier assistant (dentro del horario del dueño → su móvil).
 *   - { assistantId } → Vapi atiende con ese assistant (fuera de horario → Curro).
 *   - { error } → Vapi corta con un mensaje.
 *
 * Por eso `lib/vapi/telefono.ts` importa el número apuntando su `server` aquí en
 * vez de fijar `assistantId` (así TODAS las entrantes pasan por esta decisión).
 *
 * Gated/mockable: este endpoint NO llama a la API de Vapi (es Vapi quien nos
 * llama); solo lee la BD y decide. La decisión pura vive en lib/horario.ts.
 */
export async function POST(request: NextRequest) {
  const bloqueo = await rateLimit(request, "vapi-inbound");
  if (bloqueo) return bloqueo;

  const rawBody = await request.text();

  // 1) Verificar el secreto compartido (mismo que el webhook de fin de llamada).
  if (env.VAPI_WEBHOOK_SECRET) {
    if (!verifyVapiSecret(request.headers.get("x-vapi-secret"), env.VAPI_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "firma inválida" }, { status: 401 });
    }
  } else if (env.isProd) {
    return NextResponse.json({ error: "endpoint sin secreto configurado" }, { status: 500 });
  } else {
    console.warn("[vapi-inbound] VAPI_WEBHOOK_SECRET no configurado: firma no verificada (dev).");
  }

  // 2) Parsear el payload.
  let payload: { message?: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const message = payload.message ?? {};
  // Solo nos interesa el assistant-request (enrutado de entrantes). Cualquier otro
  // tipo de mensaje que llegue aquí lo ignoramos con un 200 para no romper la llamada.
  if (typeof message.type === "string" && message.type !== "assistant-request") {
    return NextResponse.json({ ignored: true });
  }

  // 3) Resolver el negocio por el phone-number de Vapi (id) o por el número llamado.
  if (!supabaseListo()) {
    console.warn("[vapi-inbound] sin Supabase: no se puede resolver el negocio.");
    return NextResponse.json({ error: "no configurado" });
  }

  const { phoneId, calledNumber } = extraerNumero(message);
  const negocio = await resolverNegocio(phoneId, calledNumber);
  if (!negocio) {
    console.warn("[vapi-inbound] llamada sin negocio (phoneId/número desconocido):", phoneId, calledNumber);
    return NextResponse.json({ error: "negocio no encontrado" });
  }

  // 4) Decidir (función pura) y responder en el formato que espera Vapi.
  const decision = decidirEnrutado(negocio, new Date());
  return NextResponse.json(respuestaVapi(decision));
}

/** Identificadores del número llamado dentro del assistant-request de Vapi. */
function extraerNumero(message: Record<string, unknown>): {
  phoneId: string | null;
  calledNumber: string | null;
} {
  const call = (message.call as Record<string, unknown> | undefined) ?? {};
  const phoneNumber =
    (call.phoneNumber as { number?: string; id?: string } | undefined) ??
    (message.phoneNumber as { number?: string; id?: string } | undefined) ??
    {};
  const phoneId =
    (call.phoneNumberId as string | undefined) ??
    (message.phoneNumberId as string | undefined) ??
    phoneNumber.id ??
    null;
  const calledNumber = phoneNumber.number ?? null;
  return { phoneId, calledNumber };
}

/** Localiza el negocio por su phone-number de Vapi o por el número llamado. */
async function resolverNegocio(
  phoneId: string | null,
  calledNumber: string | null,
): Promise<NegocioEnrutado | null> {
  const admin = createAdminClient();
  const cols = "vapi_assistant_id, telefono_agente, horario_atencion, activo";

  if (phoneId) {
    const { data } = await admin
      .from("businesses")
      .select(cols)
      .eq("vapi_phone_id", phoneId)
      .maybeSingle();
    if (data) return normalizar(data);
  }
  if (calledNumber) {
    const { data } = await admin
      .from("businesses")
      .select(cols)
      .eq("telefono_entrante", calledNumber)
      .maybeSingle();
    if (data) return normalizar(data);
  }
  return null;
}

/** Normaliza la fila (valida el JSON del horario) a lo que espera decidirEnrutado. */
function normalizar(row: {
  vapi_assistant_id: string | null;
  telefono_agente: string | null;
  horario_atencion: unknown;
}): NegocioEnrutado {
  return {
    vapi_assistant_id: row.vapi_assistant_id ?? null,
    telefono_agente: row.telefono_agente ?? null,
    horario_atencion: parseHorarioAtencion(row.horario_atencion),
  };
}

function supabaseListo(): boolean {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}
