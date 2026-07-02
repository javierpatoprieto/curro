import { PhoneMissed } from "lucide-react";
import { Reveal } from "./reveal";

export function Drama() {
  return (
    <section className="border-y border-ink/10 bg-kraft">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
            El problema
          </p>
          <h2 className="mt-3 headline text-3xl sm:text-4xl lg:text-5xl">
            Cada llamada perdida es una obra que se lleva{" "}
            <span className="marker">la competencia.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
            En reformas, el que contesta primero se lleva el presupuesto. Y tú no
            puedes estar en la obra y al teléfono a la vez. La mayoría de quien no
            te coge{" "}
            <strong className="font-semibold text-ink">no deja mensaje</strong>:
            llama directamente al siguiente de la lista.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto w-full max-w-sm rounded-3xl border border-ink/10 bg-white p-6 shadow-xl shadow-ink/5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-strong">
                <PhoneMissed className="size-5" />
              </span>
              <div>
                <p className="font-display text-base font-bold text-ink">
                  Llamada perdida
                </p>
                <p className="text-sm text-ink/50">+34 6·· ··· ··· · hace 1 min</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-kraft/70 p-4 text-sm leading-relaxed text-ink/70">
              Sin mensaje en el buzón. El cliente ya está llamando al siguiente de
              la lista.
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ink/50">Presupuesto</span>
              <span className="font-semibold text-brand-strong">Perdido</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
