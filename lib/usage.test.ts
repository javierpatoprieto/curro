import { describe, it, expect } from "vitest";
import { dentroDelLimite, limiteDe } from "@/lib/usage";

describe("límites de uso por plan", () => {
  it("cada plan tiene su límite de llamadas", () => {
    expect(limiteDe("starter")).toBe(100);
    expect(limiteDe("pro")).toBe(300);
    expect(limiteDe("cancelado")).toBe(0);
  });

  it("permite mientras no se alcance el límite", () => {
    expect(dentroDelLimite(99, "starter")).toBe(true);
    expect(dentroDelLimite(100, "starter")).toBe(false);
    expect(dentroDelLimite(299, "pro")).toBe(true);
    expect(dentroDelLimite(0, "cancelado")).toBe(false);
  });
});
