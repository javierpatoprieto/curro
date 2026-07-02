import { describe, it, expect } from "vitest";
import {
  estadoDeNegocio,
  contarPorEstado,
  esDelMes,
  altasEsteMes,
  churnDelMes,
  altasPorMes,
  type NegocioAdmin,
} from "@/lib/metrics/customers";

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

const REF = new Date("2026-07-15T12:00:00.000Z");

describe("estadoDeNegocio", () => {
  it("clasifica activo, prueba y cancelado", () => {
    expect(estadoDeNegocio({ plan: "pro", activo: true })).toBe("activo");
    expect(estadoDeNegocio({ plan: "premium", activo: true })).toBe("activo");
    expect(estadoDeNegocio({ plan: "trial", activo: true })).toBe("prueba");
    expect(estadoDeNegocio({ plan: "pro", activo: false })).toBe("cancelado");
    expect(estadoDeNegocio({ plan: "cancelado", activo: true })).toBe("cancelado");
  });
});

describe("contarPorEstado", () => {
  it("cuenta cada estado y el total", () => {
    const negocios = [
      negocio({ id: "1", plan: "pro", activo: true }),
      negocio({ id: "2", plan: "starter", activo: true }),
      negocio({ id: "3", plan: "trial", activo: true }),
      negocio({ id: "4", plan: "pro", activo: false }),
      negocio({ id: "5", plan: "cancelado", activo: false }),
    ];
    expect(contarPorEstado(negocios)).toEqual({
      activos: 2,
      enPrueba: 1,
      cancelados: 2,
      total: 5,
    });
  });
});

describe("esDelMes / altasEsteMes", () => {
  it("detecta fechas del mismo mes natural (UTC)", () => {
    expect(esDelMes("2026-07-01T00:00:00.000Z", REF)).toBe(true);
    expect(esDelMes("2026-07-31T23:00:00.000Z", REF)).toBe(true);
    expect(esDelMes("2026-06-30T23:00:00.000Z", REF)).toBe(false);
    expect(esDelMes("2025-07-15T00:00:00.000Z", REF)).toBe(false);
  });

  it("cuenta las altas del mes de referencia", () => {
    const negocios = [
      negocio({ id: "1", created_at: "2026-07-02T00:00:00.000Z" }),
      negocio({ id: "2", created_at: "2026-07-20T00:00:00.000Z" }),
      negocio({ id: "3", created_at: "2026-06-15T00:00:00.000Z" }),
    ];
    expect(altasEsteMes(negocios, REF)).toBe(2);
  });
});

describe("churnDelMes", () => {
  it("base = clientes preexistentes; churn = cancelados/base", () => {
    const negocios = [
      // Preexistentes (creados antes de julio 2026): 4
      negocio({ id: "1", created_at: "2026-01-01T00:00:00.000Z", activo: true, plan: "pro" }),
      negocio({ id: "2", created_at: "2026-02-01T00:00:00.000Z", activo: true, plan: "pro" }),
      negocio({ id: "3", created_at: "2026-03-01T00:00:00.000Z", activo: false, plan: "cancelado" }),
      negocio({ id: "4", created_at: "2026-04-01T00:00:00.000Z", activo: false, plan: "pro" }),
      // Alta de este mes: no cuenta en la base ni en el churn
      negocio({ id: "5", created_at: "2026-07-05T00:00:00.000Z", activo: true, plan: "pro" }),
    ];
    // 2 cancelados de 4 preexistentes = 0.5
    expect(churnDelMes(negocios, REF)).toBe(0.5);
  });

  it("devuelve 0 si no hay base (todos son altas del mes)", () => {
    const negocios = [
      negocio({ id: "1", created_at: "2026-07-05T00:00:00.000Z" }),
    ];
    expect(churnDelMes(negocios, REF)).toBe(0);
  });
});

describe("altasPorMes", () => {
  it("devuelve una serie de 6 meses en orden ascendente terminando en ref", () => {
    const negocios = [
      negocio({ id: "1", created_at: "2026-07-01T00:00:00.000Z" }),
      negocio({ id: "2", created_at: "2026-07-10T00:00:00.000Z" }),
      negocio({ id: "3", created_at: "2026-05-10T00:00:00.000Z" }),
      negocio({ id: "4", created_at: "2026-02-10T00:00:00.000Z" }),
    ];
    const serie = altasPorMes(negocios, REF, 6);
    expect(serie).toHaveLength(6);
    expect(serie.map((p) => p.clave)).toEqual([
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
    ]);
    expect(serie[serie.length - 1].altas).toBe(2); // julio
    expect(serie[0].altas).toBe(1); // febrero
    expect(serie[3].altas).toBe(1); // mayo
    expect(serie[serie.length - 1].etiqueta).toBe("jul 26");
  });
});
