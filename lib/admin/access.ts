/**
 * Control de acceso al panel de superadmin (/admin).
 *
 * La allowlist vive en la variable de entorno ADMIN_EMAILS (lista de emails
 * separados por comas). Se lee directamente de process.env (no la añadimos a
 * lib/env.ts a propósito, para no tocar archivos compartidos).
 *
 * Política FAIL-CLOSED: si ADMIN_EMAILS no está definida o está vacía, NADIE es
 * superadmin.
 */

/** Parsea la lista ADMIN_EMAILS a un conjunto de emails normalizados. */
export function parseAdminEmails(raw: string | undefined | null): Set<string> {
  if (!raw) return new Set();
  const emails = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
  return new Set(emails);
}

/**
 * ¿El email pertenece a la allowlist? Función PURA y testeable.
 * Devuelve false si el email es null/vacío o si la allowlist está vacía.
 */
export function esSuperadmin(
  email: string | null | undefined,
  raw: string | undefined | null,
): boolean {
  if (!email) return false;
  const allowlist = parseAdminEmails(raw);
  if (allowlist.size === 0) return false; // fail-closed
  return allowlist.has(email.trim().toLowerCase());
}
