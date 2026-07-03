import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/analytics/cookie-consent";

// Dirección "Fresh": display plano y neutro (Manrope) + cuerpo Inter.
const display = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://curro-kappa.vercel.app";

const TITULO = "Curro — Recepcionista con IA para autónomos y gremios";
const DESCRIPCION =
  "El recepcionista con IA para autónomos y pequeños gremios: fontaneros, electricistas, reformas, pintores y más. Curro contesta cada llamada, apunta al cliente y te lo pasa por WhatsApp. 24/7 y en español.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITULO,
    template: "%s · Curro",
  },
  description: DESCRIPCION,
  applicationName: "Curro",
  authors: [{ name: "Curro" }],
  creator: "Curro",
  publisher: "Curro",
  category: "technology",
  keywords: [
    "recepcionista IA",
    "recepcionista virtual reformas",
    "contestador inteligente",
    "atención de llamadas reformas",
    "IA para autónomos",
    "recepcionista con inteligencia artificial",
    "captación de leads reformas",
    "asistente de voz en español",
    "no perder llamadas",
    "recepcionista 24/7",
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Curro",
    title: TITULO,
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Verificación de Google Search Console por meta-tag (método "Etiqueta HTML").
  // Opcional: si defines GOOGLE_SITE_VERIFICATION en Vercel, se renderiza el
  // <meta name="google-site-verification">. Si verificas por el método "Google
  // Analytics" (GA4 ya está activo), no hace falta.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${display.variable}`}
    >
      <body className="min-h-screen antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
