/**
 * DIAGNÓSTICO de por qué agendarVisita no cierra la reserva en Cal.com.
 *
 * Lee la API key + event type de Cal del negocio (desde Supabase, con la
 * service_role) y reproduce EXACTAMENTE lo que hace el endpoint durante la
 * llamada: pide huecos y crea una reserva en el primer hueco libre. Imprime el
 * ERROR CRUDO de Cal (status + cuerpo), que es lo único que nos falta para el fix.
 *
 * NO crea nada raro: si la reserva falla (que es el caso), no queda ninguna cita.
 * Si por lo que sea sí se crea, es una cita de prueba que puedes cancelar.
 *
 * Uso (desde la carpeta Curro):
 *   vercel env pull .env.local --environment=production
 *   node --env-file=.env.local scripts/prueba-llamada/debug-cal.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CAL = "https://api.cal.com/v2";
const ZONA = "Europe/Madrid";

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Ejecuta antes: vercel env pull .env.local --environment=production\n" +
      "y corre con: node --env-file=.env.local scripts/prueba-llamada/debug-cal.mjs",
  );
  process.exit(1);
}

const sb = (path) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
  });

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  // 1) Coger la integración de Cal más reciente (el negocio de prueba).
  const res = await sb(
    "business_integrations?select=business_id,cal_api_key,cal_event_type_id,updated_at,businesses(nombre)&order=updated_at.desc&limit=5",
  );
  if (!res.ok) {
    console.error("Error leyendo business_integrations:", res.status, await res.text());
    process.exit(1);
  }
  const filas = await res.json();
  const conCal = filas.filter((f) => f.cal_api_key && f.cal_event_type_id);
  if (conCal.length === 0) {
    console.error(
      "Ningún negocio tiene Cal conectado (cal_api_key + cal_event_type_id) en business_integrations.",
    );
    process.exit(1);
  }
  const integ = conCal[0];
  const nombre = integ.businesses?.nombre ?? "(sin nombre)";
  console.log(`\n▶ Negocio: ${nombre}`);
  console.log(`  event_type_id: ${integ.cal_event_type_id}`);
  console.log(`  cal_api_key: ${String(integ.cal_api_key).slice(0, 8)}…\n`);

  const apiKey = integ.cal_api_key;
  const eventTypeId = integ.cal_event_type_id;

  // 2) Pedir huecos (igual que consultarHuecos, versión de slots 2024-09-04).
  const desde = new Date();
  const hasta = new Date(desde.getTime());
  hasta.setDate(hasta.getDate() + 21);
  const qs = new URLSearchParams({
    eventTypeId,
    start: isoDate(desde),
    end: isoDate(hasta),
    timeZone: ZONA,
  });
  const rSlots = await fetch(`${CAL}/slots?${qs}`, {
    headers: { Authorization: `Bearer ${apiKey}`, "cal-api-version": "2024-09-04" },
  });
  const slotsRaw = await rSlots.text();
  console.log(`▶ /slots → HTTP ${rSlots.status}`);
  if (!rSlots.ok) {
    console.log("  cuerpo:", slotsRaw);
    process.exit(1);
  }
  // Aplanar { data: { "2026-07-06": [{ start }] } }
  const json = JSON.parse(slotsRaw);
  const root = json?.data ?? json;
  const porFecha = root?.slots ?? root;
  const starts = [];
  for (const v of Object.values(porFecha ?? {})) {
    if (Array.isArray(v)) for (const h of v) if (h?.start) starts.push(h.start);
  }
  starts.sort();
  console.log(`  huecos encontrados: ${starts.length}`);
  if (starts.length === 0) {
    console.log("  (sin huecos: no se puede probar la reserva)");
    process.exit(0);
  }
  const start = starts[0];
  console.log(`  probando reserva en el primer hueco: ${start}\n`);

  // 3) Crear reserva (igual que crearReserva, versión de bookings 2026-02-25).
  const body = {
    start,
    eventTypeId: Number(eventTypeId),
    attendee: {
      name: "Prueba Curro Debug",
      email: "prueba+curro@example.com",
      timeZone: ZONA,
      language: "es",
    },
  };
  const rBook = await fetch(`${CAL}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2026-02-25",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const bookRaw = await rBook.text();
  console.log(`▶ POST /bookings → HTTP ${rBook.status}`);
  console.log("  ─────────── RESPUESTA CRUDA DE CAL ───────────");
  console.log(bookRaw);
  console.log("  ──────────────────────────────────────────────");
  if (rBook.ok) {
    console.log("\n✅ La reserva SÍ se creó desde el script. El fallo estaría en el cableado del endpoint, no en Cal.");
  } else {
    console.log("\n❌ Cal rechazó la reserva. El cuerpo de arriba dice por qué → con eso lo arreglo.");
  }
}

main().catch((e) => {
  console.error("Fallo inesperado:", e);
  process.exit(1);
});
