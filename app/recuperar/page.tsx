"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
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
    const redirectTo = `${window.location.origin}/auth/callback?next=/nueva-contrasena`;
    await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    // Respondemos igual haya o no cuenta (no filtramos qué emails existen).
    setCargando(false);
    setEnviado(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-6">
        {enviado ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <MailCheck className="size-8 text-[var(--primary)]" />
              <p className="font-medium">Revisa tu correo</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Si hay una cuenta con <span className="font-medium">{email}</span>,
                te hemos enviado un enlace para poner una contraseña nueva.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-center">
              <h1 className="font-display text-2xl font-extrabold">curro</h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Recupera tu acceso
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
                <CardDescription>
                  Te enviamos un enlace para crear una nueva.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                  {error && (
                    <p className="text-sm text-[var(--destructive)]">{error}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={cargando}>
                    {cargando && <Loader2 className="size-4 animate-spin" />}
                    Enviar enlace
                  </Button>
                </form>
              </CardContent>
            </Card>
            <p className="text-center text-sm text-[var(--muted-foreground)]">
              <Link href="/login" className="hover:underline">
                Volver a entrar
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
