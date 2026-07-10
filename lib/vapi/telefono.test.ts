import { describe, it, expect, vi, afterEach } from "vitest";
import {
  buildImportBody,
  importarNumeroEnVapi,
  eliminarNumeroVapi,
} from "@/lib/vapi/telefono";

describe("buildImportBody", () => {
  it("arma el cuerpo BYO-Twilio con provider, número y assistant", () => {
    const body = buildImportBody({
      numero: "+34910000000",
      assistantId: "asst_1",
      name: "Reformas García",
    });
    expect(body.provider).toBe("twilio");
    expect(body.number).toBe("+34910000000");
    expect(body.assistantId).toBe("asst_1");
    expect(body.name).toBe("Reformas García");
  });

  it("omite el nombre si no se pasa", () => {
    const body = buildImportBody({ numero: "+34910000000", assistantId: "a" });
    expect("name" in body).toBe(false);
  });
});

describe("importarNumeroEnVapi (mock por defecto)", () => {
  afterEach(() => vi.restoreAllMocks());

  it("devuelve un id simulado sin tocar la red cuando no está activo", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const r = await importarNumeroEnVapi({
      numero: "+34910000000",
      assistantId: "asst_1",
    });
    expect(r.id).toMatch(/^vapi_pn_mock_/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("eliminarNumeroVapi", () => {
  afterEach(() => vi.restoreAllMocks());

  it("es no-op para un id mock (no llama a la red)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await eliminarNumeroVapi("vapi_pn_mock_123");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
