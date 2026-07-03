import Link from "next/link";
import { Logo } from "./logo";
import { GREMIOS } from "@/lib/gremios";

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
    <footer className="bg-bosque text-nieve">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="max-w-xs">
            <Logo dark />
            <p className="mt-4 text-sm leading-relaxed text-nieve/70">
              El recepcionista con IA para autónomos y gremios. Contesta cada
              llamada y te la pasa por WhatsApp.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-nieve/70">
            {enlaces.map(({ label, href }) =>
              href.startsWith("#") ? (
                <a
                  key={label}
                  href={href}
                  className="transition-colors hover:text-lima"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  className="transition-colors hover:text-lima"
                >
                  {label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="mt-10 border-t border-nieve/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-nieve/50">
            Curro para
          </p>
          <nav className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-nieve/70">
            {GREMIOS.map((g) => (
              <Link
                key={g.slug}
                href={`/para/${g.slug}`}
                className="capitalize transition-colors hover:text-lima"
              >
                {g.nombre}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-nieve/10 pt-6 text-sm text-nieve/50 sm:flex-row sm:justify-between">
          <p>© 2026 Curro</p>
          <p className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-lima" />
            Cogiendo el teléfono ahora mismo
          </p>
        </div>
      </div>
    </footer>
  );
}
