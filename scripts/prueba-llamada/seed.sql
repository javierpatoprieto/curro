-- =============================================================================
-- SEED de PRUEBA para una llamada real. Ejecutar en el SQL Editor de Supabase
-- (proyecto de producción). Reemplaza los dos placeholders antes de correrlo.
-- =============================================================================

-- 1) Crea el negocio de prueba, ya vinculado al assistant de Vapi.
--    Sustituye ASSISTANT_ID_AQUI por el id que imprime crear-assistant.mjs.
insert into public.businesses (nombre, ciudad, vapi_assistant_id, plan, activo)
values ('Reformas de Prueba', 'Madrid', 'ASSISTANT_ID_AQUI', 'pro', true)
returning id;

-- 2) Crea el owner (tú), para recibir avisos y luego ver el lead en /panel.
--    Sustituye TU_EMAIL_AQUI por tu email. El user_id se enlaza más tarde
--    (ver paso 4) tras tu primer login con magic link.
insert into public.owners (business_id, email, whatsapp, rol)
select id, 'TU_EMAIL_AQUI', null, 'owner'
from public.businesses
where vapi_assistant_id = 'ASSISTANT_ID_AQUI';

-- 3) (Tras la llamada) Comprueba que el lead ha entrado:
-- select cliente_nombre, tipo_trabajo, zona, urgencia, created_at
-- from public.leads
-- where business_id = (select id from public.businesses where vapi_assistant_id = 'ASSISTANT_ID_AQUI')
-- order by created_at desc;

-- 4) (Opcional, para ver el lead en /panel) Tras entrar una vez con tu email en
--    la web (magic link), enlaza tu usuario de auth con el owner:
-- update public.owners
-- set user_id = (select id from auth.users where email = 'TU_EMAIL_AQUI')
-- where email = 'TU_EMAIL_AQUI';
