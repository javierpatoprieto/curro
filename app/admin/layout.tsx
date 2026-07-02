import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { esSuperadmin } from "@/lib/admin/access";

// El backend de control es privado: nunca debe indexarse.
export const metadata: Metadata = {
  title: "Superadmin — Curro",
  robots: { index: false, follow: false },
};

/**
 * Guard de superadmin. Se ejecuta en el servidor:
 *  1. Obtiene el usuario con los helpers de auth existentes.
 *  2. Comprueba su email contra la allowlist ADMIN_EMAILS (lib/admin/access).
 *  3. Si no hay sesión o no está en la lista → redirige a /login.
 *
 * Fail-closed: si ADMIN_EMAILS no está definida, se deniega a todo el mundo.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || !esSuperadmin(user.email, process.env.ADMIN_EMAILS)) {
    redirect("/login");
  }

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
          <div className="hidden text-right text-xs text-[var(--muted-foreground)] sm:block">
            <p className="font-medium text-[var(--foreground)]">
              {user.email}
            </p>
            <form action="/auth/signout" method="post">
              <button type="submit" className="underline hover:opacity-80">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
