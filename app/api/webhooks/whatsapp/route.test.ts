import { describe, it, expect } from "vitest";
import { retoMeta, resumenEvento } from "@/app/api/webhooks/whatsapp/route";

describe("retoMeta (verificación de Meta)", () => {
  it("devuelve el challenge cuando el token coincide y mode=subscribe", () => {
    expect(
      retoMeta(
        { mode: "subscribe", token: "secreto", challenge: "1234" },
        "secreto",
      ),
    ).toBe("1234");
  });

  it("rechaza (null) si el token no coincide", () => {
    expect(
      retoMeta(
        { mode: "subscribe", token: "malo", challenge: "1234" },
        "secreto",
      ),
    ).toBeNull();
  });

  it("rechaza si mode no es subscribe o falta el verifyToken", () => {
    expect(
      retoMeta({ mode: "otro", token: "secreto", challenge: "1" }, "secreto"),
    ).toBeNull();
    expect(
      retoMeta({ mode: "subscribe", token: "secreto", challenge: "1" }, undefined),
    ).toBeNull();
  });
});

describe("resumenEvento", () => {
  it("resume estados de entrega", () => {
    const payload = {
      entry: [{ changes: [{ value: { statuses: [{ status: "delivered" }] } }] }],
    };
    expect(resumenEvento(payload)).toContain("status:delivered");
  });

  it("resume mensajes entrantes", () => {
    const payload = {
      entry: [{ changes: [{ value: { messages: [{ id: "a" }, { id: "b" }] } }] }],
    };
    expect(resumenEvento(payload)).toContain("entrante:2");
  });

  it("no rompe con payloads vacíos o inesperados", () => {
    expect(resumenEvento({})).toBe("evento sin entry");
    expect(resumenEvento(null)).toBe("evento sin entry");
  });
});
