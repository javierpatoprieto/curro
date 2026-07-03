import { env } from "@/lib/env";

/** Configuración personalizable por empresa que alimenta el guion del assistant. */
export interface AssistantConfig {
  negocio: string;
  ciudad?: string | null;
  servicios?: string | null;
  zonas?: string | null;
  horario?: string | null;
  tono?: string | null;
  preguntas_clave?: string | null;
  conocimiento?: string | null;
  maxDuracionSeg?: number | null;
  /** Si el negocio tiene Cal.com conectado, el assistant puede agendar la visita. */
  calConectado?: boolean;
  /** Voz del asistente: femenina (por defecto) o masculina. */
  voz?: "femenina" | "masculina" | null;
  /** Actividad / tipo de empresa (p. ej. "fontanería"); personaliza el guion. */
  actividad?: string | null;
}

/**
 * voiceId de 11labs por género. Son nombres de voces de 11labs (multilingües con
 * eleven_turbo_v2_5); se pueden cambiar por un voice_id concreto tras probarlas.
 */
const VOCES: Record<"femenina" | "masculina", string> = {
  femenina: "sarah",
  masculina: "george",
};

const TONOS: Record<string, string> = {
  cercano: "cercano y de confianza, como un vecino que sabe del oficio",
  profesional: "profesional, claro y correcto",
  comercial: "amable y comercial, orientado a cerrar la visita",
};

const clean = (v?: string | null) => (v && v.trim() ? v.trim() : null);

/** Guion (system prompt) en español, personalizado por empresa. Ver docs/vapi.md. */
export function guion(config: AssistantConfig): string {
  const { negocio } = config;
  const ciudad = clean(config.ciudad);
  const donde = ciudad ? ` en ${ciudad}` : "";
  const tono = TONOS[clean(config.tono) ?? ""] ?? "cercano, claro y profesional";
  const actividad = clean(config.actividad) ?? "reformas y multiservicios del hogar";

  const lineas: string[] = [
    `Eres «Curro», el recepcionista virtual de ${negocio}, una empresa de ${actividad}${donde}. Hablas español de España, con tono ${tono}. Frases cortas.`,
    "",
    "Objetivo: atender la llamada cuando el dueño no puede, cualificar al cliente y tomar sus datos para devolverle la llamada y agendar una visita.",
    "",
    "Reglas:",
    "- Preséntate SIEMPRE al inicio como asistente virtual e informa de que la llamada se graba (aviso legal obligatorio).",
    "- Averigua y confirma: nombre del cliente, tipo de trabajo, zona o dirección aproximada, y si es urgente.",
    "- Si el cliente te da su teléfono, tómalo; si no, no insistas.",
    "- No des precios ni presupuestos: explica que un técnico le llamará para valorarlo.",
    "- Sé breve. En cuanto tengas los datos, despídete y confirma que le contactarán en breve.",
  ];

  if (config.calConectado) {
    lineas.push(
      "",
      "Agendado de visita (tienes herramientas para hacerlo en la misma llamada):",
      "- Cuando tengas el nombre y el tipo de trabajo, ofrece agendar una visita.",
      "- Usa la herramienta «consultarHuecos» para ver fechas libres y propón 2 o 3 opciones concretas al cliente (di día y hora de forma natural, p. ej. «el martes a las 10 o el miércoles a las 17»).",
      "- Cuando el cliente elija, pídele un email para enviarle la confirmación y usa «agendarVisita» con la fecha y hora elegidas.",
      "- Si la herramienta falla o no hay huecos, no lo intentes más: di que un técnico le llamará para cerrar la visita (plan B), y continúa tomando los datos con normalidad.",
    );
  }

  const servicios = clean(config.servicios);
  if (servicios) {
    lineas.push(
      "",
      `Servicios que ofrece ${negocio} (si piden algo fuera de esto, dilo con tacto y ofrece tomar los datos igualmente):`,
      servicios,
    );
  }

  const zonas = clean(config.zonas);
  if (zonas) lineas.push("", `Zonas que cubre: ${zonas}.`);

  const horario = clean(config.horario);
  if (horario) lineas.push("", `Horario de atención: ${horario}.`);

  const preguntas = clean(config.preguntas_clave);
  if (preguntas) {
    lineas.push("", "Pregunta siempre, además, lo siguiente:", preguntas);
  }

  const conocimiento = clean(config.conocimiento);
  if (conocimiento) {
    lineas.push(
      "",
      "Base de conocimiento del negocio (úsala para responder dudas del cliente; si algo no está aquí, di que un técnico lo confirmará):",
      conocimiento,
    );
  }

  return lineas.join("\n");
}

const DURACION_POR_DEFECTO = 300; // 5 minutos de tope por llamada

const appUrl = () =>
  env.APP_URL || env.NEXT_PUBLIC_APP_URL || "https://curro-kappa.vercel.app";

/**
 * Function-tools de agendado (Cal.com). Vapi las invoca durante la llamada y
 * hace POST a nuestro endpoint /api/vapi/tools (con el mismo secreto del webhook).
 * El endpoint resuelve el negocio por assistantId y usa su API key de Cal.com.
 */
export function herramientasCal() {
  const server = env.VAPI_WEBHOOK_SECRET
    ? {
        url: `${appUrl()}/api/vapi/tools`,
        headers: { "x-vapi-secret": env.VAPI_WEBHOOK_SECRET },
      }
    : { url: `${appUrl()}/api/vapi/tools` };

  return [
    {
      type: "function",
      server,
      function: {
        name: "consultarHuecos",
        description:
          "Consulta las próximas fechas y horas libres para agendar una visita. Úsala antes de proponer horarios al cliente.",
        parameters: {
          type: "object",
          properties: {
            dias: {
              type: "number",
              description:
                "Número de días hacia delante a consultar (opcional, por defecto 14).",
            },
          },
          required: [],
        },
      },
    },
    {
      type: "function",
      server,
      function: {
        name: "agendarVisita",
        description:
          "Reserva una visita en una fecha y hora concretas que el cliente haya elegido de las ofrecidas.",
        parameters: {
          type: "object",
          properties: {
            fecha_hora: {
              type: "string",
              description:
                "Fecha y hora de inicio elegidas, en formato ISO 8601 (la misma que devolvió consultarHuecos).",
            },
            nombre: { type: "string", description: "Nombre del cliente." },
            email: {
              type: "string",
              description: "Email del cliente para enviarle la confirmación.",
            },
            telefono: {
              type: "string",
              description: "Teléfono del cliente (opcional).",
            },
          },
          required: ["fecha_hora", "nombre", "email"],
        },
      },
    },
  ];
}

export function buildAssistantConfig(config: AssistantConfig) {
  const { negocio } = config;
  return {
    name: `Curro · ${negocio}`,
    firstMessage: `${negocio}, le atiende Curro, su asistente virtual. Le aviso de que esta llamada queda grabada. ¿En qué puedo ayudarle?`,
    // Control de coste: cortamos la llamada si se alarga demasiado.
    maxDurationSeconds: config.maxDuracionSeg ?? DURACION_POR_DEFECTO,
    model: {
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "system", content: guion(config) }],
      ...(config.calConectado ? { tools: herramientasCal() } : {}),
    },
    voice: {
      provider: "11labs",
      voiceId: VOCES[config.voz ?? "femenina"],
      model: "eleven_turbo_v2_5",
    },
    transcriber: { provider: "deepgram", model: "nova-2", language: "es" },
    analysisPlan: {
      summaryPlan: { enabled: true },
      structuredDataPlan: {
        enabled: true,
        schema: {
          type: "object",
          properties: {
            cliente_nombre: { type: "string" },
            cliente_telefono: { type: "string" },
            tipo_trabajo: { type: "string" },
            zona: { type: "string" },
            urgencia: { type: "boolean" },
          },
          required: ["tipo_trabajo"],
        },
      },
    },
    // Cablea el webhook para que el lead entre solo al colgar.
    server: env.VAPI_WEBHOOK_SECRET
      ? {
          url: `${appUrl()}/api/webhooks/vapi`,
          headers: { "x-vapi-secret": env.VAPI_WEBHOOK_SECRET },
        }
      : { url: `${appUrl()}/api/webhooks/vapi` },
  };
}

const vapiActivo = () => !env.mockProviders && Boolean(env.VAPI_API_KEY);

/**
 * Crea el assistant de Vapi para un negocio y devuelve su id.
 * En modo mock (o sin API key) devuelve un id simulado.
 */
export async function crearAssistant(config: AssistantConfig): Promise<string> {
  if (!vapiActivo()) return `asst_mock_${Date.now()}`;

  const res = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.VAPI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(buildAssistantConfig(config)),
  });
  if (!res.ok) throw new Error(`Vapi ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { id: string };
  return json.id;
}

/**
 * Re-sincroniza un assistant existente con la config actual del negocio
 * (cuando el dueño edita sus ajustes). No-op en modo mock.
 */
export async function actualizarAssistant(
  assistantId: string,
  config: AssistantConfig,
): Promise<void> {
  if (!vapiActivo() || !assistantId || assistantId.startsWith("asst_mock_")) {
    return;
  }
  const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${env.VAPI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(buildAssistantConfig(config)),
  });
  if (!res.ok) throw new Error(`Vapi ${res.status}: ${await res.text()}`);
}

/**
 * Borra el assistant de Vapi (al eliminar un negocio) para no dejar coste
 * huérfano. No-op en mock/sin key; ignora 404 (ya no existe).
 */
export async function eliminarAssistant(assistantId: string): Promise<void> {
  if (!vapiActivo() || !assistantId || assistantId.startsWith("asst_mock_")) {
    return;
  }
  const res = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${env.VAPI_API_KEY}` },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Vapi ${res.status}: ${await res.text()}`);
  }
}
