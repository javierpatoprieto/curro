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
| **Categorías de datos** | Datos del negocio: nombre, ciudad, teléfono entrante, plan, IDs de Stripe (`businesses` — `supabase/schema.sql:51-64`). Datos de usuario: nombre, email, WhatsApp, rol, `user_id` de auth (`owners` — `supabase/schema.sql:74-83`). Datos de pago tokenizados en Stripe. Datos de uso/facturación. |
| **Destinatarios / encargados** | **Stripe** (pagos/facturación), **Supabase** (BD y auth), **Resend** (email transaccional), **Vercel** (hosting/logs). |
| **Transferencias internac.** | Stripe (EE. UU./Irlanda · SCC/DPF), Resend (EE. UU. · SCC/DPF), Vercel (EE. UU. · SCC/DPF). Supabase en UE (eu-west-1), sin transferencia. |
| **Plazos de supresión** | Datos de cuenta: durante la relación **+ 5 años** (prescripción de acciones). Datos de **facturación: 6 años** (Código de Comercio) y los plazos fiscales aplicables. Logs con PII: **≤ 90 días**. *(Configurable — ver política de retención.)* |
| **Medidas de seguridad** | RLS multi-tenant (`supabase/schema.sql:153-219`), auth Supabase, `/admin` con secreto de sesión (`lib/env.ts:69-73`), TLS, cifrado en reposo del proveedor. |

---

## Tratamiento B — Servicio de recepcionista IA (recepción, grabación, transcripción de llamadas y aviso de leads)

| Campo (Art. 30.2, encargado) | Contenido |
|---|---|
| **Rol de Curro** | **Encargado del tratamiento**, por cuenta del **negocio cliente (Responsable)**. Regulado por el DPA (`docs/legal/dpa-encargado.md`). |
| **Responsable** | El autónomo/negocio que contrata Curro y en cuyo nombre se atienden las llamadas. |
| **Fines (por cuenta del responsable)** | Atender la llamada cuando el dueño no puede, informar de la grabación, **grabar y transcribir** la conversación, cualificar a quien llama, **extraer los datos del lead**, agendar visita (opcional) y **notificar el lead** al negocio y una confirmación a quien llamó. |
| **Base jurídica** | La determina el **Responsable** (negocio cliente); típicamente **interés legítimo** (Art. 6.1.f) para atender y trasladar la solicitud de presupuesto, y en su caso medidas precontractuales (Art. 6.1.b). La **información de la grabación** al interlocutor se emite al inicio de la llamada (`lib/vapi/assistant.ts:72`, `:197`). *(Base y, si aplica, consentimiento de grabación: a fijar por el Responsable / a revisar por el abogado.)* |
| **Categorías de interesados** | **Personas que llaman** al negocio (leads); terceros mencionados durante la llamada. |
| **Categorías de datos** | Nombre (`cliente_nombre`), teléfono (`cliente_telefono`), tipo de trabajo, zona, urgencia (`leads` — `supabase/schema.sql:91-105`; esquema de extracción — `lib/vapi/assistant.ts:212-228`); **email** si se agenda visita (`lib/vapi/assistant.ts:176-186`); **grabación de voz** (`leads.audio_url`) y **transcripción** (`leads.transcripcion`); metadatos e integridad de la llamada (`call_events.raw_payload`, duración, coste — `supabase/schema.sql:138-147`); contenido de las notificaciones (`messages` — `supabase/schema.sql:119-130`). |
| **Posibles cat. especiales (Art. 9)** | No se persiguen, pero la **voz libre** puede contener datos del art. 9 mencionados por el interesado; la grabación de voz podría plantear cuestión biométrica si se usara para identificación (no es el caso). **Valorar EIPD (Art. 35).** |
| **Destinatarios / subencargados** | **Vapi** (voz IA) con subcadena **OpenAI/GPT-4o**, **Deepgram/STT**, **ElevenLabs/TTS**; **Twilio** (WhatsApp/telefonía) —o **Meta** como alternativa (`lib/messaging/whatsapp.ts:186-195`)—; **Resend** (email de aviso); **Cal.com** (agendado, opcional); **Supabase** (almacenamiento); **Vercel** (hosting/logs). Además, los **owners** del negocio reciben el lead. |
| **Transferencias internac.** | Vapi y subcadena, Twilio, Resend, Cal.com, Vercel → EE. UU. (y UE/Irlanda en algunos) · **SCC 2021/914 / DPF**. Supabase en UE. Detalle en `docs/legal/subencargados.md`. |
| **Plazos de supresión** | **Grabación de audio: 30 días.** **Transcripción + datos del lead: 12 meses** (o hasta que el cliente los borre). **`raw_payload` íntegro: NO se conserva** — solo metadatos; purga a **30 días**. *(Configurable — ver política de retención.)* |
| **Medidas de seguridad** | RLS por `business_id` (`supabase/schema.sql:153-219`), verificación de secreto del webhook (`app/api/webhooks/vapi/route.ts:30-43`), rate limiting e idempotencia (`:24-25`, `:84-92`), TLS. Ver Apéndice II del DPA. |

---

## Tratamiento C — Analítica web

| Campo (Art. 30.1) | Contenido |
|---|---|
| **Rol de Curro** | **Responsable del tratamiento.** |
| **Fines** | Medición de audiencia y análisis de uso del sitio web para mejorar el producto. |
| **Base jurídica** | **Consentimiento** (Art. 6.1.a) del visitante, recabado mediante banner de cookies; GA4 solo se carga si hay consentimiento y si está configurado el ID (`lib/env.ts:61-63`). |
| **Categorías de interesados** | Visitantes del sitio web. |
| **Categorías de datos** | Identificadores online (cookies/ID de dispositivo), IP, datos de navegación y uso proporcionados por Google Analytics 4. |
| **Destinatarios / encargados** | **Google (Analytics 4)**; **Vercel** (hosting/logs). |
| **Transferencias internac.** | Google (EE. UU. · DPF). Vercel (EE. UU. · SCC/DPF). |
| **Plazos de supresión** | Según la retención configurada en GA4 (**propuesta: 14 meses**) y hasta la retirada del consentimiento. *(A fijar por el abogado.)* |
| **Medidas de seguridad** | Carga condicionada a consentimiento, anonimización/ajustes de GA4 recomendados, gestión de cookies. |

---

## Puntos abiertos para el abogado/DPO

- Confirmar **base jurídica y necesidad de consentimiento** para la **grabación de voz**
  (tratamiento B), a determinar por cada Responsable cliente.
- Valorar **EIPD/DPIA (Art. 35)** para el tratamiento B (tratamiento sistemático de voz;
  posible art. 9).
- Confirmar **retenciones** definitivas y su **implementación técnica** (hoy no existe cron
  de purga — ver `docs/legal/politica-retencion.md`).
- Verificar la **adhesión al DPF** vigente de cada proveedor o, en su defecto, SCC + TIA.
- Decidir si procede designar **DPD (Art. 37)**.
