import { describe, it, expect } from "vitest";
import {
  getEmailClient,
  resumenEnvioEmail,
  type EmailMessage,
} from "@/lib/messaging/email";
import { emailDueno } from "@/lib/messaging/templates";

// Email de aviso realista: destinatario (dueño) + asunto con PII del lead
// (nombre + tipo de trabajo). Es exactamente lo que NO debe acabar en
// `messages.payload`.
const emailConPII: EmailMessage = emailDueno({
  to: "antonio@reformas-garcia.es",
  negocio: "Reformas García",
  lead: {
    cliente_nombre: "María López",
    cliente_telefono: "+34611222333",
    tipo_trabajo: "Reforma de baño",
    zona: "Chamberí",
    urgencia: true,
  },
  panelUrl: "https://app.curro.test",
});

describe("resumenEnvioEmail (minimización PII en messages.payload)", () => {
  it("solo guarda canal y proveedor: NADA de destinatario ni asunto", () => {
    const r = resumenEnvioEmail("resend");
    expect(r).toEqual({ canal: "email", proveedor: "resend" });
    // No debe existir ninguna clave con el destinatario ni el asunto.
    expect(r).not.toHaveProperty("to");
    expect(r).not.toHaveProperty("subject");
    expect(r).not.toHaveProperty("from");
  });
});

describe("EmailClient.send: el payload persistido no lleva PII", () => {
  it("el mock devuelve un resumen sin el email del destinatario ni el asunto con PII", async () => {
    const client = getEmailClient(); // en test → MockEmailClient
    const res = await client.send(emailConPII);

    const serializado = JSON.stringify(res.request);
    // Email del destinatario (dueño).
    expect(serializado).not.toContain("antonio@reformas-garcia.es");
    // PII del interesado que viaja en el asunto (`emailDueno`): nombre y trabajo.
    expect(serializado).not.toContain("María");
    expect(serializado).not.toContain("baño");
    // Y es exactamente el resumen minimizado.
    expect(res.request).toEqual({ canal: "email", proveedor: "mock" });
  });

  it("el asunto generado por emailDueno SÍ contiene PII (control del test)", () => {
    // Confirma que el asunto que estamos excluyendo realmente lleva PII, para
    // que la aserción anterior sea significativa y no un falso verde.
    expect(emailConPII.subject).toContain("María López");
    expect(emailConPII.subject).toContain("Reforma de baño");
  });
});
