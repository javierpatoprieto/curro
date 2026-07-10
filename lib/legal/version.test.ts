import { describe, it, expect } from "vitest";
import { TERMINOS_VERSION } from "@/lib/legal/version";

// La versión de Términos + DPA se guarda como evidencia en user_metadata en el
// alta. Debe ser una fecha ISO válida (YYYY-MM-DD) para poder ordenarse y
// compararse de forma fiable.
describe("TERMINOS_VERSION", () => {
  it("tiene formato de fecha ISO YYYY-MM-DD", () => {
    expect(TERMINOS_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("es una fecha real y no inválida", () => {
    const fecha = new Date(`${TERMINOS_VERSION}T00:00:00.000Z`);
    expect(Number.isNaN(fecha.getTime())).toBe(false);
    expect(fecha.toISOString().slice(0, 10)).toBe(TERMINOS_VERSION);
  });
});
