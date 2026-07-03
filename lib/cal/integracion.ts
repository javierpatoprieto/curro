import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Acceso a `business_integrations`, donde vive la API key de Cal.com de cada
 * negocio. Esa tabla tiene RLS activado y SIN políticas: solo el service_role
 * (este cliente admin, en servidor) puede leerla o escribirla. La key NUNCA llega
 * al navegador.
 */

type Admin = ReturnType<typeof createAdminClient>;

export interface CalIntegracion {
  cal_api_key: string | null;
  cal_event_type_id: string | null;
}

/** Lee la integración de Cal.com de un negocio (o null si no hay fila). */
export async function getCalIntegracion(
  admin: Admin,
  businessId: string,
): Promise<CalIntegracion | null> {
  const { data } = await admin
    .from("business_integrations")
    .select("cal_api_key, cal_event_type_id")
    .eq("business_id", businessId)
    .maybeSingle();
  return data ?? null;
}

/** true si el negocio tiene Cal.com conectado (key + tipo de evento). */
export async function calConectado(
  admin: Admin,
  businessId: string,
): Promise<boolean> {
  const i = await getCalIntegracion(admin, businessId);
  return Boolean(i?.cal_api_key && i?.cal_event_type_id);
}

/**
 * Guarda (upsert) la API key y el tipo de evento de Cal.com de un negocio.
 * Pasar `cal_api_key: null` borra la conexión.
 */
export async function guardarCalIntegracion(
  admin: Admin,
  businessId: string,
  datos: { cal_api_key: string | null; cal_event_type_id: string | null },
): Promise<void> {
  const { error } = await admin.from("business_integrations").upsert(
    {
      business_id: businessId,
      cal_api_key: datos.cal_api_key,
      cal_event_type_id: datos.cal_event_type_id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_id" },
  );
  if (error) throw error;
}
