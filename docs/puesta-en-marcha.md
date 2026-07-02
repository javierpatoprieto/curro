# Puesta en marcha de Curro — checklist de alta de servicios

Guía para un fundador en solitario que quiere lanzar **Curro** de verdad (no en
modo mock). Todo lo que sigue está verificado contra el código de este repo; si
algo no está implementado, se indica explícitamente.

> **Cómo funciona el modo mock**: por defecto la app usa mocks
> (`MOCK_PROVIDERS` distinto de `"false"`, ver `lib/env.ts`). Para llamar a los
> proveedores reales tienes que poner **`MOCK_PROVIDERS=false`** *y además*
> tener la clave de cada proveedor. Cada adaptador comprueba las dos cosas
> (p. ej. `lib/messaging/whatsapp.ts`, `lib/messaging/email.ts`,
> `lib/vapi/assistant.ts`, `lib/stripe/client.ts`).

## Dónde va cada variable (resumen)

- **Vercel** (Project → Settings → Environment Variables): TODAS las variables de
  entorno de la app viven aquí (la app corre en Vercel).
- **Supabase**: aquí NO se ponen variables de la app. Lo que se hace en Supabase
  es aplicar `schema.sql` + migraciones y crear el proyecto (que te da la URL y
  las keys que copiarás a Vercel).
- En local: copia `.env.example` a `.env.local` (ver `README.md`).

Las variables imprescindibles en producción son solo las 3 de Supabase: si
faltan, la app **rompe al arrancar** (`lib/env.ts`, bloque `if (env.isProd)`).

---

## 1. Supabase (base de datos + auth) — OBLIGATORIO

**Cuenta:** crea un proyecto en supabase.com.

**Pasos específicos de esta app:**
1. En el proyecto → **SQL Editor**, ejecuta `supabase/schema.sql`.
2. Ejecuta las migraciones **en orden**: `supabase/migrations/002_personalizacion_negocio.sql`
   y luego `supabase/migrations/003_cal_agendado.sql`.
   - Nota: no existe una migración `001`; el estado base está en `schema.sql`.
   - `002` añade a `businesses`: `servicios, zonas, horario, tono, preguntas_clave, conocimiento, max_duracion_seg`.
   - `003` crea la tabla `business_integrations` (con RLS y **sin políticas**: solo `service_role`).
3. (Solo desarrollo) `supabase/seed.sql` para datos de prueba.
4. **Enlazar owner ↔ auth user:**
   - En el **onboarding real** esto es automático: `app/onboarding/actions.ts`
     inserta la fila de `owners` con `user_id` = usuario de la sesión.
   - Solo necesitas el enlace manual por SQL (el de `supabase/README.md`) si
     creaste owners a mano o por seed. La consulta actualiza
     `owners.user_id` cruzando por email con `auth.users`.
5. Auth: los dueños entran con **magic link** (Supabase Auth). Verifica que el
   email de magic link esté configurado y que la **Site URL / Redirect URLs** de
   Supabase Auth apunten a tu dominio de Vercel.

**Variables que produce y dónde se consumen:**

| Variable | De dónde sale (Supabase) | Dónde se consume en el código |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL | `lib/supabase/client.ts`, `lib/supabase/proxy.ts`, `lib/env.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon public | `lib/supabase/client.ts`, `lib/supabase/proxy.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role (secreto) | `lib/supabase/admin.ts` (webhooks, onboarding, admin) |

**Dónde ponerlas:** Vercel. Son las 3 imprescindibles en producción.

---

## 2. Vapi (agente de voz) — necesario para atender llamadas

**Cuenta:** crea cuenta en vapi.ai y consigue tu API key.

**Pasos específicos de esta app** (ver `docs/vapi.md` y `lib/vapi/assistant.ts`):
1. El assistant **NO lo creas a mano**: lo crea la app por API al confirmarse el
   pago (webhook de Stripe → `crearAssistant`). El código ya fija voz
   (`11labs` voiceId `sarah`), transcriber (`deepgram nova-2`, `es`), modelo
   (`openai gpt-4o`), `firstMessage`, aviso legal de grabación y el
   `analysisPlan.structuredDataPlan` con los campos `cliente_nombre`,
   `cliente_telefono`, `tipo_trabajo`, `zona`, `urgencia`.
2. **Server URL + secreto del webhook (crítico):** en `buildAssistantConfig`,
   la app cablea automáticamente el `server.url` a
   `https://TU-DOMINIO/api/webhooks/vapi` y añade la cabecera `x-vapi-secret`
   con el valor de `VAPI_WEBHOOK_SECRET`. Debes:
   - Elegir un valor secreto y ponerlo como `VAPI_WEBHOOK_SECRET`.
   - Activar el Server Message **`end-of-call-report`** (si configuras algo
     global en el panel de Vapi; el URL por assistant ya lo pone el código).
   - El endpoint valida `x-vapi-secret` en tiempo constante (`lib/vapi/verify.ts`);
     en producción, **sin secreto responde 500** a propósito
     (`app/api/webhooks/vapi/route.ts`).
3. **Asociación llamada ↔ negocio:** el webhook localiza el negocio por
   `vapi_assistant_id` (que la app guarda al crear el assistant) y, en su
   defecto, por el número entrante (`telefono_entrante`).
4. **Número de teléfono:** el código **no** compra ni asigna el número de Vapi
   por API. Tendrás que gestionar el número entrante en Vapi y guardar el
   `telefono_entrante` del negocio (fallback de asociación).

**Variables:**

| Variable | Qué es | Dónde se consume |
| --- | --- | --- |
| `VAPI_API_KEY` | API key de Vapi | `lib/vapi/assistant.ts` (crear/actualizar/eliminar assistant) |
| `VAPI_WEBHOOK_SECRET` | "Server Message Secret" (cabecera `x-vapi-secret`) | `lib/vapi/assistant.ts` (lo inyecta en el assistant) y `app/api/webhooks/vapi/route.ts` (lo valida) |

**Dónde ponerlas:** Vercel.

---

## 3. WhatsApp Cloud API (Meta) — envío de leads por WhatsApp

**Cuenta:** app de Meta for Developers con el producto **WhatsApp** y un número
de WhatsApp Business.

**Pasos específicos de esta app** (ver `lib/messaging/whatsapp.ts` y
`lib/messaging/templates.ts`):
1. Consigue un **token** (permanente/de sistema) y el **Phone Number ID**.
2. La app llama a `https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages`.
3. **Plantillas aprobadas (obligatorio):** el código envía plantillas con estos
   nombres exactos, en idioma **`es`** (`language.code: "es"`):
   - `curro_confirmacion_cliente` (constante `PLANTILLA_CLIENTE`): confirmación
     al cliente final. Variables en orden: `[nombre, negocio, calLink]`.
   - `curro_aviso_lead` (constante `PLANTILLA_DUENO`): aviso al dueño. Variables
     en orden: `[negocio, nombre, teléfono, trabajo, zona, urgencia]`.
   - Debes crear y **aprobar en Meta** dos plantillas con esos nombres y ese
     número/tipo de variables de cuerpo, o los envíos fallarán.

**Variables:**

| Variable | Qué es | Dónde se consume |
| --- | --- | --- |
| `WHATSAPP_TOKEN` | Token de acceso de la Graph API | `lib/messaging/whatsapp.ts` |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID del número | `lib/messaging/whatsapp.ts` |
| `WHATSAPP_VERIFY_TOKEN` | *(ver discrepancias)* | **NO se consume en el código** |

**Dónde ponerlas:** Vercel.

> **Importante:** la recepción de estados/mensajes entrantes de WhatsApp **no
> está implementada**. No existe ruta de webhook de Meta (solo hay
> `app/api/webhooks/stripe` y `app/api/webhooks/vapi`). Por tanto no hay
> handshake de verificación ni validación de firma `X-Hub-Signature-256`
> todavía (queda pendiente, ver `docs/seguridad.md`). Curro solo **envía**
> WhatsApp, no recibe.

---

## 4. Resend (email) — aviso al dueño por email

**Cuenta:** crea cuenta en resend.com.

**Pasos específicos de esta app** (ver `lib/messaging/email.ts`):
1. **Verifica tu dominio de envío** en Resend.
2. Define el remitente con `EMAIL_FROM` usando ese dominio verificado
   (formato tipo `"Curro <avisos@tudominio.com>"`). Si no lo defines, el código
   usa por defecto `"Curro <avisos@curro.app>"`, que **no es tu dominio** y
   fallará el envío.
3. La app hace `POST https://api.resend.com/emails`.

**Variables:**

| Variable | Qué es | Dónde se consume |
| --- | --- | --- |
| `RESEND_API_KEY` | API key de Resend | `lib/messaging/email.ts` |
| `EMAIL_FROM` | Remitente (dominio verificado en Resend) | `lib/messaging/email.ts` |

**Dónde ponerlas:** Vercel.

---

## 5. Cal.com (agenda de visitas)

**Cuenta:** cuenta en cal.com con un tipo de evento "visita".

**Cómo se usa realmente en el código:**
- Lo que **sí** funciona es `businesses.cal_link`: una **URL de reserva por
  negocio** (p. ej. `https://cal.com/tu-negocio/visita`). Se configura en el
  onboarding (`app/onboarding/actions.ts`), en ajustes del panel
  (`app/panel/ajustes/actions.ts`) o desde el admin
  (`app/admin/clientes/[id]/actions.ts`).
- Ese `cal_link` se envía al **cliente final** dentro del WhatsApp de
  confirmación (`lib/messaging/templates.ts` → `whatsappCliente`, variable
  `calLink`). Si el negocio no tiene `cal_link`, simplemente no se incluye el
  enlace.
- **No hay integración por API con Cal.com.** La migración `003_cal_agendado.sql`
  crea la tabla `business_integrations` con `cal_api_key` y `cal_event_type_id`,
  pero **ningún código lee esas columnas** para agendar automáticamente durante
  la llamada. No existe endpoint de "tools" de Vapi ni llamadas a
  `api.cal.com`. Es decir: hoy el agendado es **manual por el cliente** vía el
  enlace, no automático.

**Variables de entorno:** **ninguna.** Cal.com no usa variables de entorno; el
enlace se guarda por negocio en la base de datos (`cal_link`).

**Qué tienes que hacer:** crear tu enlace de reserva en Cal.com y pegarlo en el
onboarding o en Ajustes de cada negocio.

---

## 6. Stripe (suscripciones) — cobro y activación de cuentas

**Cuenta:** cuenta de Stripe.

**Pasos específicos de esta app** (ver `lib/stripe/plans.ts`,
`lib/stripe/client.ts`, `app/api/webhooks/stripe/route.ts`):
1. **Crea 3 Prices recurrentes** que casen con los planes de la landing. Los
   importes de referencia en el código (`lib/stripe/plans.ts`) son:
   - `starter` ("Básico") — 99 €/mes → `STRIPE_PRICE_STARTER`
   - `pro` ("Pro") — 149 €/mes → `STRIPE_PRICE_PRO`
   - `premium` ("Premium") — 199 €/mes → `STRIPE_PRICE_PREMIUM`
   - Copia el **price ID** de cada uno a su variable. El webhook mapea
     `priceId → plan` (`mapaPreciosAPlan`); si un price no está mapeado, el
     código cae por defecto al plan `pro` (`resolverCuenta`).
2. **Checkout:** la app crea sesiones de Checkout en modo `subscription` con
   **7 días de prueba** (`trial_period_days: 7`) y mete `business_id` y `plan`
   en `metadata` (`lib/stripe/client.ts`). URLs de éxito/cancelación apuntan a
   `/onboarding/exito` y `/onboarding`.
3. **Webhook de Stripe:** crea un endpoint en Stripe apuntando a
   `https://TU-DOMINIO/api/webhooks/stripe`. La app procesa:
   `checkout.session.completed` (crea el assistant de Vapi y **activa** el
   negocio), `customer.subscription.updated` y `customer.subscription.deleted`
   (activa/desactiva según estado; activos = `active` o `trialing`).
   - Copia el **signing secret** del endpoint a `STRIPE_WEBHOOK_SECRET`. La
     firma se verifica con `stripe.webhooks.constructEvent`; en producción, sin
     secreto → **500**.

**Variables:**

| Variable | Qué es | Dónde se consume |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Secret key de Stripe | `lib/stripe/client.ts` |
| `STRIPE_WEBHOOK_SECRET` | Signing secret del endpoint webhook | `app/api/webhooks/stripe/route.ts` |
| `STRIPE_PRICE_STARTER` | Price ID plan Básico | `lib/stripe/plans.ts` |
| `STRIPE_PRICE_PRO` | Price ID plan Pro | `lib/stripe/plans.ts` |
| `STRIPE_PRICE_PREMIUM` | Price ID plan Premium | `lib/stripe/plans.ts` |

**Dónde ponerlas:** Vercel.

---

## 7. Google Analytics 4 (opcional)

**Cuenta:** propiedad GA4 con su **Measurement ID** (`G-XXXXXXXXXX`).

**Comportamiento en el código** (`components/analytics/cookie-consent.tsx`):
- Si `NEXT_PUBLIC_GA_ID` está definido, aparece el **banner de consentimiento**
  de cookies y GA4 **solo se carga tras aceptar** (opt-in, con borrado de
  cookies `_ga`/`_gid` si se rechaza). Si no la defines, no hay banner ni GA4.

**Variable:**

| Variable | Qué es | Dónde se consume |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | Measurement ID de GA4 (público) | `components/analytics/cookie-consent.tsx`, `lib/env.ts` |

**Dónde ponerla:** Vercel.

---

## 8. Vercel (hosting) — y variables de app propias

**Cuenta:** importa el proyecto en Vercel (este subproyecto tiene su propio
despliegue, ver `README.md`).

**Variables de app** (no son de un proveedor externo, pero hay que ponerlas):

| Variable | Qué es | Dónde se consume |
| --- | --- | --- |
| `APP_URL` | URL pública (server) para enlaces y callbacks | `lib/stripe/client.ts`, `lib/vapi/assistant.ts`, `lib/messaging/notify.ts` |
| `NEXT_PUBLIC_APP_URL` | URL pública (cliente); fallback de `APP_URL` | mismos usos como fallback |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin` (superadmin). **Fail-closed**: sin ella, nadie entra | `lib/admin/auth.ts` |
| `MOCK_PROVIDERS` | `"false"` para llamar a proveedores reales | `lib/env.ts` (define `env.mockProviders`) |
| `NODE_ENV` | La gestiona Vercel (`production` en el deploy) | `lib/env.ts` |

**Notas de despliegue:**
- Pon **`MOCK_PROVIDERS=false`** en producción o los adaptadores seguirán en
  modo mock (no se envía nada real).
- Ajusta `APP_URL` / `NEXT_PUBLIC_APP_URL` a tu dominio real: se usan para el
  `server.url` del webhook de Vapi, los enlaces del email al panel y las
  `success_url`/`cancel_url` de Stripe.
- Define `ADMIN_PASSWORD` o no podrás entrar en `/admin`.

---

## Discrepancias detectadas (código vs `.env.example`)

**Variables en `.env.example` (y en `lib/env.ts`) SIN consumidor en el código:**
- **`WHATSAPP_VERIFY_TOKEN`** — declarada en `.env.example` y en el schema de
  `lib/env.ts`, pero **no se usa en ninguna parte** de `app/` ni `lib/`. Está
  reservada para cuando se implemente el webhook entrante de Meta (handshake +
  firma `X-Hub-Signature-256`), que hoy **no existe**. No hace falta
  configurarla para lanzar.

**Variables consumidas en el código que NO están en `.env.example`:**
- Ninguna. Todas las variables leídas por el código (`process.env.*` / `env.*`)
  están documentadas en `.env.example`.

**Otras observaciones:**
- Las columnas `cal_api_key` y `cal_event_type_id` de `business_integrations`
  (migración `003`) existen en el esquema pero **no tienen ningún lector** en el
  código: el agendado automático por API de Cal.com no está implementado. Solo
  se usa `businesses.cal_link` (enlace manual enviado por WhatsApp).
- No hay migración `001`: el estado base vive en `schema.sql`. Aplica
  `schema.sql` primero y luego `002` y `003`.

---

## Orden recomendado de puesta en marcha

1. **Supabase**: crear proyecto → `schema.sql` → `002` → `003`. Copiar las 3
   keys a Vercel. Configurar Redirect URLs de Auth.
2. **Vercel**: importar proyecto, poner las 3 de Supabase, `APP_URL` /
   `NEXT_PUBLIC_APP_URL` (dominio real), `ADMIN_PASSWORD`, y `MOCK_PROVIDERS=false`.
3. **Stripe**: crear 3 Prices → copiar los 3 price IDs y `STRIPE_SECRET_KEY` →
   crear webhook a `/api/webhooks/stripe` → copiar `STRIPE_WEBHOOK_SECRET`.
4. **Vapi**: `VAPI_API_KEY` + elegir `VAPI_WEBHOOK_SECRET`. Gestionar el número
   entrante y guardar `telefono_entrante`.
5. **Meta/WhatsApp**: `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID`; crear y
   **aprobar** las plantillas `curro_confirmacion_cliente` y `curro_aviso_lead`
   (idioma `es`).
6. **Resend**: verificar dominio → `RESEND_API_KEY` + `EMAIL_FROM`.
7. **Cal.com** (opcional): crear enlace de reserva y pegarlo en Ajustes de cada
   negocio (`cal_link`).
8. **GA4** (opcional): `NEXT_PUBLIC_GA_ID`.
9. Redeploy en Vercel para aplicar variables. Verificar que `/admin` entra y que
   un checkout de prueba activa el negocio y crea el assistant.
