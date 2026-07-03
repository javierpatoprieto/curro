import { PhoneMissed, ArrowRight, UserX } from "lucide-react";
import { Reveal } from "./reveal";

export function Drama() {
  return (
    <section className="bg-nieve">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-linea3 bg-white px-3 py-1.5 text-xs font-semibold text-bosque">
            <span className="size-1.5 rounded-full bg-lima" />
            El problema
          </span>
          <h2 className="titular mt-5 text-4xl text-bosque sm:text-5xl lg:text-6xl">
            Cada llamada que no coges es un cliente que llama al{" "}
            <span className="marca-lima">siguiente</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bosque-soft">
            Estés donde estés, con las manos ocupadas o en plena faena, no puedes
            parar a coger el teléfono. Y la mayoría de quien no te encuentra no
            deja mensaje:{" "}
            <strong className="font-semibold text-bosque">
              llama directamente al siguiente de la lista
            </strong>
            . El que contesta primero se lleva el trabajo.
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:justify-self-end">
          <div className="mx-auto w-full max-w-sm">
            {/* Tarjeta LLAMADA PERDIDA */}
            <div className="overflow-hidden rounded-2xl border border-linea3 bg-white">
              <div className="flex items-center justify-between border-b border-linea3 px-5 py-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-bosque-soft">
                  <span className="flex size-6 items-center justify-center rounded-full bg-nieve text-bosque-soft">
                    <PhoneMissed className="size-3.5" strokeWidth={2.5} />
                  </span>
                  Llamada perdida
                </span>
                <span className="text-xs text-bosque-soft/60">hace 1 min</span>
              </div>
              <div className="px-5 py-5">
                <p className="titular text-2xl text-bosque">
                  +34 6·· ··· ···
                </p>
                <p className="mt-1 text-sm text-bosque-soft">
                  Sin mensaje en el buzón
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-linea3 bg-nieve px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-bosque-soft">
                    <UserX className="size-4" strokeWidth={2.25} />
                  </span>
                  <p className="text-sm font-medium text-bosque">
                    Ya está llamando a otro
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-linea3 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-bosque-soft">
                    Cliente
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-bosque px-3 py-1 text-xs font-semibold text-lima">
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
