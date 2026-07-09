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

> ⚠️ **Estado actual (importante):** a fecha de este borrador **no existe implementación
> automatizada** de purga/retención en el repositorio (no hay cron ni job de borrado). Los
> plazos de esta política son un **objetivo** que requiere implementarse (ver §5). Hasta
> entonces, los datos (incluido audio y `raw_payload`) **se conservan indefinidamente** en
> las tablas `leads` y `call_events`, lo que debe corregirse.

---

## 2. Tabla de plazos por categoría

| # | Categoría de dato | Dónde (real) | Plazo propuesto | Acción al vencer | Criterio / base |
|---|---|---|---|---|---|
| 1 | **Grabación de audio** de la llamada | `leads.audio_url` (`supabase/schema.sql:101`) + almacenamiento del proveedor de voz | **30 días** | **Borrar** audio (fichero + URL) | Fin del control de calidad; minimización del dato más sensible (voz). |
| 2 | **Transcripción** + **datos del lead** (nombre, teléfono, tipo, zona, urgencia) | `leads.transcripcion` y campos de `leads` (`supabase/schema.sql:91-105`) | **12 meses** (o hasta que el cliente los borre) | **Borrar** el lead (o anonimizar — ver §3) | Gestión comercial del lead por el negocio cliente; instrucción del Responsable. |
| 3 | **`raw_payload` íntegro** del proveedor de voz | `call_events.raw_payload` (`supabase/schema.sql:143`) | **No conservar íntegro**; conservar solo **metadatos** (duración, coste, `vapi_call_id`); purgar el payload a **30 días** | **Purgar** `raw_payload` (dejar metadatos) | Minimización; el payload bruto puede contener copia de audio/transcripción. |
| 4 | **Contenido de notificaciones** (WhatsApp/email enviados/recibidos) | `messages.payload` (`supabase/schema.sql:119-130`) | **12 meses** *(a decidir)* | Borrar/anonimizar | Trazabilidad de avisos; alinear con el lead. |
| 5 | **Datos de facturación** | Stripe + datos contables | **6 años** | Conservar; luego borrar | **Obligación legal** (Código de Comercio art. 30; normativa fiscal). |
| 6 | **Datos de cuenta** del suscriptor y usuarios | `businesses`, `owners` (`supabase/schema.sql:51-83`) | Relación **+ 5 años** | Borrar/anonimizar tras la prescripción | Prescripción de acciones civiles/contractuales. |
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
  (`on delete cascade` en `leads`, `messages`, `call_events` —
  `supabase/schema.sql:93`, `:121`, `:140`), lo que facilita la supresión al eliminar el
  negocio. **Falta** el borrado selectivo por antigüedad (retención).

---

## 5. Implementación técnica (pendiente)

Para cumplir esta política se propone implementar (no existe hoy):

1. **Job/cron de purga** periódico (p. ej. Vercel Cron o función programada) que:
   - borre `leads.audio_url` y el fichero de audio con **> 30 días**;
   - purgue `call_events.raw_payload` con **> 30 días** dejando los metadatos;
   - borre/anonimice `leads` (y `messages`) con **> 12 meses** salvo marca de retención;
   - respete el borrado ya solicitado por el cliente.
2. **Rotación de logs** para no retener PII > 90 días.
3. **Configuración de retención en GA4** y en Stripe conforme a los plazos.
4. **Registro de ejecución** de la purga (evidencia de cumplimiento — accountability).

> **A decidir por el abogado/DPO:** confirmación final de cada plazo, política de
> anonimización, ventana de gracia de exportación, y prioridad de implementación del cron
> (dado que hoy la conservación es indefinida).

---

## 6. Referencias cruzadas

- Registro de Actividades: `docs/legal/rat.md`.
- Contrato de Encargado (supresión/devolución, Art. 28.3.g): `docs/legal/dpa-encargado.md`.
- Subencargados (dónde vive físicamente cada dato): `docs/legal/subencargados.md`.
