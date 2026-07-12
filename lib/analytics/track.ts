/**
 * Helpers de tracking de conversión (Meta Pixel + Google Ads), CON GATING por
 * consentimiento de cookies (RGPD).
 *
 * Diseño: TODO es un no-op seguro salvo que se cumplan a la vez:
 *   1. Estamos en el navegador (`typeof window !== "undefined"`).
 *   2. El visitante ha ACEPTADO las cookies (localStorage `curro_cookie_consent`
 *      === "granted"), el mismo opt-in que carga GA4 en `cookie-consent.tsx`.
 *   3. Existe el `fbq`/`gtag` correspondiente en `window` (solo existen si el
 *      banner los inicializó tras aceptar) y su id de env está configurado.
 *
 * Así, si el usuario rechaza (o no hay ids), estos helpers no disparan nada: no
 * hay riesgo de enviar eventos de publicidad sin base legal.
 *
 * TODO (mejora futura): Conversions API (Meta) y Enhanced Conversions server-side
 * (Google) son más fiables que el pixel de cliente (bloqueadores, iOS/ITP). Se
 * dispararían desde el webhook de Stripe (Purchase real) y desde el servidor de
 * `signUp`, con hash del email y deduplicación por `event_id`. Ver v2.
 */

// El STORAGE_KEY debe coincidir con el de components/analytics/cookie-consent.tsx.
const STORAGE_KEY = "curro_cookie_consent"; // "granted" | "denied"

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    // `gtag` ya está declarado en cookie-consent.tsx; aquí solo lo reusamos.
  }
}

/**
 * ¿Podemos disparar eventos de publicidad? Solo si estamos en el navegador y el
 * visitante ha aceptado las cookies. Es la ÚNICA puerta de consentimiento; todos
 * los helpers pasan por aquí.
 */
function hayConsentimiento(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "granted";
  } catch {
    // localStorage puede lanzar (modo privado, cookies bloqueadas): tratamos
    // como "sin consentimiento" para no disparar nada.
    return false;
  }
}

/** Dispara un evento estándar de Meta Pixel, si procede (guardado). */
function meta(evento: string, params?: Record<string, unknown>): void {
  if (!META_PIXEL_ID) return;
  if (!hayConsentimiento()) return;
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", evento, params);
  else window.fbq("track", evento);
}

/**
 * Dispara una conversión de Google Ads (gtag), si procede (guardado).
 * `label` identifica la acción de conversión concreta dentro de la cuenta Ads;
 * como aún no la conocemos, enviamos el evento a nivel de cuenta (AW-XXXX).
 */
function googleAds(params?: Record<string, unknown>): void {
  if (!GOOGLE_ADS_ID) return;
  if (!hayConsentimiento()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_ID,
    ...params,
  });
}

/**
 * Registro completado (fin del signUp). Meta: `CompleteRegistration`.
 * Se llama antes del redirect en app/registro/page.tsx.
 */
export function trackRegistro(): void {
  meta("CompleteRegistration");
  googleAds();
}

/**
 * Inicio del checkout de Stripe. Meta: `InitiateCheckout`.
 * Se llama en el submit del onboarding, lado cliente, antes de la server action.
 */
export function trackInitiateCheckout(): void {
  meta("InitiateCheckout");
  googleAds();
}

/**
 * Compra confirmada (pantalla de éxito tras el pago). Meta: `Purchase`.
 * @param valorEUR importe del plan en euros (para el valor de la conversión).
 */
export function trackPurchase(valorEUR?: number): void {
  const conValor = typeof valorEUR === "number" && valorEUR > 0;
  meta(
    "Purchase",
    conValor ? { value: valorEUR, currency: "EUR" } : undefined,
  );
  googleAds(conValor ? { value: valorEUR, currency: "EUR" } : undefined);
}
