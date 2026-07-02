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
    <section id="precios" className="bg-hueso">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mono inline-block border-[3px] border-black bg-casco px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black">
            ◍ Precios
          </span>
          <h2 className="headline mt-5 text-4xl text-black sm:text-5xl lg:text-6xl">
            Un presupuesto captado ya lo paga.
          </h2>
          <p className="mt-5 text-lg font-medium text-black/70">
            7 días de prueba gratis. Sin permanencia. Precios sin IVA.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={`nb-card rounded-none p-8 ${
                plan.destacado ? "lg:-mt-4" : ""
              }`}
              style={
                plan.destacado
                  ? { boxShadow: "8px 8px 0 var(--color-coral)" }
                  : undefined
              }
            >
              {plan.destacado && (
                <span className="mono mb-5 inline-block border-[3px] border-black bg-coral px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black">
                  El más elegido
                </span>
              )}
              <h3 className="headline text-2xl text-black">{plan.nombre}</h3>
              <p className="mt-2 text-sm font-medium text-black/70">
                {plan.gancho}
              </p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="headline text-5xl text-black sm:text-6xl">
                  {plan.precio}€
                </span>
                <span className="mono text-sm font-bold text-black/60">
                  /mes
                </span>
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
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 border-black bg-casco">
                      <Check className="size-3.5 text-black" strokeWidth={3} />
                    </span>
                    <span className="font-medium text-black/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
