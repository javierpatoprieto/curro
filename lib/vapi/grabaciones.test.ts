import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// env mutable: por defecto modo mock (mockProviders = true), sin API key.
vi.mock("@/lib/env", () => ({
  env: { mockProviders: true, VAPI_API_KEY: undefined as string | undefined },
}));

import { borrarGrabacionVapi } from "@/lib/vapi/grabaciones";
import { env } from "@/lib/env";

const mutableEnv = env as { mockProviders: boolean; VAPI_API_KEY?: string };
const fetchSpy = vi.spyOn(globalThis, "fetch");

beforeEach(() => {
  fetchSpy.mockReset();
  // Cualquier fetch inesperado falla ruidosamente (no debe llamarse en mock).
  fetchSpy.mockRejectedValue(new Error("fetch inesperado"));
  mutableEnv.mockProviders = true;
  mutableEnv.VAPI_API_KEY = undefined;
});

afterEach(() => {
  fetchSpy.mockReset();
});

describe("borrarGrabacionVapi (mock por defecto)", () => {
  it("en modo mock es no-op y no llama a la red", async () => {
    const r = await borrarGrabacionVapi("call_123");
    expect(r.modo).toBe("mock");
    expect(r.borrada).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sin callId devuelve borrada:false sin red", async () => {
    const r = await borrarGrabacionVapi(null);
    expect(r.borrada).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
    const r2 = await borrarGrabacionVapi("   ");
    expect(r2.borrada).toBe(false);
  });
});

describe("borrarGrabacionVapi (modo real)", () => {
  beforeEach(() => {
    mutableEnv.mockProviders = false;
    mutableEnv.VAPI_API_KEY = "vapi_test_key";
  });

  it("hace DELETE al endpoint de call de Vapi con el bearer", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 200 }));
    const r = await borrarGrabacionVapi("call_abc");
    expect(r.modo).toBe("real");
    expect(r.borrada).toBe(true);
    expect(r.status).toBe(200);
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.vapi.ai/call/call_abc");
    expect(init.method).toBe("DELETE");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer vapi_test_key",
    );
  });

  it("trata 404 como éxito (la grabación ya no existe)", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 404 }));
    const r = await borrarGrabacionVapi("call_desaparecida");
    expect(r.borrada).toBe(true);
    expect(r.status).toBe(404);
  });

  it("lanza ante otros errores HTTP", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("boom", { status: 500 }));
    await expect(borrarGrabacionVapi("call_x")).rejects.toThrow(/Vapi 500/);
  });
});
