import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, stripeConfigurado } from "@/lib/stripe/client";
import { mapaPreciosAPlan } from "@/lib/stripe/plans";
import { resolverCuenta, planDesdePrice } from "@/lib/stripe/activation";

export const runtime = "nodejs";

type Admin = ReturnType<typeof createAdminClient>;

export async function POST(request: NextRequest) {
  if (!stripeConfigurado()) {
    // Sin Stripe configurado no hay nada que procesar (dev/demo).
    if (env.isProd) {
      return NextResponse.json({ error: "stripe no configurado" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, skipped: "sin-stripe" });
  }

  const raw = await request.text();
  const sig = request.headers.get("stripe-signature");
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      if (env.isProd) throw new Error("falta STRIPE_WEBHOOK_SECRET");
      event = JSON.parse(raw) as Stripe.Event; // solo dev
    } else {
      event = stripe.webhooks.constructEvent(
        raw,
        sig ?? "",
        env.STRIPE_WEBHOOK_SECRET,
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: `firma inválida: ${e instanceof Error ? e.message : e}` },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutCompleted(
          admin,
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await onSubscriptionChange(
          admin,
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        break; // ignoramos el resto
    }
  } catch (e) {
    console.error("[stripe] error procesando webhook:", e);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, received: event.type });
}

async function onCheckoutCompleted(
  admin: Admin,
  session: Stripe.Checkout.Session,
) {
  const businessId = session.metadata?.business_id;
  if (!businessId) return;

  const plan = session.metadata?.plan ?? "pro";
  await admin
    .from("businesses")
    .update({
      plan,
      activo: true,
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id:
        typeof session.subscription === "string" ? session.subscription : null,
    })
    .eq("id", businessId);
}

async function onSubscriptionChange(
  admin: Admin,
  sub: Stripe.Subscription,
) {
  const priceId = sub.items.data[0]?.price?.id ?? null;
  const plan = planDesdePrice(priceId, mapaPreciosAPlan());
  const { plan: nuevoPlan, activo } = resolverCuenta(sub.status, plan);

  await admin
    .from("businesses")
    .update({ plan: nuevoPlan, activo })
    .eq("stripe_subscription_id", sub.id);
}
