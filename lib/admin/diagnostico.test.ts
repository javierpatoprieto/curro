import { describe, it, expect } from "vitest";
import {
  construirDiagnostico,
  bloqueosParaLlamadaReal,
  type Capacidad,
} from "@/lib/admin/diagnostico";

/** Variables mínimas para que TODO salga en verde (valores irrelevantes). */
const TODO: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  VAPI_API_KEY: "vapi",
  VAPI_WEBHOOK_SECRET: "secreto",
  TWILIO_ACCOUNT_SID: "AC1",
  TWILIO_AUTH_TOKEN: "tok",
  TWILIO_ADDRESS_SID: "AD1",
  TWILIO_BUNDLE_SID: "BU1",
  TWILIO_WHATSAPP_FROM: "whatsapp:+34600000000",
  TWILIO_WA_CONTENT_CLIENTE: "HX1",
  TWILIO_WA_CONTENT_DUENO: "HX2",
  RESEND_API_KEY: "re_1",
  EMAIL_FROM: "Curro <avisos@soycurro.es>",
  STRIPE_SECRET_KEY: "sk",
  STRIPE_WEBHOOK_SECRET: "whsec",
  STRIPE_PRICE_STARTER: "price_1",
  STRIPE_PRICE_PRO: "price_2",
  STRIPE_PRICE_PREMIUM: "price_3",
  APP_URL: "https://soycurro.es",
  CRON_SECRET: "cron",
  ADMIN_PASSWORD: "pass",
  ADMIN_SESSION_SECRET: "sess",
};

const cap = (caps: Capacidad[], id: string) => caps.find((c) => c.id === id)!;

describe("construirDiagnostico", () => {
  it("con todo puesto y MOCK_PROVIDERS=false, las capacidades clave son reales", () => {
    const caps = construirDiagnostico({ vars: TODO, mockProviders: false });
    for (const id of ["datos", "modo", "voz", "numeros", "whatsapp", "email", "pagos"]) {
      expect(cap(caps, id).estado, id).toBe("real");
    }
  });

  it("con todo puesto pero en modo mock, los adaptadores quedan en mock (no reales)", () => {
    const caps = construirDiagnostico({ vars: TODO, mockProviders: true });
    // La base de datos no depende del gate: sigue siendo real.
    expect(cap(caps, "datos").estado).toBe("real");
    for (const id of ["modo", "voz", "numeros", "whatsapp", "email", "pagos"]) {
      expect(cap(caps, id).estado, id).toBe("mock");
    }
  });

  it("distingue faltar claves (incompleto) de estar en mock", () => {
    const { TWILIO_ADDRESS_SID: _a, TWILIO_BUNDLE_SID: _b, ...sinBundle } = TODO;
    const caps = construirDiagnostico({ vars: sinBundle, mockProviders: false });
    const numeros = cap(caps, "numeros");
    expect(numeros.estado).toBe("incompleto");
    expect(numeros.faltan).toEqual(["TWILIO_ADDRESS_SID", "TWILIO_BUNDLE_SID"]);
    expect(numeros.aviso).toMatch(/Regulatory Bundle/);
    // El resto no se contagia.
    expect(cap(caps, "voz").estado).toBe("real");
  });

  it("acepta WhatsApp por Meta cuando no están las de Twilio", () => {
    const { TWILIO_WHATSAPP_FROM: _f, ...sinTwilioWa } = TODO;
    const caps = construirDiagnostico({
      vars: {
        ...sinTwilioWa,
        WHATSAPP_TOKEN: "tok",
        WHATSAPP_PHONE_NUMBER_ID: "123",
      },
      mockProviders: false,
    });
    const wa = cap(caps, "whatsapp");
    expect(wa.estado).toBe("real");
    expect(wa.resumen).toMatch(/Meta/);
  });

  it("avisa de que sin ContentSid el WhatsApp va en texto libre", () => {
    const { TWILIO_WA_CONTENT_CLIENTE: _c, ...sinPlantilla } = TODO;
    const caps = construirDiagnostico({
      vars: sinPlantilla,
      mockProviders: false,
    });
    expect(cap(caps, "whatsapp").estado).toBe("real");
    expect(cap(caps, "whatsapp").aviso).toMatch(/texto libre/);
  });

  it("marca la retención como off si no hay CRON_SECRET", () => {
    const { CRON_SECRET: _c, ...sinCron } = TODO;
    const caps = construirDiagnostico({ vars: sinCron, mockProviders: false });
    expect(cap(caps, "retencion").estado).toBe("off");
  });

  it("nunca devuelve valores de las variables, solo sus nombres", () => {
    const caps = construirDiagnostico({
      vars: { ...TODO, SUPABASE_SERVICE_ROLE_KEY: "super-secreto-123" },
      mockProviders: false,
    });
    expect(JSON.stringify(caps)).not.toContain("super-secreto-123");
  });
});

describe("bloqueosParaLlamadaReal", () => {
  it("no hay bloqueos con todo configurado en real", () => {
    const caps = construirDiagnostico({ vars: TODO, mockProviders: false });
    expect(bloqueosParaLlamadaReal(caps)).toEqual([]);
  });

  it("el modo mock bloquea por sí solo, aunque estén todas las claves", () => {
    const caps = construirDiagnostico({ vars: TODO, mockProviders: true });
    const bloqueos = bloqueosParaLlamadaReal(caps);
    expect(bloqueos).toContain("Modo de proveedores");
  });

  it("basta con uno de los dos canales de aviso (email vale sin WhatsApp)", () => {
    const { TWILIO_WHATSAPP_FROM: _f, ...sinWa } = TODO;
    const caps = construirDiagnostico({ vars: sinWa, mockProviders: false });
    expect(cap(caps, "whatsapp").estado).toBe("incompleto");
    expect(bloqueosParaLlamadaReal(caps)).toEqual([]);
  });

  it("sin ningún canal de aviso, sí bloquea", () => {
    const {
      TWILIO_WHATSAPP_FROM: _f,
      RESEND_API_KEY: _r,
      ...pelado
    } = TODO;
    const caps = construirDiagnostico({ vars: pelado, mockProviders: false });
    expect(bloqueosParaLlamadaReal(caps)).toContain(
      "Aviso al dueño (WhatsApp o email)",
    );
  });
});
