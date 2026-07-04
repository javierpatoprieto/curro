import { describe, it, expect } from "vitest";
import { capacidadesEfectivas } from "./actions";

describe("capacidades efectivas según plan en el alta", () => {
  it("ignora agenda/confirmación si el plan no las incluye (Starter)", () => {
    const c = capacidadesEfectivas("starter", { agenda: true, confirmacionCliente: true });
    expect(c.agenda).toBe(false);
    expect(c.confirmacionCliente).toBe(false);
  });
  it("respeta lo pedido si el plan lo permite (Pro)", () => {
    const c = capacidadesEfectivas("pro", { agenda: true, confirmacionCliente: false });
    expect(c.agenda).toBe(true);
    expect(c.confirmacionCliente).toBe(false);
  });
});
