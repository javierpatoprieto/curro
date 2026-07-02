import { faqs } from "@/components/marketing/faq";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://curro-kappa.vercel.app";

const DESCRIPCION =
  "Recepcionista con IA para empresas de reformas y multiservicios del hogar. Curro atiende cada llamada, cualifica al cliente y te avisa por WhatsApp. 24/7 y en español.";

/**
 * Datos estructurados (JSON-LD) para la landing: organización, producto/servicio
 * con rango de precios y FAQPage (candidata a resultados enriquecidos en Google).
 */
export function JsonLd() {
  const grafo = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Curro",
      url: SITE_URL,
      description: DESCRIPCION,
      image: `${SITE_URL}/opengraph-image`,
      areaServed: "ES",
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Curro",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description: DESCRIPCION,
      inLanguage: "es-ES",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "99",
        highPrice: "199",
        offerCount: 3,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapa el contenido; seguro para inyectar.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
    />
  );
}
