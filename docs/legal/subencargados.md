# Lista maestra de subencargados del tratamiento

> ⚠️ **BORRADOR — requiere revisión de un abogado/DPO antes de publicar/firmar.**
> Los mecanismos de transferencia (SCC/DPF) y los enlaces deben **verificarse** con cada
> proveedor antes de su publicación. No es asesoramiento jurídico.

Lista de terceros que Curro utiliza para prestar el servicio y que pueden tratar datos
personales por cuenta de los Responsables (Art. 28 RGPD). Se corresponde con el Apéndice
III del DPA (`docs/legal/dpa-encargado.md`) y con los proveedores realmente integrados en
el código (`lib/env.ts`, `lib/vapi/assistant.ts`, `lib/messaging/*`, `lib/stripe/*`,
`lib/cal/*`).

## Cómo leer la tabla
- **Datos tratados:** categorías reales que llegan a cada proveedor.
- **País:** ubicación principal de tratamiento (a confirmar por proveedor/región).
- **Mecanismo de transferencia:** base para transferencias fuera del EEE (Cap. V RGPD).
- ⚠️ **Verificar la adhesión concreta y vigente al EU-US Data Privacy Framework (DPF)** de
  cada proveedor; en su defecto, **SCC 2021/914** con el módulo correcto + TIA.

---

## A. Subencargados del servicio de recepcionista IA (tratamiento B — Curro es encargado)

| Proveedor | Finalidad | Datos tratados | País | Mecanismo de transferencia | Política / DPA |
|---|---|---|---|---|---|
| **Vapi** | Orquestación de la llamada de voz IA (recepción, control del flujo) — `crearAssistant`/`buildAssistantConfig` en `lib/vapi/assistant.ts` | Audio de la llamada, transcripción, metadatos, datos del lead | EE. UU. | SCC / DPF *(verificar)* | https://vapi.ai/privacy |
| ↳ **OpenAI** (GPT-4o) | Modelo de lenguaje que ejecuta el guion — `model` en `buildAssistantConfig` (`lib/vapi/assistant.ts`) | Transcripción/turnos de la conversación (texto) | EE. UU. | SCC / DPF · **subprocesador declarado por nuestra configuración; confirmar con la lista de subprocesadores de Vapi** | https://openai.com/policies/privacy-policy |
| ↳ **Deepgram** (nova-2) | Transcripción de voz a texto (STT) — `transcriber` en `buildAssistantConfig` (`lib/vapi/assistant.ts`) | Audio de la llamada | EE. UU. | SCC / DPF · **subprocesador declarado por nuestra configuración; confirmar con la lista de subprocesadores de Vapi** | https://deepgram.com/privacy |
| ↳ **ElevenLabs** (eleven_turbo_v2_5) | Síntesis de voz del asistente (TTS) — `voice` en `buildAssistantConfig` (`lib/vapi/assistant.ts`) | Texto a locutar (respuestas del asistente) | EE. UU. | SCC / DPF · **subprocesador declarado por nuestra configuración; confirmar con la lista de subprocesadores de Vapi** | https://elevenlabs.io/privacy |
| **Twilio** | Envío de WhatsApp y telefonía — `TwilioWhatsAppClient` en `lib/messaging/whatsapp.ts` | Teléfono, nombre y contenido del mensaje del lead/dueño | EE. UU. / Irlanda | SCC / DPF *(verificar)* | https://www.twilio.com/legal/privacy · DPA de Twilio |
| **Meta Platforms Ireland** (WhatsApp Cloud API) — *alternativa a Twilio* | Envío de WhatsApp — `RealWhatsAppClient` en `lib/messaging/whatsapp.ts` | Teléfono, nombre y contenido del mensaje | Irlanda / EE. UU. | SCC / DPF *(verificar)* | https://www.whatsapp.com/legal |
| **Resend** | Envío de email de aviso de lead al dueño — `RealEmailClient` en `lib/messaging/email.ts` | Email del dueño, nombre y resumen del lead | EE. UU. | SCC / DPF *(verificar)* | https://resend.com/legal/privacy-policy · DPA de Resend |
| **Cal.com** (opcional) | Agendado de la visita de valoración — `lib/cal/client.ts` | Nombre, email y teléfono del cliente, fecha/hora | EE. UU. / UE | SCC *(verificar)* | https://cal.com/privacy |
| **Supabase** | Base de datos (PostgreSQL) y autenticación — `supabase/schema.sql` | Todos los datos del lead, transcripción, `audio_url`, metadatos | **UE (eu-west-1)** | Sin transferencia (UE) | https://supabase.com/privacy · DPA de Supabase |
| **Vercel** | Hosting de la aplicación y logs — `lib/env.ts` | Metadatos de solicitud; posible PII en logs | EE. UU. | SCC / DPF *(verificar)* | https://vercel.com/legal/privacy-policy · DPA de Vercel |

---

## B. Encargados del tratamiento de suscriptores (tratamiento A — Curro es responsable)

| Proveedor | Finalidad | Datos tratados | País | Mecanismo de transferencia | Política / DPA |
|---|---|---|---|---|---|
| **Stripe** | Pagos, suscripciones y facturación — `lib/stripe/client.ts` | Datos de pago tokenizados, email, importe, IDs de cliente/suscripción (`businesses.stripe_*`) | EE. UU. / Irlanda | SCC / DPF *(verificar)* | https://stripe.com/privacy · DPA de Stripe |
| **Supabase** | BD y autenticación de cuentas (`businesses`, `owners`) | Datos de negocio y de usuarios (nombre, email, WhatsApp) | **UE (eu-west-1)** | Sin transferencia (UE) | https://supabase.com/privacy |
| **Resend** | Email transaccional a suscriptores | Email y contenido | EE. UU. | SCC / DPF *(verificar)* | https://resend.com/legal/privacy-policy |
| **Vercel** | Hosting y logs | Metadatos; posible PII en logs | EE. UU. | SCC / DPF *(verificar)* | https://vercel.com/legal/privacy-policy |

---

## C. Encargados de analítica web (tratamiento C — Curro es responsable, con consentimiento)

| Proveedor | Finalidad | Datos tratados | País | Mecanismo de transferencia | Política / DPA |
|---|---|---|---|---|---|
| **Google Analytics 4** | Analítica de audiencia del sitio web (solo con consentimiento) — `NEXT_PUBLIC_GA_ID` en `lib/env.ts` | Identificadores online, IP, datos de navegación | EE. UU. | DPF *(verificar)* | https://policies.google.com/privacy · Condiciones de tratamiento de datos de Google Ads/Analytics |

---

## Notas y pendientes (a decidir/verificar por el abogado/DPO)

- **Verificar** la certificación **DPF vigente** de Vapi, OpenAI, Deepgram, ElevenLabs,
  Twilio, Resend, Cal.com, Stripe, Vercel y Google; si alguno no está adherido, firmar
  **SCC 2021/914** (módulo responsable→encargado o encargado→subencargado, según el caso)
  y realizar **TIA**.
- **Confirmar la región real** de cada proveedor (algunos permiten elegir región UE, p. ej.
  OpenAI/Twilio/Cal.com); documentarlo para minimizar transferencias.
- **Subcadena de Vapi:** confirmar con Vapi la lista de subprocesadores real y su DPA (aquí
  se listan OpenAI, Deepgram y ElevenLabs por ser los configurados en
  `lib/vapi/assistant.ts`, pero Vapi podría usar otros).
- **Mantenimiento:** esta lista debe versionarse; las **altas/bajas** de subencargados se
  notifican al Responsable con derecho de objeción (DPA §4.4).
- **Enlaces:** revisar que cada URL de política/DPA sea la vigente antes de publicar.
