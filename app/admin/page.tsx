import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Plus } from "lucide-react";
import { adminAutenticado } from "@/lib/admin/auth";
import { salirAdmin } from "@/app/admin/actions";
import { getAdminDashboard } from "@/lib/admin/data";
import { Kpis } from "@/app/admin/_components/kpis";
import { TablaClientes } from "@/app/admin/_components/tabla-clientes";
import { TendenciaAltas } from "@/app/admin/_components/tendencia-altas";

// Datos en vivo (cross-tenant, dependen de Stripe/BD): sin caché.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Gate por contraseña: si no hay cookie válida, al login de admin.
  if (!(await adminAutenticado())) {
    redirect("/admin/login");
  }

  const data = await getAdminDashboard();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <span className="font-semibold">Curro · Superadmin</span>
              <p className="text-xs text-[var(--muted-foreground)]">
                Vista transversal de todos los negocios
              </p>
            </div>
          </div>
          <form action={salirAdmin}>
            <button
              type="submit"
              className="text-sm text-[var(--muted-foreground)] underline hover:text-[var(--foreground)]"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Backend de control
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Métricas del SaaS y estado de todos los negocios (tenants).
            </p>
          </div>
          <Link
            href="/admin/clientes/nuevo"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
          >
            <Plus className="size-4" /> Nuevo cliente
          </Link>
        </div>

        <Kpis data={data} />
        <TendenciaAltas serie={data.tendencia} />
        <TablaClientes filas={data.filas} />
      </main>
    </div>
  );
}
