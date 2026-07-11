import { NextResponse, type NextRequest } from "next/server";
import { getLeadById } from "@/lib/leads";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { urlFirmadaGrabacion } from "@/lib/vapi/grabaciones";

export const runtime = "nodejs";

/**
 * Sirve la grabación de un lead redirigiendo a una URL firmada de Vapi.
 *
 * Sustituye al enlace directo a `lead.audio_url` (URL pública), que Vapi deja de
 * servir el 15 jul. El navegador pide `/api/grabacion/{leadId}` y esta ruta
 * responde un 302 hacia la URL firmada de corta duración que devuelve Vapi.
 *
 * AISLAMIENTO POR NEGOCIO (anti-IDOR): NO consultamos leads por id "a pelo".
 * Reutilizamos `getLeadById`, que ya scopea al negocio del usuario autenticado
 * (RLS con la sesión por cookies: solo devuelve leads cuyo `business_id` está en
 * `current_business_ids()`). Si el lead es de otro negocio, `getLeadById`
 * devuelve `null` y respondemos 404 — nunca revelamos la grabación de otro
 * negocio ni distinguimos "no existe" de "no es tuyo".
 *
 * La API key de Vapi es server-side (esta ruta corre en el servidor) y nunca
 * llega al cliente.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const { leadId } = await params;

  // 1) Localizar el lead SCOPEADO al negocio del usuario autenticado.
  //    Si no es suyo (o no existe) → 404. Esto garantiza el aislamiento.
  const lead = await getLeadById(leadId);
  if (!lead) {
    return NextResponse.json({ error: "no encontrado" }, { status: 404 });
  }

  // "Hay grabación" se sigue marcando con audio_url (igual que en el panel).
  if (!lead.audio_url) {
    return NextResponse.json({ error: "sin grabación" }, { status: 404 });
  }

  // 2) Obtener el vapi_call_id del lead (el más reciente con call_id) desde
  //    call_events. También está protegido por RLS (business_id): con la sesión
  //    del usuario solo se ven los call_events de su negocio.
  const callId = await callIdDeLead(leadId);
  if (!callId) {
    return NextResponse.json({ error: "sin grabación" }, { status: 404 });
  }

  // 3) Pedir a Vapi la URL firmada (302). Si no se puede obtener → 404.
  const url = await urlFirmadaGrabacion(callId);
  if (!url) {
    return NextResponse.json({ error: "sin grabación" }, { status: 404 });
  }

  // 4) Redirigir (302) para que el navegador descargue el audio de la URL firmada.
  return NextResponse.redirect(url, 302);
}

/**
 * `vapi_call_id` del lead: el call_event más reciente que tenga call_id.
 * En modo demo no hay grabaciones reales → null.
 */
async function callIdDeLead(leadId: string): Promise<string | null> {
  if (isDemoMode()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("call_events")
    .select("vapi_call_id")
    .eq("lead_id", leadId)
    .not("vapi_call_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.vapi_call_id as string | null) ?? null;
}
