-- =============================================================================
-- Horario de atención (telefonía): transferir al dueño en su horario.
--
-- Cada negocio define en qué franjas atiende él mismo el teléfono
-- (`horario_atencion`, JSONB) y a qué móvil transferir dentro de ese horario
-- (`telefono_agente`, E.164). DENTRO del horario, la llamada entrante se
-- transfiere a `telefono_agente`; FUERA (tardes/noches/finde), la atiende el
-- asistente de Curro (comportamiento actual). Modo "solo por horario" (sin
-- overflow: si el dueño no coge dentro de su horario, la llamada se pierde).
--
-- `horario_atencion` NULL o sin franjas = Curro atiende 24/7 (no rompe nada).
--
-- Forma del JSON (ver lib/horario.ts):
--   {
--     "tz": "Europe/Madrid",
--     "dias": {
--       "lun": [["07:00","18:00"]],
--       "mar": [["07:00","18:00"]],
--       ... "sab": [], "dom": []
--     }
--   }
--
-- Aplicar en el SQL Editor de Supabase. Idempotente (add column if not exists).
-- =============================================================================

alter table public.businesses
  add column if not exists horario_atencion jsonb,   -- franjas en que atiende el dueño
  add column if not exists telefono_agente  text;    -- móvil del dueño (E.164) para transferir
