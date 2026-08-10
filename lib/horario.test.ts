import { describe, it, expect } from "vitest";
import {
  enHorarioAtencion,
  decidirEnrutado,
  respuestaVapi,
  parseHorarioAtencion,
  normalizarE164,
  PRESETS_HORARIO,
  type HorarioAtencion,
} from "@/lib/horario";

// L–V 07:00–18:00, sábado y domingo cerrado (el dueño no atiende → Curro).
const LV_7_18: HorarioAtencion = {
  tz: "Europe/Madrid",
  dias: {
    lun: [["07:00", "18:00"]],
    mar: [["07:00", "18:00"]],
    mie: [["07:00", "18:00"]],
    jue: [["07:00", "18:00"]],
    vie: [["07:00", "18:00"]],
    sab: [],
    dom: [],
  },
};

/**
 * Construye un instante que, EN Europe/Madrid, cae en el día/hora indicados.
 * Usamos fechas de julio (CEST, UTC+2) y enero (CET, UTC+1) para probar la tz.
 * Referencia: 2024-07-01 es lunes; 2024-07-06 sábado; 2024-07-07 domingo.
 */
describe("enHorarioAtencion", () => {
  it("dentro de horario un martes a las 10:00 (Madrid) → true", () => {
    // 2024-07-02 08:00 UTC = 10:00 CEST (martes).
    expect(enHorarioAtencion(LV_7_18, new Date("2024-07-02T08:00:00Z"))).toBe(true);
  });

  it("justo en el borde de apertura 07:00 → true (inicio inclusivo)", () => {
    // 05:00 UTC = 07:00 CEST (lunes).
    expect(enHorarioAtencion(LV_7_18, new Date("2024-07-01T05:00:00Z"))).toBe(true);
  });

  it("justo en el borde de cierre 18:00 → false (fin exclusivo)", () => {
    // 16:00 UTC = 18:00 CEST (lunes).
    expect(enHorarioAtencion(LV_7_18, new Date("2024-07-01T16:00:00Z"))).toBe(false);
  });

  it("por la tarde/noche (20:00 Madrid) → false (atiende Curro)", () => {
    // 18:00 UTC = 20:00 CEST (lunes).
    expect(enHorarioAtencion(LV_7_18, new Date("2024-07-01T18:00:00Z"))).toBe(false);
  });

  it("de madrugada (06:00 Madrid) → false", () => {
    // 04:00 UTC = 06:00 CEST (lunes).
    expect(enHorarioAtencion(LV_7_18, new Date("2024-07-01T04:00:00Z"))).toBe(false);
  });

  it("fin de semana (sábado 11:00 Madrid) → false", () => {
    // 2024-07-06 09:00 UTC = 11:00 CEST (sábado).
    expect(enHorarioAtencion(LV_7_18, new Date("2024-07-06T09:00:00Z"))).toBe(false);
  });

  it("respeta la tz del horario, no la del servidor (invierno CET)", () => {
    // 2024-01-02 (martes). 08:00 UTC = 09:00 CET → dentro; 06:30 UTC = 07:30 → dentro.
    expect(enHorarioAtencion(LV_7_18, new Date("2024-01-02T08:00:00Z"))).toBe(true);
    // 05:30 UTC = 06:30 CET → fuera.
    expect(enHorarioAtencion(LV_7_18, new Date("2024-01-02T05:30:00Z"))).toBe(false);
  });

  it("horario null → false (Curro atiende 24/7)", () => {
    expect(enHorarioAtencion(null, new Date("2024-07-02T08:00:00Z"))).toBe(false);
    expect(enHorarioAtencion(undefined, new Date("2024-07-02T08:00:00Z"))).toBe(false);
  });

  it("horario con días vacíos → false", () => {
    expect(
      enHorarioAtencion({ tz: "Europe/Madrid", dias: {} }, new Date("2024-07-02T08:00:00Z")),
    ).toBe(false);
  });

  it("soporta varias franjas el mismo día (mañana y tarde)", () => {
    const partido: HorarioAtencion = {
      tz: "Europe/Madrid",
      dias: { mar: [["09:00", "14:00"], ["16:00", "20:00"]] },
    };
    // 12:00 UTC = 14:00 CEST → fin exclusivo de la 1ª franja, aún fuera de la 2ª → false.
    expect(enHorarioAtencion(partido, new Date("2024-07-02T12:00:00Z"))).toBe(false);
    // 15:00 UTC = 17:00 CEST → dentro de la 2ª franja → true.
    expect(enHorarioAtencion(partido, new Date("2024-07-02T15:00:00Z"))).toBe(true);
  });

  it("soporta rangos que cruzan medianoche (22:00–06:00)", () => {
    const noche: HorarioAtencion = {
      tz: "Europe/Madrid",
      dias: { lun: [["22:00", "06:00"]] },
    };
    // 21:00 UTC = 23:00 CEST (lunes) → dentro.
    expect(enHorarioAtencion(noche, new Date("2024-07-01T21:00:00Z"))).toBe(true);
  });
});

describe("normalizarE164", () => {
  it("acepta un número E.164 limpio", () => {
    expect(normalizarE164("+34600111222")).toBe("+34600111222");
  });
  it("quita espacios y guiones", () => {
    expect(normalizarE164("+34 600 111 222")).toBe("+34600111222");
    expect(normalizarE164("+34-600-111-222")).toBe("+34600111222");
  });
  it("rechaza números sin + o mal formados", () => {
    expect(normalizarE164("600111222")).toBeNull();
    expect(normalizarE164("")).toBeNull();
    expect(normalizarE164(null)).toBeNull();
    expect(normalizarE164("+abc")).toBeNull();
  });
});

describe("parseHorarioAtencion", () => {
  it("parsea un JSON válido y normaliza", () => {
    const h = parseHorarioAtencion(JSON.stringify(LV_7_18));
    expect(h).not.toBeNull();
    expect(h!.tz).toBe("Europe/Madrid");
    expect(h!.dias.lun).toEqual([["07:00", "18:00"]]);
    // Los días vacíos no se conservan (no aportan nada).
    expect(h!.dias.sab).toBeUndefined();
  });

  it("acepta un objeto (no solo string)", () => {
    expect(parseHorarioAtencion(LV_7_18)).not.toBeNull();
  });

  it("vacío / inválido / sin franjas → null (Curro 24/7)", () => {
    expect(parseHorarioAtencion("")).toBeNull();
    expect(parseHorarioAtencion(null)).toBeNull();
    expect(parseHorarioAtencion("no-es-json")).toBeNull();
    expect(parseHorarioAtencion({ tz: "Europe/Madrid", dias: {} })).toBeNull();
    expect(parseHorarioAtencion({ tz: "Europe/Madrid", dias: { lun: [] } })).toBeNull();
  });

  it("descarta franjas mal formadas pero conserva las válidas", () => {
    const h = parseHorarioAtencion({
      dias: { lun: [["07:00", "18:00"], ["mal", "18:00"], ["10:00", "10:00"]] },
    });
    expect(h!.dias.lun).toEqual([["07:00", "18:00"]]);
    expect(h!.tz).toBe("Europe/Madrid"); // tz por defecto si falta
  });

  it("los presets son parseables y coherentes", () => {
    for (const { horario } of Object.values(PRESETS_HORARIO)) {
      expect(parseHorarioAtencion(horario)).not.toBeNull();
    }
  });
});

describe("decidirEnrutado", () => {
  const dentro = new Date("2024-07-02T08:00:00Z"); // martes 10:00 Madrid
  const fuera = new Date("2024-07-02T18:00:00Z"); // martes 20:00 Madrid

  it("dentro de horario y con móvil → transferir al dueño", () => {
    const d = decidirEnrutado(
      { vapi_assistant_id: "asst_1", telefono_agente: "+34600111222", horario_atencion: LV_7_18 },
      dentro,
    );
    expect(d).toEqual({ tipo: "transfer", numero: "+34600111222" });
  });

  it("fuera de horario → Curro (assistant)", () => {
    const d = decidirEnrutado(
      { vapi_assistant_id: "asst_1", telefono_agente: "+34600111222", horario_atencion: LV_7_18 },
      fuera,
    );
    expect(d).toEqual({ tipo: "assistant", assistantId: "asst_1" });
  });

  it("dentro de horario pero SIN móvil → Curro (assistant)", () => {
    const d = decidirEnrutado(
      { vapi_assistant_id: "asst_1", telefono_agente: null, horario_atencion: LV_7_18 },
      dentro,
    );
    expect(d).toEqual({ tipo: "assistant", assistantId: "asst_1" });
  });

  it("sin horario (24/7 Curro) → assistant aunque haya móvil", () => {
    const d = decidirEnrutado(
      { vapi_assistant_id: "asst_1", telefono_agente: "+34600111222", horario_atencion: null },
      dentro,
    );
    expect(d).toEqual({ tipo: "assistant", assistantId: "asst_1" });
  });

  it("móvil mal formado → no transfiere, atiende Curro", () => {
    const d = decidirEnrutado(
      { vapi_assistant_id: "asst_1", telefono_agente: "600111222", horario_atencion: LV_7_18 },
      dentro,
    );
    expect(d).toEqual({ tipo: "assistant", assistantId: "asst_1" });
  });

  it("sin assistant y fuera de horario → error", () => {
    const d = decidirEnrutado(
      { vapi_assistant_id: null, telefono_agente: null, horario_atencion: null },
      fuera,
    );
    expect(d.tipo).toBe("error");
  });
});

describe("respuestaVapi", () => {
  it("transfer → destination number", () => {
    expect(respuestaVapi({ tipo: "transfer", numero: "+34600111222" })).toEqual({
      destination: { type: "number", number: "+34600111222" },
    });
  });
  it("assistant → assistantId", () => {
    expect(respuestaVapi({ tipo: "assistant", assistantId: "asst_1" })).toEqual({
      assistantId: "asst_1",
    });
  });
  it("error → error", () => {
    expect(respuestaVapi({ tipo: "error", motivo: "x" })).toEqual({ error: "x" });
  });
});
