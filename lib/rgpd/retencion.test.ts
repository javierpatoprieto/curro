import { describe, it, expect } from "vitest";
import {
  fechaCorte,
  estaVencido,
  plazoDias,
  PLAZOS_MS,
  type CategoriaRetencion,
} from "@/lib/rgpd/retencion";

const DIA = 24 * 60 * 60 * 1000;
const ahora = new Date("2026-07-09T12:00:00.000Z");

describe("plazoDias", () => {
  it("expone los plazos canónicos por defecto", () => {
    expect(plazoDias("audio")).toBe(30);
    expect(plazoDias("raw_payload")).toBe(30);
    expect(plazoDias("logs")).toBe(90);
    // 12 meses ≈ 360 días (mes = 30d), 6 años y 5 años en días.
    expect(plazoDias("transcripcion")).toBe(360);
    expect(plazoDias("facturacion")).toBe(6 * 365);
    expect(plazoDias("cuenta")).toBe(5 * 365);
  });
});

describe("fechaCorte", () => {
  it("resta el plazo de la categoría a `ahora`", () => {
    const corte = fechaCorte("audio", ahora);
    expect(corte.getTime()).toBe(ahora.getTime() - 30 * DIA);
  });

  it("categorías distintas dan cortes distintos", () => {
    expect(fechaCorte("audio", ahora).getTime()).toBeGreaterThan(
      fechaCorte("transcripcion", ahora).getTime(),
    );
  });
});

describe("estaVencido", () => {
  const casos: { cat: CategoriaRetencion; dias: number }[] = [
    { cat: "audio", dias: 30 },
    { cat: "raw_payload", dias: 30 },
    { cat: "logs", dias: 90 },
  ];

  for (const { cat, dias } of casos) {
    it(`${cat}: vencido justo pasado el plazo, vigente justo antes`, () => {
      const justoVencido = new Date(ahora.getTime() - (dias + 1) * DIA);
      const justoVigente = new Date(ahora.getTime() - (dias - 1) * DIA);
      expect(estaVencido(cat, justoVencido, ahora)).toBe(true);
      expect(estaVencido(cat, justoVigente, ahora)).toBe(false);
    });
  }

  it("acepta fechas en string (ISO)", () => {
    const viejo = new Date(ahora.getTime() - 100 * DIA).toISOString();
    expect(estaVencido("audio", viejo, ahora)).toBe(true);
  });

  it("una fecha inválida no cuenta como vencida (fail-safe)", () => {
    expect(estaVencido("audio", "no-es-fecha", ahora)).toBe(false);
  });

  it("el borde exacto (creado == corte) NO está vencido (estricto)", () => {
    const enElCorte = fechaCorte("audio", ahora);
    expect(estaVencido("audio", enElCorte, ahora)).toBe(false);
  });
});

describe("PLAZOS_MS", () => {
  it("todas las categorías tienen un plazo positivo", () => {
    for (const ms of Object.values(PLAZOS_MS)) {
      expect(ms).toBeGreaterThan(0);
    }
  });
});
