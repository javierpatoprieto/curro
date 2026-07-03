import Link from "next/link";
import { Check } from "lucide-react";
import { btnLima, btnBosque, btnBosqueLinea } from "./ui";
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
    <section id="precios" className="bg-nieve">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-linea3 bg-white px-3 py-1.5 text-xs font-semibold text-bosque">
            <span className="size-1.5 rounded-full bg-lima" />
            Precios
          </span>
          <h2 className="titular mt-6 text-4xl text-bosque sm:text-5xl lg:text-6xl">
            Un presupuesto captado <span className="marca-lima">ya lo paga</span>.
          </h2>
          <p className="mt-5 text-lg text-bosque-soft">
            7 días de prueba gratis. Sin permanencia. Precios sin IVA.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
          {planes.map((plan, i) => (
            <Reveal
              key={plan.nombre}
              delay={i * 90}
              className={`flex flex-col rounded-2xl border p-8 ${
                plan.destacado
                  ? "border-bosque bg-bosque text-nieve lg:-mt-4"
                  : "border-linea3 bg-white"
              }`}
            >
              {plan.destacado && (
                <span className="mb-5 inline-flex items-center gap-2 self-start rounded-full bg-lima px-3 py-1.5 text-xs font-semibold text-bosque">
                  <span className="size-1.5 rounded-full bg-bosque" />
                  El más elegido
                </span>
              )}
              <h3
                className={`titular text-2xl ${
                  plan.destacado ? "text-nieve" : "text-bosque"
                }`}
              >
                {plan.nombre}
              </h3>
              <p
                className={`mt-2 text-sm ${
                  plan.destacado ? "text-nieve/70" : "text-bosque-soft"
                }`}
              >
                {plan.gancho}
              </p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span
                  className={`titular text-5xl sm:text-6xl ${
                    plan.destacado ? "text-nieve" : "text-bosque"
                  }`}
                >
                  {plan.precio}€
                </span>
                <span
                  className={`text-sm font-medium ${
                    plan.destacado ? "text-nieve/60" : "text-bosque-soft"
                  }`}
                >
                  /mes
                </span>
              </p>
              <Link
                href="/registro"
                className={`mt-6 w-full ${
                  plan.destacado ? btnLima : i === 0 ? btnBosque : btnBosqueLinea
                }`}
              >
                Probar gratis
              </Link>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.incluye.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                        plan.destacado
                          ? "bg-lima text-bosque"
                          : "bg-bosque text-lima"
                      }`}
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span
                      className={plan.destacado ? "text-nieve/80" : "text-bosque-soft"}
                    >
                      {item}
                    </span>
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
