import { describe, it, expect } from "vitest";
import { extraerStarts } from "@/lib/cal/client";

describe("extraerStarts", () => {
  it("aplana huecos agrupados por fecha bajo data", () => {
    const json = {
      status: "success",
      data: {
        "2025-07-16": [{ start: "2025-07-16T08:00:00.000Z" }, { start: "2025-07-16T09:00:00.000Z" }],
        "2025-07-17": [{ start: "2025-07-17T07:00:00.000Z" }],
      },
    };
    expect(extraerStarts(json)).toEqual([
      "2025-07-16T08:00:00.000Z",
      "2025-07-16T09:00:00.000Z",
      "2025-07-17T07:00:00.000Z",
    ]);
  });

  it("admite la variante envuelta en data.slots", () => {
    const json = {
      data: { slots: { "2025-07-16": [{ start: "2025-07-16T10:00:00.000Z" }] } },
    };
    expect(extraerStarts(json)).toEqual(["2025-07-16T10:00:00.000Z"]);
  });

  it("ignora entradas que no son arrays o sin start", () => {
    const json = { data: { "2025-07-16": [{ foo: 1 }], meta: 3 } };
    expect(extraerStarts(json)).toEqual([]);
  });

  it("devuelve [] ante formas vacías o inesperadas", () => {
    expect(extraerStarts(null)).toEqual([]);
    expect(extraerStarts({})).toEqual([]);
    expect(extraerStarts({ data: null })).toEqual([]);
  });
});
