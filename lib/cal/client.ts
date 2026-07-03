/**
 * Wrapper mínimo de la API de Cal.com (v2) para el MVP de "agendar visita en
 * la llamada". Solo dos operaciones: consultar huecos y crear una reserva.
 *
 * La API key es un SECRETO por negocio (vive en `business_integrations`, que solo
 * lee el service_role). Este módulo se ejecuta SIEMPRE en servidor (endpoint de
 * tools de Vapi), nunca en el navegador.
 *
 * Nota: las versiones de la API de Cal.com se fijan por cabecera `cal-api-version`.
 * Si Cal.com cambia el contrato, ajústalas aquí (un único sitio).
 */

const CAL_API = "https://api.cal.com/v2";
const CAL_VERSION_SLOTS = "2024-09-04";
// OJO CON LA VERSIÓN DE BOOKINGS. Debe ser "2024-08-13": es la versión del endpoint
// de creación de reserva que autentica con API key personal (cal_live_) por
// `Authorization: Bearer`. Otras versiones (p. ej. "2026-02-25") enrutan a un guard
// que espera un token OAuth y devuelven 401 "Invalid Access Token" con la API key,
// AUNQUE la misma key funcione en /slots. Verificado contra un fallo real en prod
// (log de Vercel: `Cal.com booking 401: … "Invalid Access Token"`).
const CAL_VERSION_BOOKINGS = "2024-08-13";

export interface Hueco {
  /** Inicio del hueco en ISO 8601 (UTC), tal cual lo devuelve Cal.com. */
  start: string;
}

export interface DatosReserva {
  /** Inicio elegido, en ISO 8601. */
  start: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  timeZone?: string;
  notas?: string | null;
}

export interface ReservaCreada {
  uid: string;
  start: string;
}

const DIAS_POR_DEFECTO = 14;
const ZONA_POR_DEFECTO = "Europe/Madrid";

function auth(apiKey: string, version: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "cal-api-version": version,
    "content-type": "application/json",
  };
}

/** yyyy-mm-dd de una fecha (para los parámetros start/end de slots). */
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Devuelve los próximos huecos disponibles del tipo de evento, a partir de ahora
 * y durante `dias` días. Lista plana de inicios en ISO, ordenada y recortada.
 */
export async function obtenerHuecos(
  apiKey: string,
  eventTypeId: string,
  opts: { desde?: Date; dias?: number; timeZone?: string; limite?: number } = {},
): Promise<string[]> {
  const desde = opts.desde ?? new Date();
  const hasta = new Date(desde.getTime());
  hasta.setDate(hasta.getDate() + (opts.dias ?? DIAS_POR_DEFECTO));
  const timeZone = opts.timeZone ?? ZONA_POR_DEFECTO;

  const qs = new URLSearchParams({
    eventTypeId,
    start: isoDate(desde),
    end: isoDate(hasta),
    timeZone,
  });

  const res = await fetch(`${CAL_API}/slots?${qs.toString()}`, {
    headers: auth(apiKey, CAL_VERSION_SLOTS),
  });
  if (!res.ok) {
    throw new Error(`Cal.com slots ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as unknown;
  const starts = extraerStarts(json);
  starts.sort();
  return typeof opts.limite === "number" ? starts.slice(0, opts.limite) : starts;
}

/**
 * Aplana la respuesta de /slots a una lista de `start` ISO. Cal.com devuelve los
 * huecos agrupados por fecha (`data: { "2024-09-04": [{ start }] }`); admitimos
 * también la variante envuelta en `data.slots` por robustez ante versiones.
 */
export function extraerStarts(json: unknown): string[] {
  const root = (json as { data?: unknown })?.data ?? json;
  const porFecha = (root as { slots?: unknown })?.slots ?? root;
  if (!porFecha || typeof porFecha !== "object") return [];

  const out: string[] = [];
  for (const valor of Object.values(porFecha as Record<string, unknown>)) {
    if (!Array.isArray(valor)) continue;
    for (const h of valor) {
      const start = (h as Hueco)?.start;
      if (typeof start === "string") out.push(start);
    }
  }
  return out;
}

/** Crea una reserva (booking) para el hueco elegido. Devuelve uid + inicio. */
export async function crearReserva(
  apiKey: string,
  eventTypeId: string,
  datos: DatosReserva,
): Promise<ReservaCreada> {
  const body = {
    start: datos.start,
    eventTypeId: Number(eventTypeId),
    attendee: {
      name: datos.nombre,
      email: datos.email,
      timeZone: datos.timeZone ?? ZONA_POR_DEFECTO,
      language: "es",
      ...(datos.telefono ? { phoneNumber: datos.telefono } : {}),
    },
    ...(datos.notas ? { metadata: { notas: datos.notas } } : {}),
  };

  const res = await fetch(`${CAL_API}/bookings`, {
    method: "POST",
    headers: auth(apiKey, CAL_VERSION_BOOKINGS),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Cal.com booking ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: { uid?: string; start?: string } };
  const uid = json?.data?.uid;
  if (!uid) throw new Error("Cal.com booking sin uid en la respuesta");
  return { uid, start: json.data?.start ?? datos.start };
}
