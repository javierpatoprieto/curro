import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { btnLimaLg } from "./ui";
import { Reveal } from "./reveal";

export function CtaFinal() {
  return (
    <section className="bg-bosque text-nieve">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:py-32">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-nieve/15 bg-nieve/[0.04] px-3 py-1.5 text-xs font-semibold text-nieve/80">
            <span className="size-1.5 rounded-full bg-lima" />
            Empieza hoy
          </span>

          <h2 className="titular mx-auto mt-6 max-w-2xl text-4xl text-nieve sm:text-5xl lg:text-6xl">
            Pon a Curro a coger <span className="marca-lima text-lima">el teléfono</span>.
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-nieve/75">
            En 10 minutos lo tienes contestando por ti. Que no se te escape ni
            una llamada más, estés donde estés.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/registro" className={btnLimaLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
            <span className="inline-flex items-center gap-2 rounded-lg border border-nieve/15 bg-nieve/[0.04] px-4 py-2.5 text-sm text-nieve/70">
              <PhoneCall className="size-4 text-lima" />
              Contestando en 10 min
            </span>
          </div>

          <p className="mt-7 text-sm text-nieve/50">
            Sin permanencia · Cancelas cuando quieras
          </p>
        </Reveal>
      </div>
    </section>
  );
}
