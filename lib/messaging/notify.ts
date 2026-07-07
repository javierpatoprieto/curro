import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWhatsAppClient, type WhatsAppMessage } from "@/lib/messaging/whatsapp";
import { getEmailClient, type EmailMessage } from "@/lib/messaging/email";
import { withRetry } from "@/lib/messaging/retry";
import {
  whatsappCliente,
  whatsappDueno,
  emailDueno,
  PLANTILLA_CLIENTE,
  PLANTILLA_DUENO,
  type LeadInfo,
} from "@/lib/messaging/templates";

type Admin = ReturnType<typeof createAdminClient>;

interface NotifyParams {
  admin: Admin;
  business: { id: string; nombre: string; cal_link: string | null };
  lead: LeadInfo & { id: string };
  owners: { nombre: string | null; email: string | null; whatsapp: string | null }[];
}

const panelUrl = () =>
  env.APP_URL || env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

async function registrarMensaje(
  admin: Admin,
  row: {
    business_id: string;
    lead_id: string;
    canal: "whatsapp" | "email";
    plantilla: string;
    estado_envio: "enviado" | "fallido";
    payload: unknown;
    error: string | null;
  },
) {
  await admin.from("messages").insert({ direccion: "saliente", ...row });
}

async function enviarWhatsApp(
  admin: Admin,
  args: { business_id: string; lead_id: string; plantilla: string; msg: WhatsAppMessage },
) {
  const wa = getWhatsAppClient();
  let estado: "enviado" | "fallido" = "enviado";
  let error: string | null = null;
  let payload: unknown = { modo: wa.modo };
  try {
    const res = await withRetry(() => wa.send(args.msg));
    payload = { modo: wa.modo, id: res.id, request: res.request };
  } catch (e) {
    estado = "fallido";
    error = errMsg(e);
  }
  await registrarMensaje(admin, {
    business_id: args.business_id,
    lead_id: args.lead_id,
    canal: "whatsapp",
    plantilla: args.plantilla,
    estado_envio: estado,
    payload,
    error,
  });
  return estado;
}

async function enviarEmail(
  admin: Admin,
  args: { business_id: string; lead_id: string; msg: EmailMessage },
) {
  const email = getEmailClient();
  let estado: "enviado" | "fallido" = "enviado";
  let error: string | null = null;
  let payload: unknown = { modo: email.modo };
  try {
    const res = await withRetry(() => email.send(args.msg));
    payload = { modo: email.modo, id: res.id, request: res.request };
  } catch (e) {
    estado = "fallido";
    error = errMsg(e);
  }
  await registrarMensaje(admin, {
    business_id: args.business_id,
    lead_id: args.lead_id,
    canal: "email",
    plantilla: "email_aviso_lead",
    estado_envio: estado,
    payload,
    error,
  });
  return estado;
}

/**
 * Al crear un lead: confirma al cliente por WhatsApp (con enlace Cal.com) —solo si
 * el negocio tiene `cal_link`, ya que la plantilla aprobada en Meta no admite
 * variables vacías— y avisa al/los dueño(s) por WhatsApp y email. Cada envío se
 * reintenta y se registra en `messages`; los fallos no interrumpen el resto (se
 * guardan como "fallido").
 */
export async function notificarNuevoLead({
  admin,
  business,
  lead,
  owners,
}: NotifyParams) {
  const tareas: Promise<unknown>[] = [];

  if (lead.cliente_telefono && business.cal_link) {
    tareas.push(
      enviarWhatsApp(admin, {
        business_id: business.id,
        lead_id: lead.id,
        plantilla: PLANTILLA_CLIENTE,
        msg: whatsappCliente({
          to: lead.cliente_telefono,
          negocio: business.nombre,
          calLink: business.cal_link,
          nombre: lead.cliente_nombre,
        }),
      }),
    );
  }

  for (const owner of owners) {
    if (owner.whatsapp) {
      tareas.push(
        enviarWhatsApp(admin, {
          business_id: business.id,
          lead_id: lead.id,
          plantilla: PLANTILLA_DUENO,
          msg: whatsappDueno({ to: owner.whatsapp, negocio: business.nombre, lead }),
        }),
      );
    }
    if (owner.email) {
      tareas.push(
        enviarEmail(admin, {
          business_id: business.id,
          lead_id: lead.id,
          msg: emailDueno({
            to: owner.email,
            negocio: business.nombre,
            lead,
            panelUrl: panelUrl(),
          }),
        }),
      );
    }
  }

  await Promise.all(tareas);
  return { enviados: tareas.length };
}
