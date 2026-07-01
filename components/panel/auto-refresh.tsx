"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Refresco periódico del panel (polling) para que aparezcan leads nuevos sin
 * recargar a mano. Sencillo y suficiente para el MVP; se puede sustituir por
 * Supabase Realtime más adelante.
 */
export function AutoRefresh({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
  return null;
}
