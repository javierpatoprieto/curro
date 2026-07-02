import Image from "next/image";
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
    <section id="como-funciona" className="bg-hueso">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="mono inline-block border-[3px] border-black bg-casco px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black">
              ◍ Cómo funciona
            </span>
            <h2 className="headline mt-5 text-4xl text-black sm:text-5xl lg:text-6xl">
              De la llamada perdida al{" "}
              <span className="hl-azul">presupuesto agendado</span>.
            </h2>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-black/80">
              Cuatro pasos. Cero llamadas perdidas. Y tú, sin mover un dedo.
            </p>
          </div>

          {/* Pegatina Currito señalando */}
          <div className="hidden shrink-0 border-[3px] border-black bg-white nb-shadow sm:block">
            <Image
              src="/currito/senala.webp"
              alt="Currito señalando los pasos"
              width={120}
              height={120}
              className="size-[120px] object-contain"
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map(({ n, icon: Icon, titulo, texto }, i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="nb-card flex h-full flex-col rounded-none p-5">
                <div className="flex items-center gap-3">
                  <span className="headline flex size-14 shrink-0 items-center justify-center border-[3px] border-black bg-casco text-2xl text-black">
                    {n}
                  </span>
                  <Icon className="size-7 text-azul" strokeWidth={2.5} />
                </div>
                <h3 className="headline mt-5 text-xl text-black">{titulo}</h3>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-black/70">
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
