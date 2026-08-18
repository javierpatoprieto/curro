"use client";

import { trackInitiateCheckout } from "@/lib/analytics/track";
import { Button } from "@/components/ui/button";

/**
 * Botón de envío del onboarding. Es cliente para poder disparar la conversión
 * `InitiateCheckout` (Meta/Google Ads) justo cuando el usuario inicia el
 * checkout de Stripe. El evento es no-op sin consentimiento/ids (ver
 * lib/analytics/track.ts); NO bloquea el submit del formulario, que sigue
 * llamando a la server action `crearNegocio`.
 */
export function OnboardingSubmit() {
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      onClick={() => trackInitiateCheckout()}
    >
      Empezar prueba gratis
    </Button>
  );
}
