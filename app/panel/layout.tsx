import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PhoneCall, LogOut } from "lucide-react";
import { getSessionUser, getCurrentContext } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { PanelNav } from "@/components/panel/panel-nav";
import { Button } from "@/components/ui/button";

// El panel es privado: nunca debe indexarse.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const context = await getCurrentContext();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] p-4 sm:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
            <PhoneCall className="size-4" />
          </div>
          <span className="font-semibold">Curro</span>
        </div>

        <PanelNav />

        <div className="mt-auto space-y-3 border-t border-[var(--border)] pt-4">
          <div className="px-2 text-xs text-[var(--muted-foreground)]">
            <p className="truncate font-medium text-[var(--foreground)]">
              {context?.business.nombre ?? "Sin negocio asignado"}
            </p>
            <p className="truncate">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-[var(--muted-foreground)]"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {isDemoMode() && (
          <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-2 text-center text-sm font-medium text-amber-700 dark:text-amber-400">
            ⚠️ MODO DEMO — datos de ejemplo. Conecta Supabase para ver tus datos
            reales.
          </div>
        )}
        {!context && (
          <div className="border-b border-[var(--border)] bg-[var(--secondary)] px-6 py-3 text-sm text-[var(--secondary-foreground)]">
            Aún no tienes un negocio configurado.{" "}
            <a href="/onboarding" className="font-semibold underline">
              Da de alta tu negocio
            </a>{" "}
            para empezar.
          </div>
        )}
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
