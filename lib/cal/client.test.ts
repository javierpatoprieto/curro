import { describe, it, expect, vi, afterEach } from "vitest";
import { extraerStarts, crearReserva } from "@/lib/cal/client";

describe("extraerStarts", () => {
  it("aplana huecos agrupados por fecha bajo data", () => {
    const json = {
      status: "success",
      data: {
        "2025-07-16": [{ start: "2025-07-16T08:00:00.000Z" }, { start: "2025-07-16T09:00:00.000Z" }],
        "2025-07-17": [{ start: "2025-07-17T07:00:00.000Z" }],
      },
    };
    expect(extraerStarts(json)).toEqual([
      "2025-07-16T08:00:00.000Z",
      "2025-07-16T09:00:00.000Z",
      "2025-07-17T07:00:00.000Z",
    ]);
  });

  it("admite la variante envuelta en data.slots", () => {
    const json = {
      data: { slots: { "2025-07-16": [{ start: "2025-07-16T10:00:00.000Z" }] } },
    };
    expect(extraerStarts(json)).toEqual(["2025-07-16T10:00:00.000Z"]);
  });

  it("ignora entradas que no son arrays o sin start", () => {
    const json = { data: { "2025-07-16": [{ foo: 1 }], meta: 3 } };
    expect(extraerStarts(json)).toEqual([]);
  });

  it("devuelve [] ante formas vacías o inesperadas", () => {
    expect(extraerStarts(null)).toEqual([]);
    expect(extraerStarts({})).toEqual([]);
    expect(extraerStarts({ data: null })).toEqual([]);
  });
});

describe("crearReserva (cabeceras y auth)", () => {
  afterEach(() => vi.restoreAllMocks());

  it("autentica con ?apiKey= en la URL y SIN cabecera Authorization", async () => {
    // Regresión: mandar la API key como `Authorization: Bearer` en /bookings
    // provoca 401 "Invalid Access Token" (guard de token). La key debe ir como
    // query param ?apiKey= y sin cabecera Authorization. Verificado contra Cal.
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { uid: "bk_1", start: "2026-07-06T08:00:00.000Z" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const reserva = await crearReserva("cal_live_test", "42", {
      start: "2026-07-06T08:00:00.000Z",
      nombre: "Ana",
      email: "ana@example.com",
    });
    expect(reserva.uid).toBe("bk_1");

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe(
      "https://api.cal.com/v2/bookings?apiKey=cal_live_test",
    );
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers["cal-api-version"]).toBe("2024-08-13");
    expect(headers.Authorization).toBeUndefined();
  });
});
