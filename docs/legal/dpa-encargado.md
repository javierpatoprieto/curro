# Contrato de Encargado del Tratamiento (Art. 28 RGPD)

> ⚠️ **BORRADOR — requiere revisión de un abogado/DPO antes de publicar/firmar.**
> Este documento es una propuesta técnica redactada a partir del funcionamiento real
> del servicio (ver referencias a código `fichero:línea`). No constituye asesoramiento
> jurídico. Debe validarse y adaptarse antes de incorporarlo a los Términos o de
> ponerlo a disposición de los clientes.

---

## Naturaleza de este documento

Este Contrato de Encargado del Tratamiento (en adelante, el «**DPA**» o el «**Acuerdo**»)
está pensado para **incorporarse como Anexo a las Condiciones de contratación** de Curro
y **aceptarse en el momento del alta** (aceptación electrónica de los Términos), sin
necesidad de firma manuscrita individualizada. La referencia a esta posibilidad ya existe
en las Condiciones de contratación (`app/(legal)/condiciones/page.tsx:72-83`), que
reconocen que respecto de los datos de las personas que llaman «el Cliente es responsable
del tratamiento y Curro actúa como encargado».

La aceptación de los Términos en el alta se considera formalización del presente Acuerdo
a los efectos del art. 28.3 RGPD («por contrato u otro acto jurídico con arreglo al
Derecho de la Unión o de los Estados miembros»).

---

## 1. Partes

- **Responsable del tratamiento** (en adelante, el «**Responsable**» o el «**Cliente**»):
  el autónomo, empresa o profesional que contrata el servicio Curro y en cuyo nombre se
  atienden las llamadas. Sus datos identificativos son los facilitados en el alta.
- **Encargado del tratamiento** (en adelante, el «**Encargado**» o «**Curro**»):
  **Javier Pato Prieto**, NIF **71449969D**, con domicilio en Calle Los Remedios 64F,
  39527 Liandres (Cantabria), España. Correo de contacto: **hola@soycurro.es**.
  (Datos coincidentes con el Aviso legal, `app/(legal)/aviso-legal/page.tsx:19-33`.)

> **Delimitación de roles (a decidir/confirmar por el abogado).** Este DPA regula
> **únicamente** el tratamiento en el que Curro actúa como **encargado**: los datos de
> las **personas que llaman** a los negocios clientes (tratamiento «B» del RAT). Respecto
> de los datos de los **suscriptores** (cuenta, facturación), Curro es **responsable**
> independiente y ese tratamiento se rige por la Política de privacidad, no por este DPA.

---

## 2. Objeto, duración, naturaleza y finalidad del tratamiento

### 2.1 Objeto y naturaleza
El Encargado tratará datos personales por cuenta del Responsable con el único fin de
**prestar el servicio de recepcionista virtual con IA**: atender las llamadas entrantes
del negocio del Responsable, presentarse e informar de la grabación, **grabar y
transcribir** la conversación, cualificar a quien llama, **extraer los datos del lead**
(nombre, teléfono, tipo de trabajo, zona, urgencia), opcionalmente **agendar una visita**
y **notificar el lead** al Responsable y una confirmación a quien ha llamado.

Descripción técnica del tratamiento en el Apéndice I.

### 2.2 Finalidad
La finalidad es exclusivamente la ejecución del servicio contratado, conforme a las
instrucciones del Responsable. El Encargado **no** tratará los datos para finalidades
propias.

### 2.3 Duración
El Acuerdo despliega sus efectos mientras esté vigente la relación contractual (la
suscripción). A su terminación se aplica la cláusula 4.9 (supresión o devolución).

---

## 3. Tipos de datos personales y categorías de interesados

### 3.1 Categorías de interesados
- **Personas que llaman** al negocio del Responsable (clientes potenciales / «leads» del
  Responsable). También, en su caso, terceros mencionados durante la llamada.

### 3.2 Categorías de datos personales
Con base en la estructura real de datos (`supabase/schema.sql:91-105`, tabla `leads`, y
el esquema de extracción estructurada en `lib/vapi/assistant.ts:212-228`):

- **Datos identificativos y de contacto:** nombre (`cliente_nombre`), teléfono
  (`cliente_telefono`), y —cuando se agenda visita— **email** de la persona que llama
  (`lib/vapi/assistant.ts:176-186`).
- **Datos de la solicitud:** tipo de trabajo (`tipo_trabajo`), zona/dirección aproximada
  (`zona`), urgencia (`urgencia`).
- **Grabación de voz** de la llamada (`leads.audio_url`, `supabase/schema.sql:101`) y
  **transcripción** literal de la conversación (`leads.transcripcion`,
  `supabase/schema.sql:100`).
- **Metadatos de la llamada:** identificador de llamada, duración, coste estimado y el
  `raw_payload` bruto remitido por el proveedor de voz (`supabase/schema.sql:138-147`).
- **Contenido de las comunicaciones** de confirmación/aviso enviadas (WhatsApp/email),
  registradas en `messages` (`supabase/schema.sql:119-130`).

> ⚠️ **Categorías especiales (Art. 9) — a decidir por el abogado.** El servicio **no
> persigue** recabar categorías especiales. Sin embargo, al tratarse de **conversación de
> voz libre**, la persona que llama podría mencionar datos de salud, afiliación u otros
> del art. 9. Además, la **grabación de voz** puede plantear la cuestión de un posible
> tratamiento de datos biométricos si en el futuro se usara para **identificación única**
> (no es el caso hoy: la voz se usa para transcribir, no para identificar). Debe
> valorarse una **EIPD/DPIA (Art. 35)** — ver `README.md`.

---

## 4. Obligaciones del Encargado (Art. 28.3)

### 4.1 Tratamiento solo según instrucciones documentadas [Art. 28.3.a]
El Encargado tratará los datos **únicamente siguiendo instrucciones documentadas** del
Responsable, incluidas las transferencias internacionales. Se consideran instrucciones
documentadas: (i) este Acuerdo, (ii) las Condiciones de contratación, (iii) la
configuración que el Responsable establece en su panel (guion del asistente, servicios,
zonas, canales de aviso, conexión de Cal.com), reflejada en la configuración del
assistant (`lib/vapi/assistant.ts:40-119`). Si el Encargado considera que una instrucción
infringe el RGPD o normativa de protección de datos, informará al Responsable.

### 4.2 Confidencialidad [Art. 28.3.b]
El Encargado garantiza que las personas autorizadas para tratar los datos se han
comprometido a respetar la **confidencialidad** o están sujetas a una obligación legal de
confidencialidad.

### 4.3 Seguridad [Art. 28.3.c y Art. 32]
El Encargado aplicará las **medidas técnicas y organizativas apropiadas** del Art. 32,
descritas en el Apéndice II (entre otras: aislamiento multi-tenant por `business_id` con
Row Level Security en la base de datos —`supabase/schema.sql:153-219`—, cifrado en
tránsito, verificación de secreto en los webhooks —`app/api/webhooks/vapi/route.ts:30-43`—
y rate limiting).

### 4.4 Subencargados [Art. 28.2 y 28.4]
El Responsable otorga al Encargado una **autorización general** para recurrir a otros
encargados (subencargados) para la prestación del servicio. La lista vigente figura en el
**Apéndice III** y en `docs/legal/subencargados.md`.

- El Encargado **informará** al Responsable de cualquier **alta o baja** prevista de
  subencargados con antelación razonable (p. ej. mediante aviso en el panel o por email),
  dando al Responsable la posibilidad de **oponerse** por motivos razonables relacionados
  con la protección de datos.
- Si el Responsable se opone y la objeción es fundada, las partes buscarán una solución;
  de no alcanzarse, el Responsable podrá **resolver** la parte del servicio afectada.
- El Encargado impondrá a cada subencargado, por contrato, **las mismas obligaciones de
  protección de datos** que las de este Acuerdo (art. 28.4) y responderá ante el
  Responsable del incumplimiento del subencargado.

> **A decidir por el abogado:** plazo concreto de preaviso de altas/bajas (propuesta:
> 30 días) y canal formal de notificación y de objeción.

### 4.5 Asistencia en los derechos de los interesados [Art. 28.3.e]
Teniendo en cuenta la naturaleza del tratamiento, el Encargado asistirá al Responsable,
mediante medidas técnicas y organizativas apropiadas, para que este pueda **atender las
solicitudes de ejercicio de derechos** de los interesados (acceso, rectificación,
supresión, oposición, limitación, portabilidad — Arts. 15-22). En la práctica, el
Responsable puede localizar, exportar, rectificar o eliminar los datos de un lead desde su
panel; el Encargado prestará apoyo cuando el ejercicio exija actuaciones que excedan de la
autoservicio. Si un interesado dirige una solicitud directamente al Encargado, este la
**trasladará sin demora** al Responsable y no responderá por su cuenta salvo instrucción.

### 4.6 Asistencia en seguridad, brechas y EIPD [Art. 28.3.f y Arts. 32-36]
El Encargado asistirá al Responsable en el cumplimiento de las obligaciones de los
Arts. 32 a 36, teniendo en cuenta la naturaleza del tratamiento y la información de que
disponga: seguridad (Art. 32), notificación de violaciones de seguridad (Arts. 33-34),
evaluación de impacto (Art. 35) y consulta previa (Art. 36).

### 4.7 Notificación de violaciones de seguridad [Art. 33.2]
El Encargado notificará al Responsable **sin dilación indebida** cualquier violación de la
seguridad de los datos de la que tenga conocimiento, proporcionando la información
necesaria para que el Responsable cumpla, en su caso, su deber de notificación a la AEPD
(72 h) y a los interesados.

> **A decidir por el abogado:** plazo interno del Encargado para notificar al Responsable
> (propuesta: **sin dilación indebida y en todo caso ≤ 48 h** desde el conocimiento).

### 4.8 Información y auditoría [Art. 28.3.h]
El Encargado pondrá a disposición del Responsable **toda la información necesaria** para
demostrar el cumplimiento de las obligaciones del Art. 28 y permitirá y contribuirá a la
realización de **auditorías**, incluidas inspecciones, por el Responsable o un auditor
mandatado por él.

> **A decidir por el abogado:** condiciones razonables (preaviso, confidencialidad,
> frecuencia máxima anual salvo incidente, y posibilidad de sustituir la auditoría in situ
> por informes/certificaciones de terceros —p. ej. de los subencargados— para no
> comprometer la seguridad de otros clientes en un entorno multi-tenant).

### 4.9 Supresión o devolución al final del contrato [Art. 28.3.g]
A elección del Responsable, al terminar la prestación el Encargado **suprimirá o
devolverá** todos los datos personales y eliminará las copias existentes, salvo que el
Derecho de la Unión o nacional exija su conservación. Los plazos de supresión operativos
figuran en `docs/legal/politica-retencion.md`.

> **A decidir por el abogado:** ventana de gracia para la exportación/devolución antes del
> borrado definitivo (propuesta: **30 días** tras la baja), y formato de devolución.

---

## 5. Obligaciones del Responsable

- Garantizar que existe una **base jurídica** para el tratamiento y que se ha **informado
  a los interesados** (personas que llaman) del tratamiento y de la grabación. Esta
  obligación ya figura en las Condiciones (`app/(legal)/condiciones/page.tsx:56-62`) y se
  refuerza con el **aviso de grabación** que el asistente emite al inicio de cada llamada
  (`lib/vapi/assistant.ts:72` y `:197`).
- Impartir instrucciones lícitas y mantener actualizada la configuración de su servicio.
- Atender, como responsable, las solicitudes de derechos de los interesados.

---

## 6. Transferencias internacionales [Cap. V RGPD]

La prestación del servicio implica que algunos subencargados tratan datos **fuera del
EEE** (principalmente EE. UU.). Dichas transferencias se amparan en:

- **Cláusulas Contractuales Tipo (SCC)** de la Decisión de Ejecución (UE) **2021/914** de
  la Comisión, en los módulos que correspondan; y/o
- la adhesión del importador al **EU-US Data Privacy Framework (DPF)**, cuando el proveedor
  esté certificado; complementadas, cuando proceda, con **medidas suplementarias**.

El detalle por proveedor (país y mecanismo) figura en el **Apéndice III** y en
`docs/legal/subencargados.md`.

> ⚠️ **A verificar por el abogado/DPO:** la **adhesión concreta y vigente al DPF** de cada
> proveedor (Vapi, Twilio, Resend, Stripe, Vercel, Google) y, en su defecto, la firma de
> SCC 2021/914 con el módulo correcto (responsable→encargado o encargado→subencargado) y
> la realización de un **Transfer Impact Assessment (TIA)**.

---

## 7. Responsabilidad y varios

Régimen de responsabilidad conforme al Art. 82 RGPD y a lo pactado en las Condiciones de
contratación. Legislación española y jurisdicción según las Condiciones. En caso de
conflicto entre este DPA y las Condiciones **en materia de protección de datos**,
prevalece este DPA.

---

# Apéndice I — Descripción del tratamiento

| Elemento | Detalle |
|---|---|
| **Objeto** | Recepción, grabación, transcripción y cualificación de llamadas entrantes, y aviso de leads, por cuenta del Responsable. |
| **Duración** | Vigencia de la suscripción + plazos de supresión (Apéndice de retención). |
| **Naturaleza y finalidad** | Prestación del servicio de recepcionista virtual con IA; sin finalidades propias del Encargado. |
| **Tipo de datos** | Identificativos y de contacto (nombre, teléfono, email si se agenda), datos de la solicitud (tipo de trabajo, zona, urgencia), **grabación de voz**, **transcripción**, metadatos de llamada, contenido de las notificaciones. |
| **Categorías de interesados** | Personas que llaman al negocio del Responsable; terceros mencionados en la llamada. |
| **Operaciones** | Recepción de llamada, aviso de grabación, grabación, transcripción (STT), procesamiento por LLM, síntesis de voz (TTS), extracción estructurada de datos, almacenamiento, notificación (WhatsApp/email), agendado opcional (Cal.com), y supresión/purga. |

Flujo técnico resumido: la llamada la orquesta el proveedor de voz (Vapi) con su
subcadena (LLM GPT-4o, STT Deepgram, TTS ElevenLabs — `lib/vapi/assistant.ts:200-211`); al
colgar, Vapi envía un *end-of-call-report* al webhook
(`app/api/webhooks/vapi/route.ts:23-68`), que persiste el lead y el evento de llamada en
Supabase y dispara las notificaciones (`app/api/webhooks/vapi/route.ts:101-154`).

---

# Apéndice II — Medidas de seguridad (Art. 32)

- **Aislamiento multi-tenant** por `business_id` con **Row Level Security** en PostgreSQL;
  un negocio nunca accede a datos de otro (`supabase/schema.sql:153-219`). Las escrituras
  de sistema usan `service_role` y filtran por `business_id` en código.
- **Cifrado en tránsito** (HTTPS/TLS) en todas las integraciones y APIs de proveedores.
- **Cifrado en reposo** a nivel de proveedor gestionado (Supabase/Postgres, almacenamiento
  de audio del proveedor de voz). *(A confirmar el alcance con cada proveedor.)*
- **Autenticación y control de acceso:** auth gestionada por Supabase; panel del cliente
  restringido a los `owners` del negocio; área `/admin` protegida con secreto de sesión
  (`lib/env.ts:69-73`).
- **Verificación de webhooks:** secreto compartido comprobado en cada webhook de voz
  (`app/api/webhooks/vapi/route.ts:30-43`); en producción es obligatorio.
- **Rate limiting** de los endpoints públicos (`app/api/webhooks/vapi/route.ts:24-25`),
  con backend durable opcional (Upstash Redis).
- **Idempotencia** para no duplicar tratamientos de una misma llamada
  (`app/api/webhooks/vapi/route.ts:84-92`).
- **Minimización:** extracción estructurada solo de los campos necesarios del lead
  (`lib/vapi/assistant.ts:212-228`).
- **Registro de comunicaciones** enviadas para trazabilidad (`messages`,
  `supabase/schema.sql:119-130`).

> **A decidir/reforzar por el abogado/DPO (pendientes de implementación):** política de
> **retención automatizada** (purga de audio a 30 días, no conservar `raw_payload` íntegro),
> registro de accesos/auditoría con PII ≤ 90 días, y política formal de gestión de
> incidentes. Ver `docs/legal/politica-retencion.md`.

---

# Apéndice III — Lista de subencargados

Lista maestra y detallada (finalidad, datos, país, mecanismo de transferencia, enlaces) en
**`docs/legal/subencargados.md`**. Resumen:

| Subencargado | Finalidad | País | Transferencia |
|---|---|---|---|
| **Vapi** (+ subcadena) | Orquestación de la llamada de voz IA | EE. UU. | SCC / DPF |
| ↳ OpenAI (GPT-4o) | Modelo de lenguaje del guion | EE. UU. | SCC / DPF |
| ↳ Deepgram | Transcripción de voz a texto (STT) | EE. UU. | SCC / DPF |
| ↳ ElevenLabs | Síntesis de voz (TTS) | EE. UU. | SCC / DPF |
| **Twilio** | WhatsApp y telefonía | EE. UU. / Irlanda | SCC / DPF |
| **Supabase** | Base de datos y autenticación | UE (eu-west-1) | Sin transferencia (UE) |
| **Resend** | Envío de email | EE. UU. | SCC / DPF |
| **Cal.com** | Agendado de visitas (opcional) | EE. UU. / UE | SCC |
| **Stripe** | Pagos y facturación | EE. UU. / Irlanda | SCC / DPF |
| **Vercel** | Hosting y logs | EE. UU. | SCC / DPF |

> Nota: **Meta (WhatsApp Cloud API)** es una vía alternativa a Twilio para WhatsApp
> (`lib/messaging/whatsapp.ts:186-195`); si se usa, debe añadirse a esta lista.
> **Google Analytics** solo aplica al tratamiento «C» (analítica web, con consentimiento),
> no a este DPA.
