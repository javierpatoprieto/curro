import Image from "next/image";
import Link from "next/link";

/**
 * Logotipo de Curro: avatar de Currito (el asistente) + wordmark "curro".
 * `dark` para secciones oscuras.
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
      className={`flex items-center gap-2 ${className}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-verde-soft ring-1 ring-ink/5">
        <Image
          src="/currito/cabeza.webp"
          alt="Currito, el asistente de Curro"
          width={40}
          height={40}
          className="size-8 object-contain"
          priority
        />
      </span>
      <span
        className={`font-display text-[1.5rem] font-bold lowercase tracking-tight ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        curro
      </span>
    </Link>
  );
}
