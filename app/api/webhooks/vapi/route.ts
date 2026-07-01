import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseEndOfCallReport, type ParsedVapiCall } from "@/lib/vapi/parser";
import { verifyVapiSecret } from "@/lib/vapi/verify";
import { notificarNuevoLead } from "@/lib/messaging/notify";
import { contarLlamadasMes, limiteDe } from "@/lib/usage";
import type { Plan } from "@/lib/types";

export const runtime = "nodejs";

const ok = (data: object) => NextResponse.json({ ok: true, ...data });

const supabaseListo = () =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Webhook de Vapi. Al colgar una llamada, Vapi manda el "end-of-call-report".
 * Validamos el secreto, extraemos el lead y lo guardamos junto al call_event.
 * Respondemos siempre 200 a eventos válidos para que Vapi no reintente en bucle.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  // 1) Verificar el secreto compartido.
  if (env.VAPI_WEBHOOK_SECRET) {
    const header = request.headers.get("x-vapi-secret");
    if (!verifyVapiSecret(header, env.VAPI_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "firma inválida" }, { status: 401 });
    }
  } else if (env.isProd) {
    // En producción exigimos secreto sí o sí.
    return NextResponse.json(
      { error: "webhook sin secreto configurado" },
      { status: 500 },
    );
  } else {
    console.warn("[vapi] VAPI_WEBHOOK_SECRET no configurado: firma no verificada (dev).");
  }

  // 2) Parsear el payload.
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = parseEndOfCallReport(payload);
  if (!parsed) return ok({ ignored: true }); // otro tipo de mensaje

  // 3) Sin Supabase (dev temprano) no persistimos, pero confirmamos.
  if (!supabaseListo()) {
    console.info("[vapi] lead parseado (sin Supabase, no se guarda):", parsed.lead);
    return ok({ skipped: "sin-supabase" });
  }

  try {
    return await persistir(payload, parsed);
  } catch (e) {
    console.error("[vapi] error guardando el lead:", e);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }
}

async function persistir(payload: unknown, parsed: ParsedVapiCall) {
  const admin = createAdminClient();

  // Localizar el tenant por assistant y, si no, por número llamado.
  const business = await findBusiness(admin, parsed);
  if (!business) {
    console.warn(
      "[vapi] llamada sin negocio asociado (assistant/número desconocido):",
      parsed.assistantId,
      parsed.calledNumber,
    );
    return ok({ business: null });
  }

  // Idempotencia: si ya procesamos este call_id, no duplicamos.
  if (parsed.vapiCallId) {
    const { data: existente } = await admin
      .from("call_events")
      .select("id, lead_id")
      .eq("vapi_call_id", parsed.vapiCallId)
      .maybeSingle();
    if (existente) return ok({ duplicate: true, leadId: existente.lead_id });
  }

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .insert({
      business_id: business.id,
      cliente_nombre: parsed.lead.cliente_nombre,
      cliente_telefono: parsed.lead.cliente_telefono,
      tipo_trabajo: parsed.lead.tipo_trabajo,
      zona: parsed.lead.zona,
      urgencia: parsed.lead.urgencia,
      transcripcion: parsed.transcripcion,
      audio_url: parsed.audioUrl,
      source: "vapi",
    })
    .select("id")
    .single();
  if (leadError) throw leadError;

  const { error: eventError } = await admin.from("call_events").insert({
    business_id: business.id,
    lead_id: lead.id,
    vapi_call_id: parsed.vapiCallId,
    raw_payload: payload,
    duracion_seg: parsed.duracionSeg,
    coste_estimado: parsed.costeEstimado,
  });
  if (eventError) throw eventError;

  // Notificar: WhatsApp al cliente + aviso al dueño (WhatsApp + email).
  // Solo si el negocio está activo. Los fallos de envío no tumban el webhook:
  // el lead ya está guardado y cada envío queda registrado en `messages`.
  // Control de límite de llamadas por plan: si se supera, guardamos el lead
  // igualmente (no perdemos datos) pero no gastamos en notificaciones.
  const usadas = await contarLlamadasMes(admin, business.id);
  const dentroLimite = usadas <= limiteDe(business.plan as Plan);

  let notificados = 0;
  if (business.activo !== false && dentroLimite) {
    const { data: owners } = await admin
      .from("owners")
      .select("nombre, email, whatsapp")
      .eq("business_id", business.id);

    try {
      const res = await notificarNuevoLead({
        admin,
        business: {
          id: business.id,
          nombre: business.nombre,
          cal_link: business.cal_link,
        },
        lead: { id: lead.id, ...parsed.lead },
        owners: owners ?? [],
      });
      notificados = res.enviados;
    } catch (e) {
      console.error("[vapi] error notificando el lead:", e);
    }
  }

  return ok({
    leadId: lead.id,
    businessId: business.id,
    notificados,
    limiteSuperado: !dentroLimite,
  });
}

type Admin = ReturnType<typeof createAdminClient>;

async function findBusiness(admin: Admin, parsed: ParsedVapiCall) {
  if (parsed.assistantId) {
    const { data } = await admin
      .from("businesses")
      .select("id, activo, nombre, cal_link, plan")
      .eq("vapi_assistant_id", parsed.assistantId)
      .maybeSingle();
    if (data) return data;
  }
  if (parsed.calledNumber) {
    const { data } = await admin
      .from("businesses")
      .select("id, activo, nombre, cal_link, plan")
      .eq("telefono_entrante", parsed.calledNumber)
      .maybeSingle();
    if (data) return data;
  }
  return null;
}
