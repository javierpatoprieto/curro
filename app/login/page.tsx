"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/panel";
  const confirmado = params.get("confirmado") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseListo) {
      setError("Supabase aún no está configurado.");
      return;
    }
    setCargando(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setCargando(false);
      setError(
        error.message.includes("Email not confirmed")
          ? "Tienes que confirmar tu email antes de entrar. Revisa tu correo."
          : "Email o contraseña incorrectos.",
      );
      return;
    }
    // Navegación completa para que el servidor tome la cookie de sesión.
    window.location.assign(next);
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-2xl font-extrabold">curro</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Accede a tu panel de leads
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Con tu email y contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          {confirmado && (
            <p className="mb-4 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
              Email confirmado. Ya puedes entrar con tu contraseña.
            </p>
          )}
          <GoogleButton />
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/recuperar"
                  className="text-xs text-[var(--muted-foreground)] hover:underline"
                >
                  ¿La olvidaste?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-[var(--destructive)]">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando && <Loader2 className="size-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/registro"
          className="font-medium text-[var(--foreground)] hover:underline"
        >
          Crea la de tu negocio
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
