import { describe, it, expect } from "vitest";
import {
  PROVINCIAS,
  PROVINCIA_SLUGS,
  getProvincia,
  indiceEstable,
} from "@/lib/provincias";
import { GREMIOS } from "@/lib/gremios";

describe("provincias", () => {
  it("son 50 con slugs únicos y en formato URL (sin acentos ni ñ)", () => {
    expect(PROVINCIAS).toHaveLength(50);
    expect(new Set(PROVINCIA_SLUGS).size).toBe(50);
    for (const slug of PROVINCIA_SLUGS) {
      expect(slug).toMatch(/^[a-z-]+$/);
    }
  });

  it("cada provincia tiene nombre, capital y municipios (contenido local único)", () => {
    for (const p of PROVINCIAS) {
      expect(p.nombre.length).toBeGreaterThan(2);
      expect(p.capital.length).toBeGreaterThan(2);
      expect(p.municipios.length).toBeGreaterThanOrEqual(3);
      // La capital no se repite en la lista de municipios.
      expect(p.municipios).not.toContain(p.capital);
    }
  });

  it("indiceEstable es determinista y acotado", () => {
    expect(indiceEstable("madrid")).toBe(indiceEstable("madrid"));
    for (const p of PROVINCIAS) {
      const n = indiceEstable(p.slug);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(997);
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
