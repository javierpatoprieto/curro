import Link from "next/link";
import { Check } from "lucide-react";
import { btnPrimary, btnGhost } from "./ui";

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

export function Precios() {
  return (
    <section id="precios" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-fresh-strong">
          Precios
        </p>
        <h2 className="mt-2 headline text-4xl sm:text-5xl">
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
                  <Check className="mt-0.5 size-4 shrink-0 text-fresh-strong" />
                  <span className="text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
