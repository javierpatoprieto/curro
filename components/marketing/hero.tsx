import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { btnPrimaryLg, btnGhostDark } from "./ui";
import { HeroDemo } from "./hero-demo";

/** Barra de ondas de voz decorativa (Curro "hablando"). */
function Waveform() {
  return (
    <span aria-hidden className="flex h-4 items-end gap-0.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="wave-bar w-0.5 rounded-full bg-fresh"
          style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="section-dark blueprint-dark relative isolate overflow-hidden">
      {/* Glows limpios: teal detrás del móvil, coral sutil abajo a la izquierda */}
      <div className="pointer-events-none absolute right-[6%] top-28 size-[34rem] rounded-full bg-fresh/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-[26rem] rounded-full bg-brand/12 blur-[130px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-40">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream/80">
            <Waveform />
            Recepcionista con IA · 24/7 · en español
          </span>
          <h1 className="headline mt-6 text-5xl text-cream sm:text-6xl lg:text-[4.1rem]">
            Tú en la obra.
            <br />
            Curro al{" "}
            <span className="whitespace-nowrap text-brand">teléfono.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/70">
            La recepcionista con IA para reformas y multiservicios del hogar.
            Atiende cada llamada, cualifica al cliente y te pasa el presupuesto
            por WhatsApp. Aunque estés subido a un andamio.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/login" className={btnPrimaryLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" />
            </Link>
            <a href="#como-funciona" className={btnGhostDark}>
              Ver cómo funciona
            </a>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-cream/50">
            <span>Sin permanencia</span>
            <span className="text-cream/25">·</span>
            <span>Listo en 10 minutos</span>
            <span className="text-cream/25">·</span>
            <span>Cancelas cuando quieras</span>
          </p>
        </div>

        {/* Demo de producto (móvil animado) + Currito como avatar de acento */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <HeroDemo />
            <div className="absolute -left-3 -top-3 z-10 hidden items-center gap-2 rounded-full border border-cream/15 bg-ink/80 py-1 pl-1 pr-3 shadow-lg backdrop-blur sm:flex">
              <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-cream/10 ring-1 ring-cream/20">
                <Image
                  src="/currito/cabeza.webp"
                  alt="Currito, la recepcionista de Curro"
                  width={40}
                  height={40}
                  className="size-7 object-contain"
                  priority
                />
              </span>
              <span className="text-xs font-semibold text-cream">
                Curro
                <span className="ml-1.5 inline-flex items-center gap-1 font-normal text-cream/60">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  en línea
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
