import { describe, it, expect } from "vitest";
import {
  resolverCuenta,
  esEstadoActivo,
  planDesdePrice,
} from "@/lib/stripe/activation";

describe("esEstadoActivo", () => {
  it("activa con active y trialing; inactiva el resto", () => {
    expect(esEstadoActivo("active")).toBe(true);
    expect(esEstadoActivo("trialing")).toBe(true);
    for (const s of ["canceled", "past_due", "unpaid", "incomplete"]) {
      expect(esEstadoActivo(s)).toBe(false);
    }
  });
});

describe("planDesdePrice", () => {
  const mapa = { price_abc: "pro" as const, price_xyz: "premium" as const };
  it("resuelve el plan por priceId", () => {
    expect(planDesdePrice("price_abc", mapa)).toBe("pro");
    expect(planDesdePrice("price_xyz", mapa)).toBe("premium");
  });
  it("devuelve null si no lo conoce", () => {
    expect(planDesdePrice("price_desconocido", mapa)).toBeNull();
    expect(planDesdePrice(null, mapa)).toBeNull();
  });
});

describe("resolverCuenta", () => {
  it("activa la cuenta con el plan cuando la suscripción está activa", () => {
    expect(resolverCuenta("active", "pro")).toEqual({ plan: "pro", activo: true });
    expect(resolverCuenta("trialing", "starter")).toEqual({
      plan: "starter",
      activo: true,
    });
  });

  it("desactiva y marca 'cancelado' cuando no está activa", () => {
    expect(resolverCuenta("canceled", "pro")).toEqual({
      plan: "cancelado",
      activo: false,
    });
    expect(resolverCuenta("past_due", "premium")).toEqual({
      plan: "cancelado",
      activo: false,
    });
  });

  it("cae a 'pro' si está activa pero no se pudo resolver el plan", () => {
    expect(resolverCuenta("active", null)).toEqual({ plan: "pro", activo: true });
  });
});
