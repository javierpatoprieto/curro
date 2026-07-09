-- =============================================================================
-- Aprovisionamiento asíncrono + checklist de onboarding (Fase 2).
--
-- Al crear un cliente (alta admin o self-serve tras pago) montamos todo
-- automáticamente y guardamos el estado por pasos en `onboarding_status`
-- (JSONB en el propio negocio, sin tabla nueva). El teléfono queda descrito por
-- `phone_mode` ('forward' = desvío al número que ya tiene el cliente,
-- 'new' = número dedicado nuevo en Twilio, 'none' = sin teléfono todavía),
-- `forward_target` (el número del cliente al que Curro desvía) y
-- `vapi_phone_number_id` (el SID del IncomingPhoneNumber de Twilio comprado).
--
-- Aplicar en el SQL Editor de Supabase. Idempotente.
-- =============================================================================

alter table public.businesses
  add column if not exists phone_mode text,               -- 'forward' | 'new' | 'none'
  add column if not exists forward_target text,
  add column if not exists vapi_phone_number_id text,
  add column if not exists onboarding_status jsonb not null default '{}'::jsonb;

-- Solo permitimos los tres modos de teléfono que entiende el aprovisionamiento.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'businesses_phone_mode_check'
  ) then
    alter table public.businesses
      add constraint businesses_phone_mode_check
      check (phone_mode in ('forward', 'new', 'none'));
  end if;
end $$;
