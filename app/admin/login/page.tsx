import { ShieldCheck } from "lucide-react";
import { entrarAdmin } from "@/app/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form
        action={entrarAdmin}
        className="w-full max-w-sm rounded-2xl border border-cream/10 bg-cream/[0.04] p-8 text-cream shadow-2xl"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-extrabold leading-none">
              Curro · Superadmin
            </p>
            <p className="text-xs text-cream/50">Backend de control</p>
          </div>
        </div>

        <label
          htmlFor="password"
          className="mt-8 block text-sm font-medium text-cream/70"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-cream/15 bg-ink/60 px-3 py-2.5 text-cream outline-none placeholder:text-cream/30 focus:border-brand"
          placeholder="••••••••"
        />

        {error && (
          <p className="mt-3 text-sm font-medium text-brand">
            Contraseña incorrecta.
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
