# Política de retención y supresión de datos

> ⚠️ **BORRADOR — requiere revisión de un abogado/DPO antes de publicar/firmar.**
> Los plazos son una **propuesta configurable**; deben validarse jurídicamente. No es
> asesoramiento legal.

---

## 1. Principios

- **Limitación del plazo de conservación** (Art. 5.1.e RGPD): los datos se conservan solo
  el tiempo necesario para los fines para los que se tratan.
- **Minimización** (Art. 5.1.c): no se conserva más de lo necesario; el `raw_payload`
  íntegro del proveedor de voz **no** se conserva a largo plazo.
- **Configurabilidad:** los plazos marcados abajo son valores por defecto propuestos y
  deben poder ajustarse (a nivel de producto o por cliente en su panel).

> ✅ **Estado actual (importante):** la **retención automatizada está implementada y
> testeada** en el repositorio: la lógica de plazos y vencimiento vive en
> `lib/rgpd/retencion.ts` (`estaVencido`, `fechaCorte`; plazos configurables por entorno),
> el job de purga en `lib/rgpd/retencion-job.ts` (`ejecutarRetencion`), el borrado de la
> grabación en `lib/vapi/grabaciones.ts` (`borrarGrabacionVapi`) y el endpoint protegido en
> `app/api/cron/retencion/route.ts` (autorización por `CRON_SECRET`, *fail-closed* en
> producción). El **cron diario** (`0 3 * * *`) está **declarado en `vercel.json`**. Lo
> único **pendiente es humano**: (i) **activar el cron en Vercel** definiendo `CRON_SECRET`
> en las variables de entorno y (ii) **confirmar en la cuenta real de Vapi** que su
> `DELETE` de la llamada elimina también el audio (ver §5). Estos textos son coherentes con
> lo prometido en `/privacidad`.

---

## 2. Tabla de plazos por categoría

| # | Categoría de dato | Dónde (real) | Plazo propuesto | Acción al vencer | Criterio / base |
|---|---|---|---|---|---|
| 1 | **Grabación de audio** de la llamada | `leads.audio_url` (tabla `leads` en `supabase/schema.sql`) + almacenamiento del proveedor de voz | **30 días** | **Borrar** audio (fichero + URL) | Fin del control de calidad; minimización del dato más sensible (voz). |
| 2 | **Transcripción** + **datos del lead** (nombre, teléfono, tipo, zona, urgencia) | `leads.transcripcion` y campos de la tabla `leads` (en `supabase/schema.sql`) | **12 meses** (o hasta que el cliente los borre) | **Borrar** el lead (o anonimizar — ver §3) | Gestión comercial del lead por el negocio cliente; instrucción del Responsable. |
| 3 | **`raw_payload`** del proveedor de voz | `call_events.raw_payload` (tabla `call_events` en `supabase/schema.sql`) | **No se guarda el JSON crudo**; el campo solo lleva **metadatos** (duración, coste, `vapi_call_id`); se **purga a 30 días** por defensa en profundidad | **Purgar** `raw_payload` (dejar metadatos) | Minimización; evita cualquier copia residual de audio/transcripción. |
| 4 | **Metadatos del envío de notificaciones** (WhatsApp/email) — canal, plantilla y estado, **sin el cuerpo del mensaje ni el destinatario** | `messages.payload` (tabla `messages` en `supabase/schema.sql`) | **No implementado por antigüedad** — hoy `messages` solo se purga por **cascada** al borrar el negocio o vía **DSAR** (`suprimirLead`); plazo por antigüedad *(a decidir)* | Purga por cascada / DSAR (el job de retención **no** recorre `messages` por antigüedad) | Trazabilidad de avisos; alinear con el lead. |
| 5 | **Datos de facturación** | Stripe + datos contables | **6 años** | Conservar; luego borrar | **Obligación legal** (Código de Comercio art. 30; normativa fiscal). |
| 6 | **Datos de cuenta** del suscriptor y usuarios | tablas `businesses` y `owners` (en `supabase/schema.sql`) | Relación **+ 5 años** | Borrar/anonimizar tras la prescripción | Prescripción de acciones civiles/contractuales. |
| 7 | **Logs con PII** (aplicación, hosting/Vercel) | Logs de Vercel y de la app | **≤ 90 días** | Rotación/borrado | Seguridad y depuración; minimización. |
| 8 | **Analítica web** (GA4) | Google Analytics | **14 meses** *(a decidir)* + retirada de consentimiento | Según config GA4 | Consentimiento; caducidad. |

---

## 3. Borrado vs. anonimización

- **Borrado (por defecto):** eliminación de los registros y de los ficheros asociados
  (audio). Recomendado para la **grabación de audio** (categoría 1) y el **`raw_payload`**
  (categoría 3).
- **Anonimización (alternativa para métricas):** cuando el negocio o Curro necesiten
  conservar **estadísticas agregadas** (nº de leads, tipos de trabajo, conversión) más allá
  del plazo del dato personal, puede **disociarse irreversiblemente** el lead (eliminar
  nombre, teléfono, email, transcripción y zona precisa) manteniendo campos no
  identificativos. Un dato correctamente anonimizado **queda fuera del RGPD**.
  > **A decidir por el abogado:** qué categorías se anonimizan en lugar de borrarse y con
  > qué técnica (para que la anonimización sea efectiva y no mera seudonimización).

---

## 4. Supresión a instancia del interesado / del Responsable

- El **Responsable** (negocio cliente) puede **borrar** un lead desde su panel; esa acción
  debe eliminar el lead y su audio asociado (obligación del Encargado — DPA §4.5/4.9).
- Al **dar de baja** un negocio, se propone una **ventana de gracia de 30 días** para
  exportar/devolver y, transcurrida, **borrado** de sus datos de tratamiento B
  (conservando solo lo exigido por ley, p. ej. facturación).
- El borrado en cascada por `business_id` ya está previsto a nivel de esquema
  (`on delete cascade` en las tablas `leads`, `messages` y `call_events` de
  `supabase/schema.sql`), lo que facilita la supresión al eliminar el negocio. El
  **borrado selectivo por antigüedad** (retención) está **implementado** en el job de purga
  (`lib/rgpd/retencion-job.ts`, `ejecutarRetencion`) para audio, `raw_payload` y `leads`;
  la supresión granular de un lead (DSAR, incluidos sus `messages`) vive en `suprimirLead`
  (`lib/rgpd/supresion.ts`) — ver §5.

---

## 5. Implementación técnica

La retención está **implementada y testeada** en el repositorio:

1. **Job/cron de purga** diario (Vercel Cron, `0 3 * * *` en `vercel.json`), expuesto en
   `app/api/cron/retencion/route.ts` y ejecutado por `ejecutarRetencion`
   (`lib/rgpd/retencion-job.ts`). El job:
   - borra `leads.audio_url` y solicita a Vapi el borrado del audio con **> 30 días**
     (`lib/vapi/grabaciones.ts`, `borrarGrabacionVapi`);
   - purga `call_events.raw_payload` con **> 30 días** dejando los metadatos;
   - anonimiza `leads` con **> 12 meses** salvo marca de retención (borra la PII y
     conserva la fila para métricas agregadas);
   - respeta el borrado ya solicitado por el cliente.

   > **`messages` — no implementado por antigüedad.** El job de retención **no** recorre
   > `messages` por plazo de antigüedad (el plazo de la fila 4 de §2 está **por decidir**).
   > Hoy los `messages` solo se eliminan (i) por **cascada** al borrar el negocio
   > (`on delete cascade` por `business_id`) o (ii) vía **DSAR** al suprimir un lead
   > (`suprimirLead` en `lib/rgpd/supresion.ts`, que borra los `messages` del lead). El
   > `payload` guardado ya está minimizado (solo metadatos, sin cuerpo ni destinatario),
   > por lo que no persiste PII del interesado a la espera de esa purga.
   - Los plazos son **configurables por entorno** (`RETENCION_*_DIAS` en
     `lib/rgpd/retencion.ts`).
2. El endpoint está **protegido** con `CRON_SECRET` y es *fail-closed* en producción
   (`app/api/cron/retencion/route.ts`).
3. **Rotación de logs** (PII ≤ 90 días) y **retención en GA4/Stripe**: se gestionan en la
   configuración de cada proveedor (fuera del repositorio).
4. **Registro de ejecución** de la purga como evidencia de cumplimiento (accountability).

> **Pendiente (humano, no de código) para activar la retención en producción:**
> (i) **definir `CRON_SECRET`** en las variables de entorno de Vercel para que el cron
> quede autorizado y activo; (ii) **confirmar en la cuenta real de Vapi** que su `DELETE`
> de la llamada elimina también el audio almacenado.
>
> **A decidir por el abogado/DPO:** confirmación final de cada plazo, política de
> anonimización y ventana de gracia de exportación.

---

## 6. Referencias cruzadas

- Registro de Actividades: `docs/legal/rat.md`.
- Contrato de Encargado (supresión/devolución, Art. 28.3.g): `docs/legal/dpa-encargado.md`.
- Subencargados (dónde vive físicamente cada dato): `docs/legal/subencargados.md`.
