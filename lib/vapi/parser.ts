/**
 * Parser del "end-of-call-report" de Vapi.
 *
 * Vapi envía, al colgar, un webhook con `body.message.type === "end-of-call-report"`.
 * De ahí extraemos los datos estructurados que el assistant ha cualificado
 * (nombre, teléfono, tipo de trabajo, zona, urgencia) más la transcripción,
 * la grabación y las métricas de la llamada.
 *
 * Es una función PURA (sin red ni DB) para poder testearla con payloads reales.
 */

export interface ParsedLead {
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  tipo_trabajo: string | null;
  zona: string | null;
  urgencia: boolean;
}

export interface ParsedVapiCall {
  vapiCallId: string | null;
  assistantId: string | null;
  /** Número de teléfono del negocio al que se llamó (para localizar el tenant). */
  calledNumber: string | null;
  lead: ParsedLead;
  resumen: string | null;
  transcripcion: string | null;
  audioUrl: string | null;
  duracionSeg: number | null;
  costeEstimado: number | null;
}

type Dict = Record<string, unknown>;

const asDict = (v: unknown): Dict =>
  v && typeof v === "object" ? (v as Dict) : {};

/** Devuelve un string no vacío y sin espacios sobrantes, o null. */
function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

const VERDADERO = new Set([
  "true",
  "sí",
  "si",
  "1",
  "alta",
  "urgente",
  "urgencia",
  "yes",
]);
const FALSO = new Set(["false", "no", "0", "baja", "normal", "ninguna"]);

/** Normaliza urgencia desde boolean, número o texto en español. */
export function normalizeUrgencia(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v > 0;
  if (typeof v === "string") {
    const t = v.trim().toLowerCase();
    if (VERDADERO.has(t)) return true;
    if (FALSO.has(t)) return false;
  }
  return false;
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** Duración en segundos: usa durationSeconds o la calcula de startedAt/endedAt. */
function duracion(message: Dict): number | null {
  const directo = num(message.durationSeconds);
  if (directo != null) return Math.round(directo);
  const ini = str(message.startedAt);
  const fin = str(message.endedAt);
  if (ini && fin) {
    const ms = new Date(fin).getTime() - new Date(ini).getTime();
    if (Number.isFinite(ms) && ms > 0) return Math.round(ms / 1000);
  }
  return null;
}

/**
 * Parsea el payload del webhook de Vapi. Devuelve null si no es un
 * "end-of-call-report" (ignoramos el resto de tipos de mensaje).
 */
export function parseEndOfCallReport(raw: unknown): ParsedVapiCall | null {
  const body = asDict(raw);
  const message = asDict(body.message);

  if (str(message.type) !== "end-of-call-report") return null;

  const call = asDict(message.call);
  const customer = asDict(call.customer);
  const artifact = asDict(message.artifact);
  const analysis = asDict(message.analysis);
  const datos = asDict(analysis.structuredData);
  const assistant = asDict(message.assistant);
  const phoneNumber = asDict(call.phoneNumber ?? message.phoneNumber);

  const lead: ParsedLead = {
    cliente_nombre: str(datos.cliente_nombre ?? datos.nombre),
    // El teléfono suele venir del CallerID aunque no lo pregunte el assistant.
    cliente_telefono:
      str(datos.cliente_telefono ?? datos.telefono) ?? str(customer.number),
    tipo_trabajo: str(datos.tipo_trabajo ?? datos.trabajo),
    zona: str(datos.zona ?? datos.ubicacion),
    urgencia: normalizeUrgencia(datos.urgencia),
  };

  return {
    vapiCallId: str(call.id) ?? str(message.callId),
    assistantId: str(call.assistantId) ?? str(assistant.id),
    calledNumber: str(phoneNumber.number),
    lead,
    resumen: str(analysis.summary),
    transcripcion: str(artifact.transcript) ?? str(message.transcript),
    audioUrl:
      str(message.recordingUrl) ??
      str(artifact.recordingUrl) ??
      str(artifact.stereoRecordingUrl),
    duracionSeg: duracion(message),
    costeEstimado: num(message.cost),
  };
}
