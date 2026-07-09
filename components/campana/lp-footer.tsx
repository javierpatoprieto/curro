import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

const legal = [
  { href: "/aviso-legal", t: "Aviso legal" },
  { href: "/privacidad", t: "Privacidad" },
  { href: "/condiciones", t: "Condiciones" },
  { href: "/cookies", t: "Cookies" },
];

/**
 * Pie minimalista para las landing de campaña: marca, enlaces legales (los que
 * exigen Meta/Google Ads) y copyright. Sin el mapa de enlaces del footer normal
 * para no distraer del CTA.
 */
export function LpFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-linea3 bg-nieve">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-bosque-soft">
          {legal.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-bosque"
            >
              {l.t}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-bosque-soft">© {year} Curro</p>
      </div>
    </footer>
  );
}
