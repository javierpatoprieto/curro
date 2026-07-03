import Link from "next/link";
import { Logo } from "./logo";
import { btnBosqueSm } from "./ui";

const links = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "Preguntas" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-linea3 bg-nieve/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-9 text-sm font-medium text-bosque-soft md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-bosque"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-bosque-soft transition-colors hover:text-bosque sm:block"
          >
            Acceder
          </Link>
          <Link href="/registro" className={btnBosqueSm}>
            Probar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
