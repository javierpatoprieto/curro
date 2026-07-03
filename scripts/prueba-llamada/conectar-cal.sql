-- =============================================================================
-- Conecta Cal.com al negocio de PRUEBA para verificar el agendado en la llamada.
-- Ejecutar en el SQL Editor de Supabase (producción), DESPUÉS de seed.sql.
-- Reemplaza los placeholders antes de correrlo.
--
-- Requisitos previos en Cal.com (cuenta de prueba):
--   1) Crea una API key (Settings → Developer → API keys) → CAL_API_KEY.
--   2) Crea un "event type" (p. ej. "Visita técnica 30 min") y copia su ID
--      numérico de la URL del editor → CAL_EVENT_TYPE_ID.
--
-- `business_integrations` tiene RLS activado y SIN políticas: solo el service_role
-- (los endpoints en servidor) puede leer/escribir esta fila. La API key NUNCA
-- llega al navegador. La lee el endpoint /api/vapi/tools durante la llamada.
-- =============================================================================

insert into public.business_integrations (business_id, cal_api_key, cal_event_type_id, updated_at)
select id, 'CAL_API_KEY_AQUI', 'CAL_EVENT_TYPE_ID_AQUI', now()
from public.businesses
where vapi_assistant_id = 'ASSISTANT_ID_AQUI'
on conflict (business_id) do update
  set cal_api_key = excluded.cal_api_key,
      cal_event_type_id = excluded.cal_event_type_id,
      updated_at = now();

-- Comprobar que quedó conectado (no muestra la key entera):
-- select business_id, left(cal_api_key, 8) || '…' as key, cal_event_type_id
-- from public.business_integrations
-- where business_id = (
--   select id from public.businesses where vapi_assistant_id = 'ASSISTANT_ID_AQUI'
-- );

-- OJO: el assistant solo monta las tools de agendado si se creó con calConectado=true.
-- Si el negocio de prueba ya tenía assistant SIN Cal, recréalo (crear-assistant.mjs)
-- para que incluya consultarHuecos/agendarVisita, o usa el alta desde /admin.
