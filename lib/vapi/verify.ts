import { timingSafeEqual } from "node:crypto";

/**
 * Vapi firma sus webhooks con un secreto compartido que llega en la cabecera
 * `x-vapi-secret` (el "Server Message Secret" que configuras en Vapi).
 * Comparamos en tiempo constante para no filtrar información por timing.
 */
export function verifyVapiSecret(
  headerValue: string | null,
  secret: string,
): boolean {
  if (!headerValue) return false;
  const a = Buffer.from(headerValue);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
