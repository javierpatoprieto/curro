import type { EmailMessage } from "@/lib/messaging/email";
import type { WhatsAppMessage } from "@/lib/messaging/whatsapp";

export interface LeadInfo {
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  tipo_trabajo: string | null;
  zona: string | null;
  urgencia: boolean;
}

/** Nombres de las plantillas de WhatsApp (deben estar aprobadas en Meta). */
export const PLANTILLA_CLIENTE = "curro_confirmacion_cliente";
export const PLANTILLA_DUENO = "curro_aviso_lead";

/** WhatsApp de confirmación al cliente final, con enlace para agendar visita. */
export function whatsappCliente(params: {
  to: string;
  negocio: string;
  calLink: string | null;
  nombre: string | null;
}): WhatsAppMessage {
  const { to, negocio, calLink, nombre } = params;
  const saludo = nombre ? `Hola ${nombre}` : "Hola";
  const agenda = calLink
    ? ` Puedes reservar tu visita de valoración aquí: ${calLink}`
    : "";
  const texto = `${saludo}, soy el asistente de ${negocio}. Hemos recibido tu solicitud y te contactaremos enseguida.${agenda}`;

  // La plantilla aprobada en Meta NO admite variables vacías: si el envío se
  // hace como plantilla, cada {{n}} debe tener texto. El nombre puede faltar
  // (llamada sin nombre), así que usamos un saludo genérico no vacío. El enlace
  // ({{3}}) lo garantiza quien invoca (notify solo manda esta plantilla cuando
  // el negocio tiene cal_link), pero por robustez tampoco lo dejamos vacío.
  const nombreVar = nombre?.trim() || "cliente";

  return {
    kind: "template",
    to,
    template: PLANTILLA_CLIENTE,
    variables: [nombreVar, negocio, calLink ?? ""],
    texto,
  };
}

/** WhatsApp de aviso al dueño con el resumen del lead. */
export function whatsappDueno(params: {
  to: string;
  negocio: string;
  lead: LeadInfo;
}): WhatsAppMessage {
  const { to, negocio, lead } = params;
  const lineas = [
    `🔔 Nuevo lead en ${negocio}`,
    `👤 ${lead.cliente_nombre ?? "Sin nombre"} · ${lead.cliente_telefono ?? "sin teléfono"}`,
    `🛠️ ${lead.tipo_trabajo ?? "—"}`,
    `📍 ${lead.zona ?? "—"}`,
  ];
  if (lead.urgencia) lineas.push("🔥 URGENTE");
  const texto = lineas.join("\n");

  return {
    kind: "template",
    to,
    template: PLANTILLA_DUENO,
    variables: [
      negocio,
      lead.cliente_nombre ?? "Sin nombre",
      lead.cliente_telefono ?? "sin teléfono",
      lead.tipo_trabajo ?? "—",
      lead.zona ?? "—",
      lead.urgencia ? "Sí" : "No",
    ],
    texto,
  };
}

/** Email de aviso al dueño. */
export function emailDueno(params: {
  to: string;
  negocio: string;
  lead: LeadInfo;
  panelUrl: string;
}): EmailMessage {
  const { to, negocio, lead, panelUrl } = params;
  const nombre = lead.cliente_nombre ?? "Sin nombre";
  const trabajo = lead.tipo_trabajo ?? "reforma";
  const urgente = lead.urgencia ? " (URGENTE)" : "";

  const subject = `Nuevo lead${urgente}: ${nombre} — ${trabajo}`;

  const filas: [string, string][] = [
    ["Cliente", nombre],
    ["Teléfono", lead.cliente_telefono ?? "—"],
    ["Trabajo", lead.tipo_trabajo ?? "—"],
    ["Zona", lead.zona ?? "—"],
    ["Urgencia", lead.urgencia ? "Alta" : "Normal"],
  ];

  const text = [
    `Nuevo lead en ${negocio}${urgente}`,
    "",
    ...filas.map(([k, v]) => `${k}: ${v}`),
    "",
    `Ábrelo en tu panel: ${panelUrl}/panel/leads`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto">
      <h2 style="margin:0 0 4px">Nuevo lead en ${negocio}${
        lead.urgencia
          ? ' <span style="color:#e8482a">· URGENTE</span>'
          : ""
      }</h2>
      <p style="color:#555;margin:0 0 16px">Curro acaba de atender una llamada.</p>
      <table style="width:100%;border-collapse:collapse">
        ${filas
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 0;color:#888;width:120px">${k}</td><td style="padding:8px 0;font-weight:600">${v}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0">
        <a href="${panelUrl}/panel/leads"
           style="background:#ff6b4a;color:#fff;padding:10px 18px;border-radius:9999px;text-decoration:none;font-weight:600">
          Ver en el panel
        </a>
      </p>
    </div>`.trim();

  return { to, subject, html, text };
}
