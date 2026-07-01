import Image from "next/image";
import { PhoneCall, ClipboardList, BellRing, CalendarCheck } from "lucide-react";
import { Reveal } from "./reveal";

const pasos = [
  {
    n: "01",
    icon: PhoneCall,
    titulo: "Entra la llamada",
    texto:
      "Estás en la obra y no puedes contestar. Currito coge el teléfono en el primer tono, en español y sin prisas.",
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
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-fresh-strong">
            Cómo funciona
          </p>
          <h2 className="mt-2 headline text-4xl sm:text-5xl">
            De la llamada perdida al presupuesto agendado.
          </h2>
        </div>
        <Image
          src="/currito/senala.png"
          alt="Currito señalando los pasos"
          width={480}
          height={480}
          className="hidden w-28 shrink-0 object-contain drop-shadow-lg sm:block lg:w-36"
        />
      </div>
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {pasos.map(({ n, icon: Icon, titulo, texto }, i) => (
          <Reveal key={n} delay={i * 90} className="group relative">
            <span className="font-display text-5xl font-extrabold text-ink/10 transition-colors group-hover:text-casco">
              {n}
            </span>
            <div className="mt-2 flex size-11 items-center justify-center rounded-xl bg-ink text-cream">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{titulo}</h3>
            <p className="mt-2 text-sm text-ink/70">{texto}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
