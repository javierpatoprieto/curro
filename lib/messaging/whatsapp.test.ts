import { describe, it, expect } from "vitest";
import { normalizeTo } from "@/lib/messaging/whatsapp";

describe("normalizeTo", () => {
  it("deja solo dígitos (lo que espera WhatsApp Cloud API)", () => {
    expect(normalizeTo("+34 611 111 111")).toBe("34611111111");
    expect(normalizeTo("+34-600-00-00-00")).toBe("34600000000");
    expect(normalizeTo("34611111111")).toBe("34611111111");
  });
});
