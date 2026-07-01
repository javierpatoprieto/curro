import Image from "next/image";
import Link from "next/link";

/**
 * Logotipo de Curro: avatar de Currito (cabeza) + wordmark "curro".
 * `soloTexto` omite el avatar para espacios muy reducidos.
 * `dark` usa el color crema para el wordmark (sobre secciones oscuras).
 */
export function Logo({
  soloTexto = false,
  dark = false,
  className = "",
}: {
  soloTexto?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Curro — inicio"
      className={`flex items-center gap-2.5 ${className}`}
    >
      {!soloTexto && (
        <Image
          src="/currito/cabeza.webp"
          alt="Currito, la mascota de Curro"
          width={40}
          height={40}
          className="size-9 shrink-0 object-contain"
          priority
        />
      )}
      <span
        className={`font-display text-2xl font-extrabold lowercase tracking-tight ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        curro
      </span>
    </Link>
  );
}
