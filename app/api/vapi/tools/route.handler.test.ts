import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/**
 * Test de integración del handler POST de /api/vapi/tools (el flujo que Vapi
 * dispara durante la llamada). Mockea Cal.com y Supabase para ejercitar el
 * cableado real: resolución de negocio por assistantId, forma de la respuesta que
 * Vapi espera (`{ results: [{ toolCallId, result }] }`), consultarHuecos,
 * agendarVisita, plan B y herramienta desconocida. Sin red ni credenciales.
 */

// env: sin secreto de webhook (auth se salta), Supabase "listo", sin Upstash.
vi.mock("@/lib/env", () => ({
  env: {
    VAPI_WEBHOOK_SECRET: undefined,
    isProd: false,
    NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "service-role",
    UPSTASH_REDIS_REST_URL: undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined,
  },
}));

// admin.from("businesses").select("id").eq(...).maybeSingle() → negocio encontrado.
const adminStub = {
  from: () => ({
    select: () => ({
      eq: () => ({ maybeSingle: async () => ({ data: { id: "biz-1" } }) }),
    }),
  }),
};
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => adminStub,
}));

const getCalIntegracion = vi.fn(async () => ({
  cal_api_key: "cal_test_key",
  cal_event_type_id: "42",
}));
vi.mock("@/lib/cal/integracion", () => ({
  getCalIntegracion: (...args: unknown[]) => getCalIntegracion(...(args as [])),
}));

const obtenerHuecos = vi.fn(async () => [
  "2026-07-16T08:00:00.000Z",
  "2026-07-16T09:00:00.000Z",
]);
const crearReserva = vi.fn(async () => ({ uid: "bk_1", start: "2026-07-16T08:00:00.000Z" }));
vi.mock("@/lib/cal/client", () => ({
  obtenerHuecos: (...a: unknown[]) => obtenerHuecos(...(a as [])),
  crearReserva: (...a: unknown[]) => crearReserva(...(a as [])),
}));

import { POST } from "@/app/api/vapi/tools/route";

function post(message: Record<string, unknown>): NextRequest {
  return new NextRequest("https://curro.test/api/vapi/tools", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

const callInfo = {
  call: { assistantId: "asst_123", customer: { number: "+34600111222" } },
};

beforeEach(() => {
  obtenerHuecos.mockClear();
  crearReserva.mockClear();
  getCalIntegracion.mockClear();
  getCalIntegracion.mockResolvedValue({
    cal_api_key: "cal_test_key",
    cal_event_type_id: "42",
  });
});

describe("POST /api/vapi/tools", () => {
  it("consultarHuecos devuelve huecos formateados para el assistant", async () => {
    const res = await POST(
      post({
        ...callInfo,
        toolCallList: [
          { id: "tc1", function: { name: "consultarHuecos", arguments: { dias: 7 } } },
        ],
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { results: { toolCallId: string; result: string }[] };
    expect(obtenerHuecos).toHaveBeenCalledTimes(1);
    expect(json.results).toHaveLength(1);
    expect(json.results[0]!.toolCallId).toBe("tc1");
    // Incluye el ISO exacto (para reusarlo al agendar) y la fecha humana.
    expect(json.results[0]!.result).toContain("2026-07-16T08:00:00.000Z");
    expect(json.results[0]!.result).toContain("10:00"); // Madrid = +2 en julio
  });

  it("agendarVisita crea la reserva y confirma", async () => {
    const res = await POST(
      post({
        ...callInfo,
        toolCallList: [
          {
            id: "tc2",
            function: {
              name: "agendarVisita",
              arguments: {
                fecha_hora: "2026-07-16T08:00:00.000Z",
                nombre: "Ana",
                email: "ana@example.com",
              },
            },
          },
        ],
      }),
    );
    const json = (await res.json()) as { results: { result: string }[] };
    expect(crearReserva).toHaveBeenCalledTimes(1);
    // Hereda el teléfono del cliente de la llamada si no viene en los args.
    const [, , datos] = crearReserva.mock.calls[0] as unknown as [
      string,
      string,
      { telefono?: string | null; nombre: string },
    ];
    expect(datos.telefono).toBe("+34600111222");
    expect(datos.nombre).toBe("Ana");
    expect(json.results[0]!.result).toContain("Visita confirmada");
  });

  it("agendarVisita sin email pide los datos y NO reserva", async () => {
    const res = await POST(
      post({
        ...callInfo,
        toolCallList: [
          {
            id: "tc3",
            function: { name: "agendarVisita", arguments: { nombre: "Ana" } },
          },
        ],
      }),
    );
    const json = (await res.json()) as { results: { result: string }[] };
    expect(crearReserva).not.toHaveBeenCalled();
    expect(json.results[0]!.result).toContain("Faltan datos");
  });

  it("plan B si el negocio no tiene Cal.com conectado", async () => {
    getCalIntegracion.mockResolvedValueOnce(null as never);
    const res = await POST(
      post({
        ...callInfo,
        toolCallList: [
          { id: "tc4", function: { name: "consultarHuecos", arguments: {} } },
        ],
      }),
    );
    const json = (await res.json()) as { results: { result: string }[] };
    expect(obtenerHuecos).not.toHaveBeenCalled();
    expect(json.results[0]!.result).toContain("técnico le llamará");
  });

  it("herramienta desconocida se responde sin romper", async () => {
    const res = await POST(
      post({
        ...callInfo,
        toolCallList: [{ id: "tc5", function: { name: "otraCosa", arguments: {} } }],
      }),
    );
    const json = (await res.json()) as { results: { result: string }[] };
    expect(json.results[0]!.result).toContain("Herramienta desconocida");
  });

  it("sin tool calls devuelve results vacío", async () => {
    const res = await POST(post({ ...callInfo }));
    const json = (await res.json()) as { results: unknown[] };
    expect(json.results).toEqual([]);
  });
});
