import { redirect } from "next/navigation";
import { PhoneCall } from "lucide-react";
import { getSessionUser, getCurrentContext } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { PLANES_PAGO } from "@/lib/stripe/plans";
import { crearNegocio } from "@/app/onboarding/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/onboarding");

  // Si ya tiene negocio, al panel (salvo en demo, para poder ver el flujo).
  const context = await getCurrentContext();
  if (context && !isDemoMode()) redirect("/panel");

  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
          <PhoneCall className="size-4" />
        </span>
        <span className="font-semibold">Curro</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">Da de alta tu negocio</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        En un minuto creamos tu recepcionista con IA. 7 días de prueba gratis,
        sin permanencia.
      </p>

      {error && (
        <p className="mt-4 rounded-md bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
          {error === "validacion"
            ? "Revisa los datos del formulario."
            : "No hemos podido crear el negocio. Inténtalo de nuevo."}
        </p>
      )}

      <form action={crearNegocio} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nombre">Nombre del negocio</Label>
            <Input id="nombre" name="nombre" required placeholder="Reformas García e Hijos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input id="ciudad" name="ciudad" placeholder="Madrid" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp del dueño</Label>
            <Input id="whatsapp" name="whatsapp" placeholder="+34 600 000 000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email de avisos</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={user.email ?? ""}
              placeholder="tu@empresa.es"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cal_link">Enlace de Cal.com (opcional)</Label>
            <Input
              id="cal_link"
              name="cal_link"
              placeholder="https://cal.com/tu-negocio/visita"
            />
          </div>
        </div>

        <details className="rounded-xl border border-[var(--border)] p-4">
          <summary className="cursor-pointer font-medium">
            Personaliza a Curro para tu negocio (opcional)
          </summary>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Cuanto más le cuentes, mejor atenderá tus llamadas. Puedes cambiarlo
            luego en Ajustes.
          </p>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="servicios">Servicios que ofreces</Label>
              <textarea
                id="servicios"
                name="servicios"
                rows={2}
                className="w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                placeholder="Reformas integrales, baños, cocinas, pintura, fontanería… (y lo que NO haces)"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zonas">Zonas que cubres</Label>
                <Input id="zonas" name="zonas" placeholder="Madrid capital y alrededores" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario">Horario de atención</Label>
                <Input id="horario" name="horario" placeholder="L-V 9:00-18:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tono">Tono de Curro</Label>
              <select
                id="tono"
                name="tono"
                defaultValue="cercano"
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
                className="w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                placeholder="¿Es vivienda o local? ¿Metros aproximados? ¿Para cuándo lo necesita?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conocimiento">Base de conocimiento / FAQ</Label>
              <textarea
                id="conocimiento"
                name="conocimiento"
                rows={3}
                className="w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                placeholder="Información que Curro puede usar para responder dudas (garantías, financiación, tiempos, etc.)"
              />
            </div>
          </div>
        </details>

        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-medium">Elige tu plan</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.values(PLANES_PAGO).map((p) => (
              <label key={p.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  defaultChecked={p.id === "pro"}
                  className="peer sr-only"
                  required
                />
                <div className="rounded-xl border border-[var(--border)] p-4 transition-colors peer-checked:border-[var(--primary)] peer-checked:ring-1 peer-checked:ring-[var(--primary)]">
                  <p className="font-semibold">{p.nombre}</p>
                  <p className="text-2xl font-bold">
                    {p.precio}€
                    <span className="text-sm font-normal text-[var(--muted-foreground)]">
                      /mes
                    </span>
                  </p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="w-full">
          Empezar prueba gratis
        </Button>
        <p className="text-center text-xs text-[var(--muted-foreground)]">
          Te llevaremos al pago para activar la suscripción tras la prueba.
        </p>
      </form>
    </main>
  );
}
