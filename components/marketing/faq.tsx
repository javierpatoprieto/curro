import { Reveal } from "./reveal";

export const faqs = [
  {
    q: "¿Suena natural o parece un robot?",
    a: "Curro conversa con naturalidad, en español y con un guion adaptado a tu negocio. No es un contestador ni un menú de opciones: entiende lo que necesita el cliente y le responde.",
  },
  {
    q: "¿Tengo que cambiar mi número de teléfono?",
    a: "No. Mantienes tu número de siempre y desvías a Curro solo las llamadas que no cojas (o si comunicas). El cliente sigue marcando tu número; Curro es un número interno que nadie ve.",
  },
  {
    q: "¿Avisa de que es un asistente y de que se graba?",
    a: "Sí. Al inicio de cada llamada Curro se presenta como asistente virtual e informa de que la llamada se graba, para cumplir con la normativa.",
  },
  {
    q: "¿Cuánto tardo en ponerlo en marcha?",
    a: "Unos 10 minutos. Nos dices tu tipo de negocio y tus datos, creamos tu asistente con su guion y listo.",
  },
  {
    q: "¿Hay permanencia?",
    a: "Ninguna. Pruebas 7 días gratis y, si sigues, pagas mes a mes. Cancelas cuando quieras.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t-[3px] border-black bg-casco">
      <div className="mx-auto max-w-3xl px-5 py-20 lg:py-24">
        <Reveal className="text-center">
          <span className="mono inline-block border-[3px] border-black bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide nb-shadow-sm">
            ◍ Dudas
          </span>
          <h2 className="headline mt-5 text-4xl text-black sm:text-5xl lg:text-6xl">
            Preguntas <span className="hl-azul">frecuentes</span>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {faqs.map(({ q, a }, i) => (
            <Reveal key={q} delay={i * 60}>
              <details className="group border-[3px] border-black bg-white nb-shadow open:nb-shadow">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-bold text-black [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="mono flex size-8 shrink-0 items-center justify-center border-[3px] border-black bg-casco text-2xl font-bold leading-none text-black transition-transform duration-150 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t-[3px] border-black px-5 py-4 font-medium leading-relaxed text-black/80">
                  {a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
