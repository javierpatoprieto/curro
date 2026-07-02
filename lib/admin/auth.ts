/**
 * Acceso al panel de superadmin (/admin) por CONTRASEÑA propia.
 *
 * En vez de exigir sesión de Supabase (magic link de clientes), el dueño entra
 * con una contraseña única definida en la variable de entorno ADMIN_PASSWORD.
 * Al acertar, se guarda una cookie httpOnly con un token derivado de la
 * contraseña (nunca se guarda la contraseña en la cookie). Comparaciones en
 * tiempo constante. FAIL-CLOSED: sin ADMIN_PASSWORD no entra nadie.
 *
 * Módulo SOLO servidor (usa next/headers y node:crypto).
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "curro_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function sha256(s: string): Buffer {
  return createHash("sha256").update(s).digest();
}

/** Compara dos strings en tiempo constante (a prueba de timing). */
function igual(a: string, b: string): boolean {
  const da = sha256(a);
  const db = sha256(b);
  return timingSafeEqual(da, db);
}

/** Token opaco que se guarda en la cookie (deriva de la contraseña). */
function tokenEsperado(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("curro-admin-v1").digest("hex");
}

/** ¿La contraseña introducida es la correcta? */
export function passwordCorrecta(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  return igual(input, pw);
}

/** ¿La cookie actual acredita acceso de superadmin? */
export async function adminAutenticado(): Promise<boolean> {
  const esperado = tokenEsperado();
  if (!esperado) return false; // fail-closed: sin ADMIN_PASSWORD, nadie entra
  const actual = (await cookies()).get(COOKIE)?.value;
  if (!actual) return false;
  return igual(actual, esperado);
}

/** Inicia sesión de admin: guarda la cookie httpOnly firmada. */
export async function iniciarSesionAdmin(): Promise<void> {
  const esperado = tokenEsperado();
  if (!esperado) return;
  (await cookies()).set(COOKIE, esperado, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Cierra la sesión de admin. */
export async function cerrarSesionAdmin(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Guard para páginas y server actions de /admin: redirige si no hay acceso. */
export async function exigirAdmin(): Promise<void> {
  if (!(await adminAutenticado())) redirect("/admin/login");
}
