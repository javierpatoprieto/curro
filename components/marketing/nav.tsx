"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { btnPrimarySm } from "./ui";

const links = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "Preguntas" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
        {/* Izquierda: logo */}
        <div className="justify-self-start">
          <Logo dark={!scrolled} size="lg" />
        </div>

        {/* Centro: menú */}
        <nav
          className={`hidden items-center gap-9 text-[0.95rem] font-semibold md:flex ${
            scrolled ? "text-ink/80" : "text-cream/90"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`group relative py-1 transition-colors ${
                scrolled ? "hover:text-ink" : "hover:text-cream"
              }`}
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-brand transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Derecha: acciones */}
        <div className="flex items-center gap-4 justify-self-end">
          <Link
            href="/login"
            className={`hidden text-[0.95rem] font-semibold transition-colors sm:block ${
              scrolled
                ? "text-ink/80 hover:text-ink"
                : "text-cream/90 hover:text-cream"
            }`}
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
