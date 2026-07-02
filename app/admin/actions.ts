"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  passwordCorrecta,
  iniciarSesionAdmin,
  cerrarSesionAdmin,
} from "@/lib/admin/auth";

// Rate-limit best-effort del login por IP. NOTA: es en memoria y POR INSTANCIA
// del proceso (no compartido entre réplicas ni persistente entre reinicios/cold
// starts). Es una defensa extra contra fuerza bruta, no una garantía global.
const LIMITE_INTENTOS = 10;
const VENTANA_MS = 1000 * 60 * 10; // 10 minutos
const intentosPorIp = new Map<string, { conteo: number; expira: number }>();

/** Registra un intento y devuelve true si la IP ha superado el límite. */
function superaLimite(ip: string): boolean {
  const ahora = Date.now();
  const actual = intentosPorIp.get(ip);
  if (!actual || actual.expira <= ahora) {
    // Nueva ventana para esta IP.
    intentosPorIp.set(ip, { conteo: 1, expira: ahora + VENTANA_MS });
    return false;
  }
  actual.conteo += 1;
  return actual.conteo > LIMITE_INTENTOS;
}

/** IP del cliente a partir de las cabeceras (best-effort). */
async function ipCliente(): Promise<string> {
  const xff = (await headers()).get("x-forwarded-for");
  const primera = xff?.split(",")[0]?.trim();
  return primera || "desconocida";
}

export async function entrarAdmin(formData: FormData) {
  const ip = await ipCliente();
  if (superaLimite(ip)) {
    // Rechazamos sin comprobar la contraseña.
    throw new Error(
      "Demasiados intentos de acceso. Espera unos minutos e inténtalo de nuevo."
    );
  }

  const pw = String(formData.get("password") ?? "");
  if (!passwordCorrecta(pw)) {
    redirect("/admin/login?error=1");
  }
  await iniciarSesionAdmin();
  redirect("/admin");
}

export async function salirAdmin() {
  await cerrarSesionAdmin();
  redirect("/admin/login");
}
