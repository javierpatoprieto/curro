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
    <section className="bg-bosque text-nieve">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-nieve/15 bg-nieve/[0.04] px-3 py-1.5 text-xs font-semibold text-nieve/80">
            <span className="size-1.5 rounded-full bg-lima" />
            Todo lo que hace por ti
          </span>
          <h2 className="titular mt-6 text-4xl text-nieve sm:text-5xl lg:text-6xl">
            Tu mejor recepcionista, <span className="marca-lima text-lima">sin nómina</span> ni
            bajas.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-nieve/70">
            Mientras tú estás a lo tuyo, Curro atiende, cualifica y te manda al
            cliente. Ninguna llamada se queda sin coger.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-nieve/12 bg-nieve/12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titulo, texto }, i) => (
            <Reveal
              key={titulo}
              delay={i * 70}
              className="bg-bosque p-7 transition-colors duration-300 hover:bg-nieve/[0.03]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-lima text-bosque">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <h3 className="titular mt-5 text-lg text-nieve">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-nieve/70">
                {texto}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
