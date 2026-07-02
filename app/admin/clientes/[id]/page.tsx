import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { exigirAdmin } from "@/lib/admin/auth";
import { getClienteDetalle } from "@/lib/admin/data";
import { formatoFecha } from "@/lib/metrics/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guardarCliente, borrarCliente } from "./actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--ring)]";

export default async function ClienteAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await exigirAdmin();
  const { id } = await params;
  const { ok, error } = await searchParams;

  const detalle = await getClienteDetalle(id);
  if (!detalle) notFound();
  const b = detalle.business;

  const guardar = guardarCliente.bind(null, id);
  const borrar = borrarCliente.bind(null, id);

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
          <h1 className="text-2xl font-bold tracking-tight">{b.nombre}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {b.ciudad ?? "Sin ciudad"} · Plan {b.plan} ·{" "}
            {b.activo ? "activo" : "inactivo"} · Alta {formatoFecha(b.created_at)}
          </p>
        </div>

        {ok && (
          <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
            Cambios guardados.
          </p>
        )}
        {error && (
          <p className="rounded-md bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">
            {error === "confirm"
              ? "El nombre de confirmación no coincide; no se ha borrado nada."
              : error === "validacion"
                ? "Revisa los datos del formulario."
                : "No se pudo completar la operación."}
          </p>
        )}

        {/* Uso y datos de sistema */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Dato etiqueta="Llamadas (mes)" valor={detalle.llamadasMes} />
          <Dato etiqueta="Leads (mes)" valor={detalle.leadsMes} />
          <Dato
            etiqueta="Assistant Vapi"
            valor={b.vapi_assistant_id ? "sí" : "no"}
          />
          <Dato
            etiqueta="Suscripción"
            valor={b.stripe_subscription_id ? "activa" : "—"}
          />
        </div>
        {detalle.owners.length > 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Propietario(s):{" "}
            {detalle.owners.map((o) => o.email).join(", ")}
          </p>
        )}

        {/* Edición / personalización */}
        <Card>
          <CardHeader>
            <CardTitle>Editar y personalizar</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={guardar} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Nombre">
                  <input name="nombre" defaultValue={b.nombre} required className={inputCls} />
                </Campo>
                <Campo label="Ciudad">
                  <input name="ciudad" defaultValue={b.ciudad ?? ""} className={inputCls} />
                </Campo>
                <Campo label="Plan">
                  <select name="plan" defaultValue={b.plan} className={inputCls}>
                    {["trial", "starter", "pro", "premium", "cancelado"].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Tono">
                  <select name="tono" defaultValue={b.tono ?? ""} className={inputCls}>
                    <option value="">(por defecto)</option>
                    <option value="cercano">Cercano</option>
                    <option value="profesional">Profesional</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </Campo>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="activo"
                  defaultChecked={b.activo}
                  className="size-4"
                />
                Cuenta activa (atiende llamadas)
              </label>

              <Campo label="Enlace de Cal.com">
                <input
                  name="cal_link"
                  type="url"
                  defaultValue={b.cal_link ?? ""}
                  placeholder="https://cal.com/negocio/visita"
                  className={inputCls}
                />
              </Campo>
              <Campo label="Servicios">
                <textarea name="servicios" defaultValue={b.servicios ?? ""} rows={2} className={inputCls} />
              </Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Zonas">
                  <input name="zonas" defaultValue={b.zonas ?? ""} className={inputCls} />
                </Campo>
                <Campo label="Horario">
                  <input name="horario" defaultValue={b.horario ?? ""} className={inputCls} />
                </Campo>
              </div>
              <Campo label="Preguntas clave">
                <textarea name="preguntas_clave" defaultValue={b.preguntas_clave ?? ""} rows={2} className={inputCls} />
              </Campo>
              <Campo label="Base de conocimiento">
                <textarea name="conocimiento" defaultValue={b.conocimiento ?? ""} rows={3} className={inputCls} />
              </Campo>

              <button
                type="submit"
                className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
              >
                Guardar cambios
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Zona peligrosa */}
        <Card className="border-[var(--destructive)]/30">
          <CardHeader>
            <CardTitle className="text-[var(--destructive)]">
              Borrar cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Elimina el negocio y <strong>todos sus datos</strong> (leads,
              llamadas, propietarios), cancela su suscripción de Stripe y borra su
              assistant de Vapi. Esta acción no se puede deshacer.
            </p>
            <form action={borrar} className="mt-4 flex flex-wrap items-end gap-3">
              <div className="flex-1">
                <Campo label={`Escribe «${b.nombre}» para confirmar`}>
                  <input name="confirm" className={inputCls} autoComplete="off" />
                </Campo>
              </div>
              <button
                type="submit"
                className="rounded-md bg-[var(--destructive)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Borrar definitivamente
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

function Dato({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
      <p className="text-xs text-[var(--muted-foreground)]">{etiqueta}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{valor}</p>
    </div>
  );
}
