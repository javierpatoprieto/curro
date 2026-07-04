import { describe, it, expect } from "vitest";
import {
  dentroDelLimite,
  limiteDe,
  inicioDeMesISO,
  limiteMinutosDe,
  dentroDelLimiteMinutos,
  porcentajeUso,
} from "@/lib/usage";

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

describe("límites de uso en minutos por plan", () => {
  it("cada plan tiene su límite de minutos", () => {
    expect(limiteMinutosDe("trial")).toBe(30);
    expect(limiteMinutosDe("starter")).toBe(75);
    expect(limiteMinutosDe("pro")).toBe(150);
    expect(limiteMinutosDe("premium")).toBe(450);
    expect(limiteMinutosDe("cancelado")).toBe(0);
  });

  it("permite mientras no se alcance el límite de minutos", () => {
    expect(dentroDelLimiteMinutos(29, "trial")).toBe(true);
    expect(dentroDelLimiteMinutos(30, "trial")).toBe(false);
    expect(dentroDelLimiteMinutos(149, "pro")).toBe(true);
    expect(dentroDelLimiteMinutos(150, "pro")).toBe(false);
    expect(dentroDelLimiteMinutos(0, "cancelado")).toBe(false);
  });
});

describe("porcentajeUso", () => {
  it("calcula el porcentaje de uso sobre el límite del plan", () => {
    expect(porcentajeUso(75, "pro")).toBe(50);
    expect(porcentajeUso(0, "pro")).toBe(0);
    expect(porcentajeUso(150, "pro")).toBe(100);
  });

  it("hace clamp a 100 cuando se supera el límite", () => {
    expect(porcentajeUso(300, "pro")).toBe(100);
  });

  it("no revienta con límite 0 (plan cancelado)", () => {
    expect(porcentajeUso(0, "cancelado")).toBe(0);
    expect(porcentajeUso(5, "cancelado")).toBe(100);
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
