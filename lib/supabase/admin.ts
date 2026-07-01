import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/env";

/**
 * Cliente con `service_role`: SALTA RLS. Úsalo SOLO en el servidor
 * (webhooks de Vapi/Stripe/Meta, tareas de sistema), nunca en el navegador.
 *
 * La responsabilidad de filtrar por `business_id` recae en el código que lo usa.
 */
export function createAdminClient() {
  return createSupabaseClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
