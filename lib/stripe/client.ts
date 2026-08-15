import Stripe from "stripe";
import { env } from "@/lib/env";
import { PLANES_PAGO, type PlanPago } from "@/lib/stripe/plans";

export const stripeConfigurado = () => Boolean(env.STRIPE_SECRET_KEY);

export function getStripe(): Stripe {
  return new Stripe(env.STRIPE_SECRET_KEY as string);
}

const appUrl = () =>
  env.APP_URL || env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface CheckoutParams {
  plan: PlanPago;
  businessId: string;
  email?: string | null;
}

export interface BuildCheckoutParams extends CheckoutParams {
  /** Price (Stripe) del plan elegido. */
  priceId: string;
  /** URL base de la app, para success_url / cancel_url. */
  baseUrl: string;
}

/**
 * Construye el objeto que enviamos a `stripe.checkout.sessions.create`.
 *
 * Función PURA (sin env ni red) para poder testearla en aislamiento.
 *
 * `allow_promotion_codes: true` hace que Stripe muestre el campo "Código
 * promocional" en su propia página de pago: los cupones y códigos se crean en
 * el dashboard de Stripe y es Stripe quien los valida y aplica (nosotros no
 * validamos nada). OJO: es INCOMPATIBLE con pasar `discounts` en la misma
 * sesión, así que aquí nunca se pasa `discounts`.
 */
export function buildCheckoutParams({
  plan,
  businessId,
  email,
  priceId,
  baseUrl,
}: BuildCheckoutParams): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/onboarding/exito?plan=${plan}`,
    cancel_url: `${baseUrl}/onboarding?cancelado=1`,
    customer_email: email ?? undefined,
    // Códigos de descuento: los introduce el cliente en la página de Stripe.
    allow_promotion_codes: true,
    // Datos fiscales para que la factura sirva para desgravar (autónomos):
    // dirección obligatoria + NIF/CIF opcional. Stripe los guarda en el
    // cliente y los imprime en la factura.
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    subscription_data: {
      trial_period_days: 7,
      metadata: { business_id: businessId, plan },
    },
    metadata: { business_id: businessId, plan },
  };
}

/**
 * Crea una sesión de Stripe Checkout (suscripción con 7 días de prueba) y
 * devuelve la URL a la que redirigir. En modo mock/sin clave, salta Stripe y
 * devuelve directamente la pantalla de éxito (para demos sin datos reales).
 */
export async function crearCheckout({
  plan,
  businessId,
  email,
}: CheckoutParams): Promise<string> {
  const def = PLANES_PAGO[plan];

  if (!env.mockProviders && stripeConfigurado() && def.priceId) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create(
      buildCheckoutParams({
        plan,
        businessId,
        email,
        priceId: def.priceId,
        baseUrl: appUrl(),
      }),
    );
    return session.url ?? `${appUrl()}/onboarding/exito?plan=${plan}`;
  }

  return `${appUrl()}/onboarding/exito?plan=${plan}&demo=1`;
}

/**
 * Crea una sesión del Portal de Cliente de Stripe, donde el negocio puede
 * descargar sus facturas (PDF), cambiar la tarjeta y cancelar la suscripción.
 * Devuelve la URL a la que redirigir. Requiere el `stripe_customer_id` del
 * negocio (existe una vez que ha pasado por el Checkout).
 */
export async function crearPortalFacturacion(
  customerId: string,
  returnUrl?: string,
): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl ?? `${appUrl()}/panel/facturacion`,
  });
  return session.url;
}
