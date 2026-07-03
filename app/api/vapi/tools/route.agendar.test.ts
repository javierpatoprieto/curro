import { describe, it, expect } from "vitest";
import { elegirHueco } from "@/app/api/vapi/tools/route";

const HUECOS = [
  "2026-07-16T08:00:00.000Z",
  "2026-07-16T09:00:00.000Z",
  "2026-07-17T07:30:00.000Z",
];

describe("elegirHueco", () => {
  it("empareja un instante idéntico y devuelve el string CANÓNICO de Cal", () => {
    expect(elegirHueco("2026-07-16T09:00:00.000Z", HUECOS)).toBe(
      "2026-07-16T09:00:00.000Z",
    );
  });

  it("tolera que el modelo omita los milisegundos (mismo instante)", () => {
    // El modelo devuelve `...:00Z`; Cal tenía `...:00.000Z`. Reservamos con el de Cal.
    expect(elegirHueco("2026-07-16T08:00:00Z", HUECOS)).toBe(
      "2026-07-16T08:00:00.000Z",
    );
  });

  it("tolera el offset explícito +00:00 en vez de Z", () => {
    expect(elegirHueco("2026-07-17T07:30:00+00:00", HUECOS)).toBe(
      "2026-07-17T07:30:00.000Z",
    );
  });

  it("devuelve null si el instante no coincide con ningún hueco", () => {
    expect(elegirHueco("2026-07-16T08:30:00.000Z", HUECOS)).toBeNull();
  });

  it("devuelve null ante una fecha inválida", () => {
    expect(elegirHueco("no-es-fecha", HUECOS)).toBeNull();
    expect(elegirHueco("", HUECOS)).toBeNull();
  });

  it("devuelve null si no hay huecos", () => {
    expect(elegirHueco("2026-07-16T08:00:00.000Z", [])).toBeNull();
  });
});
