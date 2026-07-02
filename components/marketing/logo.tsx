import Image from "next/image";
import Link from "next/link";

/**
 * Logotipo de Curro (dirección Cartel): avatar de Currito en círculo bordeado +
 * wordmark "curro" en display. `dark` para secciones oscuras (azul/negro).
 */
export function Logo({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Curro — inicio"
      className={`flex items-center gap-2.5 ${className}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-black bg-casco nb-shadow-sm">
        <Image
          src="/currito/cabeza.webp"
          alt="Currito, la mascota de Curro"
          width={44}
          height={44}
          className="size-8 object-contain"
          priority
        />
      </span>
      <span
        className={`font-display text-[1.65rem] lowercase leading-none tracking-tight ${
          dark ? "text-white" : "text-black"
        }`}
      >
        curro
      </span>
    </Link>
  );
}
