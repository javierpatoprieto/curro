import { describe, it, expect } from "vitest";
import {
  parseContactoDueno,
  normalizarContactoDueno,
  contactoDuenoSchema,
} from "@/lib/owners/contacto";

function fd(campos: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(campos)) f.set(k, v);
  return f;
}

describe("parseContactoDueno", () => {
  it("acepta email válido + whatsapp", () => {
    const r = parseContactoDueno(
      fd({ owner_email: "dueno@reformas.es", owner_whatsapp: "+34600000000" }),
    );
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("dueno@reformas.es");
      expect(r.data.whatsapp).toBe("+34600000000");
    }
  });

  it("acepta email sin whatsapp (opcional)", () => {
    const r = parseContactoDueno(fd({ owner_email: "dueno@reformas.es" }));
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.whatsapp).toBeUndefined();
  });

  it("rechaza email inválido", () => {
    const r = parseContactoDueno(
      fd({ owner_email: "no-es-email", owner_whatsapp: "+34600000000" }),
    );
    expect(r.success).toBe(false);
  });

  it("rechaza email ausente", () => {
    const r = parseContactoDueno(fd({ owner_whatsapp: "+34600000000" }));
    expect(r.success).toBe(false);
  });
});

describe("normalizarContactoDueno", () => {
  it("recorta espacios y conserva el whatsapp", () => {
    const out = normalizarContactoDueno({
      email: "  dueno@reformas.es  ",
      whatsapp: "  +34600000000  ",
    });
    expect(out).toEqual({ email: "dueno@reformas.es", whatsapp: "+34600000000" });
  });

  it("convierte whatsapp vacío o en blanco a null", () => {
    expect(normalizarContactoDueno({ email: "a@b.es", whatsapp: "   " }).whatsapp).toBeNull();
    expect(normalizarContactoDueno({ email: "a@b.es", whatsapp: "" }).whatsapp).toBeNull();
    expect(normalizarContactoDueno({ email: "a@b.es" }).whatsapp).toBeNull();
  });
});

describe("contactoDuenoSchema", () => {
  it("expone el tipo esperado en un parse directo", () => {
    const parsed = contactoDuenoSchema.safeParse({ email: "a@b.es" });
    expect(parsed.success).toBe(true);
  });
});
