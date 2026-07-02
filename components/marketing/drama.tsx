import Image from "next/image";
import { PhoneMissed } from "lucide-react";
import { Reveal } from "./reveal";

export function Drama() {
  return (
    <section className="border-y-[3px] border-black bg-azul text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <Reveal>
          <span className="mono inline-block border-[3px] border-black bg-casco px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black">
            ◍ El problema
          </span>
          <h2 className="headline mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
            Cada llamada perdida es una obra que se lleva{" "}
            <span className="hl-coral">la competencia</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/85">
            En reformas, el que contesta primero se lleva el presupuesto. Y tú no
            puedes estar en la obra y al teléfono a la vez. La mayoría de quien no
            te coge{" "}
            <strong className="mono bg-casco px-1.5 py-0.5 font-bold text-black">
              no deja mensaje
            </strong>
            : llama directamente al siguiente de la lista.
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:justify-self-end">
          <div className="relative mx-auto w-full max-w-sm">
            {/* Pegatina Currito preocupado */}
            <div className="absolute -right-3 -top-8 z-10 hidden border-[3px] border-black bg-casco nb-shadow-sm sm:block">
              <Image
                src="/currito/preocupado.webp"
                alt="Currito preocupado por la llamada perdida"
                width={92}
                height={92}
                className="size-[92px] object-contain"
              />
            </div>

            {/* Tarjeta LLAMADA PERDIDA */}
            <div className="nb-card rounded-none">
              <div className="mono flex items-center gap-2 border-b-[3px] border-black bg-coral px-4 py-2.5 text-[12px] font-bold uppercase text-black">
                <PhoneMissed className="size-4" strokeWidth={3} />
                Llamada perdida
              </div>
              <div className="px-4 py-4">
                <p className="mono text-[13px] font-bold text-black/70">
                  +34 6·· ··· ··· · hace 1 min
                </p>
                <div className="mt-4 border-[3px] border-black bg-hueso px-4 py-3 text-[14px] font-semibold leading-relaxed text-black">
                  Sin mensaje en el buzón. El cliente ya está llamando al
                  siguiente de la lista.
                </div>
                <div className="mono mt-4 flex items-center justify-between border-t-[3px] border-black pt-4 text-[13px] font-bold uppercase text-black">
                  <span>Presupuesto</span>
                  <span className="bg-black px-2 py-0.5 text-white">Perdido</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
