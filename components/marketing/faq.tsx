import { Reveal } from "./reveal";

export const faqs = [
  {
    q: "¿Suena natural o parece un robot?",
    a: "Curro conversa con naturalidad, en español y con un guion adaptado a tu negocio. No es un contestador ni un menú de opciones: entiende lo que necesita el cliente y le responde.",
  },
  {
    q: "¿Para qué negocios y oficios sirve?",
    a: "Para cualquier autónomo o pequeño gremio que reciba llamadas: fontaneros, electricistas, pintores, cerrajeros, climatización, carpinteros, jardineros, manitas… Adaptamos el guion a lo que ofreces.",
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
    <section id="faq" className="relative overflow-hidden bg-mist">
      <div className="pointer-events-none absolute -right-24 top-16 size-[26rem] rounded-full bg-verde/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-8 size-[22rem] rounded-full bg-violeta/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft">
            <span className="live-dot" />
            Dudas
          </span>
          <h2 className="headline mt-5 text-4xl text-ink sm:text-5xl">
            Preguntas <span className="grad">frecuentes</span>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map(({ q, a }, i) => (
            <Reveal key={q} delay={i * 70}>
              <details className="card-fresh group transition-shadow duration-300 open:shadow-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-verde-soft text-2xl font-light leading-none text-verde-dark transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-ink/6 px-6 py-5 leading-relaxed text-ink-soft">
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
