import { describe, it, expect } from "vitest";
import { parseEndOfCallReport, normalizeUrgencia } from "@/lib/vapi/parser";

// Payload realista de un "end-of-call-report" de Vapi.
// Nota: el teléfono NO viene en structuredData a propósito, para probar el
// fallback al CallerID (call.customer.number).
const payloadReal = {
  message: {
    type: "end-of-call-report",
    endedReason: "customer-ended-call",
    cost: 0.0873,
    durationSeconds: 96.4,
    startedAt: "2026-06-30T18:24:01.000Z",
    endedAt: "2026-06-30T18:25:37.000Z",
    recordingUrl: "https://storage.vapi.ai/rec/abc.wav",
    call: {
      id: "call_9f8a1b2c3d",
      assistantId: "asst_demo_reformas_garcia",
      customer: { number: "+34611111111" },
      phoneNumber: { number: "+34910000000" },
    },
    artifact: {
      transcript:
        "AI: Reformas García, le atiende Curro, su asistente virtual. Esta llamada se graba.\nUser: Hola, quiero reformar el baño entero.\nAI: ¿En qué zona y para cuándo?\nUser: En Chamberí, y me corre prisa por unas humedades.",
      recordingUrl: "https://storage.vapi.ai/rec/abc.wav",
    },
    analysis: {
      summary:
        "Cliente quiere reforma de baño completo en Chamberí, urgente por humedades.",
      structuredData: {
        cliente_nombre: "María López",
        tipo_trabajo: "Reforma de baño completo",
        zona: "Chamberí, Madrid",
        urgencia: true,
      },
    },
  },
};

describe("parseEndOfCallReport", () => {
  it("extrae los datos estructurados del lead", () => {
    const r = parseEndOfCallReport(payloadReal);
    expect(r).not.toBeNull();
    expect(r!.lead).toEqual({
      cliente_nombre: "María López",
      cliente_telefono: "+34611111111", // fallback al CallerID
      tipo_trabajo: "Reforma de baño completo",
      zona: "Chamberí, Madrid",
      urgencia: true,
    });
  });

  it("extrae identificadores, transcripción, audio y métricas", () => {
    const r = parseEndOfCallReport(payloadReal)!;
    expect(r.vapiCallId).toBe("call_9f8a1b2c3d");
    expect(r.assistantId).toBe("asst_demo_reformas_garcia");
    expect(r.calledNumber).toBe("+34910000000");
    expect(r.audioUrl).toBe("https://storage.vapi.ai/rec/abc.wav");
    expect(r.resumen).toContain("Chamberí");
    expect(r.transcripcion).toContain("asistente virtual");
    expect(r.duracionSeg).toBe(96); // redondeado
    expect(r.costeEstimado).toBeCloseTo(0.0873);
  });

  it("ignora mensajes que no son end-of-call-report", () => {
    expect(
      parseEndOfCallReport({ message: { type: "status-update" } }),
    ).toBeNull();
    expect(parseEndOfCallReport({})).toBeNull();
    expect(parseEndOfCallReport(null)).toBeNull();
  });

  it("calcula la duración desde startedAt/endedAt si falta durationSeconds", () => {
    const p = structuredClone(payloadReal) as { message: Record<string, unknown> };
    delete p.message.durationSeconds;
    const r = parseEndOfCallReport(p)!;
    expect(r.duracionSeg).toBe(96); // 18:25:37 - 18:24:01 = 96 s
  });

  it("es tolerante si no hay analysis ni structuredData", () => {
    const r = parseEndOfCallReport({
      message: {
        type: "end-of-call-report",
        call: { id: "call_x", customer: { number: "+34622222222" } },
      },
    })!;
    expect(r.lead.cliente_telefono).toBe("+34622222222");
    expect(r.lead.cliente_nombre).toBeNull();
    expect(r.lead.urgencia).toBe(false);
    expect(r.vapiCallId).toBe("call_x");
  });

  it("lee Structured Outputs nuevos (artifact.structuredOutputs indexado por id)", () => {
    const r = parseEndOfCallReport({
      message: {
        type: "end-of-call-report",
        call: { id: "c_so", customer: { number: "+34600123456" } },
        artifact: {
          transcript: "…",
          structuredOutputs: {
            "40992d8a-a64e-4d0f-9abc-000000000000": {
              cliente_nombre: "Ana Torres",
              cliente_telefono: "600123456",
              tipo_trabajo: "Cambio de ventanas",
              zona: "Chamberí",
              urgencia: true,
            },
          },
        },
      },
    })!;
    expect(r.lead).toEqual({
      cliente_nombre: "Ana Torres",
      cliente_telefono: "600123456",
      tipo_trabajo: "Cambio de ventanas",
      zona: "Chamberí",
      urgencia: true,
    });
  });

  it("lee Structured Outputs envueltos en result", () => {
    const r = parseEndOfCallReport({
      message: {
        type: "end-of-call-report",
        call: { id: "c_so2", customer: { number: "+34611000000" } },
        artifact: {
          structuredOutputs: {
            out1: { result: { tipo_trabajo: "Reforma de cocina", urgencia: false } },
          },
        },
      },
    })!;
    expect(r.lead.tipo_trabajo).toBe("Reforma de cocina");
    expect(r.lead.urgencia).toBe(false);
    expect(r.lead.cliente_telefono).toBe("+34611000000");
  });

  it("acepta nombres de campo alternativos (nombre, trabajo, ubicacion)", () => {
    const r = parseEndOfCallReport({
      message: {
        type: "end-of-call-report",
        call: { id: "c1" },
        analysis: {
          structuredData: {
            nombre: "Pedro Ruiz",
            trabajo: "Pintura de piso",
            ubicacion: "Tetuán",
            urgencia: "no",
          },
        },
      },
    })!;
    expect(r.lead.cliente_nombre).toBe("Pedro Ruiz");
    expect(r.lead.tipo_trabajo).toBe("Pintura de piso");
    expect(r.lead.zona).toBe("Tetuán");
    expect(r.lead.urgencia).toBe(false);
  });
});

describe("normalizeUrgencia", () => {
  it("interpreta booleanos, números y texto en español", () => {
    for (const v of [true, 1, "sí", "si", "true", "ALTA", "urgente"]) {
      expect(normalizeUrgencia(v)).toBe(true);
    }
    for (const v of [false, 0, "no", "false", "baja", "normal", ""]) {
      expect(normalizeUrgencia(v)).toBe(false);
    }
    expect(normalizeUrgencia(undefined)).toBe(false);
  });
});
