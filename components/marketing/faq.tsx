const faqs = [
  {
    q: "¿Suena natural o parece un robot?",
    a: "Currito conversa con naturalidad, en español y con un guion adaptado a tu negocio. No es un contestador ni un menú de opciones: entiende lo que necesita el cliente y le responde.",
  },
  {
    q: "¿Tengo que cambiar mi número de teléfono?",
    a: "No. Puedes desviar a Currito solo las llamadas que no cojas, o usar un número nuevo para tus anuncios. Tú eliges cómo encajarlo.",
  },
  {
    q: "¿Avisa de que es un asistente y de que se graba?",
    a: "Sí. Al inicio de cada llamada Currito se presenta como asistente virtual e informa de que la llamada se graba, para cumplir con la normativa.",
  },
  {
    q: "¿Cuánto tardo en ponerlo en marcha?",
    a: "Unos 10 minutos. Nos dices tu tipo de negocio y tus datos, creamos tu asistente con su guion y listo.",
  },
  {
    q: "¿Hay permanencia?",
    a: "Ninguna. Pruebas 14 días gratis y, si sigues, pagas mes a mes. Cancelas cuando quieras.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-ink/10 bg-kraft">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center headline text-4xl sm:text-5xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-12 divide-y divide-ink/10">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="shrink-0 text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink/70">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
