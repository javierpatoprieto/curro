import { z } from "zod";

/**
 * Validación central de variables de entorno.
 *
 * Filosofía (Fase 0): casi todo es opcional para que `npm run dev` y los tests
 * arranquen sin cuentas reales. Los adaptadores de proveedores (Vapi, WhatsApp,
 * Resend, Stripe) usan mocks por defecto y solo exigen la clave cuando se
 * ejecutan en modo real. Al desplegar en producción, validamos lo imprescindible.
 */

const schema = z.object({
  // --- Supabase (en Next, el cliente de navegador necesita el prefijo NEXT_PUBLIC_) ---
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // --- Voz IA (Vapi) ---
  VAPI_API_KEY: z.string().optional(),
  VAPI_WEBHOOK_SECRET: z.string().optional(),

  // --- WhatsApp Cloud API (Meta) ---
  WHATSAPP_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),

  // --- WhatsApp vía Twilio (alternativa a Meta directo) ---
  // Si estas están y MOCK_PROVIDERS=false, se usa Twilio en vez de Meta.
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  // Número emisor de WhatsApp en Twilio, formato "whatsapp:+14155238886"
  // (el sandbox o tu número aprobado).
  TWILIO_WHATSAPP_FROM: z.string().optional(),
  // ContentSid (HX…) de las plantillas aprobadas en Twilio (producción, opcional).
  // Sin ellos, las plantillas se mandan como texto libre (válido en sandbox y
  // dentro de la ventana de 24 h).
  TWILIO_WA_CONTENT_CLIENTE: z.string().optional(),
  TWILIO_WA_CONTENT_DUENO: z.string().optional(),

  // --- Email (Resend) ---
  RESEND_API_KEY: z.string().optional(),
  // Remitente de los emails (debe ser un dominio verificado en Resend).
  EMAIL_FROM: z.string().optional(),

  // --- Pagos (Stripe) ---
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // IDs de precio (Price) de cada plan en Stripe.
  STRIPE_PRICE_STARTER: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_PREMIUM: z.string().optional(),

  // --- App ---
  APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Google Analytics 4 (Measurement ID G-XXXXXXXXXX). Es público; el banner de
  // consentimiento solo carga GA4 si esta variable está definida.
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Token de verificación de Google Search Console (método "Etiqueta HTML").
  // Opcional: si se define, el layout renderiza el meta google-site-verification.
  GOOGLE_SITE_VERIFICATION: z.string().optional(),

  // --- Superadmin (/admin) ---
  // Secreto propio (aleatorio, p. ej. `openssl rand -hex 32`) con el que se firma
  // el token de sesión de admin. Si falta, se firma con ADMIN_PASSWORD (menos
  // seguro). ADMIN_PASSWORD se lee directamente de process.env en lib/admin/auth.
  ADMIN_SESSION_SECRET: z.string().optional(),

  // --- Rate limit durable (Upstash Redis, REST) ---
  // Si ambas están, el rate limit de los webhooks públicos es global (compartido
  // entre instancias). Sin ellas, se usa un contador en memoria por instancia.
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Si es "false", los adaptadores llaman a los proveedores reales.
  // Por defecto usamos mocks para no depender de cuentas externas.
  MOCK_PROVIDERS: z.enum(["true", "false"]).optional(),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // No abortamos el proceso: mostramos el problema y seguimos con lo válido,
  // porque en Fase 0 muchas variables aún no existen.
  console.warn(
    "[env] Variables de entorno con formato inválido:",
    parsed.error.flatten().fieldErrors,
  );
}

const raw = parsed.success ? parsed.data : ({} as z.infer<typeof schema>);

export const env = {
  ...raw,
  isProd: raw.NODE_ENV === "production",
  isTest: raw.NODE_ENV === "test",
  /** Por defecto true, salvo que MOCK_PROVIDERS sea explícitamente "false". */
  mockProviders: raw.MOCK_PROVIDERS !== "false",
};

// --- Fail-fast en producción -----------------------------------------------
// La app no funciona sin Supabase, así que en prod exigimos lo imprescindible.
// Si falta algo, rompemos al arrancar (mejor que devolver 500 en un webhook a
// mitad de una llamada). En el build de Vercel de Production estas variables ya
// están. En los despliegues Preview de Vercel NO abortamos: el preview solo
// valida el build (corre en modo mock, sin base de datos real), así que no
// exigimos las claves de producción y evitamos romper el build de cada PR.
const esPreviewVercel = process.env.VERCEL_ENV === "preview";
if (env.isProd && !esPreviewVercel) {
  const imprescindibles = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ] as const;
  const faltan = imprescindibles.filter((k) => !raw[k]);
  if (faltan.length > 0) {
    throw new Error(
      `[env] Faltan variables imprescindibles en producción: ${faltan.join(", ")}. ` +
        "Configúralas en el proyecto de Vercel antes de desplegar.",
    );
  }
}

/** Lee una variable obligatoria en el punto de uso, con error claro en español. */
export function requireEnv(key: keyof typeof raw): string {
  const value = raw[key];
  if (!value || typeof value !== "string") {
    throw new Error(
      `Falta la variable de entorno "${key}". Añádela a .env.local (mira .env.example).`,
    );
  }
  return value;
}
