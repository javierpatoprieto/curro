import Link from "next/link";
import { Logo } from "./logo";
import { btnPrimarySm } from "./ui";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-ink">
            Cómo funciona
          </a>
          <a href="#precios" className="transition-colors hover:text-ink">
            Precios
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            Preguntas
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Acceder
          </Link>
          <Link href="/registro" className={btnPrimarySm}>
            Probar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
