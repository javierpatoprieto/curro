/**
 * Acceso al panel de superadmin (/admin) por CONTRASEÑA propia.
 *
 * En vez de exigir sesión de Supabase (magic link de clientes), el dueño entra
 * con una contraseña única definida en la variable de entorno ADMIN_PASSWORD.
 * Al acertar, se guarda una cookie httpOnly con un TOKEN FIRMADO CON EXPIRACIÓN
 * (nunca se guarda la contraseña en la cookie). El valor de la cookie es
 * `${exp}.${hmac}` donde `exp` es un timestamp absoluto (ms desde epoch).
 *
 * FIRMA: el HMAC se calcula con un SECRETO PROPIO (ADMIN_SESSION_SECRET), no con
 * la contraseña. Firmar con la contraseña exponía en la cookie un
 * HMAC-SHA256(contraseña, …) del que, al ser la contraseña de baja entropía, se
 * podía intentar recuperar la contraseña por fuerza bruta offline. Con un secreto
 * largo y aleatorio el token no filtra nada sobre la contraseña.
 *
 * Para conservar la propiedad "cambiar la contraseña cierra todas las sesiones",
 * el mensaje firmado incluye una HUELLA de la contraseña actual (sha256 truncado);
 * si la contraseña cambia, la huella cambia y los tokens viejos dejan de validar.
 *
 * Compatibilidad: si no hay ADMIN_SESSION_SECRET definido, caemos a firmar con la
 * contraseña (comportamiento anterior) y avisamos por consola. Define el secreto
 * en producción para cerrar del todo el agujero. FAIL-CLOSED: sin ADMIN_PASSWORD
 * no entra nadie.
 *
 * Módulo SOLO servidor (usa next/headers y node:crypto).
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "curro_admin";
const DURACION_SESION_MS = 1000 * 60 * 60 * 24 * 30; // 30 días
const MAX_AGE = Math.floor(DURACION_SESION_MS / 1000); // en segundos, alineado con la duración

function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** Compara dos strings en tiempo constante (a prueba de timing). */
function igual(a: string, b: string): boolean {
  const da = createHash("sha256").update(a).digest();
  const db = createHash("sha256").update(b).digest();
  return timingSafeEqual(da, db);
}

/** Huella corta de la contraseña; va DENTRO del HMAC, no en claro en la cookie. */
export function huellaPassword(pw: string): string {
  return sha256Hex(pw).slice(0, 16);
}

let avisoSecretoEmitido = false;

/**
 * Clave con la que se firma el token. Prioriza ADMIN_SESSION_SECRET (recomendado);
 * si falta, cae a ADMIN_PASSWORD (comportamiento anterior) con un aviso. Null si
 * no hay ninguna de las dos (fail-closed).
 */
function claveFirma(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  if (!avisoSecretoEmitido) {
    console.warn(
      "[admin] ADMIN_SESSION_SECRET no está definido: firmando la sesión con " +
        "ADMIN_PASSWORD (menos seguro). Define ADMIN_SESSION_SECRET (aleatorio, " +
        "p. ej. `openssl rand -hex 32`) en el entorno.",
    );
    avisoSecretoEmitido = true;
  }
  return pw;
}

/** Firma un token `${exp}.${hmac}` para el `exp` dado. Funciones puras y testables. */
export function firmarToken(
  exp: number,
  opts: { secret: string; huella: string },
): string {
  const hmac = createHmac("sha256", opts.secret)
    .update(`${exp}.${opts.huella}`)
    .digest("hex");
  return `${exp}.${hmac}`;
}

/**
 * Valida un valor de cookie contra el secreto y la huella de la contraseña actual.
 * Comprueba formato, expiración y firma (en tiempo constante).
 */
export function verificarToken(
  value: string | undefined | null,
  opts: { secret: string; huella: string; ahora: number },
): boolean {
  if (!value) return false;
  const punto = value.indexOf(".");
  if (punto <= 0) return false;
  const expStr = value.slice(0, punto);
  const hmac = value.slice(punto + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !hmac) return false;
  if (exp <= opts.ahora) return false;
  const esperado = firmarToken(exp, { secret: opts.secret, huella: opts.huella });
  // esperado es `${exp}.${hmacEsperado}`: comparamos solo la parte del HMAC.
  const hmacEsperado = esperado.slice(esperado.indexOf(".") + 1);
  return igual(hmac, hmacEsperado);
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
  const secret = claveFirma();
  if (!secret) return false;
  const actual = (await cookies()).get(COOKIE)?.value;
  return verificarToken(actual, {
    secret,
    huella: huellaPassword(pw),
    ahora: Date.now(),
  });
}

/** Inicia sesión de admin: guarda la cookie httpOnly firmada con expiración. */
export async function iniciarSesionAdmin(): Promise<void> {
  const pw = process.env.ADMIN_PASSWORD;
  const secret = claveFirma();
  if (!pw || !secret) return;
  const exp = Date.now() + DURACION_SESION_MS;
  const token = firmarToken(exp, { secret, huella: huellaPassword(pw) });
  (await cookies()).set(COOKIE, token, {
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
