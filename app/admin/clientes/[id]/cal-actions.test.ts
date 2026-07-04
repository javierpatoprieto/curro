import { describe, it, expect } from "vitest";
import { calPermitidoParaPlan } from "@/lib/plans";

describe("gating de agenda por plan en admin", () => {
  it("bloquea Starter, permite Pro/Premium/Trial", () => {
    expect(calPermitidoParaPlan("starter")).toBe(false);
    expect(calPermitidoParaPlan("pro")).toBe(true);
    expect(calPermitidoParaPlan("premium")).toBe(true);
    expect(calPermitidoParaPlan("trial")).toBe(true);
  });
});
