import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { Business } from "@/lib/types";

const supabaseConfigurado = () =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Usuario autenticado (o null). Verifica contra el servidor de Supabase. */
export async function getSessionUser() {
  if (!supabaseConfigurado()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export interface CurrentContext {
  user: { id: string; email: string | null };
  owner: { id: string; nombre: string | null; rol: string };
  business: Business;
}

/**
 * Contexto del usuario actual: su owner y su negocio (tenant).
 * Devuelve null si no hay sesión o si el usuario aún no está enlazado a un owner
 * (ver supabase/README.md → "Enlazar un usuario a un owner").
 */
export async function getCurrentContext(): Promise<CurrentContext | null> {
  if (!supabaseConfigurado()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("owners")
    .select("id, nombre, rol, business:businesses(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data || !data.business) return null;

  return {
    user: { id: user.id, email: user.email ?? null },
    owner: { id: data.id, nombre: data.nombre, rol: data.rol },
    business: data.business as unknown as Business,
  };
}
