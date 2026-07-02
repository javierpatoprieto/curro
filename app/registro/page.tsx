"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [password2, setPassword2] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
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
          <GoogleButton texto="Registrarse con Google" />
          <div className="my-4 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="h-px flex-1 bg-[var(--border)]" />o
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
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
              <Input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password2">Repite la contraseña</Label>
              <Input
                id="password2"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Otra vez"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-[var(--destructive)]">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={cargando}>
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
