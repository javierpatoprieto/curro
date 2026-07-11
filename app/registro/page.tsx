"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { trackRegistro } from "@/lib/analytics/track";
import {
  GoogleButton,
  googleLoginActivo,
} from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TERMINOS_VERSION } from "@/lib/legal/version";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const supabaseListo = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

function RegistroForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!aceptaTerminos) {
      setError(
        "Debes aceptar los Términos y Condiciones y el Anexo DPA para continuar.",
      );
      return;
    }
    if (!supabaseListo) {
      setError("Supabase aún no está configurado.");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    // Tras confirmar el email, Supabase redirige al callback y de ahí al onboarding.
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/onboarding`;
    // Evidencia de aceptación de Términos + Anexo DPA (Art. 28 RGPD) guardada en
    // user_metadata en el momento del alta, sin migración de base de datos.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          terminos_version: TERMINOS_VERSION,
          terminos_aceptados_at: new Date().toISOString(),
        },
      },
    });

    setCargando(false);
    if (error) {
      setError(
        error.message.includes("already registered") ||
          error.message.includes("already been registered")
          ? "Ya existe una cuenta con este email. Entra o recupera tu contraseña."
          : "No hemos podido crear la cuenta. Inténtalo de nuevo.",
      );
      return;
    }
    // Conversión: registro completado. No-op sin consentimiento/ids (ver
    // lib/analytics/track.ts). Se dispara antes de mostrar la confirmación de
    // email, que es el "redirect" efectivo de este flujo de doble opt-in.
    trackRegistro();
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="w-full max-w-sm space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <MailCheck className="size-8 text-[var(--primary)]" />
            <p className="font-medium">Confirma tu email</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Te hemos enviado un correo a{" "}
              <span className="font-medium">{email}</span>. Ábrelo y pulsa el
              enlace para activar tu cuenta. Es la única vez: después entras solo
              con tu contraseña.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-2xl font-extrabold">curro</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Crea la cuenta de tu negocio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empezar</CardTitle>
          <CardDescription>7 días gratis. Sin permanencia.</CardDescription>
        </CardHeader>
        <CardContent>
          {googleLoginActivo && (
            <>
              <GoogleButton
                texto="Registrarse con Google"
                bloqueado={!aceptaTerminos}
              />
              <div className="my-4 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <span className="h-px flex-1 bg-[var(--border)]" />o
                <span className="h-px flex-1 bg-[var(--border)]" />
              </div>
            </>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@empresa.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={
                    showPw ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showPw ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input
                id="acepta-terminos"
                type="checkbox"
                required
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--primary)]"
              />
              <Label
                htmlFor="acepta-terminos"
                className="text-sm font-normal leading-snug text-[var(--muted-foreground)]"
              >
                He leído y acepto los{" "}
                <Link
                  href="/condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--foreground)] underline"
                >
                  Términos y Condiciones
                </Link>{" "}
                y el{" "}
                <Link
                  href="/condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--foreground)] underline"
                >
                  Anexo de Encargado de Tratamiento (DPA)
                </Link>
                .
              </Label>
            </div>
            {error && (
              <p className="text-sm text-[var(--destructive)]">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={cargando || !aceptaTerminos}
            >
              {cargando && <Loader2 className="size-4 animate-spin" />}
              Crear cuenta
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--foreground)] hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Suspense>
        <RegistroForm />
      </Suspense>
    </main>
  );
}
