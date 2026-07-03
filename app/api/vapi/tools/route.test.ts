import { describe, it, expect } from "vitest";
import { parseArgs, formatoFecha } from "@/app/api/vapi/tools/route";

describe("parseArgs", () => {
  it("parsea argumentos como string JSON", () => {
    expect(parseArgs('{"nombre":"Ana","dias":7}')).toEqual({
      nombre: "Ana",
      dias: 7,
    });
  });

  it("acepta un objeto ya parseado", () => {
    expect(parseArgs({ nombre: "Ana" })).toEqual({ nombre: "Ana" });
  });

  it("devuelve {} ante entradas inválidas", () => {
    expect(parseArgs("no-json")).toEqual({});
    expect(parseArgs(undefined)).toEqual({});
    expect(parseArgs(42)).toEqual({});
  });
});

describe("formatoFecha", () => {
  it("convierte ISO UTC a hora de Madrid (verano = +2)", () => {
    // 08:00 UTC en julio → 10:00 en Europe/Madrid.
    expect(formatoFecha("2025-07-16T08:00:00.000Z")).toContain("10:00");
  });

  it("devuelve la cadena original si no es una fecha válida", () => {
    expect(formatoFecha("no-es-fecha")).toBe("no-es-fecha");
  });
});
