import type { Metadata } from "next";

// El backend de control es privado: nunca debe indexarse.
export const metadata: Metadata = {
  title: "Superadmin — Curro",
  robots: { index: false, follow: false },
};

// Layout mínimo: el gate por contraseña y la cabecera viven en la página del
// dashboard (app/admin/page.tsx), para no envolver también a /admin/login.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
