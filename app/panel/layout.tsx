import { redirect } from "next/navigation";
import { PhoneCall, LogOut } from "lucide-react";
import { getSessionUser, getCurrentContext } from "@/lib/auth";
import { PanelNav } from "@/components/panel/panel-nav";
import { Button } from "@/components/ui/button";

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
          <span className="font-semibold">AtiendeReformas</span>
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
        {!context && (
          <div className="border-b border-[var(--border)] bg-[var(--secondary)] px-6 py-3 text-sm text-[var(--secondary-foreground)]">
            Tu usuario aún no está enlazado a ningún negocio. Enlázalo por email
            (ver <code>supabase/README.md</code>) o completa el alta en la Fase 5.
          </div>
        )}
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
