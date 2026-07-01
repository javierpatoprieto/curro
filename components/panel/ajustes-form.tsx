"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { guardarAjustes } from "@/app/panel/ajustes/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Business } from "@/lib/types";

const areaCls =
  "w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

export function AjustesForm({ business }: { business: Business }) {
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [pendiente, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setEstado("idle");
    startTransition(async () => {
      const r = await guardarAjustes(fd);
      setEstado(r.ok ? "ok" : "error");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="nombre">Nombre del negocio</Label>
          <Input id="nombre" name="nombre" required defaultValue={business.nombre} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input id="ciudad" name="ciudad" defaultValue={business.ciudad ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cal_link">Enlace de Cal.com</Label>
          <Input
            id="cal_link"
            name="cal_link"
            defaultValue={business.cal_link ?? ""}
            placeholder="https://cal.com/tu-negocio/visita"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-[var(--border)] pt-6">
        <p className="text-sm font-medium">Cómo atiende Curro</p>
        <div className="space-y-2">
          <Label htmlFor="servicios">Servicios que ofreces</Label>
          <textarea
            id="servicios"
            name="servicios"
            rows={2}
            className={areaCls}
            defaultValue={business.servicios ?? ""}
            placeholder="Reformas integrales, baños, cocinas, pintura… (y lo que NO haces)"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="zonas">Zonas que cubres</Label>
            <Input id="zonas" name="zonas" defaultValue={business.zonas ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horario">Horario</Label>
            <Input id="horario" name="horario" defaultValue={business.horario ?? ""} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tono">Tono</Label>
          <select
            id="tono"
            name="tono"
            defaultValue={business.tono ?? "cercano"}
            className="h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <option value="cercano">Cercano</option>
            <option value="profesional">Profesional</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preguntas_clave">Preguntas que debe hacer siempre</Label>
          <textarea
            id="preguntas_clave"
            name="preguntas_clave"
            rows={2}
            className={areaCls}
            defaultValue={business.preguntas_clave ?? ""}
            placeholder="¿Es vivienda o local? ¿Metros aproximados? ¿Para cuándo?"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conocimiento">Base de conocimiento / FAQ</Label>
          <textarea
            id="conocimiento"
            name="conocimiento"
            rows={4}
            className={areaCls}
            defaultValue={business.conocimiento ?? ""}
            placeholder="Info que Curro puede usar para responder dudas (garantías, financiación, tiempos…)"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pendiente}>
          {pendiente && <Loader2 className="size-4 animate-spin" />}
          Guardar cambios
        </Button>
        {estado === "ok" && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
            <CheckCircle2 className="size-4" /> Guardado y sincronizado con Curro
          </span>
        )}
        {estado === "error" && (
          <span className="text-sm text-[var(--destructive)]">
            No se pudo guardar. Revisa los datos.
          </span>
        )}
      </div>
    </form>
  );
}
