import { describe, it, expect } from "vitest";
import { cronAutorizado } from "@/app/api/cron/retencion/route";

describe("cronAutorizado", () => {
  it("con CRON_SECRET: exige Bearer <secret> exacto", () => {
    const opts = { secret: "s3cr3t", isProd: true };
    expect(cronAutorizado("Bearer s3cr3t", opts)).toBe(true);
    expect(cronAutorizado("Bearer otro", opts)).toBe(false);
    expect(cronAutorizado("s3cr3t", opts)).toBe(false); // sin "Bearer "
    expect(cronAutorizado(null, opts)).toBe(false);
  });

  it("sin CRON_SECRET: permitido en dev, rechazado en prod (fail-closed)", () => {
    expect(cronAutorizado(null, { secret: undefined, isProd: false })).toBe(true);
    expect(cronAutorizado(null, { secret: undefined, isProd: true })).toBe(false);
  });
});
