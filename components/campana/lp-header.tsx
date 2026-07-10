import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { btnBosqueSm } from "@/components/marketing/ui";

/**
 * Cabecera minimalista para las landing de campaña (tráfico pagado): solo la
 * marca y UN único CTA. Sin menú de navegación a propósito — cada enlace extra
 * es una fuga de conversión.
 */
export function LpHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-linea3 bg-nieve/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Logo />
        <Link href="/registro" className={btnBosqueSm}>
          Probar gratis
        </Link>
      </div>
    </header>
  );
}
