import Link from "next/link";
import { Check } from "lucide-react";
import { btnPrimary, btnGhost } from "./ui";
import { Reveal } from "./reveal";

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
      "Panel de clientes y transcripciones",
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

export function Precios() {
  return (
    <section id="precios" className="relative overflow-hidden bg-mist">
      <div className="pointer-events-none absolute -right-24 top-24 size-[30rem] rounded-full bg-verde/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 size-[26rem] rounded-full bg-violeta/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-verde-soft px-3 py-1.5 text-xs font-semibold text-ink">
            <span className="live-dot" />
            Precios
          </span>
          <h2 className="headline mt-6 text-4xl text-ink sm:text-5xl lg:text-6xl">
            Un presupuesto captado <span className="grad">ya lo paga</span>.
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            7 días de prueba gratis. Sin permanencia. Precios sin IVA.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
          {planes.map((plan, i) => (
            <Reveal
              key={plan.nombre}
              delay={i * 90}
              className={`card-fresh flex flex-col p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.destacado ? "ring-2 ring-verde lg:-mt-4" : ""
              }`}
            >
              {plan.destacado && (
                <span className="mb-5 inline-flex items-center gap-2 self-start rounded-full bg-verde px-3 py-1.5 text-xs font-semibold text-ink">
                  <span className="live-dot" />
                  El más elegido
                </span>
              )}
              <h3 className="headline text-2xl text-ink">{plan.nombre}</h3>
              <p className="mt-2 text-sm text-ink-soft">{plan.gancho}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="headline text-5xl text-ink sm:text-6xl">
                  {plan.precio}€
                </span>
                <span className="text-sm font-medium text-ink-soft">/mes</span>
              </p>
              <Link
                href="/registro"
                className={`mt-6 w-full ${plan.destacado ? btnPrimary : btnGhost}`}
              >
                Probar gratis
              </Link>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.incluye.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-verde-soft text-verde-dark">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
