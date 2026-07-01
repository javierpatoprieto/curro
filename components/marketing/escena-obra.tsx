import Image from "next/image";

/** Sección full-bleed: Currito en la obra mientras el dueño trabaja tranquilo. */
export function EscenaObra() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/currito/obra.jpg"
        alt="Currito atiende una llamada en la obra mientras el dueño sigue trabajando"
        width={2000}
        height={1144}
        className="h-[60vh] min-h-80 w-full object-cover"
      />
      {/* Degradado para legibilidad del titular */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="max-w-xl headline text-3xl text-cream sm:text-4xl lg:text-5xl">
            Tú a lo tuyo. Currito, al teléfono.
          </p>
          <p className="mt-4 max-w-md text-cream/80">
            Mientras tú picas pared, él atiende, cualifica y te manda el lead.
            Ninguna llamada se queda sin coger.
          </p>
        </div>
      </div>
    </section>
  );
}
