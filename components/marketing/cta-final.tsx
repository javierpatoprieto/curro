import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { btnPrimaryLg } from "./ui";
import { Reveal } from "./reveal";

export function CtaFinal() {
  return (
    <section className="section-dark relative overflow-hidden bg-ink">
      <div className="pointer-events-none absolute -left-24 -top-24 size-[32rem] rounded-full bg-verde/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 size-[30rem] rounded-full bg-violeta/25 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center lg:py-32">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <span className="live-dot" />
            Empieza hoy
          </span>

          <h2 className="headline mx-auto mt-6 max-w-2xl text-4xl text-white sm:text-5xl lg:text-6xl">
            Pon a Curro a coger <span className="grad">el teléfono</span>.
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            En 10 minutos lo tienes contestando por ti. Que no se te escape ni
            una llamada más, estés donde estés.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/registro" className={btnPrimaryLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-sm text-white/70">
              <PhoneCall className="size-4 text-verde" />
              Contestando en 10 min
            </span>
          </div>

          <p className="mt-7 text-sm text-white/50">
            Sin permanencia · Cancelas cuando quieras
          </p>
        </Reveal>
      </div>
    </section>
  );
}
