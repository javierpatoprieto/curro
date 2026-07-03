import { describe, it, expect } from "vitest";
import {
  guion,
  buildAssistantConfig,
  herramientasCal,
} from "@/lib/vapi/assistant";

describe("guion", () => {
  it("incluye negocio, ciudad, tono y el aviso legal", () => {
    const g = guion({
      negocio: "Reformas García",
      ciudad: "Madrid",
      tono: "comercial",
    });
    expect(g).toContain("Reformas García");
    expect(g).toContain("en Madrid");
    expect(g).toContain("comercial");
    expect(g).toContain("la llamada se graba");
  });

  it("incorpora servicios, zonas, horario, preguntas y conocimiento", () => {
    const g = guion({
      negocio: "X",
      servicios: "baños y cocinas",
      zonas: "Chamberí",
      horario: "L-V 9-18",
      preguntas_clave: "¿metros?",
      conocimiento: "garantía de 2 años",
    });
    expect(g).toContain("baños y cocinas");
    expect(g).toContain("Chamberí");
    expect(g).toContain("L-V 9-18");
    expect(g).toContain("¿metros?");
    expect(g).toContain("garantía de 2 años");
  });

  it("omite las secciones que no se rellenan", () => {
    const g = guion({ negocio: "X" });
    expect(g).not.toContain("Zonas que cubre");
    expect(g).not.toContain("Base de conocimiento");
  });

  it("usa la actividad indicada (tipo de empresa) o el valor por defecto", () => {
    expect(guion({ negocio: "X", actividad: "fontanería" })).toContain(
      "una empresa de fontanería",
    );
    expect(guion({ negocio: "X" })).toContain(
      "una empresa de reformas y multiservicios del hogar",
    );
  });

  it("añade el bloque de agendado solo cuando Cal.com está conectado", () => {
    expect(guion({ negocio: "X" })).not.toContain("consultarHuecos");
    const g = guion({ negocio: "X", calConectado: true });
    expect(g).toContain("consultarHuecos");
    expect(g).toContain("agendarVisita");
    expect(g).toContain("plan B");
  });

  it("SIN Cal: pide el teléfono activamente y enfoca en devolver la llamada, sin agendar", () => {
    const g = guion({ negocio: "Reformas García" });
    expect(g).toContain("Pídele SIEMPRE su número de teléfono");
    expect(g).toContain("Reformas García le devuelva la llamada");
    expect(g).not.toContain("agendar una visita");
    expect(g).not.toContain("si no, no insistas"); // no queda la regla pasiva
  });

  it("CON Cal: mantiene el agendado y el teléfono como opcional", () => {
    const g = guion({ negocio: "X", calConectado: true });
    expect(g).toContain("agendar una visita");
    expect(g).toContain("si no, no insistas");
    expect(g).not.toContain("Pídele SIEMPRE su número");
  });
});

describe("buildAssistantConfig", () => {
  it("pone tope de duración por defecto y español en voz/transcriptor", () => {
    const c = buildAssistantConfig({ negocio: "X" });
    expect(c.maxDurationSeconds).toBe(300);
    expect(c.transcriber.language).toBe("es");
    expect(c.name).toContain("X");
  });

  it("respeta el maxDuracionSeg indicado", () => {
    const c = buildAssistantConfig({ negocio: "X", maxDuracionSeg: 120 });
    expect(c.maxDurationSeconds).toBe(120);
  });

  it("elige la voz de 11labs según el género (femenina por defecto)", () => {
    expect(buildAssistantConfig({ negocio: "X" }).voice.voiceId).toBe("sarah");
    expect(
      buildAssistantConfig({ negocio: "X", voz: "masculina" }).voice.voiceId,
    ).toBe("george");
    expect(
      buildAssistantConfig({ negocio: "X", voz: "femenina" }).voice.voiceId,
    ).toBe("sarah");
  });

  it("no adjunta tools si Cal.com no está conectado", () => {
    const c = buildAssistantConfig({ negocio: "X" });
    expect((c.model as { tools?: unknown[] }).tools).toBeUndefined();
  });

  it("adjunta las 2 tools de agendado cuando Cal.com está conectado", () => {
    const c = buildAssistantConfig({ negocio: "X", calConectado: true });
    const tools = (c.model as { tools?: { function: { name: string } }[] }).tools;
    expect(tools).toHaveLength(2);
    expect(tools?.map((t) => t.function.name)).toEqual([
      "consultarHuecos",
      "agendarVisita",
    ]);
  });
});

describe("herramientasCal", () => {
  it("define las 2 function-tools apuntando a /api/vapi/tools", () => {
    const tools = herramientasCal();
    expect(tools).toHaveLength(2);
    for (const t of tools) {
      expect(t.type).toBe("function");
      expect(t.server.url).toContain("/api/vapi/tools");
    }
    expect(tools[1].function.parameters.required).toContain("email");
  });
});
