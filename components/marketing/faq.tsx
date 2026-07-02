import { Plus } from "lucide-react";

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
    <section id="faq" className="border-t border-ink/10 bg-kraft">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-fresh-strong">
            Dudas
          </p>
          <h2 className="mt-2 headline text-4xl sm:text-5xl">
            Preguntas frecuentes
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-ink/10 bg-white/70 px-5 py-4 transition-colors open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-strong transition-transform group-open:rotate-45">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink/70">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
