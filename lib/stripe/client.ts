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
 * Crea una sesión de Stripe Checkout (suscripción con 14 días de prueba) y
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
      subscription_data: {
        trial_period_days: 14,
        metadata: { business_id: businessId, plan },
      },
      metadata: { business_id: businessId, plan },
    });
    return session.url ?? `${appUrl()}/onboarding/exito?plan=${plan}`;
  }

  return `${appUrl()}/onboarding/exito?plan=${plan}&demo=1`;
}
