import { Badge } from "@/components/ui/badge";
import { ESTADO_LABEL } from "@/lib/leads";
import type { LeadEstado } from "@/lib/types";

const VARIANTE: Record<
  LeadEstado,
  "default" | "secondary" | "destructive" | "outline"
> = {
  nuevo: "default",
  contactado: "secondary",
  visita_agendada: "secondary",
  presupuestado: "secondary",
  ganado: "default",
  perdido: "outline",
};

export function EstadoBadge({ estado }: { estado: LeadEstado }) {
  return <Badge variant={VARIANTE[estado]}>{ESTADO_LABEL[estado]}</Badge>;
}
