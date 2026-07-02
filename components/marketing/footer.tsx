import Link from "next/link";
import { Logo } from "./logo";

const enlaces = [
  { label: "Precios", href: "#precios" },
  { label: "Preguntas", href: "#faq" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Condiciones", href: "/condiciones" },
  { label: "Cookies", href: "/cookies" },
  { label: "Acceder", href: "/login" },
];

export function Footer() {
  return (
    <footer className="border-t-[3px] border-black bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-5 py-10 sm:flex-row">
        <Logo dark />

        <nav className="mono flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] font-bold uppercase tracking-wide">
          {enlaces.map(({ label, href }) =>
            href.startsWith("#") ? (
              <a
                key={label}
                href={href}
                className="text-white/80 transition-colors hover:text-casco"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                className="text-white/80 transition-colors hover:text-casco"
              >
                {label}
              </Link>
            ),
          )}
        </nav>

        <p className="mono text-[12px] font-bold uppercase tracking-wide text-white/60">
          © 2026 Curro
        </p>
      </div>
    </footer>
  );
}
