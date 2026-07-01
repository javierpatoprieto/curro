import { env } from "@/lib/env";

export interface CrearAssistantParams {
  negocio: string;
  ciudad: string | null;
}

/** Guion (system prompt) en español, parametrizado por negocio. Ver docs/vapi.md. */
export function guion(negocio: string, ciudad: string | null): string {
  const donde = ciudad ? ` en ${ciudad}` : "";
  return [
    `Eres «Curro», la recepcionista virtual de ${negocio}, una empresa de reformas y multiservicios del hogar${donde}. Hablas español de España, con tono cercano, claro y profesional. Frases cortas.`,
    "",
    "Objetivo: atender la llamada cuando el dueño no puede, cualificar al cliente y tomar sus datos para devolverle la llamada y agendar una visita.",
    "",
    "Reglas:",
    "- Preséntate SIEMPRE al inicio como asistente virtual e informa de que la llamada se graba (aviso legal obligatorio).",
    "- Averigua y confirma: nombre del cliente, tipo de trabajo, zona o dirección aproximada, y si es urgente.",
    "- No des precios ni presupuestos: explica que un técnico le llamará para valorarlo.",
    "- Sé breve. En cuanto tengas los datos, despídete y confirma que le contactarán.",
  ].join("\n");
}

export function buildAssistantConfig(negocio: string, ciudad: string | null) {
  return {
    name: `Curro · ${negocio}`,
    firstMessage: `${negocio}, le atiende Curro, su asistente virtual. Le aviso de que esta llamada queda grabada. ¿En qué puedo ayudarle?`,
    model: {
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "system", content: guion(negocio, ciudad) }],
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
  };
}

/**
 * Crea el assistant de Vapi para un negocio y devuelve su id.
 * En modo mock (o sin API key) devuelve un id simulado.
 */
export async function crearAssistant({
  negocio,
  ciudad,
}: CrearAssistantParams): Promise<string> {
  if (!env.mockProviders && env.VAPI_API_KEY) {
    const res = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.VAPI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(buildAssistantConfig(negocio, ciudad)),
    });
    if (!res.ok) {
      throw new Error(`Vapi ${res.status}: ${await res.text()}`);
    }
    const json = (await res.json()) as { id: string };
    return json.id;
  }
  return `asst_mock_${Date.now()}`;
}
