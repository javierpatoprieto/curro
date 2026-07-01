/** Tipos de dominio compartidos. Reflejan el esquema SQL (supabase/schema.sql). */

export const LEAD_ESTADOS = [
  "nuevo",
  "contactado",
  "visita_agendada",
  "presupuestado",
  "ganado",
  "perdido",
] as const;

export type LeadEstado = (typeof LEAD_ESTADOS)[number];

/** Etiquetas en español de los estados (módulo puro, apto para cliente). */
export const ESTADO_LABEL: Record<LeadEstado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  visita_agendada: "Visita agendada",
  presupuestado: "Presupuestado",
  ganado: "Ganado",
  perdido: "Perdido",
};

export const PLANES = ["trial", "starter", "pro", "cancelado"] as const;
export type Plan = (typeof PLANES)[number];

export type CanalMensaje = "whatsapp" | "email";
export type DireccionMensaje = "saliente" | "entrante";
export type EstadoEnvio = "pendiente" | "enviado" | "entregado" | "fallido";

export interface Business {
  id: string;
  nombre: string;
  ciudad: string | null;
  telefono_entrante: string | null;
  vapi_assistant_id: string | null;
  cal_link: string | null;
  plan: Plan;
  activo: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Owner {
  id: string;
  business_id: string;
  user_id: string | null;
  nombre: string | null;
  email: string;
  whatsapp: string | null;
  rol: string;
  created_at: string;
}

export interface Lead {
  id: string;
  business_id: string;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  tipo_trabajo: string | null;
  zona: string | null;
  urgencia: boolean;
  estado: LeadEstado;
  transcripcion: string | null;
  audio_url: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  business_id: string;
  lead_id: string | null;
  canal: CanalMensaje;
  direccion: DireccionMensaje;
  plantilla: string | null;
  estado_envio: EstadoEnvio;
  payload: unknown;
  error: string | null;
  created_at: string;
}

export interface CallEvent {
  id: string;
  business_id: string;
  lead_id: string | null;
  vapi_call_id: string | null;
  raw_payload: unknown;
  duracion_seg: number | null;
  coste_estimado: number | null;
  created_at: string;
}
