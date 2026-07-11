import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Lead } from "@/lib/types";

// --- Mocks de las dependencias de la ruta -----------------------------------
// getLeadById es el guardián del aislamiento por negocio: lo controlamos aquí.
const getLeadById = vi.fn<(id: string) => Promise<Lead | null>>();
vi.mock("@/lib/leads", () => ({ getLeadById: (id: string) => getLeadById(id) }));

// No demo: forzamos el camino "real" (call_events por Supabase).
vi.mock("@/lib/demo", () => ({ isDemoMode: () => false }));

// urlFirmadaGrabacion: no debe llegar a la red en estos tests.
const urlFirmadaGrabacion =
  vi.fn<(callId: string | null | undefined) => Promise<string | null>>();
vi.mock("@/lib/vapi/grabaciones", () => ({
  urlFirmadaGrabacion: (id: string | null | undefined) =>
    urlFirmadaGrabacion(id),
}));

// Cliente Supabase falso: encadenable, devuelve el call_event que le fijemos.
let callEventRow: { vapi_call_id: string | null } | null = null;
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => {
    const builder: Record<string, unknown> = {};
    for (const m of ["from", "select", "eq", "not", "order", "limit"]) {
      builder[m] = vi.fn(() => builder);
    }
    builder.maybeSingle = vi.fn(async () => ({ data: callEventRow }));
    return builder;
  },
}));

import { GET } from "@/app/api/grabacion/[leadId]/route";

function req() {
  return new Request("http://localhost/api/grabacion/x") as never;
}
function ctx(leadId: string) {
  return { params: Promise.resolve({ leadId }) };
}

const leadPropio: Lead = {
  id: "lead-propio",
  business_id: "negocio-A",
  cliente_nombre: "Cliente",
  cliente_telefono: null,
  tipo_trabajo: null,
  zona: null,
  urgencia: false,
  estado: "nuevo",
  transcripcion: null,
  audio_url: "https://legacy.vapi/publica.wav",
  source: "vapi",
  created_at: "2026-07-01T10:00:00.000Z",
  updated_at: "2026-07-01T10:00:00.000Z",
};

beforeEach(() => {
  getLeadById.mockReset();
  urlFirmadaGrabacion.mockReset();
  callEventRow = null;
});

describe("GET /api/grabacion/[leadId] — aislamiento por negocio", () => {
  it("lead de OTRO negocio (getLeadById → null) responde 404 y no llama a Vapi", async () => {
    // getLeadById está scopeado al negocio del usuario: para un lead ajeno da null.
    getLeadById.mockResolvedValue(null);

    const res = await GET(req(), ctx("lead-de-otro-negocio"));

    expect(res.status).toBe(404);
    expect(getLeadById).toHaveBeenCalledWith("lead-de-otro-negocio");
    // Nunca se intenta obtener la URL firmada de un lead que no es del usuario.
    expect(urlFirmadaGrabacion).not.toHaveBeenCalled();
  });

  it("lead propio con grabación redirige (302) a la URL firmada", async () => {
    getLeadById.mockResolvedValue(leadPropio);
    callEventRow = { vapi_call_id: "call_real_123" };
    urlFirmadaGrabacion.mockResolvedValue(
      "https://storage.vapi.ai/rec.wav?sig=xyz",
    );

    const res = await GET(req(), ctx("lead-propio"));

    expect(urlFirmadaGrabacion).toHaveBeenCalledWith("call_real_123");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(
      "https://storage.vapi.ai/rec.wav?sig=xyz",
    );
  });

  it("lead propio sin call_id responde 404 y no llama a Vapi", async () => {
    getLeadById.mockResolvedValue(leadPropio);
    callEventRow = null; // no hay call_event con vapi_call_id

    const res = await GET(req(), ctx("lead-propio"));

    expect(res.status).toBe(404);
    expect(urlFirmadaGrabacion).not.toHaveBeenCalled();
  });

  it("lead propio sin audio_url responde 404 (no hay grabación)", async () => {
    getLeadById.mockResolvedValue({ ...leadPropio, audio_url: null });

    const res = await GET(req(), ctx("lead-propio"));

    expect(res.status).toBe(404);
    expect(urlFirmadaGrabacion).not.toHaveBeenCalled();
  });
});
