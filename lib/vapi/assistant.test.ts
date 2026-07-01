import { describe, it, expect } from "vitest";
import { guion, buildAssistantConfig } from "@/lib/vapi/assistant";

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
});
