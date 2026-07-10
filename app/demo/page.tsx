import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { btnBosqueSm, btnBosqueLg } from "@/components/marketing/ui";
import { CurroVoz } from "@/components/demo/curro-voz";

export const metadata: Metadata = {
  title: { absolute: "Prueba Curro: habla con la recepcionista IA · Curro" },
  description:
    "Habla con Curro ahora mismo desde el navegador, sin instalar nada. Cuéntale una avería como si fueras un cliente y comprueba cómo atiende, pregunta y capta el lead.",
};

const ejemplos = [
  "«Hola, tengo una fuga en el baño, es urgente, estoy en Santander.»",
  "«Necesito presupuesto para reformar una cocina en Torrelavega.»",
  "«¿Podéis venir a revisar el cuadro eléctrico esta semana?»",
];

export default function DemoPage() {
  return (
    <div className="bg-nieve text-bosque">
      {/* Cabecera mínima */}
      <header className="sticky top-0 z-40 border-b border-linea3 bg-nieve/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/" aria-label="Inicio">
            <Logo />
          </Link>
          <Link href="/registro" className={btnBosqueSm}>
            Probar gratis
          </Link>
        </div>
      </header>

      {/* Hero + demo de voz */}
      <section className="bg-nieve">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-linea3 bg-white px-3 py-1.5 text-xs font-semibold text-bosque">
            <span className="size-1.5 rounded-full bg-lima" />
            Demo en vivo · sin instalar nada
          </span>

          <h1 className="titular mx-auto mt-6 max-w-2xl text-4xl text-bosque sm:text-5xl lg:text-6xl">
            Habla con Curro <span className="marca-lima">ahora mismo</span>.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-bosque-soft">
            Pulsa el botón, permite el micrófono y háblale como si fueras un
            cliente con una avería. Es exactamente lo que oiría quien te llama.
          </p>

          <div className="mt-12">
            <CurroVoz />
          </div>
        </div>
      </section>

      {/* Qué decirle */}
      <section className="border-t border-linea3 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="titular text-2xl text-bosque sm:text-3xl">
            ¿No sabes qué decirle? Prueba con esto
          </h2>
          <ul className="mt-6 space-y-3">
            {ejemplos.map((e) => (
              <li
                key={e}
                className="rounded-2xl border border-linea3 bg-nieve px-5 py-4 text-[15px] text-bosque-soft"
              >
                {e}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] leading-relaxed text-bosque-soft">
            Curro te preguntará lo justo (qué necesitas, la zona, si corre prisa),
            lo apuntará y, en tu cuenta, te avisaría al instante por WhatsApp.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bosque text-nieve">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center lg:py-24">
          <h2 className="titular mx-auto max-w-xl text-3xl text-nieve sm:text-4xl lg:text-5xl">
            ¿Y si contestara así <span className="marca-lima en-oscuro">por ti</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-nieve/75">
            En 10 minutos lo tienes atendiendo tus llamadas. Sin permanencia,
            con 7 días de prueba.
          </p>
          <div className="mt-8">
            <Link href="/registro" className={btnBosqueLg}>
              Probar Curro en mi negocio
            </Link>
          </div>
        </div>
      </section>

      {/* Pie mínimo */}
      <footer className="border-t border-linea3 bg-nieve">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-bosque-soft">
            <Link href="/aviso-legal" className="transition-colors hover:text-bosque">Aviso legal</Link>
            <Link href="/privacidad" className="transition-colors hover:text-bosque">Privacidad</Link>
            <Link href="/condiciones" className="transition-colors hover:text-bosque">Condiciones</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
