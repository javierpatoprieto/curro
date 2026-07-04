# Rediseño del onboarding de alta de clientes — Curro

- **Fecha:** 2026-07-04
- **Estado:** Diseño aprobado (pendiente de plan de implementación)
- **Autor:** Javier + Claude

## Objetivo

Que dar de alta un cliente nuevo sea **un flujo único desde el panel de admin** que
provisiona **todo** automáticamente (assistant de voz, teléfono, agenda, avisos) en
**<10 min y sin que Javier toque casi nada**. Es la tesis de crecimiento: el
onboarding no puede ser el cuello de botella.

## Estado actual (qué ya hace hoy)

- El alta (`app/admin/clientes/nuevo`) ya crea automáticamente: **assistant de Vapi**
  (guion personalizado + voz + tono), **negocio** (`businesses`) y **dueño**
  (`owners`, email + whatsapp).
- El guion (`lib/vapi/assistant.ts`) **ya se adapta** a con-Cal / sin-Cal.
- Editar el contacto del dueño post-alta está hecho en la rama
  `feat/editar-contacto-dueno` (`guardarContactoDueno` + `lib/owners/contacto`),
  **pendiente de merge** — es dependencia de este trabajo.

### Huecos que este rediseño cierra
1. El campo `cal_link` del alta es **decorativo**: no conecta la API de Cal
   (`business_integrations`) ni activa el agendado. El helper
   `lib/cal/integracion.ts::guardarCalIntegracion` **ya existe pero no está
   enchufado a ningún formulario**.
2. **No se aprovisiona número de teléfono** por cliente para recibir llamadas.
3. **No hay gating por plan** ni **medición de consumo** (minutos).

## Decisiones clave

- **Forma del onboarding:** wizard multi-paso + **aprovisionamiento asíncrono con
  checklist de estado** en la ficha del cliente (Enfoque 3). Lo que no es instantáneo
  (número, consentimiento del cliente) queda **visible y accionable**, no escondido.
- **Teléfono: dos modos** — (a) **desvío** del número propio del cliente hacia un
  número de Curro; (b) **número nuevo** aprovisionado y atado al assistant.
- **Agenda: API-key AHORA, OAuth+Platform DESPUÉS.** Cada cliente usa su **Cal.com
  gratis** (conecta su Google Calendar ahí y genera una API key + tipo de evento);
  coste para Curro **€0**. Se descarta de momento OAuth + Cal Platform porque cuesta
  **~€299/mes fijos** desde el cliente 1 (mata el margen a bajo volumen). Se migrará a
  OAuth cuando haya ~6+ clientes Pro que lo amorticen. La conexión de Cal se diseña
  como **interfaz** (`CalProvider`) para que ese cambio sea un swap contenido.
- **Planes gatean features y protegen el backend** (no se aprovisiona lo que el plan
  no paga).

## Modelo de costes (referencia, investigado 2026)

Fuentes: pricing oficial de Vapi, Twilio, Meta/WhatsApp, Cal.com, Resend.

- **Voz (Vapi todo incluido, español + ElevenLabs + telefonía): ~€0,25/min.** Es el
  **coste dominante** (~90%). Llamada de 2 min ≈ €0,50.
- WhatsApp aviso (categoría *utility*): **~€0,02/mensaje**. Email (Resend): **€0**
  hasta 3.000/mes. Número de teléfono: **~€1–6/mes** fijo por cliente.
- Agenda con **API-key**: **€0** para Curro (el cliente usa su Cal gratis).
- Agenda con **OAuth/Platform** (futuro): **~€299/mes fijos** + ~€0,55/booking.

## Planes y precios

| | **Starter — 49€** | **Pro — 99€** ⭐ | **Premium — 199€** |
|---|:--:|:--:|:--:|
| Minutos de voz/mes | ~75 (~35 llam.) | ~150 (~75 llam.) | ~450 (~225 llam.) |
| Recepción 24/7 + captura de lead | ✅ | ✅ | ✅ |
| Aviso al dueño (WhatsApp + email) | ✅ | ✅ | ✅ |
| Confirmación al cliente por WhatsApp | — | ✅ | ✅ |
| Agenda automática (Cal.com, API-key) | — | ✅ | ✅ |
| Teléfono: desvío del número propio | ✅ | ✅ | ✅ |
| Número nuevo dedicado | — | ✅ | ✅ |
| Multi-número / multi-sucursal | — | — | ✅ |

- **Add-on de minutos:** +50 min por +20€/mes. **Overage:** ~€0,40/min sin add-on.
- **Trial:** gratis 7 días, features Pro, ~30 min.
- **Ancla comercial: Pro** (marcar "Más popular"). Starter es el gancho de entrada.

## El wizard (pasos)

Admin-driven (lo rellena Javier). Validación por paso.

1. **Negocio** — nombre, ciudad, tipo de empresa, servicios, zonas, horario, FAQ,
   preguntas clave.
2. **Plan** — Starter / Pro / Premium (+ add-ons). Gatea los pasos siguientes.
3. **Voz & tono** — voz (F/M), tono (cercano/profesional/comercial).
4. **Capacidades** (gated por plan) — casillas: ☑ Agenda automática (Cal), ☑
   Confirmación al cliente por WhatsApp. El aviso al dueño va **siempre**. Si el plan
   no incluye una, sale bloqueada con "disponible en Pro".
5. **Teléfono** (gated) — desvío del número propio (muestra el número Curro al que
   desviar + instrucciones) **o** número nuevo aprovisionado.
6. **Contacto del dueño** — email, WhatsApp (avisos).
7. **Revisar & Crear** — resumen → botón Crear.

## Aprovisionamiento al pulsar «Crear»

- **Síncrono:** crear `businesses` + `owners` + **assistant de Vapi**. Si falla el
  assistant, abortar (no dejar el negocio a medias) — como hoy.
- **Asíncrono** (no bloquea): número de teléfono, agenda (requiere la API-key del
  cliente), avisos.
- Redirige a la ficha del cliente con un **checklist de onboarding** que refleja el
  estado de cada pieza (pendiente / listo / error), poniéndose en verde sola.

## Feature matrix (entitlements)

Config en código (`lib/plans.ts`): mapa `plan → { minutos, agenda, confirmacionCliente,
numeroDedicado, multiNumero, addonsMax }`. Se usa **en el wizard** (habilitar/bloquear)
**y en el backend** (rechazar aprovisionar lo no incluido).

## Conexión de agenda (API-key)

- Paso/acción que capta `cal_api_key` + `cal_event_type_id` → `guardarCalIntegracion`.
  `calConectado` se deriva de la presencia de ambos. El guion ya adapta.
- Interfaz `CalProvider` (`apiKey` | `oauth`) para el swap futuro a Platform.

## Teléfono (dos modos)

- **Desvío:** el cliente configura en su operadora un desvío condicional a un número
  Curro. Guardar `phone_mode='forward'` + el número de destino Curro asignado.
- **Número nuevo:** aprovisionar un número (Twilio/Vapi API) y atarlo al
  `vapi_assistant_id`. Guardar `phone_mode='new'` + identificadores.

## Medición de minutos y límites

- Sumar `duracionSeg` por `business` por mes (ya se parsea en `lib/vapi/parser.ts`;
  vive en `call_events`/`leads`). Vista de consumo en la ficha.
- Enforcement: aviso al acercarse al límite → overage o upsell. (Fase 3.)

## Cambios de modelo de datos (borrador)

- `businesses`: añadir `phone_mode` (`forward` | `new` | `none`), `forward_target`
  (número Curro de destino), `vapi_phone_number_id` (si número nuevo),
  `onboarding_status` (jsonb: estado por pieza).
- `business_integrations`: ya tiene `cal_api_key`, `cal_event_type_id` (sin cambios).
- Config de planes: en código, no en BD (más fácil de versionar).
- Consumo: derivado de `call_events` (sin tabla nueva al principio).

## Fases de construcción

1. **Config de planes** (matriz + límites) · **wire agenda API-key** en alta/ficha ·
   **wizard** (reorganizar el form en pasos). (La edición de contacto del dueño ya
   está.)
2. **Teléfono** (2 modos) + **checklist async** en la ficha.
3. **Medición de minutos** + límites/overage + **add-ons** (Stripe).
4. *(escala)* Migración a **OAuth + Cal Platform**.

**Aparte:** actualizar la **landing/precios** públicos con los packs (49/99/199),
alineado con el spec `2026-07-01-rediseno-landing-curro-design.md`.

## Testing

- Unit: gating por plan (cliente + servidor), wiring de `guardarCalIntegracion`,
  validación por paso del wizard, adapter de aprovisionar número (mock), suma de
  minutos.
- E2E: alta por wizard → `businesses` + `owners` + assistant + `business_integrations`
  creados coherentemente.

## Fuera de alcance (ahora)

- OAuth + Cal Platform (Fase 4).
- Cobro real de overage/add-ons vía Stripe metered (parte de Fase 3).

## Preguntas abiertas

- Trial exacto (¿7 días? ¿tarjeta requerida?).
- Proveedor del número nuevo: Twilio directo vs import a Vapi.
- Add-on de minutos: nuevo price en Stripe.
