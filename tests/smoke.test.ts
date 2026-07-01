import { describe, it, expect } from "vitest";
import { LEAD_ESTADOS, PLANES } from "@/lib/types";

// Test humo: confirma que Vitest y el alias "@/" funcionan.
// Los tests de verdad (parser de Vapi, estados del lead, activación Stripe)
// llegan en sus fases correspondientes.
describe("scaffold", () => {
  it("expone los estados del lead esperados", () => {
    expect(LEAD_ESTADOS).toContain("nuevo");
    expect(LEAD_ESTADOS).toContain("ganado");
    expect(LEAD_ESTADOS).toHaveLength(6);
  });

  it("expone los planes", () => {
    expect(PLANES).toContain("trial");
    expect(PLANES).toContain("cancelado");
  });
});
