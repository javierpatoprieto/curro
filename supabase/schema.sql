-- =============================================================================
-- Curro — Esquema multi-tenant con Row Level Security (RLS)
-- =============================================================================
-- Aislamiento: TODO se filtra por business_id. Un negocio nunca ve datos de otro.
-- El acceso de usuario pasa por RLS (anon key). Los webhooks usan service_role
-- (salta RLS) y son responsables de filtrar por business_id en el código.
--
-- Aplicar en el SQL Editor de Supabase, o con la CLI (ver supabase/README.md).
-- Idempotente en lo posible (drop policy if exists antes de crearlas).
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------
do $$ begin
  create type lead_estado as enum (
    'nuevo', 'contactado', 'visita_agendada', 'presupuestado', 'ganado', 'perdido'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type canal_mensaje as enum ('whatsapp', 'email');
exception when duplicate_object then null; end $$;

do $$ begin
  create type direccion_mensaje as enum ('saliente', 'entrante');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_envio as enum ('pendiente', 'enviado', 'entregado', 'fallido');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Trigger genérico para updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tabla: businesses (tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id                    uuid primary key default gen_random_uuid(),
  nombre                text not null,
  ciudad                text,
  telefono_entrante     text,
  vapi_assistant_id     text,
  cal_link              text,
  plan                  text not null default 'trial',
  activo                boolean not null default true,
  stripe_customer_id    text,
  stripe_subscription_id text,
  -- Aprovisionamiento (Fase 2): modo de teléfono, destino del desvío, SID del
  -- número dedicado de Twilio y estado del onboarding por pasos (JSONB).
  phone_mode            text,               -- 'forward' | 'new' | 'none'
  forward_target        text,
  vapi_phone_number_id  text,               -- SID del número comprado en Twilio (PN…)
  vapi_phone_id         text,               -- id del phone-number en Vapi (inbound BYO Twilio)
  onboarding_status     jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Solo permitimos los tres modos de teléfono que entiende el aprovisionamiento
-- (espeja la constraint que añade la migración 005: un build fresco = una BD
-- migrada). Idempotente.
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

drop trigger if exists trg_businesses_updated_at on public.businesses;
create trigger trg_businesses_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Tabla: owners (usuarios del tenant, ligados a auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.owners (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  nombre      text,
  email       text not null,
  whatsapp    text,
  rol         text not null default 'owner',
  created_at  timestamptz not null default now()
);

create index if not exists idx_owners_business on public.owners(business_id);
create index if not exists idx_owners_user on public.owners(user_id);

-- ---------------------------------------------------------------------------
-- Tabla: leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  business_id      uuid not null references public.businesses(id) on delete cascade,
  cliente_nombre   text,
  cliente_telefono text,
  tipo_trabajo     text,
  zona             text,
  urgencia         boolean not null default false,
  estado           lead_estado not null default 'nuevo',
  transcripcion    text,
  audio_url        text,
  source           text not null default 'vapi',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_leads_business_created on public.leads(business_id, created_at desc);
create index if not exists idx_leads_business_estado on public.leads(business_id, estado);

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Tabla: messages (WhatsApp / email enviados y recibidos)
-- business_id denormalizado para simplificar y acelerar RLS.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  lead_id      uuid references public.leads(id) on delete set null,
  canal        canal_mensaje not null,
  direccion    direccion_mensaje not null default 'saliente',
  plantilla    text,
  estado_envio estado_envio not null default 'pendiente',
  payload      jsonb,
  error        text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_messages_business on public.messages(business_id, created_at desc);
create index if not exists idx_messages_lead on public.messages(lead_id);

-- ---------------------------------------------------------------------------
-- Tabla: call_events (payloads crudos de Vapi + métricas)
-- ---------------------------------------------------------------------------
create table if not exists public.call_events (
  id             uuid primary key default gen_random_uuid(),
  business_id    uuid not null references public.businesses(id) on delete cascade,
  lead_id        uuid references public.leads(id) on delete set null,
  vapi_call_id   text,
  raw_payload    jsonb,
  duracion_seg   integer,
  coste_estimado numeric(10, 4),
  created_at     timestamptz not null default now()
);

create unique index if not exists uq_call_events_vapi_call_id
  on public.call_events(vapi_call_id) where vapi_call_id is not null;
create index if not exists idx_call_events_business on public.call_events(business_id, created_at desc);

-- =============================================================================
-- Row Level Security
-- =============================================================================

-- Devuelve los business_id a los que pertenece el usuario autenticado.
-- SECURITY DEFINER para evitar recursión de políticas al consultar owners.
create or replace function public.current_business_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select business_id from public.owners where user_id = auth.uid()
$$;

alter table public.businesses   enable row level security;
alter table public.owners       enable row level security;
alter table public.leads        enable row level security;
alter table public.messages     enable row level security;
alter table public.call_events  enable row level security;

-- businesses: los miembros ven y editan su propio negocio.
drop policy if exists businesses_select on public.businesses;
create policy businesses_select on public.businesses
  for select to authenticated
  using (id in (select public.current_business_ids()));

drop policy if exists businesses_update on public.businesses;
create policy businesses_update on public.businesses
  for update to authenticated
  using (id in (select public.current_business_ids()))
  with check (id in (select public.current_business_ids()));

-- owners: los miembros ven a los compañeros de su negocio.
drop policy if exists owners_select on public.owners;
create policy owners_select on public.owners
  for select to authenticated
  using (business_id in (select public.current_business_ids()));

-- leads: los miembros ven y actualizan (cambio de estado) sus leads.
drop policy if exists leads_select on public.leads;
create policy leads_select on public.leads
  for select to authenticated
  using (business_id in (select public.current_business_ids()));

drop policy if exists leads_update on public.leads;
create policy leads_update on public.leads
  for update to authenticated
  using (business_id in (select public.current_business_ids()))
  with check (business_id in (select public.current_business_ids()));

-- messages: solo lectura para los miembros (los crea el sistema con service_role).
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select to authenticated
  using (business_id in (select public.current_business_ids()));

-- call_events: solo lectura para los miembros.
drop policy if exists call_events_select on public.call_events;
create policy call_events_select on public.call_events
  for select to authenticated
  using (business_id in (select public.current_business_ids()));

-- Nota: NO definimos políticas de INSERT/DELETE para usuarios autenticados.
-- Las escrituras de sistema (webhooks) usan service_role, que salta RLS.
-- El alta de negocios/owners (onboarding) también se hace con service_role.
