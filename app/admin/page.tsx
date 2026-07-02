import { getAdminDashboard } from "@/lib/admin/data";
import { Kpis } from "@/app/admin/_components/kpis";
import { TablaClientes } from "@/app/admin/_components/tabla-clientes";
import { TendenciaAltas } from "@/app/admin/_components/tendencia-altas";

// Datos en vivo (cross-tenant, dependen de la sesión y de Stripe): sin caché.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboard();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Backend de control</h1>
        <p className="text-[var(--muted-foreground)]">
          Métricas del SaaS y estado de todos los negocios (tenants).
        </p>
      </header>

      <Kpis data={data} />

      <TendenciaAltas serie={data.tendencia} />

      <TablaClientes filas={data.filas} />
    </div>
  );
}
