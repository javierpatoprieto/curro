import Link from "next/link";
import { PhoneCall } from "lucide-react";

/**
 * Logotipo de Curro — dirección "Reflex": marca verde bosque con glifo lima +
 * wordmark. `dark` para fondos oscuros (verde bosque).
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
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
          dark ? "bg-lima text-bosque" : "bg-bosque text-lima"
        }`}
      >
        <PhoneCall className="size-[17px]" strokeWidth={2.5} />
      </span>
      <span
        className={`font-display text-[1.5rem] font-bold tracking-tight ${
          dark ? "text-nieve" : "text-bosque"
        }`}
      >
        curro
      </span>
    </Link>
  );
}
