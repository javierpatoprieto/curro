import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { exigirAdmin } from "@/lib/admin/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crearClienteAdmin } from "./actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--ring)]";

const SECTORES = [
  "fontanería",
  "electricidad",
  "reformas",
  "pintura",
  "cerrajería",
  "climatización y aire acondicionado",
  "albañilería",
  "carpintería",
  "cristalería",
  "multiservicios del hogar",
];

export default async function NuevoClientePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await exigirAdmin();
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-4" /> Volver al panel
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alta de cliente</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Rellena los datos y Curro se monta solo: se crea el asistente de voz
            con la personalización y la cuenta del cliente.
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
            {error === "validacion"
              ? "Revisa los datos: nombre, email y plan son obligatorios."
              : error === "vapi"
                ? "No se pudo crear el asistente de voz (Vapi). Revisa la API key e inténtalo de nuevo."
                : "No se pudo crear el cliente. Inténtalo de nuevo."}
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Datos del cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={crearClienteAdmin} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Nombre del negocio *">
                  <input name="nombre" required placeholder="Reformas García" className={inputCls} />
                </Campo>
                <Campo label="Email del propietario *">
                  <input name="email" type="email" required placeholder="dueno@negocio.es" className={inputCls} />
                </Campo>
                <Campo label="Ciudad">
                  <input name="ciudad" placeholder="Madrid" className={inputCls} />
                </Campo>
                <Campo label="Tipo de empresa">
                  <input
                    name="actividad"
                    list="sectores"
                    placeholder="fontanería, reformas, electricidad…"
                    className={inputCls}
                  />
                  <datalist id="sectores">
                    {SECTORES.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </Campo>
                <Campo label="Plan *">
                  <select name="plan" defaultValue="pro" className={inputCls}>
                    {["trial", "starter", "pro", "premium"].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Voz de Curro">
                  <select name="voz" defaultValue="femenina" className={inputCls}>
                    <option value="femenina">Femenina</option>
                    <option value="masculina">Masculina</option>
                  </select>
                </Campo>
                <Campo label="Tono">
                  <select name="tono" defaultValue="cercano" className={inputCls}>
                    <option value="cercano">Cercano</option>
                    <option value="profesional">Profesional</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </Campo>
                <Campo label="WhatsApp del dueño (avisos)">
                  <input name="whatsapp" placeholder="+34600000000" className={inputCls} />
                </Campo>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="activo" defaultChecked className="size-4" />
                Cuenta activa desde el alta (atiende llamadas ya)
              </label>

              <Campo label="Enlace de Cal.com (opcional)">
                <input
                  name="cal_link"
                  type="url"
                  placeholder="https://cal.com/negocio/visita"
                  className={inputCls}
                />
              </Campo>
              <Campo label="Servicios que ofrece">
                <textarea
                  name="servicios"
                  rows={2}
                  placeholder="Reformas integrales, baños, cocinas, pintura… (y lo que NO hace)"
                  className={inputCls}
                />
              </Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Zonas que cubre">
                  <input name="zonas" placeholder="Madrid capital y alrededores" className={inputCls} />
                </Campo>
                <Campo label="Horario">
                  <input name="horario" placeholder="L-V 9-18h" className={inputCls} />
                </Campo>
              </div>
              <Campo label="Preguntas que Curro debe hacer siempre">
                <textarea
                  name="preguntas_clave"
                  rows={2}
                  placeholder="¿Es vivienda o local? ¿Metros aproximados? ¿Para cuándo?"
                  className={inputCls}
                />
              </Campo>
              <Campo label="Base de conocimiento / FAQ">
                <textarea
                  name="conocimiento"
                  rows={3}
                  placeholder="Info que Curro puede usar (garantías, financiación, tiempos…)"
                  className={inputCls}
                />
              </Campo>

              <button
                type="submit"
                className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
              >
                Crear cliente y montar a Curro
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
