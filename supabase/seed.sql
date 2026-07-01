-- =============================================================================
-- Seed de desarrollo: un tenant de prueba con leads de ejemplo.
-- Ejecutar DESPUÉS de schema.sql. Se ejecuta como postgres (salta RLS).
-- Idempotente: usa un id fijo para el negocio de prueba.
-- =============================================================================

-- Negocio de prueba
insert into public.businesses (id, nombre, ciudad, telefono_entrante, cal_link, plan, activo)
values (
  '00000000-0000-0000-0000-000000000001',
  'Reformas García e Hijos',
  'Madrid',
  '+34910000000',
  'https://cal.com/reformas-garcia/visita',
  'pro',
  true
)
on conflict (id) do update set
  nombre = excluded.nombre,
  ciudad = excluded.ciudad,
  telefono_entrante = excluded.telefono_entrante,
  cal_link = excluded.cal_link,
  plan = excluded.plan,
  activo = excluded.activo;

-- Owner del negocio de prueba.
-- user_id queda NULL hasta que el dueño entre por primera vez con magic link;
-- entonces se enlaza (ver supabase/README.md → "Enlazar un usuario a un owner").
insert into public.owners (id, business_id, nombre, email, whatsapp, rol)
values (
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-000000000001',
  'Antonio García',
  'dueno@reformas-garcia.es',
  '+34600000000',
  'owner'
)
on conflict (id) do nothing;

-- Leads de ejemplo para desarrollar el panel.
insert into public.leads
  (id, business_id, cliente_nombre, cliente_telefono, tipo_trabajo, zona, urgencia, estado, transcripcion, source)
values
  (
    '00000000-0000-0000-0000-0000000000b1',
    '00000000-0000-0000-0000-000000000001',
    'María López', '+34611111111', 'Reforma de baño completo', 'Chamberí, Madrid',
    true, 'nuevo',
    'Hola, tengo un baño de los años 80 y quiero reformarlo entero. Me corre un poco de prisa porque tengo humedades.',
    'vapi'
  ),
  (
    '00000000-0000-0000-0000-0000000000b2',
    '00000000-0000-0000-0000-000000000001',
    'Pedro Ruiz', '+34622222222', 'Pintura de piso 90m²', 'Tetuán, Madrid',
    false, 'contactado',
    'Buenas, quería pintar todo el piso antes de mudarme. Son unos 90 metros, tres habitaciones.',
    'vapi'
  ),
  (
    '00000000-0000-0000-0000-0000000000b3',
    '00000000-0000-0000-0000-000000000001',
    'Lucía Fernández', '+34633333333', 'Cambio de ventanas', 'Salamanca, Madrid',
    false, 'visita_agendada',
    'Quiero cambiar las ventanas por unas con mejor aislamiento térmico y acústico.',
    'vapi'
  )
on conflict (id) do nothing;
