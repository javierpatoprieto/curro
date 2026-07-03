import { describe, it, expect } from "vitest";
import { PROVINCIAS, PROVINCIA_SLUGS, getProvincia } from "@/lib/provincias";
import { GREMIOS } from "@/lib/gremios";

describe("provincias", () => {
  it("son 50 con slugs únicos y en formato URL (sin acentos ni ñ)", () => {
    expect(PROVINCIAS).toHaveLength(50);
    expect(new Set(PROVINCIA_SLUGS).size).toBe(50);
    for (const slug of PROVINCIA_SLUGS) {
      expect(slug).toMatch(/^[a-z-]+$/);
    }
  });

  it("cada provincia tiene nombre visible", () => {
    for (const p of PROVINCIAS) {
      expect(p.nombre.length).toBeGreaterThan(2);
    }
  });

  it("getProvincia resuelve por slug", () => {
    expect(getProvincia("madrid")?.nombre).toBe("Madrid");
    expect(getProvincia("a-coruna")?.nombre).toBe("A Coruña");
    expect(getProvincia("no-existe")).toBeUndefined();
  });

  it("la matriz gremio × provincia genera 12 × 50 = 600 páginas", () => {
    expect(GREMIOS.length * PROVINCIAS.length).toBe(600);
  });
});
