import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { btnPrimaryLg, btnGhostDark } from "./ui";

/** Barra de ondas de voz decorativa (Currito "hablando"). */
function Waveform() {
  return (
    <span aria-hidden className="flex h-6 items-end gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="wave-bar w-1 rounded-full bg-casco"
          style={{ height: "100%", animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="section-dark blueprint-dark relative overflow-hidden">
      {/* Halos de color */}
      <div className="pointer-events-none absolute -right-32 -top-40 size-[36rem] rounded-full bg-brand/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-fresh/20 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-4 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream/80">
            <Waveform />
            Recepcionista con IA · 24/7 · en español
          </span>
          <h1 className="headline mt-6 text-5xl text-cream sm:text-6xl lg:text-7xl">
            Tú en la obra.
            <br />
            Currito al{" "}
            <span className="relative whitespace-nowrap text-casco">
              teléfono.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/70">
            La recepcionista con inteligencia artificial para empresas de
            reformas y multiservicios del hogar. Atiende cada llamada, cualifica
            al cliente y te pasa el presupuesto por WhatsApp. Aunque estés subido
            a un andamio.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/login" className={btnPrimaryLg}>
              Probar gratis 14 días
              <ArrowRight className="size-4" />
            </Link>
            <a href="#como-funciona" className={btnGhostDark}>
              Ver cómo funciona
            </a>
          </div>
          <p className="mt-5 text-sm text-cream/50">
            Sin permanencia · Listo en 10 minutos · Cancelas cuando quieras
          </p>
        </div>

        {/* Currito a sangre, cogiendo el teléfono */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="pointer-events-none absolute bottom-0 h-2/3 w-full max-w-md rounded-full bg-casco/15 blur-2xl" />
          <Image
            src="/currito/hero.png"
            alt="Currito, la mascota de Curro, con casco de obra atiende una llamada con el móvil"
            width={890}
            height={1300}
            priority
            className="relative w-full max-w-sm object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
