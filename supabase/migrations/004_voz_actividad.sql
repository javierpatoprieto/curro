-- =============================================================================
-- Voz del asistente (femenina/masculina) y actividad (tipo de empresa) por negocio.
-- La voz elige el voiceId de 11labs; la actividad personaliza el guion
-- ("una empresa de {actividad}"). Aplicar en el SQL Editor de Supabase. Idempotente.
-- =============================================================================

alter table public.businesses
  add column if not exists voz text not null default 'femenina',
  add column if not exists actividad text;

-- Solo permitimos los dos valores que entiende el assistant.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'businesses_voz_check'
  ) then
    alter table public.businesses
      add constraint businesses_voz_check check (voz in ('femenina', 'masculina'));
  end if;
end $$;
