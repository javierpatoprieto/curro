import { describe, it, expect } from "vitest";
import {
  buildComprarParams,
  buscarNumeroES,
  comprarNumero,
  asignarWebhookVoz,
  twilioNumerosActivo,
} from "@/lib/twilio/numeros";

describe("buildComprarParams", () => {
  it("incluye PhoneNumber, VoiceUrl, VoiceMethod y las credenciales regulatorias ES", () => {
    const p = buildComprarParams("+34910000000", {
      voiceUrl: "https://app/api/inbound",
      addressSid: "AD123",
      bundleSid: "BU123",
    });
    expect(p.get("PhoneNumber")).toBe("+34910000000");
    expect(p.get("VoiceUrl")).toBe("https://app/api/inbound");
    expect(p.get("VoiceMethod")).toBe("POST");
    // ES exige AddressSid + BundleSid al comprar.
    expect(p.get("AddressSid")).toBe("AD123");
    expect(p.get("BundleSid")).toBe("BU123");
  });
});

describe("twilioNumerosActivo (gate doble)", () => {
  it("es false por defecto (MOCK_PROVIDERS no es 'false' en test)", () => {
    // En test el gate está cerrado: nunca se llama a la API real de Twilio.
    expect(twilioNumerosActivo()).toBe(false);
  });
});

describe("buscarNumeroES (mock)", () => {
  it("devuelve un número ES simulado sin llamar a la red", async () => {
    const num = await buscarNumeroES();
    expect(num).toMatch(/^\+34/);
  });
});

describe("comprarNumero (mock)", () => {
  it("devuelve un SID simulado (mock_pn_...) y no hace red", async () => {
    const res = await comprarNumero("+34910000000", {
      voiceUrl: "https://app/api/inbound",
    });
    expect(res.sid).toMatch(/^mock_pn_/);
    expect(res.phoneNumber).toBe("+34910000000");
  });
});

describe("asignarWebhookVoz (mock)", () => {
  it("es un no-op resoluble en mock", async () => {
    await expect(
      asignarWebhookVoz("PN123", "https://app/api/inbound"),
    ).resolves.toBeUndefined();
  });
});
