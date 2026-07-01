-- =============================================================================
-- Personalización por empresa: guion configurable, base de conocimiento y
-- control de duración de llamada. Aplicar en el SQL Editor de Supabase.
-- Idempotente (add column if not exists).
-- =============================================================================

alter table public.businesses
  add column if not exists servicios       text,  -- qué trabajos hace (y cuáles no)
  add column if not exists zonas           text,  -- zonas que cubre
  add column if not exists horario         text,  -- horario de atención
  add column if not exists tono            text,  -- cercano | profesional | comercial
  add column if not exists preguntas_clave text,  -- qué debe preguntar siempre
  add column if not exists conocimiento    text,  -- FAQ/notas para responder dudas
  add column if not exists max_duracion_seg integer; -- tope de duración por llamada
