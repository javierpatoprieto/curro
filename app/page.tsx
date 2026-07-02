import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Drama } from "@/components/marketing/drama";
import { Pasos } from "@/components/marketing/pasos";
import { PorQue } from "@/components/marketing/por-que";
import { Precios } from "@/components/marketing/precios";
import { Faq } from "@/components/marketing/faq";
import { CtaFinal } from "@/components/marketing/cta-final";
import { Footer } from "@/components/marketing/footer";
import { JsonLd } from "@/components/seo/json-ld";

export default function Home() {
  return (
    <div className="bg-cream text-ink">
      <JsonLd />
      <Nav />
      <Hero />
      <Drama />
      <Pasos />
      <PorQue />
      <Precios />
      <Faq />
      <CtaFinal />
      <Footer />
    </div>
  );
}
