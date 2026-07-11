"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/analytics/track";
import { PRECIO_MENSUAL } from "@/lib/stripe/precios";
import type { Plan } from "@/lib/types";

/**
 * Dispara la conversión `Purchase` (Meta/Google Ads) al llegar a la pantalla de
 * éxito tras el pago. Es un componente cliente montado en la página (server) de
 * éxito. No-op sin consentimiento/ids (ver lib/analytics/track.ts).
 *
 * El valor de la conversión sale del plan (`?plan=`) vía la fuente de verdad de
 * precios (lib/stripe/precios.ts). Si el plan no es válido, se dispara sin valor.
 *
 * TODO (v2): la señal fiable de compra es el webhook `checkout.session.completed`
 * de Stripe (server-side, no depende de que el usuario aterrice aquí ni de
 * bloqueadores). Migrar a Conversions API / Enhanced Conversions con dedup por
 * event_id desde el webhook.
 */
export function TrackPurchase({ plan }: { plan?: string }) {
  const disparado = useRef(false);

  useEffect(() => {
    if (disparado.current) return; // evita doble disparo en Strict Mode
    disparado.current = true;
    const valor =
      plan && plan in PRECIO_MENSUAL
        ? PRECIO_MENSUAL[plan as Plan]
        : undefined;
    trackPurchase(valor);
  }, [plan]);

  return null;
}
