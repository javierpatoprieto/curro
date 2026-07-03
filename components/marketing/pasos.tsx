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
    <section id="como-funciona" className="bg-nieve">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-linea3 bg-white px-3 py-1.5 text-xs font-semibold text-bosque">
            <span className="size-1.5 rounded-full bg-lima" />
            Cómo funciona
          </span>
          <h2 className="titular mt-5 text-4xl text-bosque sm:text-5xl lg:text-6xl">
            De la llamada al{" "}
            <span className="marca-lima">cliente agendado</span>.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-bosque-soft">
            Cuatro pasos. Cero llamadas perdidas. Y tú, a lo tuyo.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map(({ n, icon: Icon, titulo, texto }, i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="flex h-full flex-col rounded-2xl border border-linea3 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full bg-bosque text-lima">
                    <Icon className="size-5" strokeWidth={2.25} />
                  </span>
                  <span className="font-display text-2xl font-semibold text-bosque-soft/35">
                    {n}
                  </span>
                </div>
                <h3 className="titular mt-6 text-xl text-bosque">{titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-bosque-soft">
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
