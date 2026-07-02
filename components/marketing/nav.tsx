import Link from "next/link";
import { Logo } from "./logo";
import { btnPrimarySm } from "./ui";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-black bg-hueso">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="mono hidden items-center gap-7 text-[13px] font-bold uppercase text-black md:flex">
          <a href="#como-funciona" className="hover:text-azul">
            Cómo funciona
          </a>
          <a href="#precios" className="hover:text-azul">
            Precios
          </a>
          <a href="#faq" className="hover:text-azul">
            Preguntas
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="mono hidden text-[13px] font-bold uppercase text-black hover:text-azul sm:block"
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
