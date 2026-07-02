/**
 * Acceso al panel de superadmin (/admin) por CONTRASEÑA propia.
 *
 * En vez de exigir sesión de Supabase (magic link de clientes), el dueño entra
 * con una contraseña única definida en la variable de entorno ADMIN_PASSWORD.
 * Al acertar, se guarda una cookie httpOnly con un TOKEN FIRMADO CON EXPIRACIÓN
 * (nunca se guarda la contraseña en la cookie). El valor de la cookie es
 * `${exp}.${hmac}` donde `exp` es un timestamp absoluto (ms desde epoch) y
 * `hmac = HMAC-SHA256(ADMIN_PASSWORD, String(exp))`. Comparaciones en tiempo
 * constante. FAIL-CLOSED: sin ADMIN_PASSWORD no entra nadie. Como el token se
 * firma con ADMIN_PASSWORD, cambiar la contraseña invalida todas las sesiones.
 *
 * Módulo SOLO servidor (usa next/headers y node:crypto).
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "curro_admin";
const DURACION_SESION_MS = 1000 * 60 * 60 * 24 * 30; // 30 días
const MAX_AGE = Math.floor(DURACION_SESION_MS / 1000); // en segundos, alineado con la duración

function sha256(s: string): Buffer {
  return createHash("sha256").update(s).digest();
}

/** Compara dos strings en tiempo constante (a prueba de timing). */
function igual(a: string, b: string): boolean {
  const da = sha256(a);
  const db = sha256(b);
  return timingSafeEqual(da, db);
}

/** Firma un `exp` (timestamp en ms) con ADMIN_PASSWORD; null si no hay contraseña. */
function firmarExp(exp: number): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update(String(exp)).digest("hex");
}

/** ¿La contraseña introducida es la correcta? */
export function passwordCorrecta(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  return igual(input, pw);
}

/** ¿La cookie actual acredita acceso de superadmin? */
export async function adminAutenticado(): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false; // fail-closed: sin ADMIN_PASSWORD, nadie entra
  const actual = (await cookies()).get(COOKIE)?.value;
  if (!actual) return false;

  // El valor es `${exp}.${hmac}`: parsear ambas partes.
  const punto = actual.indexOf(".");
  if (punto <= 0) return false;
  const expStr = actual.slice(0, punto);
  const hmac = actual.slice(punto + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !hmac) return false;

  // Comprobar expiración y luego que la firma recomputada coincide.
  if (exp <= Date.now()) return false;
  const esperado = firmarExp(exp);
  if (!esperado) return false;
  return igual(hmac, esperado);
}

/** Inicia sesión de admin: guarda la cookie httpOnly firmada con expiración. */
export async function iniciarSesionAdmin(): Promise<void> {
  const exp = Date.now() + DURACION_SESION_MS;
  const hmac = firmarExp(exp);
  if (!hmac) return;
  (await cookies()).set(COOKIE, `${exp}.${hmac}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
