# Telefonía (números +34) — cómo enrutan las llamadas

Cómo un número de teléfono real acaba atendido por Curro. **Estado: mockeado** —
todo corre en simulación hasta que exista el bundle regulatorio de Twilio para ES.

## Arquitectura (la correcta, verificada en los docs de Vapi)

**NO hace falta un webhook TwiML propio** (`/api/webhooks/twilio/inbound`). El
patrón recomendado es **importar el número de Twilio en Vapi** ("Bring Your Own"):
se registra el número + credenciales de Twilio en Vapi, y **Vapi configura el
webhook de voz del número y atiende las entrantes con el assistant**.

```
Cliente llama al número dedicado (+34…)
   → Twilio (el número está importado en Vapi)
   → Vapi contesta con el assistant del negocio (inbound)
   → al colgar: webhook /api/webhooks/vapi → lead + avisos (igual que hoy)
```

## Piezas

- `lib/twilio/numeros.ts` — compra el número ES en Twilio (`comprarNumero`), gated
  y mockable. Exige AddressSid + BundleSid (regulatorio ES).
- `lib/vapi/telefono.ts` — **`importarNumeroEnVapi({ numero, assistantId, name })`**:
  POST `https://api.vapi.ai/phone-number` con `provider:"twilio"` + credenciales +
  `assistantId`. Devuelve el id del phone-number de Vapi. `eliminarNumeroVapi(id)`
  lo desasigna. Gated+mockable.
- `lib/onboarding/aprovisionar.ts` — el paso `telefono` (modo `new`): compra el
  número (idempotente, anti double-buy) y luego lo **importa a Vapi** (idempotente
  por `vapi_phone_id`). Si el import falla, el reintento re-importa sin recomprar.
- Columnas (migración 005): `vapi_phone_number_id` = SID del número en Twilio (PN…);
  `vapi_phone_id` = id del phone-number en **Vapi**.

## Para activar números reales (cuando toque)

1. Twilio: crear el **Address** (AddressSid) y el **Regulatory Bundle** (BundleSid)
   para España, y esperar su aprobación.
2. Poner en Vercel: `TWILIO_ADDRESS_SID`, `TWILIO_BUNDLE_SID` (además de
   `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN` que ya están) y `MOCK_PROVIDERS=false`.
3. Dar de alta un cliente con `phone_mode: "new"` y plan con `numeroDedicado`.

## ⚠️ Pendiente / avisos

- **SIN VERIFICAR EN VIVO**: nada de esto se ha probado contra un +34 real (no hay
  bundle). Confirmar con una llamada real de punta a punta antes de fiarse.
- **Modo `forward` (desvío)**: hoy el orquestador solo guarda `forward_target` y
  marca el paso hecho; NO provisiona un número Curro al que el cliente desvíe. Para
  que el desvío funcione de verdad hay que darle al cliente un número Curro
  (importado en Vapi) y guiar el desvío `**61*NUM#`. Queda por construir.
- **Borrado de cliente**: `borrarCliente` aún NO libera el número de Twilio ni
  borra el phone-number de Vapi (`eliminarNumeroVapi`). Añadirlo antes de operar
  con números reales para no dejar coste huérfano.
