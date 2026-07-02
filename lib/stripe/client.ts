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
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: def.priceId, quantity: 1 }],
      success_url: `${appUrl()}/onboarding/exito?plan=${plan}`,
      cancel_url: `${appUrl()}/onboarding?cancelado=1`,
      customer_email: email ?? undefined,
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
    });
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
