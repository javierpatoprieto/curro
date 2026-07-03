import { describe, it, expect } from "vitest";
import {
  normalizeTo,
  twilioTo,
  buildTwilioParams,
  type WhatsAppMessage,
} from "@/lib/messaging/whatsapp";

describe("normalizeTo", () => {
  it("deja solo dígitos (lo que espera WhatsApp Cloud API)", () => {
    expect(normalizeTo("+34 611 111 111")).toBe("34611111111");
    expect(normalizeTo("+34-600-00-00-00")).toBe("34600000000");
    expect(normalizeTo("34611111111")).toBe("34611111111");
  });
});

describe("twilioTo", () => {
  it("pone el prefijo whatsapp:+ y solo dígitos", () => {
    expect(twilioTo("+34 611 222 333")).toBe("whatsapp:+34611222333");
  });
});

describe("buildTwilioParams", () => {
  const from = "whatsapp:+14155238886";

  it("manda texto libre para mensajes de tipo text", () => {
    const msg: WhatsAppMessage = { kind: "text", to: "34611222333", body: "Hola" };
    const p = buildTwilioParams(msg, from);
    expect(p.get("From")).toBe(from);
    expect(p.get("To")).toBe("whatsapp:+34611222333");
    expect(p.get("Body")).toBe("Hola");
    expect(p.get("ContentSid")).toBeNull();
  });

  it("usa ContentSid + ContentVariables cuando hay plantilla aprobada", () => {
    const msg: WhatsAppMessage = {
      kind: "template",
      to: "34611222333",
      template: "curro_aviso_lead",
      variables: ["Reformas García", "María"],
      texto: "resumen",
    };
    const p = buildTwilioParams(msg, from, "HX123");
    expect(p.get("ContentSid")).toBe("HX123");
    expect(JSON.parse(p.get("ContentVariables")!)).toEqual({
      "1": "Reformas García",
      "2": "María",
    });
    expect(p.get("Body")).toBeNull();
  });

  it("cae a texto libre (el `texto` de la plantilla) si no hay ContentSid", () => {
    const msg: WhatsAppMessage = {
      kind: "template",
      to: "34611222333",
      template: "curro_aviso_lead",
      variables: ["x"],
      texto: "resumen legible",
    };
    const p = buildTwilioParams(msg, from);
    expect(p.get("Body")).toBe("resumen legible");
    expect(p.get("ContentSid")).toBeNull();
  });
});
