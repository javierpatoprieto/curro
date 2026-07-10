import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, PhoneCall, MessageSquareText, Sparkles } from "lucide-react";
import { LpHeader } from "@/components/campana/lp-header";
import { LpHero } from "@/components/campana/lp-hero";
import { LpFooter } from "@/components/campana/lp-footer";
import { GremioDolores } from "@/components/marketing/gremio";
import { Pasos } from "@/components/marketing/pasos";
import { PorQue } from "@/components/marketing/por-que";
import { Precios } from "@/components/marketing/precios";
import { Faq } from "@/components/marketing/faq";
import { CtaFinal } from "@/components/marketing/cta-final";
import { CurroChat } from "@/components/chat/curro-chat";
import { GREMIO_SLUGS, getGremio } from "@/lib/gremios";

// Landing de campaña: solo para los gremios conocidos; cualquier otro slug → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return GREMIO_SLUGS.map((gremio) => ({ gremio }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gremio: string }>;
}): Promise<Metadata> {
  const { gremio: slug } = await params;
  const g = getGremio(slug);
  if (!g) return {};
  return {
    title: { absolute: `Curro para ${g.nombre}: no pierdas ni una llamada` },
    description: g.metaDescription,
    // Tráfico pagado: NO indexar (evita competir/duplicar con las páginas SEO
    // de /para y mantiene la campaña separada de la búsqueda orgánica).
    robots: { index: false, follow: true },
  };
}

/** Franja de confianza: pruebas rápidas en lugar de testimonios inventados. */
function LpConfianza() {
  const items = [
    { icon: Clock, t: "Contesta 24/7" },
    { icon: PhoneCall, t: "Al primer tono" },
    { icon: MessageSquareText, t: "Aviso al WhatsApp" },
    { icon: Sparkles, t: "Español natural" },
  ];
  return (
    <section className="border-y border-linea3 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 text-sm font-medium text-bosque-soft">
        {items.map(({ icon: Icon, t }) => (
          <span key={t} className="inline-flex items-center gap-2">
            <Icon className="size-4 text-lima-ink" strokeWidth={2.25} />
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

export default async function LpPage({
  params,
}: {
  params: Promise<{ gremio: string }>;
}) {
  const { gremio: slug } = await params;
  const g = getGremio(slug);
  if (!g) notFound();

  return (
    <div className="bg-nieve text-bosque">
      <LpHeader />
      <LpHero gremio={g} />
      <LpConfianza />
      <GremioDolores gremio={g} />
      <Pasos />
      <PorQue />
      <Precios />
      <Faq />
      <CtaFinal />
      <LpFooter />
      <CurroChat />
    </div>
  );
}
