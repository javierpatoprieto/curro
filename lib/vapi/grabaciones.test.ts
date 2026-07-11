import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// env mutable: por defecto modo mock (mockProviders = true), sin API key.
vi.mock("@/lib/env", () => ({
  env: { mockProviders: true, VAPI_API_KEY: undefined as string | undefined },
}));

import {
  borrarGrabacionVapi,
  urlFirmadaGrabacion,
} from "@/lib/vapi/grabaciones";
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

describe("urlFirmadaGrabacion (mock por defecto)", () => {
  it("en modo mock devuelve una URL simulada sin tocar la red", async () => {
    const url = await urlFirmadaGrabacion("call_123");
    expect(url).toContain("call_123");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sin callId devuelve null sin red", async () => {
    expect(await urlFirmadaGrabacion(null)).toBeNull();
    expect(await urlFirmadaGrabacion("   ")).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("urlFirmadaGrabacion (modo real)", () => {
  beforeEach(() => {
    mutableEnv.mockProviders = false;
    mutableEnv.VAPI_API_KEY = "vapi_test_key";
  });

  it("captura el 302 y devuelve la URL firmada del header Location", async () => {
    const firmada = "https://storage.vapi.ai/recordings/abc.wav?sig=xyz";
    // `redirect: "manual"` => fetch NO sigue el 302; leemos su Location.
    fetchSpy.mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { Location: firmada },
      }),
    );

    const url = await urlFirmadaGrabacion("call_abc");
    expect(url).toBe(firmada);

    const [reqUrl, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(reqUrl).toBe("https://api.vapi.ai/call/call_abc/mono-recording");
    expect(init.method).toBe("GET");
    expect(init.redirect).toBe("manual");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer vapi_test_key",
    );
  });

  it("ante un no-2xx/3xx (p. ej. 404) devuelve null sin lanzar", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("nope", { status: 404 }));
    expect(await urlFirmadaGrabacion("call_desaparecida")).toBeNull();
  });

  it("ante un 3xx sin Location devuelve null", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 302 }));
    expect(await urlFirmadaGrabacion("call_sin_location")).toBeNull();
  });

  it("ante un fallo de red devuelve null sin lanzar", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("ECONNRESET"));
    expect(await urlFirmadaGrabacion("call_red")).toBeNull();
  });
});
