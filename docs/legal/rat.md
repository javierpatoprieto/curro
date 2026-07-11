# Registro de Actividades de Tratamiento (Art. 30 RGPD)

> ⚠️ **BORRADOR — requiere revisión de un abogado/DPO antes de publicar/firmar.**
> Documento fundamentado en el funcionamiento real del servicio (referencias
> `fichero:línea`). No es asesoramiento jurídico.

---

## Datos del responsable / encargado

- **Titular:** Javier Pato Prieto — NIF **71449969D**
- **Domicilio:** Calle Los Remedios 64F, 39527 Liandres (Cantabria), España
- **Contacto:** hola@soycurro.es
- **Servicio:** Curro — recepcionista virtual con IA para empresas de reformas y
  multiservicios del hogar.

Curro figura en el RAT con **dos roles** según el tratamiento:
- Como **Responsable** (Art. 30.1) en los tratamientos **A** (suscriptores) y **C**
  (analítica web).
- Como **Encargado** (Art. 30.2) en el tratamiento **B** (servicio de recepcionista por
  cuenta del negocio cliente).

> **Nota (a confirmar por el abogado):** el Art. 30.5 exime del registro a organizaciones
> de <250 empleados salvo que el tratamiento no sea ocasional, entrañe riesgo o incluya
> categorías especiales. Dado que el tratamiento **B** es **sistemático y continuado** y
> maneja voz (posible riesgo art. 9), procede mantener y documentar este RAT.

---

## Tratamiento A — Gestión de suscriptores y facturación

| Campo (Art. 30.1) | Contenido |
|---|---|
| **Rol de Curro** | **Responsable del tratamiento.** |
| **Fines** | Alta y gestión de la cuenta del suscriptor, prestación y soporte del servicio contratado, gestión de la suscripción, cobros, facturación y contabilidad, y comunicaciones con el cliente. |
| **Base jurídica** | **Ejecución de contrato** (Art. 6.1.b) para la relación de servicio; **obligación legal** (Art. 6.1.c) para facturación/contabilidad y fiscal; **interés legítimo** (Art. 6.1.f) para seguridad, prevención de fraude y mejora del servicio. |
| **Categorías de interesados** | Suscriptores (autónomos/empresas) y sus usuarios (`owners`). |
| **Categorías de datos** | Datos del negocio: nombre, ciudad, teléfono entrante, plan, IDs de Stripe (tabla `businesses` en `supabase/schema.sql`). Datos de usuario: nombre, email, WhatsApp, rol, `user_id` de auth (tabla `owners` en `supabase/schema.sql`). Datos de pago tokenizados en Stripe. Datos de uso/facturación. |
| **Destinatarios / encargados** | **Stripe** (pagos/facturación), **Supabase** (BD y auth), **Resend** (email transaccional), **Vercel** (hosting/logs). |
| **Transferencias internac.** | Stripe (EE. UU./Irlanda · SCC/DPF), Resend (EE. UU. · SCC/DPF), Vercel (EE. UU. · SCC/DPF). Supabase en UE (eu-west-1), sin transferencia. |
| **Plazos de supresión** | Datos de cuenta: durante la relación **+ 5 años** (prescripción de acciones). Datos de **facturación: 6 años** (Código de Comercio) y los plazos fiscales aplicables. Logs con PII: **≤ 90 días**. *(Configurable — ver política de retención.)* |
| **Medidas de seguridad** | RLS multi-tenant (políticas RLS en `supabase/schema.sql`), auth Supabase, `/admin` con secreto de sesión (`ADMIN_SESSION_SECRET` en `lib/env.ts`), TLS, cifrado en reposo del proveedor. |

---

## Tratamiento B — Servicio de recepcionista IA (recepción, grabación, transcripción de llamadas y aviso de leads)

| Campo (Art. 30.2, encargado) | Contenido |
|---|---|
| **Rol de Curro** | **Encargado del tratamiento**, por cuenta del **negocio cliente (Responsable)**. Regulado por el DPA (`docs/legal/dpa-encargado.md`). |
| **Responsable** | El autónomo/negocio que contrata Curro y en cuyo nombre se atienden las llamadas. |
| **Fines (por cuenta del responsable)** | Atender la llamada cuando el dueño no puede, informar de la grabación, **grabar y transcribir** la conversación, cualificar a quien llama, **extraer los datos del lead**, agendar visita (opcional) y **notificar el lead** al negocio y una confirmación a quien llamó. |
| **Base jurídica** | La determina el **Responsable** (negocio cliente); típicamente **interés legítimo** (Art. 6.1.f) para atender y trasladar la solicitud de presupuesto, y en su caso medidas precontractuales (Art. 6.1.b). La **información de la grabación** al interlocutor se emite al inicio de la llamada (`lib/vapi/assistant.ts`, guion en `guion()` y `firstMessage` de `buildAssistantConfig()`). *(Base y, si aplica, consentimiento de grabación: a fijar por el Responsable / a revisar por el abogado.)* |
| **Categorías de interesados** | **Personas que llaman** al negocio (leads); terceros mencionados durante la llamada. |
| **Categorías de datos** | Nombre (`leads.cliente_nombre`), teléfono (`leads.cliente_telefono`), tipo de trabajo, zona, urgencia (tabla `leads` en `supabase/schema.sql`; esquema de extracción en `buildAssistantConfig()` de `lib/vapi/assistant.ts`); **email** si se agenda visita (`agendarVisita` en `lib/vapi/assistant.ts`); **grabación de voz** (`leads.audio_url`) y **transcripción** (`leads.transcripcion`); metadatos e integridad de la llamada (`call_events.raw_payload`, duración, coste — tabla `call_events` en `supabase/schema.sql`); **metadatos del envío** de las notificaciones (canal, plantilla, estado), **sin el cuerpo del mensaje ni el destinatario** (`messages.payload`, tabla `messages` en `supabase/schema.sql`; ver `resumenEnvio` en `lib/messaging/whatsapp.ts` y `resumenEnvioEmail` en `lib/messaging/email.ts`). |
| **Posibles cat. especiales (Art. 9)** | No se persiguen, pero la **voz libre** puede contener datos del art. 9 mencionados por el interesado; la grabación de voz podría plantear cuestión biométrica si se usara para identificación (no es el caso). **Valorar EIPD (Art. 35).** |
| **Destinatarios / subencargados** | **Vapi** (voz IA), con **subprocesadores declarados por nuestra configuración** —**OpenAI/GPT-4o**, **Deepgram/STT**, **ElevenLabs/TTS**— *(confirmar con la lista de subprocesadores de Vapi)*; **Twilio** (WhatsApp/telefonía) —o **Meta (WhatsApp Cloud API)** como alternativa (`getWhatsAppClient` en `lib/messaging/whatsapp.ts`)—; **Resend** (email de aviso); **Cal.com** (agendado, opcional); **Supabase** (almacenamiento); **Vercel** (hosting/logs). Además, los **owners** del negocio reciben el lead. |
| **Transferencias internac.** | Vapi y subcadena, Twilio, Meta, Resend, Cal.com, Vercel → EE. UU. (y UE/Irlanda en algunos) · **SCC 2021/914 / DPF**. Supabase en UE. Detalle en `docs/legal/subencargados.md`. |
| **Plazos de supresión** | **Grabación de audio: 30 días.** **Transcripción + datos del lead: 12 meses** (o hasta que el cliente los borre). **`raw_payload`: no se guarda el JSON crudo** — el campo solo lleva metadatos; se purga a **30 días** por defensa en profundidad. Retención **implementada** (`lib/rgpd/retencion-job.ts`; cron en `vercel.json`); pendiente solo activar `CRON_SECRET` en Vercel. *(Plazos configurables — ver política de retención.)* |
| **Medidas de seguridad** | RLS por `business_id` (`supabase/schema.sql`, políticas RLS en las tablas), verificación de secreto del webhook (`app/api/webhooks/vapi/route.ts`), rate limiting, idempotencia, TLS y **purga automatizada de retención** (`lib/rgpd/retencion-job.ts`). Ver Apéndice II del DPA. |

---

## Tratamiento C — Analítica web

| Campo (Art. 30.1) | Contenido |
|---|---|
| **Rol de Curro** | **Responsable del tratamiento.** |
| **Fines** | Medición de audiencia y análisis de uso del sitio web para mejorar el producto. |
| **Base jurídica** | **Consentimiento** (Art. 6.1.a) del visitante, recabado mediante banner de cookies. GA4 solo se carga si hay consentimiento y si está configurado el ID (`NEXT_PUBLIC_GA_ID` en `lib/env.ts`). |
| **Categorías de interesados** | Visitantes del sitio web. |
| **Categorías de datos** | Identificadores online (cookies/ID de dispositivo), IP, datos de navegación y uso proporcionados por Google Analytics 4. |
| **Destinatarios / encargados** | **Google (Analytics 4)**; **Vercel** (hosting/logs). |
| **Transferencias internac.** | Google (EE. UU. · DPF *(a verificar)*). Vercel (EE. UU. · SCC/DPF). |
| **Plazos de supresión** | Según la retención configurada en GA4 (**propuesta: 14 meses**) y hasta la retirada del consentimiento. *(A fijar por el abogado.)* |
| **Medidas de seguridad (Art. 30.1.g)** | Carga de GA4 **condicionada al consentimiento** (banner de cookies); **anonimización de IP** y ajustes de retención en la configuración de GA4; transporte cifrado (HTTPS). Los datos los trata **Google como encargado** bajo sus *Data Processing Terms* de Google Analytics, que incorporan las medidas de seguridad de Google. Gestión y revocación de cookies desde el banner. |

---

## Puntos abiertos para el abogado/DPO

- Confirmar **base jurídica y necesidad de consentimiento** para la **grabación de voz**
  (tratamiento B), a determinar por cada Responsable cliente.
- Valorar **EIPD/DPIA (Art. 35)** para el tratamiento B (tratamiento sistemático de voz;
  posible art. 9).
- Confirmar los **plazos de retención** definitivos. La **implementación técnica ya existe**
  (job `ejecutarRetencion` en `lib/rgpd/retencion-job.ts` y cron diario declarado en
  `vercel.json`); solo resta **activarla en Vercel** (definir `CRON_SECRET`) y confirmar el
  borrado del audio en Vapi — ver `docs/legal/politica-retencion.md`.
- Verificar la **adhesión al DPF** vigente de cada proveedor o, en su defecto, SCC + TIA.
- Decidir si procede designar **DPD (Art. 37)**.
