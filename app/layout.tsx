import type { Metadata } from "next";
import { Archivo, Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/analytics/cookie-consent";

// Dirección "Cartel" (neo-brutal): display bestia + mono técnica + grotesca.
const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://curro-kappa.vercel.app";

const TITULO = "Curro — Recepcionista con IA para reformas";
const DESCRIPCION =
  "Recepcionista con IA para empresas de reformas y multiservicios del hogar. Curro atiende cada llamada, cualifica al cliente y te avisa por WhatsApp. 24/7 y en español.";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="min-h-screen antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
