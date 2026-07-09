import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, stripeConfigurado } from "@/lib/stripe/client";
import { mapaPreciosAPlan, type PlanPago } from "@/lib/stripe/plans";
import { resolverCuenta, planDesdePrice } from "@/lib/stripe/activation";
import { aprovisionarNegocio } from "@/lib/onboarding/aprovisionar";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

type Admin = ReturnType<typeof createAdminClient>;

const PLANES_PAGO_VALIDOS = new Set<PlanPago>(["starter", "pro", "premium"]);

export async function POST(request: NextRequest) {
  const bloqueo = await rateLimit(request, "stripe");
  if (bloqueo) return bloqueo;

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

  // El plan lo fija nuestro propio checkout en la metadata; validamos por si
  // acaso y, si no es uno conocido, no tocamos el plan (dejamos el actual).
  const metaPlan = session.metadata?.plan;
  const plan =
    metaPlan && PLANES_PAGO_VALIDOS.has(metaPlan as PlanPago)
      ? (metaPlan as PlanPago)
      : undefined;

  // Solo llegamos aquí tras un pago confirmado: es el momento de fijar el plan y
  // los ids de Stripe y luego aprovisionar (assistant + teléfono + activación),
  // que persiste el estado por pasos en `onboarding_status`.
  await admin
    .from("businesses")
    .update({
      ...(plan ? { plan } : {}),
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : null,
      stripe_subscription_id:
        typeof session.subscription === "string" ? session.subscription : null,
    })
    .eq("id", businessId);

  // Aprovisionamiento (Fase 2). Idempotente: no recrea el assistant ni recompra
  // el número si ya existen.
  //
  // Defect 1: NO tragamos un fallo de activación. Si el paso crítico (assistant)
  // falla, la cuenta NO queda activa y un cliente que PAGÓ se quedaría
  // inactivo-para-siempre porque Stripe no reintenta un 200. Dejamos que el
  // error (AprovisionamientoError, o un fallo DURO de persistencia por columna
  // que falta / RLS — defects 2/3/9) SUBA: el `catch` del POST lo convierte en
  // 500 → Stripe reintenta el webhook (self-healing).
  //
  // Pasos NO críticos pendientes (telefono/agenda) NO lanzan → devolvemos 200 y
  // el resto se reintenta desde la ficha del cliente.
  await aprovisionarNegocio(admin, businessId);
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
