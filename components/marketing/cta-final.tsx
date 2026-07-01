import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { btnPrimaryLg } from "./ui";

export function CtaFinal() {
  return (
    <section className="section-dark relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-1/2 size-[26rem] -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 py-20 sm:grid-cols-[1fr_auto]">
        <div>
          <h2 className="headline text-4xl text-cream sm:text-5xl lg:text-6xl">
            Pon a Currito a coger{" "}
            <span className="text-brand">el teléfono.</span>
          </h2>
          <p className="mt-5 max-w-xl text-cream/70">
            En 10 minutos lo tienes atendiendo llamadas por ti. Que no se te
            escape ni un presupuesto más.
          </p>
          <div className="mt-8">
            <Link href="/login" className={btnPrimaryLg}>
              Probar gratis 14 días
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-cream/50">
            Sin permanencia · Cancelas cuando quieras
          </p>
        </div>
        <Image
          src="/currito/pulgar.webp"
          alt="Currito celebrando con el pulgar hacia arriba"
          width={890}
          height={1300}
          className="mx-auto w-40 shrink-0 object-contain drop-shadow-2xl sm:w-52 lg:w-64"
        />
      </div>
    </section>
  );
}
