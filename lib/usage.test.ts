import { describe, it, expect } from "vitest";
import { dentroDelLimite, limiteDe, inicioDeMesISO } from "@/lib/usage";

describe("límites de uso por plan", () => {
  it("cada plan tiene su límite de llamadas", () => {
    expect(limiteDe("starter")).toBe(35);
    expect(limiteDe("pro")).toBe(75);
    expect(limiteDe("cancelado")).toBe(0);
  });

  it("permite mientras no se alcance el límite", () => {
    expect(dentroDelLimite(34, "starter")).toBe(true);
    expect(dentroDelLimite(35, "starter")).toBe(false);
    expect(dentroDelLimite(74, "pro")).toBe(true);
    expect(dentroDelLimite(0, "cancelado")).toBe(false);
  });
});

describe("inicioDeMesISO", () => {
  it("devuelve el día 1 a las 00:00:00 en UTC (no en hora local)", () => {
    const iso = inicioDeMesISO();
    // Debe terminar exactamente en medianoche UTC.
    expect(iso.endsWith("T00:00:00.000Z")).toBe(true);

    // Y ser el día 1 del mes/año actual en UTC.
    const now = new Date();
    const d = new Date(iso);
    expect(d.getUTCFullYear()).toBe(now.getUTCFullYear());
    expect(d.getUTCMonth()).toBe(now.getUTCMonth());
    expect(d.getUTCDate()).toBe(1);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
  });
});
