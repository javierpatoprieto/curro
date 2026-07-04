import { describe, it, expect } from "vitest";
import { PRECIO_MENSUAL } from "@/lib/stripe/precios";

describe("precios mensuales por plan (packs 2026)", () => {
  it("Starter 49 · Pro 99 · Premium 199 · trial/cancelado 0", () => {
    expect(PRECIO_MENSUAL.starter).toBe(49);
    expect(PRECIO_MENSUAL.pro).toBe(99);
    expect(PRECIO_MENSUAL.premium).toBe(199);
    expect(PRECIO_MENSUAL.trial).toBe(0);
    expect(PRECIO_MENSUAL.cancelado).toBe(0);
  });
});
