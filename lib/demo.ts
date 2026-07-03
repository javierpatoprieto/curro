import { env } from "@/lib/env";
import type { Business, Lead } from "@/lib/types";
import type { CurrentContext } from "@/lib/auth";

/**
 * Modo demo: activo SOLO cuando Supabase no está configurado (desarrollo temprano
 * o vista previa local). En producción Supabase siempre está configurado, así que
 * el modo demo nunca se activa y el guard de autenticación real es el que manda.
 */
export const isDemoMode = () => !env.NEXT_PUBLIC_SUPABASE_URL;

const DEMO_BUSINESS_ID = "00000000-0000-0000-0000-000000000001";

export const DEMO_BUSINESS: Business = {
  id: DEMO_BUSINESS_ID,
  nombre: "Reformas García e Hijos",
  ciudad: "Madrid",
  telefono_entrante: "+34 910 000 000",
  vapi_assistant_id: "asst_demo_reformas_garcia",
  cal_link: "https://cal.com/reformas-garcia/visita",
  plan: "pro",
  activo: true,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  servicios:
    "Reformas integrales, baños, cocinas, pintura y fontanería. No hacemos tejados ni piscinas.",
  zonas: "Madrid capital y municipios del sur.",
  horario: "Lunes a viernes de 9:00 a 18:00.",
  tono: "cercano",
  preguntas_clave:
    "¿Es vivienda o local? ¿Metros aproximados? ¿Para cuándo lo necesita?",
  conocimiento:
    "Ofrecemos 2 años de garantía en todas las obras y presupuesto sin compromiso tras la visita.",
  voz: "femenina",
  actividad: "reformas y multiservicios del hogar",
  max_duracion_seg: 300,
  created_at: "2026-01-15T09:00:00.000Z",
  updated_at: "2026-06-20T12:00:00.000Z",
};

export const DEMO_CONTEXT: CurrentContext = {
  user: { id: "demo-user", email: "dueno@reformas-garcia.es" },
  owner: { id: "demo-owner", nombre: "Antonio García", rol: "owner" },
  business: DEMO_BUSINESS,
};

export const DEMO_LEADS: Lead[] = [
  {
    id: "b1",
    business_id: DEMO_BUSINESS_ID,
    cliente_nombre: "María López",
    cliente_telefono: "+34 611 111 111",
    tipo_trabajo: "Reforma de baño completo",
    zona: "Chamberí, Madrid",
    urgencia: true,
    estado: "nuevo",
    transcripcion:
      "Hola, tengo un baño de los años 80 y quiero reformarlo entero. Me corre un poco de prisa porque tengo humedades y se me está estropeando la pared del pasillo.",
    audio_url: null,
    source: "vapi",
    created_at: "2026-06-30T18:24:00.000Z",
    updated_at: "2026-06-30T18:24:00.000Z",
  },
  {
    id: "b2",
    business_id: DEMO_BUSINESS_ID,
    cliente_nombre: "Pedro Ruiz",
    cliente_telefono: "+34 622 222 222",
    tipo_trabajo: "Pintura de piso 90 m²",
    zona: "Tetuán, Madrid",
    urgencia: false,
    estado: "contactado",
    transcripcion:
      "Buenas, quería pintar todo el piso antes de mudarme. Son unos 90 metros, tres habitaciones, salón y cocina.",
    audio_url: null,
    source: "vapi",
    created_at: "2026-06-29T10:12:00.000Z",
    updated_at: "2026-06-29T11:00:00.000Z",
  },
  {
    id: "b3",
    business_id: DEMO_BUSINESS_ID,
    cliente_nombre: "Lucía Fernández",
    cliente_telefono: "+34 633 333 333",
    tipo_trabajo: "Cambio de ventanas",
    zona: "Salamanca, Madrid",
    urgencia: false,
    estado: "visita_agendada",
    transcripcion:
      "Quiero cambiar las ventanas por unas con mejor aislamiento térmico y acústico. Son cinco ventanas y un balcón.",
    audio_url: null,
    source: "vapi",
    created_at: "2026-06-27T16:40:00.000Z",
    updated_at: "2026-06-28T09:30:00.000Z",
  },
  {
    id: "b4",
    business_id: DEMO_BUSINESS_ID,
    cliente_nombre: "Javier Moreno",
    cliente_telefono: "+34 644 444 444",
    tipo_trabajo: "Reforma integral de cocina",
    zona: "Arganzuela, Madrid",
    urgencia: false,
    estado: "presupuestado",
    transcripcion:
      "Necesito reformar la cocina entera: quitar los azulejos, cambiar muebles, encimera y electrodomésticos.",
    audio_url: null,
    source: "vapi",
    created_at: "2026-06-24T12:05:00.000Z",
    updated_at: "2026-06-26T18:00:00.000Z",
  },
];
