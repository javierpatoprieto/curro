import Link from "next/link";
import { PhoneCall } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <Link href="/" className="mb-10 inline-flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
          <PhoneCall className="size-4" />
        </span>
        <span className="font-semibold">Curro</span>
      </Link>
      <article className="prose-curro space-y-4 text-sm leading-relaxed text-[var(--foreground)]">
        {children}
      </article>
      <Link
        href="/"
        className="mt-12 inline-block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
