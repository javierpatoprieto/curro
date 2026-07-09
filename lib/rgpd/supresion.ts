import type { createAdminClient } from "@/lib/supabase/admin";
import { borrarGrabacionVapi } from "@/lib/vapi/grabaciones";

type Admin = ReturnType<typeof createAdminClient>;

export interface ResultadoSupresion {
  ok: boolean;
  /** Motivo cuando ok === false (p. ej. "no-encontrado"). */
  motivo?: string;
  /** Nº de call_events (llamadas) del lead cuyas grabaciones se intentó borrar. */
  grabaciones: number;
}

/**
 * Supresión granular de UN lead (DSAR — Art. 17 RGPD "derecho de supresión").
 *
 * Borra, para el lead indicado:
 *  1. las grabaciones asociadas en Vapi (por cada call_event con vapi_call_id),
 *  2. sus `messages` (WhatsApp/email),
 *  3. sus `call_events` (metadatos de llamada),
 *  4. la fila `leads` (PII: nombre, teléfono, transcripción, audio_url…).
 *
 * Hasta ahora solo existía borrar el negocio entero (`borrarCliente`); esto
 * permite atender una solicitud individual sin tocar al resto de clientes.
 *
 * Lógica separada de la server action para poder testearla con un admin stub.
 * Recibe el `admin` (service_role) ya creado; NO hace auth (eso lo hace la action).
 * Idempotente: borrar un lead inexistente devuelve ok:false, motivo "no-encontrado".
 */
export async function suprimirLead(
  admin: Admin,
  leadId: string,
): Promise<ResultadoSupresion> {
  // 1) Localizar el lead y sus llamadas (para borrar el audio en Vapi).
  const { data: lead } = await admin
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .maybeSingle();
  if (!lead) return { ok: false, motivo: "no-encontrado", grabaciones: 0 };

  const { data: eventos } = await admin
    .from("call_events")
    .select("vapi_call_id")
    .eq("lead_id", leadId);

  const callIds = (eventos ?? [])
    .map((e: { vapi_call_id: string | null }) => e.vapi_call_id)
    .filter((v: string | null): v is string => Boolean(v));

  // 2) Borrar las grabaciones en Vapi (mock/no-op por defecto). Los fallos de
  // borrado remoto no bloquean la supresión local: se registran y se sigue.
  for (const callId of callIds) {
    try {
      await borrarGrabacionVapi(callId);
    } catch (e) {
      console.error("[rgpd] no se pudo borrar la grabación en Vapi:", callId, e);
    }
  }

  // 3) Borrar filas hijas y el propio lead. Orden explícito (messages y
  // call_events referencian lead_id con ON DELETE SET NULL, no CASCADE, así que
  // los borramos a mano para no dejar huérfanos con PII en el payload).
  await admin.from("messages").delete().eq("lead_id", leadId);
  await admin.from("call_events").delete().eq("lead_id", leadId);
  await admin.from("leads").delete().eq("id", leadId);

  return { ok: true, grabaciones: callIds.length };
}
