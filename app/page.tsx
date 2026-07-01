import { PhoneCall, MessageCircle, CalendarCheck, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const pasos = [
  {
    icon: PhoneCall,
    titulo: "Atiende la llamada",
    texto:
      "La IA responde en español 24/7 cuando estás en obra, cualifica al cliente y toma sus datos.",
  },
  {
    icon: MessageCircle,
    titulo: "Avisa al instante",
    texto:
      "Te llega el lead por WhatsApp y email en segundos, con el resumen de lo que necesita.",
  },
  {
    icon: CalendarCheck,
    titulo: "Agenda la visita",
    texto:
      "El cliente recibe un WhatsApp con enlace para reservar la visita de valoración.",
  },
  {
    icon: LayoutDashboard,
    titulo: "Gestiona todo",
    texto:
      "Panel con tus leads, transcripciones y estados. Nada se pierde, aunque no cojas el teléfono.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-20">
      <section className="flex flex-col items-center gap-6 text-center">
        <Badge variant="secondary">Fase 1 · Auth y panel base ✅</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AtiendeReformas
        </h1>
        <p className="max-w-2xl text-lg text-[var(--muted-foreground)]">
          La recepcionista con IA para empresas de reformas y multiservicios del
          hogar. Deja de perder presupuestos por no coger el teléfono.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a className={buttonVariants({ size: "lg" })} href="/login">
            Acceder al panel
          </a>
          <a
            className={buttonVariants({ variant: "outline", size: "lg" })}
            href="#como-funciona"
          >
            Cómo funciona
          </a>
        </div>
      </section>

      <section id="como-funciona" className="grid gap-4 sm:grid-cols-2">
        {pasos.map(({ icon: Icon, titulo, texto }) => (
          <Card key={titulo}>
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--secondary)]">
                <Icon className="size-5" />
              </div>
              <CardTitle>{titulo}</CardTitle>
              <CardDescription>{texto}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>

      <footer className="text-center text-sm text-[var(--muted-foreground)]">
        Proyecto en construcción · Multi-tenant con Supabase RLS · Next.js 16
      </footer>
    </main>
  );
}
