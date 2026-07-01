import { Check } from "lucide-react";
import { HeroDemo } from "./hero-demo";
import { Reveal } from "./reveal";

const puntos = [
  "Coge la llamada en el primer tono y conversa en español.",
  "Cualifica: nombre, tipo de trabajo, zona y urgencia.",
  "Te avisa al instante por WhatsApp con el resumen y la transcripción.",
];

export function Prueba() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-fresh-strong">
            Míralo en acción
          </p>
          <h2 className="mt-2 headline text-4xl sm:text-5xl">
            Una llamada real, de principio a fin.
          </h2>
          <p className="mt-5 max-w-lg text-ink/70">
            Así trabaja Currito cada vez que entra una llamada que tú no puedes
            coger. En segundos tienes el lead en el móvil.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {puntos.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-fresh/15 text-fresh-strong">
                  <Check className="size-3.5" />
                </span>
                <span className="text-ink/80">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="flex justify-center">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
