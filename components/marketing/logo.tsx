import Image from "next/image";
import Link from "next/link";

/**
 * Logotipo de Curro: avatar de Currito (cabeza) + wordmark "curro".
 * `soloTexto` omite el avatar para espacios muy reducidos.
 * `dark` usa el color crema para el wordmark (sobre secciones oscuras).
 * `size="lg"` para la barra de navegación (más presencia).
 */
export function Logo({
  soloTexto = false,
  dark = false,
  size = "md",
  className = "",
}: {
  soloTexto?: boolean;
  dark?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const lg = size === "lg";
  return (
    <Link
      href="/"
      aria-label="Curro — inicio"
      className={`flex items-center gap-2.5 ${className}`}
    >
      {!soloTexto && (
        <span
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 transition-colors ${
            lg ? "size-10" : "size-8"
          } ${dark ? "bg-cream/10 ring-cream/20" : "bg-ink/5 ring-ink/10"}`}
        >
          <Image
            src="/currito/cabeza.webp"
            alt="Currito, la mascota de Curro"
            width={44}
            height={44}
            className={lg ? "size-9 object-contain" : "size-7 object-contain"}
            priority
          />
        </span>
      )}
      <span
        className={`font-display font-extrabold lowercase tracking-tight ${
          lg ? "text-[1.7rem]" : "text-xl"
        } ${dark ? "text-cream" : "text-ink"}`}
      >
        curro
      </span>
    </Link>
  );
}
