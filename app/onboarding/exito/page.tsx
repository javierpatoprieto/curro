import Link from "next/link";
import { CheckCircle2, PhoneCall, MessageCircle, LayoutDashboard } from "lucide-react";
import { PLANES_PAGO, type PlanPago } from "@/lib/stripe/plans";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const pasos = [
  { icon: PhoneCall, texto: "Configuramos tu número para que Curro atienda las llamadas." },
  { icon: MessageCircle, texto: "Conecta tu WhatsApp y tu enlace de Cal.com desde Ajustes." },
  { icon: LayoutDashboard, texto: "Tus leads aparecerán en el panel en cuanto entre la primera llamada." },
];

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; demo?: string }>;
}) {
  const { plan, demo } = await searchParams;
  const def = plan && plan in PLANES_PAGO ? PLANES_PAGO[plan as PlanPago] : null;

  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="size-8 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        ¡Bienvenido a Curro!
      </h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        {def
          ? `Tu plan ${def.nombre} (${def.precio}€/mes) está listo con 14 días de prueba.`
          : "Tu cuenta está lista con 14 días de prueba."}
        {demo && " (demo: no se ha realizado ningún cobro real)."}
      </p>

      <Card className="mt-8 text-left">
        <CardContent className="space-y-4 py-6">
          {pasos.map(({ icon: Icon, texto }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--secondary)]">
                <Icon className="size-4" />
              </span>
              <p className="text-sm">{texto}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Link href="/panel" className={buttonVariants({ size: "lg", className: "mt-8" })}>
        Ir a mi panel
      </Link>
    </main>
  );
}
