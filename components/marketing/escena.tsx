import Image from "next/image";
import { Reveal } from "./reveal";

export function Escena() {
  return (
    <section className="border-y border-linea3 bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-20">
        <Reveal className="overflow-hidden rounded-3xl border border-linea3">
          <Image
            src="/img/gremio.jpg"
            alt="Un fontanero trabaja tranquilo mientras Curro atiende sus llamadas"
            width={880}
            height={1100}
            className="h-full w-full object-cover"
          />
        </Reveal>

        <Reveal delay={120}>
          <span className="inline-flex items-center gap-2 rounded-full border border-linea3 bg-nieve px-3 py-1.5 text-xs font-semibold text-bosque">
            <span className="size-1.5 rounded-full bg-lima" />
            Tú, a lo tuyo
          </span>
          <h2 className="titular mt-6 text-4xl text-bosque sm:text-5xl">
            Con las manos en la faena, no en el{" "}
            <span className="marca-lima">teléfono</span>.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bosque-soft">
            Mientras tú picas pared, sueldas o pintas, Curro coge la llamada,
            cualifica al cliente y te manda el aviso. Ninguna se queda sin coger,
            estés donde estés.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
