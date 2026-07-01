import Image from "next/image";
import { Reveal } from "./reveal";

export function Drama() {
  return (
    <section className="border-y border-ink/10 bg-kraft">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 sm:grid-cols-[1fr_auto]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
            El problema
          </p>
          <p className="mt-3 headline text-3xl sm:text-4xl lg:text-5xl">
            Cada llamada perdida es una obra que se lleva{" "}
            <span className="marker">la competencia.</span>
          </p>
          <p className="mt-5 max-w-xl text-ink/70">
            En reformas, el que contesta primero se lleva el presupuesto. Y tú no
            puedes estar en la obra y al teléfono a la vez. La mayoría de quien no
            te coge <strong className="font-semibold text-ink">no deja
            mensaje</strong>: llama directamente al siguiente de la lista.
          </p>
        </Reveal>
        <Reveal
          delay={120}
          className="mx-auto w-40 shrink-0 sm:w-52 lg:w-60"
        >
          <Image
            src="/currito/preocupado.webp"
            alt="Currito con gesto de preocupación"
            width={520}
            height={520}
            className="w-full object-contain drop-shadow-xl"
          />
        </Reveal>
      </div>
    </section>
  );
}
