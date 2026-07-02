import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { btnPrimaryLg } from "./ui";
import { Reveal } from "./reveal";

export function CtaFinal() {
  return (
    <section className="border-t-[3px] border-black bg-azul">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-20 sm:grid-cols-[1fr_auto] lg:py-24">
        <Reveal>
          <span className="mono inline-block border-[3px] border-black bg-casco px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black nb-shadow-sm">
            ◍ Empieza hoy
          </span>
          <h2 className="headline mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
            Pon a Curro a coger{" "}
            <span className="hl-coral">el teléfono.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/85">
            En 10 minutos lo tienes atendiendo llamadas por ti. Que no se te
            escape ni un presupuesto más.
          </p>
          <div className="mt-8">
            <Link href="/registro" className={btnPrimaryLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" strokeWidth={3} />
            </Link>
          </div>
          <p className="mono mt-6 text-[11px] font-bold uppercase tracking-wide text-white/70">
            Sin permanencia · Cancelas cuando quieras
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="hidden justify-self-center sm:block"
        >
          <div className="rotate-2 border-[3px] border-black bg-casco p-4 nb-shadow">
            <Image
              src="/currito/pulgar.webp"
              alt="Currito celebrando con el pulgar hacia arriba"
              width={890}
              height={1300}
              className="w-36 shrink-0 object-contain lg:w-44"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
