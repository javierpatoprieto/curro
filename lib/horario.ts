/**
 * Horario de atención del DUEÑO (módulo puro, sin red ni DB).
 *
 * Cada negocio define en qué franjas atiende él mismo el teléfono. DENTRO de ese
 * horario, la llamada entrante se TRANSFIERE a su móvil (`telefono_agente`);
 * FUERA (tardes, noches, fines de semana) la atiende el asistente de Curro, como
 * hasta ahora. Es un modo "solo por horario" (sin overflow): si el dueño no coge
 * dentro de su horario, la llamada se pierde — no cae al asistente.
 *
 * `horario_atencion` vacío o null = el dueño no configura horario ⇒ Curro atiende
 * 24/7 (comportamiento actual, no se rompe nada).
 *
 * La decisión se toma EN VIVO por llamada (nuestro endpoint /api/vapi/inbound
 * consulta esto), así que cambiar el horario o el móvil NO requiere tocar Vapi.
 */

/** Días de la semana, claves cortas en español (lunes → domingo). */
export const DIAS = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"] as const;
export type DiaSemana = (typeof DIAS)[number];

/** Un rango horario "HH:MM"–"HH:MM" (inicio inclusivo, fin exclusivo). */
export type Rango = [string, string];

/** Horario semanal en el que ATIENDE EL DUEÑO. */
export interface HorarioAtencion {
  /** Zona horaria IANA. Por defecto Europe/Madrid. */
  tz: string;
  /** Franjas por día. Un día ausente o con [] = ese día atiende Curro. */
  dias: Partial<Record<DiaSemana, Rango[]>>;
}

export const TZ_POR_DEFECTO = "Europe/Madrid";

/** "07:00" → 420 (minutos desde medianoche). null si el formato es inválido. */
function aMinutos(hhmm: unknown): number | null {
  if (typeof hhmm !== "string") return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (!Number.isInteger(h) || !Number.isInteger(min)) return null;
  if (h < 0 || h > 24 || min < 0 || min > 59) return null;
  const total = h * 60 + min;
  return total > 24 * 60 ? null : total;
}

/** ¿Está `minutos` dentro del rango? Tolera rangos que cruzan medianoche. */
function enRango(minutos: number, rango: Rango): boolean {
  const a = aMinutos(rango[0]);
  const b = aMinutos(rango[1]);
  if (a == null || b == null || a === b) return false;
  // Rango normal (07:00–18:00): inicio inclusivo, fin exclusivo.
  if (a < b) return minutos >= a && minutos < b;
  // Rango que cruza medianoche (22:00–06:00).
  return minutos >= a || minutos < b;
}

const INTL_A_DIA: Record<string, DiaSemana> = {
  Mon: "lun",
  Tue: "mar",
  Wed: "mie",
  Thu: "jue",
  Fri: "vie",
  Sat: "sab",
  Sun: "dom",
};

/** Día de la semana y minutos-del-día de `fecha` EN la zona horaria `tz`. */
function partesEnTz(fecha: Date, tz: string): { dia: DiaSemana; minutos: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(fecha);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dia = INTL_A_DIA[get("weekday")] ?? "lun";
  // hour12:false devuelve "00".."23" en Node, pero algún runtime da "24" a las 0h.
  let hora = Number(get("hour"));
  if (!Number.isFinite(hora) || hora === 24) hora = 0;
  const min = Number(get("minute")) || 0;
  return { dia, minutos: hora * 60 + min };
}

/**
 * ¿Está `ahora` DENTRO del horario de atención del dueño?
 *  - true  → el dueño atiende ⇒ transferir la llamada a su móvil.
 *  - false → fuera de horario (o sin horario) ⇒ atiende Curro.
 *
 * Horario null/undefined/vacío ⇒ false (Curro atiende 24/7). Respeta la tz del
 * propio horario (Europe/Madrid por defecto), no la del servidor.
 */
export function enHorarioAtencion(
  horario: HorarioAtencion | null | undefined,
  ahora: Date,
): boolean {
  if (!horario || !horario.dias) return false;
  const tz = horario.tz || TZ_POR_DEFECTO;
  let partes: { dia: DiaSemana; minutos: number };
  try {
    partes = partesEnTz(ahora, tz);
  } catch {
    // tz inválida: no arriesgamos una transferencia equivocada ⇒ atiende Curro.
    return false;
  }
  const rangos = horario.dias[partes.dia];
  if (!Array.isArray(rangos) || rangos.length === 0) return false;
  return rangos.some((r) => Array.isArray(r) && enRango(partes.minutos, r));
}

/**
 * Normaliza un teléfono a algo parecido a E.164 para usarlo como destino de
 * transferencia en Vapi: quita espacios, guiones y paréntesis. Devuelve el número
 * si tras limpiar cumple `+` seguido de 6–15 dígitos; si no, null (un número mal
 * formado NO debe provocar una transferencia rota: mejor que atienda Curro).
 */
export function normalizarE164(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const limpio = v.replace(/[\s()\-.]/g, "");
  return /^\+\d{6,15}$/.test(limpio) ? limpio : null;
}

/**
 * Valida y normaliza un `horario_atencion` que llega de un formulario (string
 * JSON) o de la BD (objeto). Devuelve el horario normalizado o null si está
 * vacío / es inválido / no tiene ninguna franja (null ⇒ Curro atiende 24/7).
 * Función pura: apta para server actions y tests.
 */
export function parseHorarioAtencion(raw: unknown): HorarioAtencion | null {
  if (raw == null || raw === "") return null;

  let obj: unknown = raw;
  if (typeof raw === "string") {
    try {
      obj = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (typeof obj !== "object" || obj == null) return null;

  const src = obj as { tz?: unknown; dias?: unknown };
  const tz = typeof src.tz === "string" && src.tz.trim() ? src.tz.trim() : TZ_POR_DEFECTO;
  const diasSrc =
    typeof src.dias === "object" && src.dias != null
      ? (src.dias as Record<string, unknown>)
      : {};

  const dias: Partial<Record<DiaSemana, Rango[]>> = {};
  let totalRangos = 0;

  for (const dia of DIAS) {
    const lista = diasSrc[dia];
    if (!Array.isArray(lista)) continue;
    const rangos: Rango[] = [];
    for (const r of lista) {
      if (!Array.isArray(r) || r.length < 2) continue;
      const ini = aMinutos(r[0]);
      const fin = aMinutos(r[1]);
      if (ini == null || fin == null || ini === fin) continue;
      // Guardamos el string original ya validado (HH:MM), normalizado a 2 dígitos.
      rangos.push([aHHMM(ini), aHHMM(fin)]);
    }
    if (rangos.length > 0) {
      dias[dia] = rangos;
      totalRangos += rangos.length;
    }
  }

  if (totalRangos === 0) return null;
  return { tz, dias };
}

/** 420 → "07:00". */
function aHHMM(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// --- Presets de horario para la UI -----------------------------------------

/** Presets rápidos para el editor semanal (reutilizados por el componente). */
export const PRESETS_HORARIO: Record<string, { etiqueta: string; horario: HorarioAtencion }> = {
  "lv-7-18": {
    etiqueta: "L–V 7:00–18:00",
    horario: horarioDias(["lun", "mar", "mie", "jue", "vie"], "07:00", "18:00"),
  },
  "lv-8-20": {
    etiqueta: "L–V 8:00–20:00",
    horario: horarioDias(["lun", "mar", "mie", "jue", "vie"], "08:00", "20:00"),
  },
  "ls-8-14": {
    etiqueta: "L–S 8:00–14:00",
    horario: horarioDias(["lun", "mar", "mie", "jue", "vie", "sab"], "08:00", "14:00"),
  },
};

function horarioDias(dias: DiaSemana[], ini: string, fin: string): HorarioAtencion {
  const map: Partial<Record<DiaSemana, Rango[]>> = {};
  for (const d of dias) map[d] = [[ini, fin]];
  return { tz: TZ_POR_DEFECTO, dias: map };
}

// --- Decisión de enrutado de la llamada entrante ----------------------------

/** Datos mínimos del negocio para decidir cómo enrutar una entrante. */
export interface NegocioEnrutado {
  vapi_assistant_id: string | null;
  telefono_agente: string | null;
  horario_atencion: HorarioAtencion | null;
}

export type DecisionEnrutado =
  | { tipo: "transfer"; numero: string }
  | { tipo: "assistant"; assistantId: string }
  | { tipo: "error"; motivo: string };

/**
 * Decide cómo enrutar una llamada entrante (función PURA, testeable):
 *  - DENTRO del horario del dueño y con móvil válido ⇒ transferir a su móvil.
 *  - En cualquier otro caso (fuera de horario, sin horario, sin móvil) ⇒ Curro
 *    (su assistant). Modo "solo por horario": no hay overflow.
 *  - Si no hay assistant configurado y no toca transferir ⇒ error.
 */
export function decidirEnrutado(
  negocio: NegocioEnrutado,
  ahora: Date,
): DecisionEnrutado {
  const movil = normalizarE164(negocio.telefono_agente);
  if (movil && enHorarioAtencion(negocio.horario_atencion, ahora)) {
    return { tipo: "transfer", numero: movil };
  }
  if (negocio.vapi_assistant_id) {
    return { tipo: "assistant", assistantId: negocio.vapi_assistant_id };
  }
  return { tipo: "error", motivo: "sin assistant configurado" };
}

/**
 * Traduce la decisión al cuerpo de respuesta que espera Vapi ante un
 * `assistant-request` (verificado en docs.vapi.ai):
 *  - transfer  → { destination: { type: "number", number } } (Vapi desvía y
 *    IGNORA cualquier assistant).
 *  - assistant → { assistantId } (Vapi atiende con ese assistant).
 *  - error     → { error } (Vapi corta con un mensaje).
 */
export function respuestaVapi(
  decision: DecisionEnrutado,
): Record<string, unknown> {
  switch (decision.tipo) {
    case "transfer":
      return { destination: { type: "number", number: decision.numero } };
    case "assistant":
      return { assistantId: decision.assistantId };
    case "error":
      return { error: decision.motivo };
  }
}
