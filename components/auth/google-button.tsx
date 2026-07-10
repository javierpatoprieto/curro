"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const supabaseListo = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

/**
 * El login con Google solo se muestra si está activado explícitamente. Requiere
 * tener el proveedor Google configurado en Supabase (app OAuth de Google Cloud).
 * Mientras no lo esté, el botón queda oculto para no dar error al pulsarlo.
 */
export const googleLoginActivo =
  process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "true";

/** Logo oficial de Google (multicolor). */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.85 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

/**
 * Inicia sesión / registro con Google (OAuth vía Supabase). Tras autenticar,
 * cae en /onboarding, que reenvía a /panel si el negocio ya existe.
 *
 * `bloqueado` permite exigir la aceptación de Términos + Anexo DPA antes de
 * iniciar el flujo OAuth (usado en el registro). Si el usuario intenta continuar
 * sin haber aceptado, se muestra `mensajeBloqueo` y no se inicia OAuth.
 *
 * TODO(registro-google): la evidencia de aceptación (terminos_version /
 * terminos_aceptados_at) no se guarda por esta vía porque signInWithOAuth no
 * admite `data` de user_metadata como signUp. Para el alta social hay que
 * registrar la versión aceptada tras el callback (/auth/callback) o en el
 * onboarding, p. ej. con supabase.auth.updateUser({ data: { ... } }) si el
 * metadata todavía no está puesto.
 */
export function GoogleButton({
  texto = "Continuar con Google",
  bloqueado = false,
  mensajeBloqueo,
}: {
  texto?: string;
  bloqueado?: boolean;
  mensajeBloqueo?: string;
}) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function onClick() {
    if (bloqueado) {
      setError(
        mensajeBloqueo ??
          "Debes aceptar los Términos y Condiciones y el Anexo DPA para continuar.",
      );
      return;
    }
    if (!supabaseListo) {
      setError("Supabase aún no está configurado.");
      return;
    }
    setCargando(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
    if (error) {
      setCargando(false);
      setError("No hemos podido conectar con Google. Inténtalo de nuevo.");
    }
    // Si va bien, el navegador se redirige a Google (no hay que hacer nada más).
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onClick}
        disabled={cargando}
        aria-disabled={bloqueado}
      >
        {cargando ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
        {texto}
      </Button>
      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
    </div>
  );
}
