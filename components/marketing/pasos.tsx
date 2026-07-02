import { PhoneCall, ClipboardList, BellRing, CalendarCheck } from "lucide-react";
import { Reveal } from "./reveal";

const pasos = [
  {
    n: "01",
    icon: PhoneCall,
    titulo: "Entra la llamada",
    texto:
      "Estás en la obra y no puedes contestar. Curro coge el teléfono en el primer tono, en español y sin prisas.",
  },
  {
    n: "02",
    icon: ClipboardList,
    titulo: "Cualifica al cliente",
    texto:
      "Pregunta nombre, tipo de trabajo, zona y urgencia. Toma nota de todo como lo haría tu mejor recepcionista.",
  },
  {
    n: "03",
    icon: BellRing,
    titulo: "Te avisa al instante",
    texto:
      "Recibes el lead por WhatsApp y email en segundos, con el resumen y la transcripción de la llamada.",
  },
  {
    n: "04",
    icon: CalendarCheck,
    titulo: "Agenda la visita",
    texto:
      "El cliente recibe un WhatsApp con un enlace para reservar la visita de valoración. Sin llamadas de ida y vuelta.",
  },
];

export function Pasos() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-fresh-strong">
          Cómo funciona
        </p>
        <h2 className="mt-2 headline text-4xl sm:text-5xl">
          De la llamada perdida al presupuesto agendado.
        </h2>
        <p className="mt-5 text-lg text-ink/60">
          Cuatro pasos. Cero llamadas perdidas. Y tú, sin mover un dedo.
        </p>
      </div>

      <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {pasos.map(({ n, icon: Icon, titulo, texto }, i) => (
          <Reveal key={n} delay={i * 90} className="group">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-ink text-cream shadow-sm transition-transform group-hover:-translate-y-0.5">
              <Icon className="size-5" />
            </div>
            <div className="mt-5 flex items-center gap-2">
              <span className="font-display text-sm font-extrabold text-brand-strong">
                {n}
              </span>
              <h3 className="font-display text-xl font-bold">{titulo}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{texto}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
