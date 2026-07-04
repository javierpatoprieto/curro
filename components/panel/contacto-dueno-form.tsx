"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { guardarContactoDueno } from "@/app/panel/ajustes/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ContactoDuenoForm({
  email,
  whatsapp,
}: {
  email: string;
  whatsapp: string | null;
}) {
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [pendiente, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setEstado("idle");
    startTransition(async () => {
      const r = await guardarContactoDueno(fd);
      setEstado(r.ok ? "ok" : "error");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="owner_email">Email de avisos</Label>
          <Input
            id="owner_email"
            name="owner_email"
            type="email"
            required
            defaultValue={email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner_whatsapp">WhatsApp de avisos</Label>
          <Input
            id="owner_whatsapp"
            name="owner_whatsapp"
            defaultValue={whatsapp ?? ""}
            placeholder="+34600000000"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pendiente}>
          {pendiente && <Loader2 className="size-4 animate-spin" />}
          Guardar contacto
        </Button>
        {estado === "ok" && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
            <CheckCircle2 className="size-4" /> Contacto actualizado
          </span>
        )}
        {estado === "error" && (
          <span className="text-sm text-[var(--destructive)]">
            No se pudo guardar. Revisa el email.
          </span>
        )}
      </div>
    </form>
  );
}
