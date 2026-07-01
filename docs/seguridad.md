# Seguridad — repaso

Resumen de las medidas de seguridad del MVP y qué revisar antes de producción.

## Aislamiento entre tenants (RLS)

- Todas las tablas tienen **Row Level Security** activada (`supabase/schema.sql`).
- Los usuarios acceden con la **anon key**; solo ven filas de los negocios a los
  que pertenecen, resuelto por `current_business_ids()` (SECURITY DEFINER, evita
  recursión de políticas).
- No hay políticas de INSERT/DELETE para usuarios: las escrituras de sistema van
  con `service_role`.

## service_role: solo en el servidor

- La `service_role` key salta RLS y **solo** se usa en el servidor
  (`lib/supabase/admin.ts`): webhooks y onboarding.
- Nunca se importa en componentes cliente ni se expone al navegador.
- El código con `service_role` filtra siempre por `business_id`.

## Validación de webhooks

- **Vapi**: se compara la cabecera `x-vapi-secret` con `VAPI_WEBHOOK_SECRET` en
  tiempo constante (`lib/vapi/verify.ts`). En producción, sin secreto → `500`.
- **Stripe**: se verifica la firma con `stripe.webhooks.constructEvent` y
  `STRIPE_WEBHOOK_SECRET`. En producción, sin secreto → `500`.
- **Meta/WhatsApp**: al implementar la recepción de estados, verificar el
  `WHATSAPP_VERIFY_TOKEN` (handshake) y la firma `X-Hub-Signature-256`.

## Secretos

- Nada de secretos en el repo. Todo por variables de entorno; `.env.local` está
  en `.gitignore`. `.env.example` documenta todas las variables sin valores.
- Claves sensibles (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
  `VAPI_API_KEY`, `WHATSAPP_TOKEN`) no llevan prefijo `NEXT_PUBLIC_`, así que
  nunca llegan al cliente.

## Autenticación y rutas

- Sesión gestionada por Supabase Auth (magic link) y refrescada en `proxy.ts`.
- `/panel` está protegido en el proxy y, además, el layout redirige a `/login`
  si no hay sesión (defensa en profundidad).

## Cumplimiento

- El guion del assistant informa al inicio de que es un **asistente virtual** y
  de que la **llamada se graba** (`lib/vapi/assistant.ts`).
- Páginas de **privacidad** y **aviso legal** (plantillas a revisar por un
  abogado).
- **Límite de llamadas por plan** (`lib/usage.ts`): al superarlo, se guarda el
  lead pero se pausan las notificaciones (control de coste). El webhook cuenta
  las llamadas del mes y aplica `dentroDelLimite` (una única fuente de verdad).

## Provisión de recursos tras el pago

- El onboarding crea el negocio **inactivo** (`activo: false`) y **sin assistant
  de Vapi**. El assistant se crea y la cuenta se activa en el webhook de Stripe
  (`checkout.session.completed`), solo cuando el pago se confirma. Así un
  onboarding abandonado no deja assistants huérfanos (coste) ni cuentas activas
  gratis. El onboarding también evita negocios duplicados por usuario.

## Configuración obligatoria en producción

- `lib/env.ts` **rompe al arrancar** en producción si faltan las variables
  imprescindibles de Supabase (URL, anon key, service_role), en vez de fallar
  tarde con un 500 en mitad de un webhook.

## Pendiente antes de producción

- [ ] Revisar las políticas RLS con dos tenants reales (test de fuga).
- [ ] Rotar y guardar secretos en el gestor de Vercel/Supabase.
- [x] Rate limiting en los webhooks públicos (`lib/ratelimit.ts`, best-effort en
      memoria por instancia; para una cuota global exacta, mover a Upstash/Redis).
- [ ] Verificación de firma del webhook de WhatsApp cuando se implemente.
- [ ] Revisión legal de privacidad y aviso legal.
