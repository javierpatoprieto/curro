import { describe, it, expect } from "vitest";
import { ENTITLEMENTS, puede, type Capacidad } from "@/lib/plans";

describe("entitlements por plan", () => {
  it("Starter: sin agenda, sin número dedicado, con aviso al dueño", () => {
    expect(puede("starter", "agenda")).toBe(false);
    expect(puede("starter", "numeroDedicado")).toBe(false);
    expect(puede("starter", "confirmacionCliente")).toBe(false);
  });

  it("Pro: agenda + confirmación + número dedicado, sin multi-número", () => {
    expect(puede("pro", "agenda")).toBe(true);
    expect(puede("pro", "confirmacionCliente")).toBe(true);
    expect(puede("pro", "numeroDedicado")).toBe(true);
    expect(puede("pro", "multiNumero")).toBe(false);
  });

  it("Premium: todo", () => {
    const caps: Capacidad[] = ["agenda", "confirmacionCliente", "numeroDedicado", "multiNumero"];
    for (const c of caps) expect(puede("premium", c)).toBe(true);
  });

  it("trial hereda features de Pro; cancelado no puede nada", () => {
    expect(puede("trial", "agenda")).toBe(true);
    expect(puede("cancelado", "agenda")).toBe(false);
  });

  it("todos los planes del tipo Plan están en ENTITLEMENTS", () => {
    expect(Object.keys(ENTITLEMENTS).sort()).toEqual(
      ["cancelado", "premium", "pro", "starter", "trial"].sort(),
    );
  });
});
