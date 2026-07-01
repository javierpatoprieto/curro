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
    <section className="section-dark border-t border-cream/10">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-casco">
            Todo lo que hace por ti
          </p>
          <h2 className="mt-2 headline text-4xl text-cream sm:text-5xl">
            Tu mejor recepcionista, sin nómina ni bajas.
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="bg-ink p-8">
              <Icon className="size-6 text-fresh" />
              <h3 className="mt-4 font-display text-lg font-bold text-cream">
                {titulo}
              </h3>
              <p className="mt-2 text-sm text-cream/60">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
