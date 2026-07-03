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

// Solo se generan las páginas de los gremios conocidos; cualquier otro slug → 404.
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
  const path = `/para/${g.slug}`;
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: path,
      siteName: "Curro",
      title: g.metaTitle,
      description: g.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: g.metaTitle,
      description: g.metaDescription,
    },
  };
}

export default async function GremioPage({
  params,
}: {
  params: Promise<{ gremio: string }>;
}) {
  const { gremio: slug } = await params;
  const g = getGremio(slug);
  if (!g) notFound();

  return (
    <div className="bg-white text-ink">
      <Nav />
      <GremioHero gremio={g} />
      <GremioDolores gremio={g} />
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
