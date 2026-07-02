import { describe, it, expect } from "vitest";
import { construirFilas, mrrDeNegocio } from "@/lib/metrics/rows";
import type { NegocioAdmin } from "@/lib/metrics/customers";

function negocio(over: Partial<NegocioAdmin>): NegocioAdmin {
  return {
    id: over.id ?? "id",
    nombre: over.nombre ?? "Negocio",
    ciudad: over.ciudad ?? "Madrid",
    plan: over.plan ?? "pro",
    activo: over.activo ?? true,
    created_at: over.created_at ?? "2026-07-01T00:00:00.000Z",
  };
}

describe("mrrDeNegocio", () => {
  it("usa el MRR real de Stripe cuando existe para el negocio", () => {
    const n = negocio({ id: "a", plan: "pro", activo: true });
    expect(mrrDeNegocio(n, { a: 123.45 })).toBe(123.45);
  });

  it("deriva del plan si no hay MRR de Stripe para ese negocio", () => {
    const n = negocio({ id: "a", plan: "pro", activo: true });
    expect(mrrDeNegocio(n, { otro: 50 })).toBe(149);
    expect(mrrDeNegocio(n, null)).toBe(149);
  });

  it("es 0 para negocios inactivos o cancelados sin dato de Stripe", () => {
    expect(mrrDeNegocio(negocio({ plan: "pro", activo: false }), null)).toBe(0);
    expect(mrrDeNegocio(negocio({ plan: "cancelado", activo: true }), null)).toBe(0);
  });
});

describe("construirFilas", () => {
  const negocios = [
    negocio({ id: "a", nombre: "Alfa", plan: "starter", activo: true }), // 99
    negocio({ id: "b", nombre: "Beta", plan: "premium", activo: true }), // 199
    negocio({ id: "c", nombre: "Gamma", plan: "trial", activo: true }), // 0
  ];

  it("ordena por MRR descendente y adjunta conteos del mes", () => {
    const filas = construirFilas(
      negocios,
      { a: 10, b: 5 }, // llamadas
      { a: 3, c: 1 }, // leads
      null, // MRR derivado de la BD
    );
    expect(filas.map((f) => f.id)).toEqual(["b", "a", "c"]);
    expect(filas[0]).toMatchObject({ id: "b", mrr: 199, llamadasMes: 5, leadsMes: 0 });
    expect(filas[1]).toMatchObject({ id: "a", mrr: 99, llamadasMes: 10, leadsMes: 3 });
    expect(filas[2]).toMatchObject({ id: "c", mrr: 0, estado: "prueba", leadsMes: 1 });
  });

  it("desempata por nombre cuando el MRR coincide", () => {
    const empatan = [
      negocio({ id: "z", nombre: "Zeta", plan: "pro", activo: true }),
      negocio({ id: "a", nombre: "Ana", plan: "pro", activo: true }),
    ];
    const filas = construirFilas(empatan, {}, {}, null);
    expect(filas.map((f) => f.nombre)).toEqual(["Ana", "Zeta"]);
  });

  it("prefiere el MRR de Stripe cuando se proporciona", () => {
    const filas = construirFilas(negocios, {}, {}, { a: 300, b: 0, c: 0 });
    expect(filas.map((f) => f.id)).toEqual(["a", "b", "c"]);
    expect(filas[0].mrr).toBe(300);
  });
});
