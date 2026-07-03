import { describe, it, expect } from "vitest";
import { GREMIOS, GREMIO_SLUGS, getGremio } from "@/lib/gremios";

describe("gremios (landing SEO)", () => {
  it("tiene slugs únicos y en formato URL", () => {
    const set = new Set(GREMIO_SLUGS);
    expect(set.size).toBe(GREMIOS.length);
    for (const slug of GREMIO_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("cada gremio trae metadatos, subtítulo y 3 dolores", () => {
    for (const g of GREMIOS) {
      expect(g.metaTitle.length).toBeGreaterThan(10);
      expect(g.metaDescription.length).toBeGreaterThan(50);
      expect(g.metaDescription.length).toBeLessThanOrEqual(170);
      expect(g.subtitulo.length).toBeGreaterThan(10);
      expect(g.dolores).toHaveLength(3);
      for (const d of g.dolores) {
        expect(d.titulo.length).toBeGreaterThan(3);
        expect(d.texto.length).toBeGreaterThan(10);
      }
      expect(g.ejemplo.trabajo).toBeTruthy();
    }
  });

  it("getGremio resuelve por slug y devuelve undefined si no existe", () => {
    expect(getGremio("fontaneros")?.nombre).toBe("fontaneros");
    expect(getGremio("no-existe")).toBeUndefined();
  });
});
