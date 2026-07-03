import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyVapiSecret } from "@/lib/vapi/verify";
import { getCalIntegracion } from "@/lib/cal/integracion";
import { obtenerHuecos, crearReserva } from "@/lib/cal/client";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

const ZONA = "Europe/Madrid";
const PLAN_B =
  "No se ha podido agendar ahora mismo. Dile al cliente que un técnico le llamará para cerrar la visita.";

type Admin = ReturnType<typeof createAdminClient>;
type ToolCall = { id?: string; function?: { name?: string; arguments?: unknown } };

/**
 * Endpoint de las function-tools de Vapi (agendar visita con Cal.com).
 * Vapi hace POST aquí cuando el assistant llama a consultarHuecos/agendarVisita.
 * Verificamos el secreto, resolvemos el negocio por assistantId y usamos su API
 * key de Cal.com (leída solo por service_role). Respondemos SIEMPRE 200 con un
 * mensaje para el assistant salvo fallo de autenticación: un 500 a mitad de
 * llamada sería peor que un plan B hablado.
 */
export async function POST(request: NextRequest) {
  const bloqueo = rateLimit(request, "vapi-tools");
  if (bloqueo) return bloqueo;

  const rawBody = await request.text();

  // 1) Verificar el secreto compartido (mismo que el webhook de fin de llamada).
  if (env.VAPI_WEBHOOK_SECRET) {
    if (!verifyVapiSecret(request.headers.get("x-vapi-secret"), env.VAPI_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "firma inválida" }, { status: 401 });
    }
  } else if (env.isProd) {
    return NextResponse.json({ error: "endpoint sin secreto configurado" }, { status: 500 });
  }

  let payload: { message?: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const message = payload.message ?? {};
  const toolCalls = extraerToolCalls(message);
  if (toolCalls.length === 0) return NextResponse.json({ results: [] });

  const assistantId = extraerAssistantId(message);
  const telefonoCliente = extraerTelefono(message);

  // Sin Supabase o sin negocio no podemos agendar: plan B para todas.
  const admin = supabaseListo() ? createAdminClient() : null;
  const business = admin && assistantId ? await findBusiness(admin, assistantId) : null;
  const integ = admin && business ? await getCalIntegracion(admin, business.id) : null;
  const calListo = Boolean(integ?.cal_api_key && integ?.cal_event_type_id);

  const results = await Promise.all(
    toolCalls.map(async (tc) => {
      const toolCallId = tc.id ?? "";
      if (!calListo || !integ?.cal_api_key || !integ?.cal_event_type_id) {
        return { toolCallId, result: PLAN_B };
      }
      const nombre = tc.function?.name;
      const args = parseArgs(tc.function?.arguments);
      try {
        if (nombre === "consultarHuecos") {
          return { toolCallId, result: await onConsultarHuecos(integ, args) };
        }
        if (nombre === "agendarVisita") {
          return {
            toolCallId,
            result: await onAgendarVisita(integ, args, telefonoCliente),
          };
        }
        return { toolCallId, result: `Herramienta desconocida: ${nombre}` };
      } catch (e) {
        console.error(`[vapi-tools] ${nombre} falló:`, e);
        return { toolCallId, result: PLAN_B };
      }
    }),
  );

  return NextResponse.json({ results });
}

// --- Handlers de cada tool --------------------------------------------------

async function onConsultarHuecos(
  integ: { cal_api_key: string | null; cal_event_type_id: string | null },
  args: Record<string, unknown>,
): Promise<string> {
  const dias = typeof args.dias === "number" ? args.dias : undefined;
  const starts = await obtenerHuecos(integ.cal_api_key!, integ.cal_event_type_id!, {
    dias,
    timeZone: ZONA,
    limite: 6,
  });
  if (starts.length === 0) {
    return "No hay huecos libres en las próximas fechas. Ofrece el plan B: un técnico le llamará para cerrar la visita.";
  }
  const lineas = starts.map((iso) => `- ${formatoFecha(iso)} (${iso})`);
  return (
    "Huecos libres. Ofrece al cliente 2 o 3 de estas opciones (di el día y la hora). " +
    "Al agendar, usa la fecha ISO exacta entre paréntesis:\n" +
    lineas.join("\n")
  );
}

async function onAgendarVisita(
  integ: { cal_api_key: string | null; cal_event_type_id: string | null },
  args: Record<string, unknown>,
  telefonoCliente: string | null,
): Promise<string> {
  const start = typeof args.fecha_hora === "string" ? args.fecha_hora : "";
  const nombre = typeof args.nombre === "string" ? args.nombre : "";
  const email = typeof args.email === "string" ? args.email : "";
  const telefono =
    typeof args.telefono === "string" && args.telefono ? args.telefono : telefonoCliente;

  if (!start || !nombre || !email) {
    return "Faltan datos para agendar (necesito fecha, nombre y email). Pídeselos al cliente.";
  }

  // No nos fiamos del `fecha_hora` que teclea el modelo: Cal solo acepta una
  // reserva si el `start` coincide EXACTAMENTE con un hueco libre. El modelo
  // suele reformatear la fecha (quita milisegundos, cambia `Z` por `+00:00`,
  // redondea el minuto…) y entonces Cal la rechaza. Revalidamos contra los huecos
  // vivos y reservamos con el string CANÓNICO de Cal.
  const huecos = await obtenerHuecos(integ.cal_api_key!, integ.cal_event_type_id!, {
    dias: 21,
    timeZone: ZONA,
  });
  if (huecos.length === 0) {
    return "Ya no quedan huecos libres. Ofrece el plan B: un técnico le llamará para cerrar la visita.";
  }
  const canonico = elegirHueco(start, huecos);
  if (!canonico) {
    const opciones = huecos
      .slice(0, 4)
      .map((iso) => `- ${formatoFecha(iso)} (${iso})`)
      .join("\n");
    return (
      "Esa fecha ya no está libre o no coincide con un hueco válido. Ofrece de nuevo " +
      "una de estas opciones y agenda con la fecha ISO exacta entre paréntesis:\n" +
      opciones
    );
  }

  await crearReserva(integ.cal_api_key!, integ.cal_event_type_id!, {
    start: canonico,
    nombre,
    email,
    telefono,
    timeZone: ZONA,
  });
  return `Visita confirmada para el ${formatoFecha(canonico)}. Se le ha enviado la confirmación por email. Despídete.`;
}

/**
 * Devuelve el `start` CANÓNICO de Cal que corresponde al instante pedido por el
 * modelo, o null si ninguno coincide. Compara por INSTANTE (no por texto), así
 * toleramos variantes de formato que representan la misma hora (milisegundos
 * omitidos, `Z` vs `+00:00`, etc.) y reservamos siempre con el string exacto que
 * Cal considera reservable.
 */
export function elegirHueco(pedido: string, huecos: string[]): string | null {
  const t = new Date(pedido).getTime();
  if (Number.isNaN(t)) return null;
  return huecos.find((h) => new Date(h).getTime() === t) ?? null;
}

// --- Utilidades -------------------------------------------------------------

function supabaseListo() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

async function findBusiness(admin: Admin, assistantId: string) {
  const { data } = await admin
    .from("businesses")
    .select("id")
    .eq("vapi_assistant_id", assistantId)
    .maybeSingle();
  return data;
}

function extraerToolCalls(message: Record<string, unknown>): ToolCall[] {
  const lista =
    (message.toolCallList as ToolCall[] | undefined) ??
    (message.toolCalls as ToolCall[] | undefined);
  return Array.isArray(lista) ? lista : [];
}

function extraerAssistantId(message: Record<string, unknown>): string | null {
  const call = message.call as { assistantId?: string } | undefined;
  const assistant = message.assistant as { id?: string } | undefined;
  return call?.assistantId ?? assistant?.id ?? null;
}

function extraerTelefono(message: Record<string, unknown>): string | null {
  const call = message.call as { customer?: { number?: string } } | undefined;
  return call?.customer?.number ?? null;
}

/** Los argumentos de la tool llegan como string JSON o como objeto. */
export function parseArgs(argumentos: unknown): Record<string, unknown> {
  if (argumentos && typeof argumentos === "object") {
    return argumentos as Record<string, unknown>;
  }
  if (typeof argumentos === "string") {
    try {
      return JSON.parse(argumentos) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

/** ISO → texto humano en español y zona de Madrid (p. ej. "mié 16 jul, 10:00"). */
export function formatoFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ZONA,
  }).format(d);
}
