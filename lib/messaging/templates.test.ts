import { describe, it, expect } from "vitest";
import {
  whatsappCliente,
  whatsappDueno,
  emailDueno,
  PLANTILLA_CLIENTE,
  PLANTILLA_DUENO,
  type LeadInfo,
} from "@/lib/messaging/templates";

const lead: LeadInfo = {
  cliente_nombre: "María López",
  cliente_telefono: "+34611111111",
  tipo_trabajo: "Reforma de baño completo",
  zona: "Chamberí, Madrid",
  urgencia: true,
};

describe("whatsappCliente", () => {
  it("incluye saludo, negocio y enlace de Cal.com", () => {
    const m = whatsappCliente({
      to: "+34611111111",
      negocio: "Reformas García",
      calLink: "https://cal.com/reformas-garcia/visita",
      nombre: "María",
    });
    expect(m.kind).toBe("template");
    if (m.kind !== "template") return;
    expect(m.template).toBe(PLANTILLA_CLIENTE);
    expect(m.texto).toContain("Hola María");
    expect(m.texto).toContain("Reformas García");
    expect(m.texto).toContain("https://cal.com/reformas-garcia/visita");
    expect(m.variables).toEqual([
      "María",
      "Reformas García",
      "https://cal.com/reformas-garcia/visita",
    ]);
  });

  it("funciona sin nombre ni enlace", () => {
    const m = whatsappCliente({
      to: "+34611111111",
      negocio: "Reformas García",
      calLink: null,
      nombre: null,
    });
    if (m.kind !== "template") throw new Error("esperado template");
    expect(m.texto).toContain("Hola,");
    expect(m.texto).not.toContain("reservar");
  });
});

describe("whatsappDueno", () => {
  it("resume el lead y marca la urgencia", () => {
    const m = whatsappDueno({ to: "+34600000000", negocio: "Reformas García", lead });
    if (m.kind !== "template") throw new Error("esperado template");
    expect(m.template).toBe(PLANTILLA_DUENO);
    expect(m.texto).toContain("Reforma de baño completo");
    expect(m.texto).toContain("María López");
    expect(m.texto).toContain("🔥 URGENTE");
  });

  it("no marca urgencia cuando es false", () => {
    const m = whatsappDueno({
      to: "+34600000000",
      negocio: "Reformas García",
      lead: { ...lead, urgencia: false },
    });
    if (m.kind !== "template") throw new Error("esperado template");
    expect(m.texto).not.toContain("URGENTE");
  });
});

describe("emailDueno", () => {
  it("genera asunto, html y texto con enlace al panel", () => {
    const m = emailDueno({
      to: "dueno@reformas-garcia.es",
      negocio: "Reformas García",
      lead,
      panelUrl: "https://app.curro.es",
    });
    expect(m.subject).toContain("URGENTE");
    expect(m.subject).toContain("María López");
    expect(m.html).toContain("Reforma de baño completo");
    expect(m.html).toContain("https://app.curro.es/panel/leads");
    expect(m.text).toContain("Teléfono: +34611111111");
  });
});
