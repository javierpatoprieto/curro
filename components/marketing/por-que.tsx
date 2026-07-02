import {
  Clock,
  Languages,
  MessageCircle,
  FileText,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

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
    texto: "El lead te llega donde ya miras cada día. Al momento.",
  },
  {
    icon: FileText,
    titulo: "Transcripción y datos",
    texto: "Cada llamada, escrita y con los datos ordenados y buscables.",
  },
  {
    icon: LayoutDashboard,
    titulo: "Panel de leads",
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
    <section className="border-y-[3px] border-black bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="mono inline-block border-[3px] border-black bg-casco px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black">
            ◍ Todo lo que hace por ti
          </span>
          <h2 className="headline mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
            Tu mejor recepcionista, sin nómina ni bajas.
          </h2>
          <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-white/70">
            Mientras tú picas pared, Curro atiende, cualifica y te manda el lead.
            Ninguna llamada se queda sin coger.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titulo, texto }) => (
            <div
              key={titulo}
              className="border-[3px] border-black bg-white p-6 text-black"
              style={{ boxShadow: "6px 6px 0 var(--color-casco)" }}
            >
              <span className="flex size-11 items-center justify-center border-[3px] border-black bg-casco">
                <Icon className="size-5 text-black" strokeWidth={2.5} />
              </span>
              <h3 className="headline mt-5 text-lg text-black">{titulo}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-black/70">
                {texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
