# Expediente para revisión legal — Curro

> ⚠️ **Documento interno de apoyo.** Los borradores de esta carpeta (`dpa-encargado.md`, `rat.md`, `politica-retencion.md`, `subencargados.md`) **requieren revisión y validación de un abogado o DPO** antes de publicarse o firmarse. No constituyen asesoramiento jurídico. Este expediente reúne el email para el profesional, las decisiones que solo él puede tomar, el estado del cumplimiento y cómo obtener la validación.

---

## 1. Email para el abogado / DPO (listo para enviar)

**Asunto:** Revisión y validación de cumplimiento RGPD — Curro (SaaS de recepcionista de voz con IA)

Estimado/a [nombre]:

Le escribo para solicitar la **revisión y validación** de la documentación de protección de datos de mi proyecto, **Curro** (soycurro.es): un SaaS que atiende las llamadas de negocios (autónomos y pymes de oficios) con un asistente de voz con IA que **graba y transcribe** la conversación con quien llama, extrae los datos de la solicitud y avisa al negocio.

**Modelo de roles (dos tratamientos):** respecto de los **suscriptores** (los negocios que contratan Curro), Curro es **responsable**; respecto de las **personas que llaman** a esos negocios, el negocio cliente es **responsable** y **Curro es encargado del tratamiento (Art. 28)**.

**Documentación ya redactada (borradores, adjuntos):** (1) contrato de **encargado del tratamiento (Art. 28)**, incorporado como anexo a los Términos y aceptado por el cliente en el alta; (2) **Registro de Actividades (Art. 30)**; (3) **política de retención** (con borrado/anonimización automatizados ya implementados); (4) **lista de subencargados** y transferencias; (5) páginas legales publicadas (privacidad, condiciones, cookies, aviso legal).

**Medidas técnicas ya implementadas:** aislamiento multi-tenant, aviso de grabación al inicio de cada llamada, minimización de datos, borrado automático por plazos, derecho de supresión granular (incluida la grabación) y acceso a grabaciones por endpoint autenticado.

**Le pido que valide/decida en concreto** (ver lista detallada abajo): EIPD (Art. 35), DPO (Art. 37), base jurídica de la grabación, verificación de transferencias internacionales, plazos de conservación, plazos de notificación, datos identificativos y publicación del texto del DPA.

¿Podría indicarme **alcance y coste** de una revisión puntual? Quedo a su disposición para una llamada.

Un saludo,
**Javier Pato Prieto** — Curro · soycurro.es · [teléfono]

---

## 2. Decisiones que requieren criterio legal

1. **EIPD / Evaluación de Impacto (Art. 35).** Decidir si es obligatoria. Indicios fuertes de que sí: observación sistemática + grabación de voz a escala + posible categoría especial (Art. 9) en conversación libre. Si aplica, realizarla (la AEPD ofrece la herramienta gratuita *Gestiona EIPD*).
2. **Delegado de Protección de Datos (DPO, Art. 37).** ¿Procede designarlo o basta un punto de contacto?
3. **Base jurídica de la grabación** (tratamiento del llamante): interés legítimo + análisis (LIA) vs. consentimiento; y si el aviso al inicio de la llamada es suficiente. La determina cada Responsable cliente.
4. **Transferencias internacionales.** Verificar la adhesión vigente al **Data Privacy Framework** de cada proveedor de EE. UU. (Vapi, OpenAI, Deepgram, ElevenLabs, Twilio, Meta, Resend, Cal.com, Stripe, Vercel, Google) o, en su defecto, firmar **SCC 2021/914** (módulo correcto) + análisis de transferencia (TIA).
5. **Plazos de conservación definitivos.** Confirmar los propuestos (audio 30 días; transcripción + lead 12 meses; facturación 6 años; cuenta durante la relación + 5 años; logs ≤ 90 días).
6. **Plazos concretos.** Preaviso de altas/bajas de subencargados; plazo interno de notificación de brechas; ventana de exportación de datos al causar baja.
7. **Datos identificativos y forma jurídica.** Confirmar NIF, domicilio y razón social; decidir si se opera como autónomo o sociedad.
8. **Técnica de anonimización.** Que la anonimización del job de retención sea efectiva (anonimización real, no seudonimización).
9. **Publicación del texto íntegro del DPA.** Hoy el cliente acepta un "Anexo DPA" en el alta cuyo texto completo no está publicado en la web; decidir si debe publicarse o entregarse.

---

## 3. Estado del cumplimiento (lo que el profesional NO tiene que rehacer)

Validado internamente (revisión técnica, no jurídica) — completo y coherente con el código:

- **DPA (Art. 28.3):** las 9 obligaciones cubiertas. El DPA se **acepta de verdad en el alta** (checkbox obligatorio + evidencia de versión y fecha en los metadatos del usuario).
- **RAT (Art. 30):** los 3 tratamientos con todos los campos.
- **Coherencia:** mismos plazos, subencargados y roles en los 5 documentos y en las páginas publicadas.
- **Veracidad vs. código:** retención automatizada implementada (cron diario, borrado por plazos, supresión granular incl. grabación en Vapi); `messages` y `raw_payload` guardan solo metadatos (sin cuerpo ni destinatario); aviso de grabación en el guion; acceso a grabaciones por endpoint autenticado.
- **Transparencia:** transferencias marcadas siempre como "SCC/DPF (a verificar)", nunca como hechas; disclaimers de borrador en todos los documentos.

---

## 4. Cómo obtener la validación

- **Abogado/a especialista en protección de datos** — revisión puntual de los documentos (one-off; unos cientos de €). Lo más rápido.
- **DPO-as-a-service / consultora RGPD** — suscripción que mantiene RAT/DPA/EIPD; tiene sentido al escalar.
- **Herramientas gratuitas de la AEPD** — *Gestiona EIPD* (para la evaluación de impacto) y *Facilita_RGPD* (solo para tratamientos de **bajo riesgo**; grabar voz de terceros probablemente no lo es, así que puede no ser suficiente).
