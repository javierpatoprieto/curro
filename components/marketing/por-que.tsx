import {
  Clock,
  Languages,
  MessageCircle,
  FileText,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "./reveal";

const features = [
  {
    icon: Clock,
    titulo: "24/7, también noches y findes",
    texto: "No hay horario que se le escape. Ni festivos, ni vacaciones.",
  },
  {
    icon: Languages,
    titulo: "Habla español natural",
    texto: "Conversa con naturalidad. Nada de menús ni «pulse 1».",
  },
  {
    icon: MessageCircle,
    titulo: "Aviso por WhatsApp y email",
    texto: "El cliente te llega donde ya miras cada día. Al momento.",
  },
  {
    icon: FileText,
    titulo: "Transcripción y datos",
    texto: "Cada llamada, escrita y con los datos ordenados y buscables.",
  },
  {
    icon: LayoutDashboard,
    titulo: "Panel de clientes",
    texto: "Gestiona el estado de cada presupuesto desde un solo sitio.",
  },
  {
    icon: ShieldCheck,
    titulo: "Aviso legal incluido",
    texto: "Informa de que es un asistente virtual y de que se graba.",
  },
];

export function PorQue() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-0 size-[32rem] rounded-full bg-verde/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-violeta/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
            <span className="live-dot" />
            Todo lo que hace por ti
          </span>
          <h2 className="headline mt-6 text-4xl text-white sm:text-5xl lg:text-6xl">
            Tu mejor recepcionista, <span className="grad">sin nómina</span> ni
            bajas.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
            Mientras tú estás a lo tuyo, Curro atiende, cualifica y te manda al
            cliente. Ninguna llamada se queda sin coger.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titulo, texto }, i) => (
            <Reveal
              key={titulo}
              delay={i * 70}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-verde/30 hover:bg-white/[0.07]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-verde/12 text-verde transition-colors group-hover:bg-verde/20">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <h3 className="headline mt-5 text-lg text-white">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {texto}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
