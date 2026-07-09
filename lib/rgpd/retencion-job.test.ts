import { describe, it, expect, vi, beforeEach } from "vitest";

const borrarGrabacionVapi = vi.fn(async () => ({
  modo: "mock" as const,
  borrada: true,
  status: null,
}));
vi.mock("@/lib/vapi/grabaciones", () => ({
  borrarGrabacionVapi: (...a: unknown[]) => borrarGrabacionVapi(...(a as [])),
}));

import { cortesRetencion, ejecutarRetencion } from "@/lib/rgpd/retencion-job";
import { fechaCorte } from "@/lib/rgpd/retencion";

const ahora = new Date("2026-07-09T03:00:00.000Z");

describe("cortesRetencion (selección de vencidos)", () => {
  it("calcula un corte por categoría, coincidiendo con fechaCorte", () => {
    const c = cortesRetencion(ahora);
    expect(c.audioCorteISO).toBe(fechaCorte("audio", ahora).toISOString());
    expect(c.transcripcionCorteISO).toBe(
      fechaCorte("transcripcion", ahora).toISOString(),
    );
    expect(c.rawPayloadCorteISO).toBe(
      fechaCorte("raw_payload", ahora).toISOString(),
    );
  });

  it("el corte de transcripción es más antiguo que el de audio (12m > 30d)", () => {
    const c = cortesRetencion(ahora);
    expect(new Date(c.transcripcionCorteISO).getTime()).toBeLessThan(
      new Date(c.audioCorteISO).getTime(),
    );
  });
});

/**
 * Stub del admin: registra las consultas para verificar que se filtran por el
 * corte correcto, y devuelve filas configurables. Encadena select().not().lt(),
 * select().lt().or(), select().in(), update().in().
 */
function makeAdminStub(rows: {
  leadsAudio: { id: string }[];
  leadsTranscripcion: { id: string }[];
  callEvents: { vapi_call_id: string | null }[];
  callEventsRaw: { id: string }[];
}) {
  const consultas: { tabla: string; lt?: string; op: string }[] = [];
  const updates: { tabla: string; campos: Record<string, unknown> }[] = [];

  function selectResult(tabla: string, kind: "audio" | "transcripcion" | "raw" | "events") {
    // objeto "thenable" que resuelve a { data } y admite encadenar filtros.
    const chain: Record<string, unknown> = {};
    const resolveData = () => {
      if (kind === "audio") return rows.leadsAudio;
      if (kind === "transcripcion") return rows.leadsTranscripcion;
      if (kind === "raw") return rows.callEventsRaw;
      return rows.callEvents;
    };
    chain.not = () => chain;
    chain.or = () => chain;
    chain.in = () => chain;
    chain.lt = (_col: string, val: string) => {
      consultas.push({ tabla, lt: val, op: kind });
      return chain;
    };
    chain.then = (resolve: (r: { data: unknown }) => void) =>
      resolve({ data: resolveData() });
    return chain;
  }

  const admin = {
    from(tabla: string) {
      return {
        select(_cols: string) {
          if (tabla === "leads") {
            // Distinguimos audio vs transcripción por el filtro que se aplique.
            // El de audio usa .not("audio_url"...); el de transcripción usa .or(...).
            // Devolvemos un chain que decide por el primer filtro llamado.
            let kind: "audio" | "transcripcion" = "transcripcion";
            const chain: Record<string, unknown> = {};
            const resolveData = () =>
              kind === "audio" ? rows.leadsAudio : rows.leadsTranscripcion;
            chain.not = () => {
              kind = "audio";
              return chain;
            };
            chain.or = () => {
              kind = "transcripcion";
              return chain;
            };
            chain.in = () => chain;
            chain.lt = (_c: string, val: string) => {
              consultas.push({ tabla, lt: val, op: kind });
              return chain;
            };
            chain.then = (resolve: (r: { data: unknown }) => void) =>
              resolve({ data: resolveData() });
            return chain;
          }
          if (tabla === "call_events") {
            // Dos usos: select("vapi_call_id").in(...) y select("id").not(raw).lt(...)
            const chain: Record<string, unknown> = {};
            let kind: "events" | "raw" = "events";
            chain.not = () => {
              kind = "raw";
              return chain;
            };
            chain.in = () => chain;
            chain.lt = (_c: string, val: string) => {
              consultas.push({ tabla, lt: val, op: kind });
              return chain;
            };
            chain.then = (resolve: (r: { data: unknown }) => void) =>
              resolve({ data: kind === "raw" ? rows.callEventsRaw : rows.callEvents });
            return chain;
          }
          return selectResult(tabla, "events");
        },
        update(campos: Record<string, unknown>) {
          updates.push({ tabla, campos });
          return { in: () => Promise.resolve({ error: null }) };
        },
      };
    },
  };

  return { admin: admin as never, consultas, updates };
}

describe("ejecutarRetencion", () => {
  beforeEach(() => borrarGrabacionVapi.mockClear());

  it("borra audio vencido, anonimiza leads y purga raw_payload", async () => {
    const { admin, updates } = makeAdminStub({
      leadsAudio: [{ id: "lead-a" }],
      leadsTranscripcion: [{ id: "lead-t1" }, { id: "lead-t2" }],
      callEvents: [{ vapi_call_id: "call_1" }],
      callEventsRaw: [{ id: "ev-1" }, { id: "ev-2" }, { id: "ev-3" }],
    });

    const res = await ejecutarRetencion(admin, ahora);

    expect(res.audioBorrados).toBe(1);
    expect(res.leadsAnonimizados).toBe(2);
    expect(res.rawPayloadPurgados).toBe(3);

    // Borra la grabación del call_event asociado al audio vencido.
    expect(borrarGrabacionVapi).toHaveBeenCalledWith("call_1");

    // Anonimiza: el update de leads borra la PII.
    const anon = updates.find(
      (u) => u.tabla === "leads" && "cliente_telefono" in u.campos,
    );
    expect(anon?.campos.cliente_nombre).toBeNull();
    expect(anon?.campos.transcripcion).toBeNull();

    // Purga raw_payload de call_events.
    const purga = updates.find(
      (u) => u.tabla === "call_events" && "raw_payload" in u.campos,
    );
    expect(purga?.campos.raw_payload).toBeNull();
  });

  it("no hace updates ni llama a Vapi si no hay vencidos", async () => {
    const { admin, updates } = makeAdminStub({
      leadsAudio: [],
      leadsTranscripcion: [],
      callEvents: [],
      callEventsRaw: [],
    });

    const res = await ejecutarRetencion(admin, ahora);
    expect(res).toEqual({
      audioBorrados: 0,
      leadsAnonimizados: 0,
      rawPayloadPurgados: 0,
    });
    expect(updates).toHaveLength(0);
    expect(borrarGrabacionVapi).not.toHaveBeenCalled();
  });
});
