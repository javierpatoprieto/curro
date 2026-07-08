import { describe, it, expect } from "vitest";
import { configDesdeNegocio } from "@/lib/vapi/config-negocio";
import type { Business } from "@/lib/types";

const negocio: Pick<
  Business,
  | "nombre"
  | "ciudad"
  | "servicios"
  | "zonas"
  | "horario"
  | "tono"
  | "preguntas_clave"
  | "conocimiento"
  | "voz"
  | "actividad"
> = {
  nombre: "Reformas García",
  ciudad: "Madrid",
  servicios: "baños y cocinas",
  zonas: "Chamberí",
  horario: "L-V 9-18",
  tono: "cercano",
  preguntas_clave: "¿metros?",
  conocimiento: "garantía 2 años",
  voz: "masculina",
  actividad: "fontanería",
};

describe("configDesdeNegocio", () => {
  it("preserva voz y actividad (no se resetean al re-sincronizar)", () => {
    const c = configDesdeNegocio(negocio, true);
    expect(c.voz).toBe("masculina");
    expect(c.actividad).toBe("fontanería");
    expect(c.calConectado).toBe(true);
    expect(c.negocio).toBe("Reformas García");
  });

  it("mapea null cuando voz/actividad no están definidas", () => {
    const c = configDesdeNegocio(
      { ...negocio, voz: null, actividad: null },
      false,
    );
    expect(c.voz).toBeNull();
    expect(c.actividad).toBeNull();
    expect(c.calConectado).toBe(false);
  });
});
