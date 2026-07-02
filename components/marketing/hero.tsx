import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { btnPrimaryLg, btnGhost } from "./ui";

const DATOS = [
  { k: "Cliente", v: "María López", urg: false },
  { k: "Trabajo", v: "Reforma baño", urg: false },
  { k: "Zona", v: "Chamberí", urg: false },
  { k: "Urgencia", v: "ALTA", urg: true },
];

function CallCard() {
  return (
    <div className="nb-card mx-auto w-full max-w-sm rounded-none">
      <div className="mono flex items-center gap-2 border-b-[3px] border-black px-4 py-2.5 text-[12px] font-bold uppercase">
        <span className="size-2.5 rounded-full border-2 border-black bg-emerald-500" />
        Llamada en directo · 9:41
      </div>
      {DATOS.map(({ k, v, urg }) => (
        <div
          key={k}
          className="flex items-center gap-3 border-b-[3px] border-black px-4 py-3 text-[13px] font-semibold last:border-b-0"
        >
          <span
            className={`flex size-6 shrink-0 items-center justify-center border-2 border-black ${
              urg ? "bg-coral" : "bg-casco"
            }`}
          >
            {urg ? "!" : <Check className="size-3.5" strokeWidth={3} />}
          </span>
          <span className="text-black/70">{k}:</span>
          <span className="mono ml-auto bg-black px-2 py-0.5 text-[11px] font-bold text-white">
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-hueso">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <span className="mono inline-block border-[3px] border-black bg-casco px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide">
            ◍ Recepcionista IA · 24/7 · Español
          </span>
          <h1 className="headline mt-5 text-5xl text-black sm:text-6xl lg:text-7xl">
            Tú en la obra. Curro <span className="hl-azul">al</span>{" "}
            <span className="hl-coral">teléfono</span>.
          </h1>
          <p className="mt-6 max-w-md text-lg font-medium leading-relaxed text-black/80">
            Coge cada llamada, cualifica al cliente y te pasa el presupuesto por
            WhatsApp. Aunque estés subido a un andamio.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/registro" className={btnPrimaryLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" strokeWidth={3} />
            </Link>
            <a href="#como-funciona" className={btnGhost}>
              Ver cómo funciona
            </a>
          </div>
          <p className="mono mt-6 text-[11px] font-bold uppercase tracking-wide text-black/60">
            Sin permanencia · Listo en 10 min · Cancelas cuando quieras
          </p>
        </div>
        <div className="lg:justify-self-end">
          <CallCard />
        </div>
      </div>
    </section>
  );
}
