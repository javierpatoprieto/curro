import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/marketing/nav";
import { GremioHero, GremioDolores } from "@/components/marketing/gremio";
import { Pasos } from "@/components/marketing/pasos";
import { PorQue } from "@/components/marketing/por-que";
import { Precios } from "@/components/marketing/precios";
import { Faq } from "@/components/marketing/faq";
import { CtaFinal } from "@/components/marketing/cta-final";
import { Footer } from "@/components/marketing/footer";
import { CurroChat } from "@/components/chat/curro-chat";
import { GREMIO_SLUGS, getGremio } from "@/lib/gremios";
import { PROVINCIA_SLUGS, getProvincia } from "@/lib/provincias";

// Matriz gremio × provincia. Solo se generan estas combinaciones; otras → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return GREMIO_SLUGS.flatMap((gremio) =>
    PROVINCIA_SLUGS.map((provincia) => ({ gremio, provincia })),
  );
}

type Params = Promise<{ gremio: string; provincia: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { gremio: gs, provincia: ps } = await params;
  const g = getGremio(gs);
  const p = getProvincia(ps);
  if (!g || !p) return {};
  const title = `Recepcionista con IA para ${g.nombre} en ${p.nombre} · Curro`;
  const description = `El recepcionista con IA para ${g.nombre} en ${p.nombre}. Coge cada llamada, cualifica y te la pasa por WhatsApp. Prueba gratis 7 días.`;
  const path = `/para/${g.slug}/${p.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: path,
      siteName: "Curro",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GremioProvinciaPage({ params }: { params: Params }) {
  const { gremio: gs, provincia: ps } = await params;
  const g = getGremio(gs);
  const p = getProvincia(ps);
  if (!g || !p) notFound();

  return (
    <div className="bg-white text-ink">
      <Nav />
      <GremioHero gremio={g} provincia={p} />
      <GremioDolores gremio={g} provincia={p} />
      <Pasos />
      <PorQue />
      <Precios />
      <Faq />
      <CtaFinal />
      <Footer />
      <CurroChat />
    </div>
  );
}
