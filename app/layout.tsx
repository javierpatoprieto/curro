import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AtiendeReformas — Tu recepcionista con IA 24/7",
  description:
    "Recepcionista con inteligencia artificial para empresas de reformas y multiservicios del hogar. Atendemos cada llamada, cualificamos al cliente y te pasamos el lead al instante.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
