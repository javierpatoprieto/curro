import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { btnBosqueLg } from "./ui";

export function Hero() {
  return (
    <section className="bg-nieve">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-linea3 bg-white px-3 py-1.5 text-xs font-semibold text-bosque">
            <span className="size-1.5 rounded-full bg-lima" />
            Recepcionista con IA · autónomos y gremios
          </span>

          <h1 className="titular mt-6 text-5xl text-bosque sm:text-6xl lg:text-[4.4rem]">
            Tú a lo tuyo. Curro coge{" "}
            <span className="marca-lima">el teléfono</span>.
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-bosque-soft">
            El recepcionista con IA para autónomos y pequeños gremios. Contesta
            cada llamada, apunta al cliente y te lo pasa por WhatsApp. Estés donde
            estés, con las manos ocupadas o en plena faena.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/registro" className={btnBosqueLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-bosque transition-opacity hover:opacity-70"
            >
              Ver cómo funciona
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </a>
          </div>

          <p className="mt-7 text-sm text-bosque-soft">
            Sin permanencia · Listo en 10 min · Cancelas cuando quieras
          </p>
        </div>

        {/* Imagen real: la llamada entrante */}
        <div className="relative lg:justify-self-end">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-linea3">
            <Image
              src="/img/llamada.jpg"
              alt="Un profesional sujeta el móvil con una llamada entrante que Curro atiende por él"
              width={880}
              height={1100}
              priority
              className="h-full w-full object-cover"
            />
            {/* Tarjeta flotante de producto */}
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-linea3 bg-nieve/95 p-3 shadow-lg backdrop-blur">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bosque text-lima">
                <PhoneCall className="size-5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bosque">
                  Curro está atendiendo
                </p>
                <p className="truncate text-xs text-bosque-soft">
                  Reparar fuga · Chamberí · Urgente
                </p>
              </div>
              <span aria-hidden className="ml-auto flex h-5 items-end gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-bosque"
                    style={{
                      height: "100%",
                      animation: `curro-wave ${0.7 + i * 0.1}s ease-in-out ${i * 0.1}s infinite`,
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
