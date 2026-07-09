# Documentación RGPD de Curro — índice

> ⚠️ **BORRADOR — requiere revisión de un abogado/DPO antes de publicar/firmar.**
> Todos los documentos de esta carpeta son **borradores técnicos** redactados a partir del
> funcionamiento real del servicio (con referencias `fichero:línea`) para que un
> **abogado/DPO los revise, valide y adapte**. **No constituyen asesoramiento jurídico** ni
> deben publicarse ni firmarse tal cual.

Curro es un SaaS español de **recepcionista de voz con IA** que, por cuenta de negocios de
reformas, **atiende, graba y transcribe llamadas de terceros** (las personas que llaman) y
avisa de los leads. Esto genera **dos tratamientos con roles distintos**:

- **Curro RESPONSABLE** de los datos de los **suscriptores** (negocios que pagan) y de la
  **analítica web**.
- **Curro ENCARGADO** (Art. 28 RGPD) de los datos de las **personas que llaman**, siendo
  cada **negocio cliente el Responsable**.

---

## Documentos

| # | Documento | Qué es | Estado |
|---|---|---|---|
| 1 | [`dpa-encargado.md`](./dpa-encargado.md) | **Contrato de Encargado del Tratamiento (Art. 28)** para incorporar como Anexo a los Términos (aceptación en el alta). Incluye contenido mínimo del Art. 28.3, subencargados con objeción, transferencias (SCC/DPF) y Apéndices I-III. | Borrador |
| 2 | [`rat.md`](./rat.md) | **Registro de Actividades de Tratamiento (Art. 30)** con los 3 tratamientos reales (A suscriptores, B servicio IA como encargado, C analítica). | Borrador |
| 3 | [`politica-retencion.md`](./politica-retencion.md) | **Política de retención y supresión**: plazos por categoría, borrado vs. anonimización y la implementación técnica (ya existente: job + cron; pendiente solo activar `CRON_SECRET` en Vercel). | Borrador |
| 4 | [`subencargados.md`](./subencargados.md) | **Lista maestra de subencargados** (proveedor, finalidad, datos, país, transferencia, enlaces), incluida la subcadena de Vapi. | Borrador |

---

## Cómo encajan

- El **DPA (1)** regula el tratamiento **B** del **RAT (2)**; su Apéndice III remite a la
  **lista de subencargados (4)** y sus cláusulas de supresión a la **política de
  retención (3)**.
- La **retención (3)** aplica a todas las categorías del **RAT (2)**; su implementación
  técnica ya existe (job + cron) y solo resta activarla en Vercel.

---

## Datos canónicos usados (coherentes en todos los documentos)

- **Responsable/Encargado (titular):** Javier Pato Prieto · NIF 71449969D · Cantabria ·
  hola@soycurro.es (coincide con Aviso legal y Política de privacidad publicados).
- **Retenciones (propuesta configurable):** audio 30 días · transcripción + lead 12 meses ·
  `raw_payload` solo metadatos, purga 30 días · facturación 6 años · cuenta relación + 5
  años · logs con PII ≤ 90 días.
- **Subencargados clave:** Vapi (+ OpenAI, Deepgram, ElevenLabs), Twilio/Meta, Supabase
  (UE), Resend, Cal.com, Stripe, Vercel, Google Analytics.

---

## Pendientes que exceden lo redactable aquí (para el abogado/DPO)

1. **EIPD / DPIA (Art. 35) — recomendada.** El tratamiento **B** implica **observación
   sistemática** y **grabación de voz** a escala, con posibilidad de datos del **art. 9**
   mencionados en conversación libre y una eventual dimensión **biométrica** si la voz se
   usara para identificación (hoy no). Procede evaluar si es obligatoria y, previsiblemente,
   realizarla por tratamiento.
2. **Designación de DPD (Art. 37) — a valorar.** Analizar si el volumen y la naturaleza del
   tratamiento (observación habitual y sistemática a gran escala) obligan a nombrar
   Delegado de Protección de Datos; si no es obligatorio, decidir si se designa
   voluntariamente o un punto de contacto de privacidad.
3. **Base jurídica y consentimiento de la grabación** (tratamiento B): confirmar qué base
   usa cada Responsable cliente y si el aviso de grabación al inicio de la llamada es
   suficiente o requiere consentimiento.
4. **Transferencias internacionales:** verificar la **adhesión al DPF** de cada proveedor o,
   en su defecto, firmar **SCC 2021/914** con el módulo correcto y realizar **TIA**.
5. **Activación de la retención en producción:** la retención **ya está implementada y
   testeada** (job `ejecutarRetencion` en `lib/rgpd/retencion-job.ts`, endpoint protegido en
   `app/api/cron/retencion/route.ts` y cron diario en `vercel.json`). Queda **pendiente lo
   humano**: definir `CRON_SECRET` en Vercel para activar el cron y confirmar que el `DELETE`
   de Vapi borra el audio (ver `politica-retencion.md §5`).
6. **Revisión de los textos públicos** (`/privacidad`, `/condiciones`, `/aviso-legal`,
   `/cookies`) para alinearlos con estos documentos una vez validados.
