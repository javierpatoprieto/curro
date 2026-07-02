-- =============================================================================
-- Agendado de visitas en llamada (Cal.com).
-- La API key de Cal.com es un SECRETO por negocio: se guarda en una tabla
-- aparte con RLS y SIN políticas para anon/authenticated, de modo que solo el
-- service_role (que salta RLS, únicamente en servidor) puede leerla/escribirla.
-- Así el secreto nunca llega al navegador aunque el dueño lea su propio negocio.
-- Aplicar en el SQL Editor de Supabase. Idempotente.
-- =============================================================================

create table if not exists public.business_integrations (
  business_id       uuid primary key references public.businesses(id) on delete cascade,
  cal_api_key       text,        -- API key de Cal.com del negocio (secreto)
  cal_event_type_id text,        -- id o slug del tipo de evento "visita"
  updated_at        timestamptz not null default now()
);

alter table public.business_integrations enable row level security;

-- Nota: no se crea ninguna política. Con RLS activado y sin políticas, los roles
-- anon/authenticated no pueden ver ni tocar la tabla; solo el service_role
-- (usado en servidor: webhooks, endpoint de tools y acciones de ajustes) accede.
