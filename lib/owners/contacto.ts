import { z } from "zod";

/**
 * Datos de contacto del dueño donde llegan los avisos de lead (tabla `owners`,
 * columnas `email` y `whatsapp`). Los consume `lib/messaging/notify.ts` para
 * avisar al dueño de cada lead nuevo por email y WhatsApp.
 */
export const contactoDuenoSchema = z.object({
  email: z.email(),
  // Formato libre: lo normaliza `twilioTo`/`normalizeTo` al enviar (ver
  // lib/messaging/whatsapp.ts), igual que en el alta del cliente.
  whatsapp: z.string().optional(),
});

export type ContactoDueno = z.infer<typeof contactoDuenoSchema>;

/**
 * Parseo + validación desde un FormData. Reutilizable en la edición del cliente
 * en admin (`app/admin/clientes/[id]`) y en el panel del propio dueño
 * (`/panel/ajustes`). Espera los campos `owner_email` y `owner_whatsapp`.
 */
export function parseContactoDueno(formData: FormData) {
  const g = (k: string) => (formData.get(k) as string) || undefined;
  return contactoDuenoSchema.safeParse({
    email: g("owner_email"),
    whatsapp: g("owner_whatsapp"),
  });
}

/** Normaliza los campos listos para el UPDATE sobre `owners` (whatsapp vacío → null). */
export function normalizarContactoDueno(d: ContactoDueno): {
  email: string;
  whatsapp: string | null;
} {
  const whatsapp = d.whatsapp?.trim();
  return { email: d.email.trim(), whatsapp: whatsapp ? whatsapp : null };
}
