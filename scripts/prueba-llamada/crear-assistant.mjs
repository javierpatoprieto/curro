/**
 * Crea un assistant de Vapi para la PRUEBA de llamada real, cableado al webhook
 * de producción de Curro. No toca la base de datos.
 *
 * Uso:
 *   VAPI_API_KEY=xxx VAPI_WEBHOOK_SECRET=xxx node scripts/prueba-llamada/crear-assistant.mjs
 *
 * Variables:
 *   VAPI_API_KEY         (obligatoria) tu clave privada de Vapi.
 *   VAPI_WEBHOOK_SECRET  (obligatoria) el mismo secreto que pondrás en Vercel.
 *   APP_URL              (opcional) por defecto https://curro-kappa.vercel.app
 *   NEGOCIO              (opcional) nombre del negocio de prueba.
 *   CIUDAD               (opcional) ciudad del negocio.
 */

const API_KEY = process.env.VAPI_API_KEY;
const SECRET = process.env.VAPI_WEBHOOK_SECRET;
const APP_URL = process.env.APP_URL || "https://curro-kappa.vercel.app";
const NEGOCIO = process.env.NEGOCIO || "Reformas de Prueba";
const CIUDAD = process.env.CIUDAD || "Madrid";

if (!API_KEY || !SECRET) {
  console.error(
    "Faltan variables. Ejemplo:\n  VAPI_API_KEY=xxx VAPI_WEBHOOK_SECRET=xxx node scripts/prueba-llamada/crear-assistant.mjs",
  );
  process.exit(1);
}

const guion = [
  `Eres «Curro», la recepcionista virtual de ${NEGOCIO}, una empresa de reformas y multiservicios del hogar en ${CIUDAD}. Hablas español de España, con tono cercano, claro y profesional. Frases cortas.`,
  "",
  "Objetivo: atender la llamada cuando el dueño no puede, cualificar al cliente y tomar sus datos para devolverle la llamada y agendar una visita.",
  "",
  "Reglas:",
  "- Preséntate SIEMPRE al inicio como asistente virtual e informa de que la llamada se graba (aviso legal obligatorio).",
  "- Averigua y confirma: nombre del cliente, tipo de trabajo, zona o dirección aproximada, y si es urgente.",
  "- Si el cliente te da su teléfono, tómalo; si no, no insistas.",
  "- No des precios ni presupuestos: explica que un técnico le llamará para valorarlo.",
  "- Sé breve. En cuanto tengas los datos, despídete y confirma que le contactarán en breve.",
].join("\n");

const config = {
  name: `Curro · ${NEGOCIO} (PRUEBA)`,
  firstMessage: `${NEGOCIO}, le atiende Curro, su asistente virtual. Le aviso de que esta llamada queda grabada. ¿En qué puedo ayudarle?`,
  maxDurationSeconds: 300,
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [{ role: "system", content: guion }],
  },
  voice: { provider: "11labs", voiceId: "sarah", model: "eleven_turbo_v2_5" },
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
  // Aquí está la magia: al colgar, Vapi manda el end-of-call-report a tu webhook
  // con el secreto en la cabecera, y Curro guarda el lead.
  server: {
    url: `${APP_URL}/api/webhooks/vapi`,
    headers: { "x-vapi-secret": SECRET },
  },
};

const res = await fetch("https://api.vapi.ai/assistant", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "content-type": "application/json",
  },
  body: JSON.stringify(config),
});

if (!res.ok) {
  console.error(`Vapi ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const json = await res.json();
console.log("\n✅ Assistant creado.");
console.log("   id:", json.id);
console.log("   webhook:", `${APP_URL}/api/webhooks/vapi`);
console.log("\nSiguiente paso: pega este id en el SQL (vapi_assistant_id) y");
console.log("asígnale un número de teléfono en el dashboard de Vapi.\n");
