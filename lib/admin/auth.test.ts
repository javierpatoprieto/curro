import { describe, it, expect } from "vitest";
import { firmarToken, verificarToken, huellaPassword } from "@/lib/admin/auth";

const SECRET = "un-secreto-largo-y-aleatorio-de-prueba";
const OTRO_SECRET = "otro-secreto-distinto";

describe("firmarToken / verificarToken", () => {
  const huella = huellaPassword("contraseña-actual");

  it("valida un token recién firmado con el mismo secreto y huella", () => {
    const exp = 10_000;
    const token = firmarToken(exp, { secret: SECRET, huella });
    expect(
      verificarToken(token, { secret: SECRET, huella, ahora: 5_000 }),
    ).toBe(true);
  });

  it("rechaza un token expirado", () => {
    const token = firmarToken(1_000, { secret: SECRET, huella });
    expect(
      verificarToken(token, { secret: SECRET, huella, ahora: 2_000 }),
    ).toBe(false);
  });

  it("rechaza si el secreto de firma cambia (token viejo inválido)", () => {
    const token = firmarToken(10_000, { secret: SECRET, huella });
    expect(
      verificarToken(token, { secret: OTRO_SECRET, huella, ahora: 5_000 }),
    ).toBe(false);
  });

  it("rechaza si cambia la contraseña (huella distinta)", () => {
    const token = firmarToken(10_000, { secret: SECRET, huella });
    const huellaNueva = huellaPassword("contraseña-nueva");
    expect(
      verificarToken(token, { secret: SECRET, huella: huellaNueva, ahora: 5_000 }),
    ).toBe(false);
  });

  it("rechaza valores mal formados o vacíos", () => {
    const opts = { secret: SECRET, huella, ahora: 5_000 };
    expect(verificarToken(undefined, opts)).toBe(false);
    expect(verificarToken("", opts)).toBe(false);
    expect(verificarToken("sin-punto", opts)).toBe(false);
    expect(verificarToken(".solo-hmac", opts)).toBe(false);
    expect(verificarToken("10000.", opts)).toBe(false);
    expect(verificarToken("abc.def", opts)).toBe(false);
  });

  it("rechaza un HMAC manipulado con exp válido", () => {
    const exp = 10_000;
    const token = firmarToken(exp, { secret: SECRET, huella });
    const manipulado = `${exp}.${"0".repeat(64)}`;
    expect(token).not.toBe(manipulado);
    expect(
      verificarToken(manipulado, { secret: SECRET, huella, ahora: 5_000 }),
    ).toBe(false);
  });
});

describe("huellaPassword", () => {
  it("es determinista y de 16 caracteres hex", () => {
    const h = huellaPassword("hola");
    expect(h).toBe(huellaPassword("hola"));
    expect(h).toMatch(/^[0-9a-f]{16}$/);
  });

  it("cambia con la contraseña", () => {
    expect(huellaPassword("hola")).not.toBe(huellaPassword("adios"));
  });
});
