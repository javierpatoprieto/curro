import { describe, it, expect } from "vitest";
import {
  importeMensualItem,
  mrrDeSuscripcion,
  mrrDesdeStripe,
  mrrDesdeBaseDatos,
  arrDesdeMrr,
  PRECIO_MENSUAL_PLAN,
  type SuscripcionMRR,
  type ItemSuscripcion,
} from "@/lib/metrics/mrr";

function item(
  unit_amount: number | null,
  interval: "day" | "week" | "month" | "year" | null,
  quantity = 1,
): ItemSuscripcion {
  return {
    quantity,
    price:
      interval === null
        ? { unit_amount, recurring: null }
        : { unit_amount, recurring: { interval } },
  };
}

function sub(status: string, items: ItemSuscripcion[]): SuscripcionMRR {
  return { status, items: { data: items } };
}

describe("importeMensualItem", () => {
  it("convierte céntimos a euros para intervalo mensual", () => {
    expect(importeMensualItem(item(14900, "month"))).toBe(149);
  });

  it("prorratea el anual entre 12", () => {
    expect(importeMensualItem(item(120000, "year"))).toBe(100);
  });

  it("multiplica por la cantidad", () => {
    expect(importeMensualItem(item(9900, "month", 3))).toBe(297);
  });

  it("devuelve 0 sin precio, sin importe o sin recurrencia", () => {
    expect(importeMensualItem({ quantity: 1, price: null })).toBe(0);
    expect(importeMensualItem(item(null, "month"))).toBe(0);
    expect(importeMensualItem(item(9900, null))).toBe(0);
  });
});

describe("mrrDeSuscripcion", () => {
  it("suma los ítems de una suscripción activa/trialing", () => {
    expect(mrrDeSuscripcion(sub("active", [item(9900, "month"), item(5000, "month")]))).toBe(149);
    expect(mrrDeSuscripcion(sub("trialing", [item(14900, "month")]))).toBe(149);
  });

  it("no cuenta suscripciones en estados que no generan ingreso", () => {
    for (const s of ["canceled", "past_due", "unpaid", "incomplete"]) {
      expect(mrrDeSuscripcion(sub(s, [item(14900, "month")]))).toBe(0);
    }
  });
});

describe("mrrDesdeStripe", () => {
  it("suma solo las suscripciones vivas y redondea a 2 decimales", () => {
    const subs = [
      sub("active", [item(9900, "month")]), // 99
      sub("trialing", [item(14900, "month")]), // 149
      sub("canceled", [item(19900, "month")]), // 0
      sub("active", [item(120000, "year")]), // 100
    ];
    expect(mrrDesdeStripe(subs)).toBe(348);
  });

  it("devuelve 0 sin suscripciones", () => {
    expect(mrrDesdeStripe([])).toBe(0);
  });
});

describe("mrrDesdeBaseDatos", () => {
  it("suma el precio del plan solo de los negocios activos", () => {
    const negocios = [
      { plan: "pro", activo: true }, // 149
      { plan: "starter", activo: true }, // 99
      { plan: "premium", activo: false }, // 0 (inactivo)
      { plan: "trial", activo: true }, // 0 (trial no cobra)
      { plan: "cancelado", activo: false }, // 0
    ];
    expect(mrrDesdeBaseDatos(negocios)).toBe(248);
  });

  it("los precios del mapa coinciden con los planes de pago", () => {
    expect(PRECIO_MENSUAL_PLAN.starter).toBe(99);
    expect(PRECIO_MENSUAL_PLAN.pro).toBe(149);
    expect(PRECIO_MENSUAL_PLAN.premium).toBe(199);
    expect(PRECIO_MENSUAL_PLAN.trial).toBe(0);
    expect(PRECIO_MENSUAL_PLAN.cancelado).toBe(0);
  });
});

describe("arrDesdeMrr", () => {
  it("multiplica el MRR por 12", () => {
    expect(arrDesdeMrr(348)).toBe(4176);
    expect(arrDesdeMrr(0)).toBe(0);
  });
});
