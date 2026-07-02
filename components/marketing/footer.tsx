import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Logo />
          <span className="text-sm text-ink/45">
            Recepcionista con IA para reformas
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink/60">
          <a href="#precios" className="transition-colors hover:text-ink">
            Precios
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            Preguntas
          </a>
          <Link href="/privacidad" className="transition-colors hover:text-ink">
            Privacidad
          </Link>
          <Link href="/aviso-legal" className="transition-colors hover:text-ink">
            Aviso legal
          </Link>
          <Link href="/login" className="transition-colors hover:text-ink">
            Acceder
          </Link>
        </div>
        <p className="text-sm text-ink/40">© 2026 Curro</p>
      </div>
    </footer>
  );
}
