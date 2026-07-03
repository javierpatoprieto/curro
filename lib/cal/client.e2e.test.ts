import { describe, it, expect } from "vitest";
import { obtenerHuecos, crearReserva } from "@/lib/cal/client";

/**
 * E2E REAL contra api.cal.com usando el cliente de producción (no un mock).
 * Verifica el contrato de verdad: cabeceras `cal-api-version`, forma de /slots y
 * de /bookings. Se SALTA solo si no hay credenciales, así el `vitest run` normal
 * (y CI) sigue verde sin tocar la red.
 *
 * Cómo correrlo (con una cuenta de Cal.com de prueba):
 *   CAL_API_KEY=cal_live_xxx CAL_EVENT_TYPE_ID=123456 npx vitest run lib/cal/client.e2e.test.ts
 *
 * Para crear una RESERVA real (efecto secundario), añade CAL_BOOK=1:
 *   CAL_API_KEY=... CAL_EVENT_TYPE_ID=... CAL_BOOK=1 CAL_EMAIL=tu@correo.com \
 *     npx vitest run lib/cal/client.e2e.test.ts
 */

const API_KEY = process.env.CAL_API_KEY;
const EVENT_TYPE_ID = process.env.CAL_EVENT_TYPE_ID;
const sinCreds = !API_KEY || !EVENT_TYPE_ID;

describe.skipIf(sinCreds)("Cal.com E2E (real)", () => {
  it("obtenerHuecos responde sin error y devuelve una lista", async () => {
    const huecos = await obtenerHuecos(API_KEY!, EVENT_TYPE_ID!, { limite: 6 });
    expect(Array.isArray(huecos)).toBe(true);
    if (huecos.length === 0) {
      console.warn(
        "[cal-e2e] La API respondió OK pero no hay huecos libres en los próximos días.",
      );
    } else {
      // Deben ser fechas ISO válidas.
      for (const iso of huecos) {
        expect(Number.isNaN(new Date(iso).getTime())).toBe(false);
      }
      console.info("[cal-e2e] Próximos huecos:", huecos);
    }
  });

  it.runIf(process.env.CAL_BOOK === "1")(
    "crearReserva crea una reserva real en el primer hueco libre",
    async () => {
      const huecos = await obtenerHuecos(API_KEY!, EVENT_TYPE_ID!, { limite: 1 });
      expect(huecos.length).toBeGreaterThan(0);
      const start = huecos[0]!;
      const reserva = await crearReserva(API_KEY!, EVENT_TYPE_ID!, {
        start,
        nombre: "Prueba Curro E2E",
        email: process.env.CAL_EMAIL ?? "prueba+curro@example.com",
        notas: "Reserva de prueba automática (E2E). Se puede cancelar.",
      });
      expect(reserva.uid).toBeTruthy();
      console.info("[cal-e2e] Reserva creada:", reserva);
    },
  );
});
