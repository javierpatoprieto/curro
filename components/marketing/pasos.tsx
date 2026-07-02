import { PhoneCall, ClipboardList, MessageCircle, CalendarCheck } from "lucide-react";
import { Reveal } from "./reveal";

const pasos = [
  {
    n: "01",
    icon: PhoneCall,
    titulo: "Contesta la llamada",
    texto:
      "Estés donde estés, Curro coge el teléfono en el primer tono, en español y sin prisas.",
  },
  {
    n: "02",
    icon: ClipboardList,
    titulo: "Apunta los datos",
    texto:
      "Pregunta nombre, tipo de trabajo, zona y urgencia. Toma nota de todo como tu mejor recepcionista.",
  },
  {
    n: "03",
    icon: MessageCircle,
    titulo: "Te avisa por WhatsApp",
    texto:
      "Recibes el cliente por WhatsApp en segundos, con el resumen y la transcripción de la llamada.",
  },
  {
    n: "04",
    icon: CalendarCheck,
    titulo: "Agenda la visita",
    texto:
      "El cliente recibe un enlace para reservar la visita. Sin llamadas de ida y vuelta.",
  },
];

export function Pasos() {
  return (
    <section id="como-funciona" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-verde-soft px-3 py-1.5 text-xs font-semibold text-ink">
            <span className="live-dot" />
            Cómo funciona
          </span>
          <h2 className="headline mt-5 text-4xl text-ink sm:text-5xl lg:text-6xl">
            De la llamada al{" "}
            <span className="grad">cliente agendado</span>.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Cuatro pasos. Cero llamadas perdidas. Y tú, a lo tuyo.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map(({ n, icon: Icon, titulo, texto }, i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="card-fresh flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full bg-verde-soft text-verde-dark">
                    <Icon className="size-5" strokeWidth={2.25} />
                  </span>
                  <span className="font-display text-sm font-bold text-ink-soft/40">
                    {n}
                  </span>
                </div>
                <h3 className="headline mt-6 text-xl text-ink">{titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {texto}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
