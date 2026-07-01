import Link from "next/link";
import {
  PhoneCall,
  MessageCircle,
  CalendarCheck,
  ClipboardList,
  Clock,
  Languages,
  BellRing,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Check,
  ArrowRight,
  Flame,
} from "lucide-react";

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

const planes = [
  {
    nombre: "Básico",
    precio: "99",
    gancho: "Para empezar a no perder llamadas.",
    destacado: false,
    incluye: [
      "Recepcionista con IA 24/7",
      "Hasta 100 llamadas al mes",
      "Aviso por WhatsApp y email",
      "Panel de leads y transcripciones",
    ],
  },
  {
    nombre: "Pro",
    precio: "149",
    gancho: "El equilibrio perfecto para la mayoría.",
    destacado: true,
    incluye: [
      "Todo lo del plan Básico",
      "Hasta 300 llamadas al mes",
      "Agenda de visitas con Cal.com",
      "Guion personalizado a tu negocio",
      "Soporte prioritario",
    ],
  },
  {
    nombre: "Premium",
    precio: "199",
    gancho: "Para varios oficios y mucho volumen.",
    destacado: false,
    incluye: [
      "Todo lo del plan Pro",
      "Llamadas sin límite razonable",
      "Varios números / oficios",
      "Informes de uso mensuales",
    ],
  },
];

const faqs = [
  {
    q: "¿Suena natural o parece un robot?",
    a: "Curro conversa con naturalidad, en español y con un guion adaptado a tu negocio. No es un contestador ni un menú de opciones: entiende lo que necesita el cliente y le responde.",
  },
  {
    q: "¿Tengo que cambiar mi número de teléfono?",
    a: "No. Puedes desviar a Curro solo las llamadas que no cojas, o usar un número nuevo para tus anuncios. Tú eliges cómo encajarlo.",
  },
  {
    q: "¿Avisa de que es un asistente y de que se graba?",
    a: "Sí. Al inicio de cada llamada Curro se presenta como asistente virtual e informa de que la llamada se graba, para cumplir con la normativa.",
  },
  {
    q: "¿Cuánto tardo en ponerlo en marcha?",
    a: "Unos 10 minutos. Nos dices tu tipo de negocio y tus datos, creamos tu asistente con su guion y listo.",
  },
  {
    q: "¿Hay permanencia?",
    a: "Ninguna. Pruebas 14 días gratis y, si sigues, pagas mes a mes. Cancelas cuando quieras.",
  },
];

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-strong hover:-translate-y-0.5";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-transparent px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink/5";

export default function Home() {
  return (
    <div className="bg-cream text-ink">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-ink text-cream">
              <PhoneCall className="size-4" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Curro
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
            <a href="#como-funciona" className="hover:text-ink">
              Cómo funciona
            </a>
            <a href="#precios" className="hover:text-ink">
              Precios
            </a>
            <a href="#faq" className="hover:text-ink">
              Preguntas
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block"
            >
              Acceder
            </Link>
            <Link href="/login" className={btnPrimary}>
              Probar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="blueprint relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <span
              className="animate-rise inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/70"
              style={{ animationDelay: "0ms" }}
            >
              <span className="size-2 rounded-full bg-emerald-500" />
              Recepcionista con IA · 24/7 · en español
            </span>
            <h1
              className="animate-rise mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              Curro coge <span className="marker">el teléfono</span> cuando tú no
              puedes.
            </h1>
            <p
              className="animate-rise mt-6 max-w-xl text-lg text-ink/70"
              style={{ animationDelay: "160ms" }}
            >
              La recepcionista con inteligencia artificial para empresas de
              reformas y multiservicios del hogar. Atiende cada llamada,
              cualifica al cliente y te pasa el presupuesto por WhatsApp. Aunque
              estés subido a un andamio.
            </p>
            <div
              className="animate-rise mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link href="/login" className={btnPrimary}>
                Probar gratis 14 días
                <ArrowRight className="size-4" />
              </Link>
              <a href="#como-funciona" className={btnGhost}>
                Ver cómo funciona
              </a>
            </div>
            <p
              className="animate-rise mt-5 text-sm text-ink/50"
              style={{ animationDelay: "320ms" }}
            >
              Sin permanencia · Listo en 10 minutos · Cancelas cuando quieras
            </p>
          </div>

          {/* Maqueta: llamada + aviso de WhatsApp */}
          <div
            className="animate-rise relative mx-auto w-full max-w-sm"
            style={{ animationDelay: "400ms" }}
          >
            <div className="rotate-2 rounded-[2rem] border border-ink/10 bg-ink p-3 shadow-2xl">
              <div className="rounded-[1.6rem] bg-cream p-5">
                {/* Llamada entrante */}
                <div className="flex items-center justify-between text-xs text-ink/50">
                  <span>9:41</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                    En directo
                  </span>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Llamada entrante
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold">
                    +34 6·· ··· ···
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream">
                    <PhoneCall className="size-4 text-brand" />
                    Curro está atendiendo…
                  </div>
                </div>

                {/* Aviso de WhatsApp al dueño */}
                <div className="mt-6 rounded-2xl border border-emerald-600/20 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <MessageCircle className="size-4" />
                    WhatsApp · nuevo lead
                  </div>
                  <p className="mt-2 text-sm font-semibold">María López</p>
                  <p className="text-sm text-ink/70">
                    Reforma de baño completo · Chamberí
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-strong">
                    <Flame className="size-3" /> Urgente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Problema ---------- */}
      <section className="border-y border-ink/10 bg-kraft">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="font-display text-2xl font-bold sm:text-3xl">
            Cuando no coges el teléfono,{" "}
            <span className="marker">el cliente llama al siguiente.</span>
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-ink/70">
            En reformas, el que contesta primero se lleva el presupuesto. Y tú no
            puedes estar en la obra y al teléfono a la vez. Curro sí.
          </p>
        </div>
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Cómo funciona
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            De la llamada perdida al presupuesto agendado.
          </h2>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map(({ n, icon: Icon, titulo, texto }) => (
            <div key={n} className="group relative">
              <span className="font-display text-5xl font-extrabold text-ink/10 transition-colors group-hover:text-brand/30">
                {n}
              </span>
              <div className="mt-2 flex size-11 items-center justify-center rounded-xl bg-ink text-cream">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{titulo}</h3>
              <p className="mt-2 text-sm text-ink/70">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Características ---------- */}
      <section className="border-t border-ink/10 bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Todo lo que hace por ti
            </p>
            <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Tu mejor recepcionista, sin nómina ni bajas.
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="bg-ink p-8">
                <Icon className="size-6 text-brand" />
                <h3 className="mt-4 font-display text-lg font-bold">{titulo}</h3>
                <p className="mt-2 text-sm text-cream/60">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Precios ---------- */}
      <section id="precios" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Precios
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Un presupuesto captado ya lo paga.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            14 días de prueba gratis. Sin permanencia. Precios sin IVA.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={
                plan.destacado
                  ? "relative rounded-3xl border-2 border-brand bg-white p-8 shadow-xl lg:-mt-4 lg:mb-4"
                  : "rounded-3xl border border-ink/10 bg-white/60 p-8"
              }
            >
              {plan.destacado && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  El más elegido
                </span>
              )}
              <h3 className="font-display text-2xl font-extrabold">
                {plan.nombre}
              </h3>
              <p className="mt-1 text-sm text-ink/60">{plan.gancho}</p>
              <p className="mt-6">
                <span className="font-display text-5xl font-extrabold">
                  {plan.precio}€
                </span>
                <span className="text-ink/60"> /mes</span>
              </p>
              <Link
                href="/login"
                className={`mt-6 w-full ${plan.destacado ? btnPrimary : btnGhost}`}
              >
                Probar gratis
              </Link>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.incluye.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span className="text-ink/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="border-t border-ink/10 bg-kraft">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-12 divide-y divide-ink/10">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 text-brand transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-ink/70">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Que no se te escape{" "}
            <span className="text-brand">ni un presupuesto más.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/70">
            Pon a Curro a coger el teléfono hoy mismo. En 10 minutos lo tienes
            atendiendo llamadas por ti.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-strong hover:-translate-y-0.5"
            >
              Probar gratis 14 días
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-ink text-cream">
              <PhoneCall className="size-3.5" />
            </span>
            <span className="font-display font-extrabold">Curro</span>
            <span className="text-sm text-ink/50">
              · Recepcionista con IA para reformas
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-ink/60">
            <a href="#precios" className="hover:text-ink">
              Precios
            </a>
            <a href="#faq" className="hover:text-ink">
              Preguntas
            </a>
            <Link href="/login" className="hover:text-ink">
              Acceder
            </Link>
          </div>
          <p className="text-sm text-ink/40">© 2026 Curro</p>
        </div>
      </footer>
    </div>
  );
}
