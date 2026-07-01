import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="hidden text-sm text-ink/50 sm:inline">
            · Recepcionista con IA para reformas
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink/60">
          <a href="#precios" className="hover:text-ink">
            Precios
          </a>
          <a href="#faq" className="hover:text-ink">
            Preguntas
          </a>
          <Link href="/privacidad" className="hover:text-ink">
            Privacidad
          </Link>
          <Link href="/aviso-legal" className="hover:text-ink">
            Aviso legal
          </Link>
          <Link href="/login" className="hover:text-ink">
            Acceder
          </Link>
        </div>
        <p className="text-sm text-ink/40">© 2026 Curro</p>
      </div>
    </footer>
  );
}
