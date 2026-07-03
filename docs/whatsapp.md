# WhatsApp

Curro avisa al cliente y al dueño por WhatsApp cuando entra un lead. El **envío
ya está implementado** con una interfaz intercambiable (`lib/messaging/whatsapp.ts`):
soporta **Twilio** (elegido) o **Meta directo**, y cae a **mock** si no hay
credenciales o `MOCK_PROVIDERS` no es `false`.

## Flujo

```
Llamada → webhook Vapi → lead guardado → notificarNuevoLead():
   ├─ WhatsApp al CLIENTE   (confirmación + enlace Cal.com)
   └─ WhatsApp + email al DUEÑO (resumen del lead)
```

Selección de proveedor (en `getWhatsAppClient`): si `MOCK_PROVIDERS=false` y están
las envs de **Twilio** → Twilio; si no, si están las de **Meta** → Meta; si no → mock.

---

## Opción elegida: Twilio

Ventaja: ya usáis Twilio para los números (un proveedor menos) y su **sandbox**
permite probar HOY sin esperar aprobaciones de plantillas.

### Envs (Vercel, las pone Javi) + `MOCK_PROVIDERS=false`

- `TWILIO_ACCOUNT_SID` — de la consola de Twilio.
- `TWILIO_AUTH_TOKEN` — de la consola de Twilio.
- `TWILIO_WHATSAPP_FROM` — número emisor, formato `whatsapp:+14155238886`
  (el del **sandbox** para pruebas, o tu número de WhatsApp aprobado en producción).
- `TWILIO_WA_CONTENT_CLIENTE`, `TWILIO_WA_CONTENT_DUENO` — *opcionales*: los
  `ContentSid` (HX…) de las plantillas aprobadas en Twilio. Sin ellos, las
  plantillas se envían como **texto libre** (válido en sandbox y en la ventana de
  24 h tras un mensaje del usuario).

### Probar con el sandbox (sin aprobaciones)

1. En Twilio Console → Messaging → **Try it out → WhatsApp sandbox**.
2. Desde el móvil que vaya a recibir el aviso, envía `join <palabra>` al número del
   sandbox (Twilio te da la palabra). Esto abre la ventana de 24 h.
3. Pon las 3 envs de arriba (`TWILIO_WHATSAPP_FROM` = número del sandbox) + redeploy.
4. Haz una llamada de prueba (Vapi) → debe llegar el WhatsApp de aviso.

> El sandbox solo entrega a números que hayan hecho `join`. Para clientes reales
> hace falta el número de producción + plantillas aprobadas (ContentSid).

### Producción

- Da de alta tu **número de WhatsApp** en Twilio (Senders) — Twilio guía el alta
  con Meta por detrás.
- Crea las **plantillas** (Content Templates) en Twilio, con el mismo contenido y
  orden de variables que abajo; Twilio las envía a aprobar a Meta. Copia sus
  `ContentSid` a `TWILIO_WA_CONTENT_CLIENTE/DUENO`.

---

## Plantillas (contenido y variables)

Los nombres/orden deben coincidir con `templates.ts`. Idioma **es**.

### `curro_confirmacion_cliente` (al cliente)
`{{1}}`=nombre · `{{2}}`=negocio · `{{3}}`=enlace Cal.com.
```
Hola {{1}}, soy el asistente de {{2}}. Hemos recibido tu solicitud y te
contactaremos enseguida. Puedes reservar tu visita de valoración aquí: {{3}}
```

### `curro_aviso_lead` (al dueño)
`{{1}}`=negocio · `{{2}}`=nombre · `{{3}}`=teléfono · `{{4}}`=trabajo · `{{5}}`=zona · `{{6}}`=urgencia.
```
🔔 Nuevo lead en {{1}}
👤 {{2}} · {{3}}
🛠️ {{4}}
📍 {{5}}
Urgente: {{6}}
```

> ⚠️ **Variables vacías**: tanto Meta como Twilio (con plantilla) rechazan
> parámetros en blanco. Si un lead llega sin nombre/teléfono/enlace, el código manda
> `""`/`"—"`. Con ContentSid conviene asegurar que ningún parámetro va vacío. En
> **texto libre** (sandbox / ventana 24 h) no hay problema.

---

## Alternativa: Meta directo (WhatsApp Cloud API)

Sin intermediario ni markup, pero te gestionas tú Business Manager + verificación +
plantillas. Envs: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
`WHATSAPP_VERIFY_TOKEN` + `MOCK_PROVIDERS=false`. Webhook de verificación en
`https://soycurro.es/api/webhooks/whatsapp` (GET valida `hub.challenge` con
`WHATSAPP_VERIFY_TOKEN`). Ese webhook es **específico de Meta**; con Twilio no se usa
(Twilio tiene sus propios callbacks, opcionales para el envío saliente).
