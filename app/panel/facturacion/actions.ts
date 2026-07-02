"use server";

import { redirect } from "next/navigation";
import { getCurrentContext } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { stripeConfigurado, crearPortalFacturacion } from "@/lib/stripe/client";

/**
 * Abre el Portal de Cliente de Stripe para el negocio actual (facturas, tarjeta,
 * cancelación). Redirige a la URL del portal, o de vuelta con un error si aún no
 * hay cliente de Stripe (no ha pasado por el pago) o Stripe no está configurado.
 */
export async function abrirPortalFacturacion() {
  if (isDemoMode()) redirect("/panel/facturacion?error=demo");

  const context = await getCurrentContext();
  if (!context) redirect("/login?next=/panel/facturacion");

  const customerId = context.business.stripe_customer_id;
  if (!stripeConfigurado() || !customerId) {
    redirect("/panel/facturacion?error=sin-suscripcion");
  }

  const url = await crearPortalFacturacion(customerId);
  redirect(url);
}
