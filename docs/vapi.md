# Configurar el assistant de Vapi (Curro)

Cómo montar el agente de voz que atiende las llamadas y cómo conecta con nuestro
webhook. En la **Fase 5** esto se creará automáticamente por API al dar de alta un
negocio; aquí queda documentado el "qué" y un ejemplo para hacerlo a mano.

## Flujo

```
Cliente llama ─► Vapi (Curro atiende en español) ─► al colgar:
   POST /api/webhooks/vapi  { message.type: "end-of-call-report" }
      └► verificamos secreto, extraemos el lead y guardamos lead + call_event
```

## 1. El guion (system prompt)

Ejemplo para una empresa de reformas. Ajusta el nombre del negocio por tenant.

```
Eres «Curro», la recepcionista virtual de {NOMBRE_DEL_NEGOCIO}, una empresa de
reformas y multiservicios del hogar en {CIUDAD}. Hablas español de España, con
tono cercano, claro y profesional. Frases cortas.

Objetivo: atender la llamada cuando el dueño no puede, cualificar al cliente y
tomar sus datos para que le devuelvan la llamada y agenden una visita.

Reglas:
- Preséntate SIEMPRE al inicio como asistente virtual e informa de que la llamada
  se graba (aviso legal obligatorio).
- Averigua y confirma: nombre del cliente, tipo de trabajo/reforma, zona o
  dirección aproximada, y si es urgente.
- Si el cliente da su teléfono, tómalo; si no, no insistas (ya tenemos el número).
- No des precios ni presupuestos: explica que un técnico le llamará para valorarlo.
- Sé breve. En cuanto tengas los datos, despídete y confirma que le contactarán.
```

**Primer mensaje (firstMessage):**

```
Reformas {NOMBRE_DEL_NEGOCIO}, le atiende Curro, su asistente virtual.
Le aviso de que esta llamada queda grabada. ¿En qué puedo ayudarle?
```

## 2. Datos estructurados (extracción)

Configura `analysisPlan.structuredDataPlan` para que Vapi devuelva estos campos.
Nuestro parser los lee de `message.analysis.structuredData` (y admite también los
alias `nombre`, `telefono`, `trabajo`, `ubicacion`).

```json
{
  "analysisPlan": {
    "structuredDataPlan": {
      "enabled": true,
      "schema": {
        "type": "object",
        "properties": {
          "cliente_nombre": { "type": "string", "description": "Nombre del cliente" },
          "cliente_telefono": { "type": "string", "description": "Teléfono si lo facilita" },
          "tipo_trabajo": { "type": "string", "description": "Tipo de reforma o trabajo solicitado" },
          "zona": { "type": "string", "description": "Zona, barrio o dirección aproximada" },
          "urgencia": { "type": "boolean", "description": "true si el cliente indica prisa o urgencia" }
        },
        "required": ["tipo_trabajo"]
      }
    },
    "summaryPlan": { "enabled": true }
  }
}
```

> El teléfono del cliente se rellena solo con el CallerID (`call.customer.number`)
> aunque el assistant no lo pregunte.

## 3. Voz y transcripción

- **Voz**: una voz en español de España (p. ej. ElevenLabs multilingüe o Azure
  `es-ES`). Elige una que suene natural y cercana.
- **Transcriber**: Deepgram o Whisper en `es`.
- **Modelo**: un modelo de lenguaje capaz (p. ej. GPT‑4o o similar) con el guion
  anterior como system prompt.

## 4. Server URL y secreto (¡importante!)

Para que Vapi nos mande el informe al colgar:

1. En Vapi, configura el **Server URL** del assistant (o global) apuntando a:
   ```
   https://TU-DOMINIO/api/webhooks/vapi
   ```
2. Activa el mensaje de servidor **`end-of-call-report`** (Server Messages).
3. Define un **Server Message Secret**. Vapi lo enviará en la cabecera
   `x-vapi-secret`. Pon ese mismo valor en tu entorno como `VAPI_WEBHOOK_SECRET`.

Nuestro endpoint rechaza con `401` cualquier petición cuyo `x-vapi-secret` no
coincida (comparación en tiempo constante). En producción, si falta el secreto,
respondemos `500` a propósito (no aceptamos webhooks sin firmar).

## 5. Asociar la llamada con el negocio (tenant)

El webhook localiza el negocio así:

1. Por `vapi_assistant_id` (el `assistantId` de la llamada) → recomendado.
2. Si no, por el número llamado (`telefono_entrante`).

Asegúrate de guardar el `vapi_assistant_id` en la fila del negocio (lo hará el
onboarding de la Fase 5).

## 6. Probar el webhook en local

Con el servidor en marcha (`npm run dev`), simula un informe de fin de llamada:

```bash
curl -X POST http://localhost:3000/api/webhooks/vapi \
  -H "content-type: application/json" \
  -H "x-vapi-secret: $VAPI_WEBHOOK_SECRET" \
  -d '{
    "message": {
      "type": "end-of-call-report",
      "cost": 0.09,
      "durationSeconds": 96,
      "call": {
        "id": "call_local_1",
        "assistantId": "asst_demo_reformas_garcia",
        "customer": { "number": "+34611111111" }
      },
      "artifact": { "transcript": "AI: ...\nUser: quiero reformar el baño" },
      "analysis": {
        "summary": "Baño en Chamberí, urgente",
        "structuredData": {
          "cliente_nombre": "María López",
          "tipo_trabajo": "Reforma de baño",
          "zona": "Chamberí",
          "urgencia": true
        }
      }
    }
  }'
```

- Sin Supabase configurado: responde `{ ok: true, skipped: "sin-supabase" }` y
  registra el lead parseado en consola.
- Con Supabase y un negocio cuyo `vapi_assistant_id` sea `asst_demo_reformas_garcia`:
  crea el `lead` + `call_event` y responde `{ ok: true, leadId, businessId }`.
  Repetir la misma llamada (mismo `call.id`) no duplica: responde `{ duplicate: true }`.
