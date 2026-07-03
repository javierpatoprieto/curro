import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { evaluar, rateLimit } from "@/lib/ratelimit";

describe("evaluar", () => {
  it("permite (null) mientras count <= limite", () => {
    expect(evaluar(1, 3, 10_000)).toBeNull();
    expect(evaluar(3, 3, 10_000)).toBeNull();
  });

  it("bloquea (429 con retry-after) al superar el límite", () => {
    const res = evaluar(4, 3, 8_000);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(429);
    expect(res!.headers.get("retry-after")).toBe("8");
  });

  it("retry-after nunca baja de 1 segundo", () => {
    const res = evaluar(10, 1, 100);
    expect(res!.headers.get("retry-after")).toBe("1");
  });
});

function req(ip: string): NextRequest {
  return new NextRequest("https://curro.test/api/webhooks/vapi", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("rateLimit (modo memoria)", () => {
  it("deja pasar hasta el límite y luego bloquea, por IP", async () => {
    const bucket = "test-memoria";
    const opts = { limite: 2, ventanaMs: 60_000 };
    // Misma IP: 1 y 2 pasan, la 3ª se bloquea.
    expect(await rateLimit(req("1.1.1.1"), bucket, opts)).toBeNull();
    expect(await rateLimit(req("1.1.1.1"), bucket, opts)).toBeNull();
    const bloqueo = await rateLimit(req("1.1.1.1"), bucket, opts);
    expect(bloqueo?.status).toBe(429);
    // Otra IP tiene su propio contador.
    expect(await rateLimit(req("2.2.2.2"), bucket, opts)).toBeNull();
  });
});
