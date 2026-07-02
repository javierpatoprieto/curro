import {
  Clock,
  Languages,
  MessageCircle,
  FileText,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

const stats = [
  { valor: "24/7", label: "Atiende siempre, también noches y findes" },
  { valor: "1er", label: "Coge la llamada al primer tono" },
  { valor: "100%", label: "Conversa en español natural" },
  { valor: "0", label: "Llamadas perdidas, cero presupuestos escapados" },
];

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
    <section className="section-dark blueprint-dark relative isolate overflow-hidden border-t border-cream/10">
      <div className="pointer-events-none absolute -right-24 top-10 size-[26rem] rounded-full bg-fresh/12 blur-[130px]" />
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-fresh">
            Todo lo que hace por ti
          </p>
          <h2 className="mt-2 headline text-4xl text-cream sm:text-5xl">
            Tu mejor recepcionista, sin nómina ni bajas.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/60">
            Mientras tú picas pared, Curro atiende, cualifica y te manda el lead.
            Ninguna llamada se queda sin coger.
          </p>
        </div>

        {/* Datos de impacto */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink p-6">
              <p className="headline text-4xl text-cream sm:text-5xl">{s.valor}</p>
              <p className="mt-2 text-sm text-cream/55">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Capacidades */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="bg-ink p-8">
              <Icon className="size-6 text-fresh" />
              <h3 className="mt-4 font-display text-lg font-bold text-cream">
                {titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/60">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
