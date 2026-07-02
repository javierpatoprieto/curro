import { PhoneMissed, ArrowRight, UserX } from "lucide-react";
import { Reveal } from "./reveal";

export function Drama() {
  return (
    <section className="relative overflow-hidden bg-mist">
      <div className="pointer-events-none absolute -left-24 top-10 size-[30rem] rounded-full bg-verde/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft">
            El problema
          </span>
          <h2 className="headline mt-5 text-4xl text-ink sm:text-5xl lg:text-6xl">
            Cada llamada que no coges es un cliente que llama al{" "}
            <span className="grad">siguiente</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Estés donde estés, con las manos ocupadas o en plena faena, no puedes
            parar a coger el teléfono. Y la mayoría de quien no te encuentra no
            deja mensaje:{" "}
            <strong className="font-semibold text-ink">
              llama directamente al siguiente de la lista
            </strong>
            . El que contesta primero se lleva el trabajo.
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:justify-self-end">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-verde/15 blur-2xl" />

            {/* Tarjeta LLAMADA PERDIDA */}
            <div className="card-fresh overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between border-b border-ink/6 px-5 py-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft">
                  <span className="flex size-6 items-center justify-center rounded-full bg-mist text-ink-soft">
                    <PhoneMissed className="size-3.5" strokeWidth={2.5} />
                  </span>
                  Llamada perdida
                </span>
                <span className="text-xs text-ink-soft/60">hace 1 min</span>
              </div>
              <div className="px-5 py-5">
                <p className="font-display text-2xl font-bold text-ink">
                  +34 6·· ··· ···
                </p>
                <p className="mt-1 text-sm text-ink-soft">Sin mensaje en el buzón</p>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-soft shadow-sm">
                    <UserX className="size-4" strokeWidth={2.25} />
                  </span>
                  <p className="text-sm font-medium text-ink">
                    Ya está llamando a otro
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-ink/6 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Cliente
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                    Perdido
                    <ArrowRight className="size-3.5" strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
