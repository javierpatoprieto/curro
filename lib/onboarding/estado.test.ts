import { describe, it, expect } from "vitest";
import {
  PASOS,
  PASOS_LABEL,
  estadoInicial,
  marcarPaso,
  todoListo,
  iconoDeEstado,
  type OnboardingStatus,
} from "@/lib/onboarding/estado";

describe("estadoInicial", () => {
  it("crea un estado con los 5 pasos, todos pendientes por defecto (plan pro, forward)", () => {
    const st = estadoInicial("pro", "forward");
    for (const paso of PASOS) {
      expect(st[paso]).toBeDefined();
    }
    expect(st.assistant.estado).toBe("pendiente");
    expect(st.telefono.estado).toBe("pendiente");
    expect(st.agenda.estado).toBe("pendiente");
    expect(st.whatsapp.estado).toBe("pendiente");
    expect(st.activo.estado).toBe("pendiente");
  });

  it("marca agenda como omitido cuando el plan no la incluye (starter)", () => {
    const st = estadoInicial("starter", "forward");
    // starter no tiene agenda ni confirmacionCliente
    expect(st.agenda.estado).toBe("omitido");
    expect(st.whatsapp.estado).toBe("omitido");
    // assistant, telefono y activo siguen pendientes
    expect(st.assistant.estado).toBe("pendiente");
    expect(st.telefono.estado).toBe("pendiente");
  });

  it("con phone_mode 'none' marca el paso teléfono como omitido", () => {
    const st = estadoInicial("pro", "none");
    expect(st.telefono.estado).toBe("omitido");
  });

  it("con phone_mode 'new' y plan sin numeroDedicado (starter) omite el teléfono", () => {
    const st = estadoInicial("starter", "new");
    expect(st.telefono.estado).toBe("omitido");
  });

  it("con phone_mode 'new' y plan con numeroDedicado (pro) deja teléfono pendiente", () => {
    const st = estadoInicial("pro", "new");
    expect(st.telefono.estado).toBe("pendiente");
  });
});

describe("marcarPaso", () => {
  it("actualiza un paso de forma inmutable, sin tocar el original", () => {
    const st = estadoInicial("pro", "forward");
    const st2 = marcarPaso(st, "assistant", "hecho", { detalle: "asst_123" });
    expect(st2.assistant!.estado).toBe("hecho");
    expect(st2.assistant!.detalle).toBe("asst_123");
    expect(st2.assistant!.at).toBeTypeOf("string");
    // El original no cambia (inmutable).
    expect(st.assistant.estado).toBe("pendiente");
    expect(st2).not.toBe(st);
  });

  it("permite marcar error con detalle", () => {
    const st = estadoInicial("pro", "forward");
    const st2 = marcarPaso(st, "telefono", "error", { detalle: "Twilio 500" });
    expect(st2.telefono!.estado).toBe("error");
    expect(st2.telefono!.detalle).toBe("Twilio 500");
  });
});

describe("todoListo", () => {
  it("es false si algún paso no-omitido sigue pendiente o en error", () => {
    const st = estadoInicial("pro", "forward");
    expect(todoListo(st)).toBe(false);
  });

  it("ignora los pasos omitidos y es true cuando el resto están hechos", () => {
    let st: OnboardingStatus = estadoInicial("starter", "forward"); // agenda + whatsapp omitidos
    st = marcarPaso(st, "assistant", "hecho");
    st = marcarPaso(st, "telefono", "hecho");
    st = marcarPaso(st, "activo", "hecho");
    expect(todoListo(st)).toBe(true);
  });

  it("es false si un paso está en error aunque el resto estén hechos", () => {
    let st: OnboardingStatus = estadoInicial("pro", "forward");
    st = marcarPaso(st, "assistant", "hecho");
    st = marcarPaso(st, "telefono", "error");
    st = marcarPaso(st, "agenda", "hecho");
    st = marcarPaso(st, "whatsapp", "hecho");
    st = marcarPaso(st, "activo", "hecho");
    expect(todoListo(st)).toBe(false);
  });
});

describe("PASOS_LABEL / iconoDeEstado", () => {
  it("hay una etiqueta legible por cada paso", () => {
    for (const paso of PASOS) {
      expect(PASOS_LABEL[paso]).toBeTruthy();
    }
  });

  it("iconoDeEstado devuelve un símbolo por estado conocido", () => {
    expect(iconoDeEstado("hecho")).toBeTruthy();
    expect(iconoDeEstado("pendiente")).toBeTruthy();
    expect(iconoDeEstado("error")).toBeTruthy();
    expect(iconoDeEstado("omitido")).toBeTruthy();
  });
});

describe("OnboardingStatus (forma)", () => {
  it("acepta un objeto vacío como estado (columna con default '{}')", () => {
    const vacio: OnboardingStatus = {};
    expect(todoListo(vacio)).toBe(true); // sin pasos no-omitidos pendientes
  });
});
