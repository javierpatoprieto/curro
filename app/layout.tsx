import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-brico",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Curro — La recepcionista con IA para reformas",
  description:
    "Curro coge el teléfono cuando tú no puedes. Recepcionista con inteligencia artificial para empresas de reformas y multiservicios del hogar: atiende cada llamada, cualifica al cliente y te pasa el presupuesto por WhatsApp. 24/7 y en español.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
