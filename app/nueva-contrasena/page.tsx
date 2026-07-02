"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
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

/**
 * Se llega aquí desde el enlace de "recuperar contraseña": el callback ya ha
 * canjeado el código por una sesión temporal, así que updateUser puede fijar la
 * nueva contraseña sin pedir la antigua.
 */
export default function NuevaContrasenaPage() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!supabaseListo) {
      setError("Supabase aún no está configurado.");
      return;
    }

    setCargando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setCargando(false);
      setError(
        "No hemos podido cambiar la contraseña. El enlace pudo caducar; pídelo de nuevo.",
      );
      return;
    }
    window.location.assign("/panel");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold">curro</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Nueva contraseña</CardTitle>
            <CardDescription>Elige una contraseña para tu cuenta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
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
              {error && (
                <p className="text-sm text-[var(--destructive)]">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={cargando}>
                {cargando && <Loader2 className="size-4 animate-spin" />}
                Guardar y entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
