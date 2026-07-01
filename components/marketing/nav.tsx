import Link from "next/link";
import { Logo } from "./logo";
import { btnPrimary } from "./ui";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
          <a href="#como-funciona" className="hover:text-ink">
            Cómo funciona
          </a>
          <a href="#precios" className="hover:text-ink">
            Precios
          </a>
          <a href="#faq" className="hover:text-ink">
            Preguntas
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block"
          >
            Acceder
          </Link>
          <Link href="/login" className={btnPrimary}>
            Probar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
