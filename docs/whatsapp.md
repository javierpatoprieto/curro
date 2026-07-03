# WhatsApp (Cloud API de Meta)

Cómo conectar el canal de WhatsApp para que Curro avise al cliente y al dueño
cuando entra un lead. El **envío ya está implementado** (`lib/messaging/whatsapp.ts`
+ `templates.ts`); esto es el "qué tienes que dar de alta en Meta" para pasar de
mock a real.

## Flujo

```
Llamada → webhook Vapi → lead guardado → notificarNuevoLead():
   ├─ WhatsApp al CLIENTE   (plantilla curro_confirmacion_cliente + enlace Cal.com)
   └─ WhatsApp + email al DUEÑO (plantilla curro_aviso_lead con el resumen)
```

Sin `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` (o con `MOCK_PROVIDERS` distinto
de `false`), el cliente cae a **mock** (log en consola, no envía). Es seguro.

## 1. Variables de entorno (Vercel, las pone Javi)

- `WHATSAPP_TOKEN` — token de acceso del número de WhatsApp (System User token,
  permanente; el token temporal de 24 h solo sirve para probar).
- `WHATSAPP_PHONE_NUMBER_ID` — ID del número (no el número en sí), en la API Setup.
- `WHATSAPP_VERIFY_TOKEN` — una cadena que TÚ inventas; se usa para verificar el
  webhook (ver abajo). Debe ser el mismo valor aquí y en Meta.
- `MOCK_PROVIDERS=false` — para que use el proveedor real.

Tras ponerlas: **redeploy** (son de build/runtime).

## 2. Webhook

- **Callback URL**: `https://soycurro.es/api/webhooks/whatsapp`
- **Verify token**: el mismo valor que `WHATSAPP_VERIFY_TOKEN`.
- Al pulsar "Verificar y guardar", Meta hace un `GET` con `hub.challenge`; nuestro
  endpoint responde el challenge si el token coincide (si no, 403).
- **Suscríbete** al campo `messages` (para estados de entrega y respuestas). El
  `POST` de eventos hoy solo acusa recibo (200) y loguea un resumen; no hace falta
  nada más para que los avisos salgan.

## 3. Plantillas (Message Templates) — hay que crearlas y que Meta las apruebe

Idioma **Español (es)**, categoría **Utilidad (Utility)**. Los nombres y el orden
de las variables tienen que coincidir EXACTAMENTE con el código (`templates.ts`).

### `curro_confirmacion_cliente` (al cliente)

Variables: `{{1}}` = nombre del cliente · `{{2}}` = nombre del negocio ·
`{{3}}` = enlace de Cal.com.

```
Hola {{1}}, soy el asistente de {{2}}. Hemos recibido tu solicitud y te
contactaremos enseguida. Puedes reservar tu visita de valoración aquí: {{3}}
```

Ejemplos para la revisión de Meta: `{{1}}=María`, `{{2}}=Reformas García`,
`{{3}}=https://cal.com/reformas-garcia/visita`.

### `curro_aviso_lead` (al dueño)

Variables: `{{1}}` = negocio · `{{2}}` = nombre cliente · `{{3}}` = teléfono ·
`{{4}}` = tipo de trabajo · `{{5}}` = zona · `{{6}}` = urgencia (Sí/No).

```
🔔 Nuevo lead en {{1}}
👤 {{2}} · {{3}}
🛠️ {{4}}
📍 {{5}}
Urgente: {{6}}
```

Ejemplos: `{{1}}=Reformas García`, `{{2}}=María`, `{{3}}=611222333`,
`{{4}}=Reforma de baño`, `{{5}}=Chamberí`, `{{6}}=Sí`.

> ⚠️ **Cuidado con variables vacías**: Meta rechaza mensajes con parámetros en
> blanco. Si un lead llega sin nombre/teléfono/enlace, el código manda `""` o `"—"`.
> Conviene asegurar que ningún parámetro va vacío (usar "—" o similar). Revisar en
> `templates.ts` antes de activar el envío real al cliente.

## 4. Probar

1. Con las envs puestas y `MOCK_PROVIDERS=false`, haz una llamada de prueba (Vapi).
2. Debe llegar el WhatsApp al dueño (y al cliente si dio teléfono).
3. Los envíos quedan registrados en la tabla `messages` (canal, plantilla, estado).
4. Mientras las plantillas no estén aprobadas, Meta devolverá error de plantilla;
   el lead se guarda igual (el fallo de envío no tumba el webhook).
