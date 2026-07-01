"use client";

import { useState } from "react";
import { Loader2, MailCheck, PhoneCall } from "lucide-react";
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

type Estado = "idle" | "enviando" | "enviado" | "error";

const supabaseListo = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseListo) {
      setEstado("error");
      setMensaje(
        "Supabase aún no está configurado. Añade NEXT_PUBLIC_SUPABASE_URL y la anon key a .env.local.",
      );
      return;
    }

    setEstado("enviando");
    setMensaje("");

    const supabase = createClient();
    const emailRedirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });

    if (error) {
      setEstado("error");
      setMensaje("No hemos podido enviar el enlace. Inténtalo de nuevo.");
      return;
    }
    setEstado("enviado");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
            <PhoneCall className="size-5" />
          </div>
          <h1 className="text-2xl font-bold">AtiendeReformas</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Accede a tu panel de leads
          </p>
        </div>

        <Card>
          {estado === "enviado" ? (
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <MailCheck className="size-8 text-[var(--primary)]" />
              <p className="font-medium">Revisa tu correo</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Te hemos enviado un enlace de acceso a{" "}
                <span className="font-medium">{email}</span>. Ábrelo en este
                dispositivo para entrar.
              </p>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>
                  Te enviamos un enlace mágico. Sin contraseñas.
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
                  {mensaje && (
                    <p className="text-sm text-[var(--destructive)]">{mensaje}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={estado === "enviando"}
                  >
                    {estado === "enviando" && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    Enviar enlace de acceso
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-[var(--muted-foreground)]">
          ¿Aún no tienes cuenta? El alta de negocios llega en la Fase 5.
        </p>
      </div>
    </main>
  );
}
