import { Nav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Drama } from "@/components/marketing/drama";
import { Pasos } from "@/components/marketing/pasos";
import { EscenaObra } from "@/components/marketing/escena-obra";
import { PorQue } from "@/components/marketing/por-que";
import { Prueba } from "@/components/marketing/prueba";
import { Precios } from "@/components/marketing/precios";
import { Faq } from "@/components/marketing/faq";
import { CtaFinal } from "@/components/marketing/cta-final";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="bg-cream text-ink">
      <Nav />
      <Hero />
      <Drama />
      <Pasos />
      <EscenaObra />
      <PorQue />
      <Prueba />
      <Precios />
      <Faq />
      <CtaFinal />
      <Footer />
    </div>
  );
}
