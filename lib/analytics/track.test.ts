import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests del gating por consentimiento de lib/analytics/track.ts.
 *
 * Entorno: vitest corre en "node" (sin jsdom), así que montamos un `window` y un
 * `localStorage` falsos en globalThis. Los ids de env se leen al importar el
 * módulo, por eso usamos import dinámico tras stubear el entorno con resetModules.
 */

const STORAGE_KEY = "curro_cookie_consent";

type FakeWindow = {
  fbq?: ReturnType<typeof vi.fn>;
  gtag?: ReturnType<typeof vi.fn>;
  localStorage: { getItem: (k: string) => string | null };
};

function montarWindow(opts: {
  consentimiento: "granted" | "denied" | null;
  conFbq?: boolean;
  conGtag?: boolean;
}): { fbq?: ReturnType<typeof vi.fn>; gtag?: ReturnType<typeof vi.fn> } {
  const store: Record<string, string> = {};
  if (opts.consentimiento) store[STORAGE_KEY] = opts.consentimiento;
  const fbq = opts.conFbq ? vi.fn() : undefined;
  const gtag = opts.conGtag ? vi.fn() : undefined;
  const win: FakeWindow = {
    fbq,
    gtag,
    localStorage: { getItem: (k) => store[k] ?? null },
  };
  // @ts-expect-error — inyectamos un window mínimo para el test.
  globalThis.window = win;
  return { fbq, gtag };
}

/** Importa el módulo tras fijar los ids de env (se leen en el import). */
async function cargarTrack(env: {
  meta?: string;
  ads?: string;
}) {
  vi.resetModules();
  if (env.meta) vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", env.meta);
  else vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
  if (env.ads) vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", env.ads);
  else vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", "");
  return import("@/lib/analytics/track");
}

afterEach(() => {
  vi.unstubAllEnvs();
  // @ts-expect-error — limpiamos el window inyectado.
  delete globalThis.window;
});

describe("track — gating por consentimiento", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("no dispara nada si el visitante RECHAZÓ (denied)", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: "denied",
      conFbq: true,
      conGtag: true,
    });
    const { trackRegistro, trackInitiateCheckout, trackPurchase } =
      await cargarTrack({ meta: "123", ads: "AW-999" });

    trackRegistro();
    trackInitiateCheckout();
    trackPurchase(99);

    expect(fbq).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("no dispara nada sin decisión de consentimiento (null)", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: null,
      conFbq: true,
      conGtag: true,
    });
    const { trackRegistro } = await cargarTrack({ meta: "123", ads: "AW-999" });

    trackRegistro();

    expect(fbq).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("no dispara si faltan los ids, aunque haya consentimiento y fbq/gtag", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: "granted",
      conFbq: true,
      conGtag: true,
    });
    const { trackRegistro, trackPurchase } = await cargarTrack({});

    trackRegistro();
    trackPurchase(49);

    expect(fbq).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("no dispara si hay consentimiento e ids pero fbq/gtag no existen", async () => {
    montarWindow({ consentimiento: "granted", conFbq: false, conGtag: false });
    const { trackRegistro } = await cargarTrack({ meta: "123", ads: "AW-999" });
    // No debe lanzar aunque window.fbq/gtag no existan.
    expect(() => trackRegistro()).not.toThrow();
  });

  it("es seguro en SSR (sin window)", async () => {
    // @ts-expect-error — simulamos SSR: no hay window.
    delete globalThis.window;
    const { trackRegistro, trackInitiateCheckout, trackPurchase } =
      await cargarTrack({ meta: "123", ads: "AW-999" });
    expect(() => {
      trackRegistro();
      trackInitiateCheckout();
      trackPurchase(99);
    }).not.toThrow();
  });
});

describe("track — dispara cuando procede (granted + ids + fbq/gtag)", () => {
  it("trackRegistro → fbq CompleteRegistration + gtag conversion", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: "granted",
      conFbq: true,
      conGtag: true,
    });
    const { trackRegistro } = await cargarTrack({ meta: "123", ads: "AW-999" });

    trackRegistro();

    expect(fbq).toHaveBeenCalledWith("track", "CompleteRegistration");
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({ send_to: "AW-999" }),
    );
  });

  it("trackInitiateCheckout → fbq InitiateCheckout + gtag conversion", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: "granted",
      conFbq: true,
      conGtag: true,
    });
    const { trackInitiateCheckout } = await cargarTrack({
      meta: "123",
      ads: "AW-999",
    });

    trackInitiateCheckout();

    expect(fbq).toHaveBeenCalledWith("track", "InitiateCheckout");
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({ send_to: "AW-999" }),
    );
  });

  it("trackPurchase(99) → incluye value y currency EUR en Meta y Google", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: "granted",
      conFbq: true,
      conGtag: true,
    });
    const { trackPurchase } = await cargarTrack({ meta: "123", ads: "AW-999" });

    trackPurchase(99);

    expect(fbq).toHaveBeenCalledWith("track", "Purchase", {
      value: 99,
      currency: "EUR",
    });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({
        send_to: "AW-999",
        value: 99,
        currency: "EUR",
      }),
    );
  });

  it("trackPurchase() sin valor → Purchase sin value/currency", async () => {
    const { fbq } = montarWindow({
      consentimiento: "granted",
      conFbq: true,
      conGtag: true,
    });
    const { trackPurchase } = await cargarTrack({ meta: "123", ads: "AW-999" });

    trackPurchase();

    expect(fbq).toHaveBeenCalledWith("track", "Purchase");
  });

  it("solo Meta configurado → dispara fbq, no gtag", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: "granted",
      conFbq: true,
      conGtag: true,
    });
    const { trackRegistro } = await cargarTrack({ meta: "123" });

    trackRegistro();

    expect(fbq).toHaveBeenCalledWith("track", "CompleteRegistration");
    expect(gtag).not.toHaveBeenCalled();
  });

  it("solo Google Ads configurado → dispara gtag, no fbq", async () => {
    const { fbq, gtag } = montarWindow({
      consentimiento: "granted",
      conFbq: true,
      conGtag: true,
    });
    const { trackRegistro } = await cargarTrack({ ads: "AW-999" });

    trackRegistro();

    expect(gtag).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({ send_to: "AW-999" }),
    );
    expect(fbq).not.toHaveBeenCalled();
  });
});
