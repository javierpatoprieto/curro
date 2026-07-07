# Campaña de ads — Curro (oficios)

Plan de arranque para captar altas de prueba (7 días, tarjeta por adelantado).
Gremio primario: **reformas/construcción** (vertical núcleo, encaja con la marca
Currito). Extensible a fontaneros, electricistas, etc. — hay una landing de
campaña por gremio en `/lp/[gremio]` (p. ej. `/lp/reformas`, `/lp/fontaneros`).

## Posicionamiento / ángulo

El autónomo de oficio **no busca** "recepcionista IA", pero siente el dolor cada
día. Hay que nombrarlo y cuantificarlo:

> **Cada llamada que no coges es un presupuesto que se lleva la competencia.**

Ejes de mensaje a testear:
- **Pérdida** — "¿Cuántas obras/clientes pierdes por no coger el teléfono?"
- **Manos libres** — "Tú a lo tuyo. Curro coge el teléfono por ti."
- **Coste** — "Una recepcionista por 49 €/mes, no 1.200 €."
- **24/7 / demo** — "Escucha cómo contesta Curro a tus clientes."

## Plataformas

- **Meta (Instagram + Facebook, Reels/Feed) = principal.** Demanda latente, gran
  volumen de autónomos, CPL barato. Vídeo vertical con **audio real de Curro
  atendiendo** = el mejor gancho.
- **Google Search = secundario, pequeño.** Captura la intención existente
  ("secretaria/recepcionista virtual autónomos", "servicio contestar llamadas").

## Segmentación (Meta)

- Ubicación: España (o 2-3 provincias donde ya haya cobertura/leads).
- Edad 25-60, todos los géneros.
- Advantage+ audience con señales: propietarios de pequeña empresa, autónomos,
  intereses en reformas/construcción/herramientas (Leroy Merlin, Bricomart,
  Bosch), software para autónomos (Holded, Quipu, Declarando).
- Empezar con **Advantage+ / objetivo Leads o Ventas**, 1-2 conjuntos, sin
  sobre-segmentar.

## Presupuesto, estructura y KPIs

- **15-20 €/día · 7-10 días ≈ 150 € de test.**
- 1 campaña → 1-2 conjuntos → **3-4 creativos** (un ángulo cada uno).
- Objetivos orientativos (oficios ES): CTR > 1 % · CPC 0,20-0,60 € · CPL 5-15 € ·
  coste/inicio-de-prueba < 30 €.
- Rentabilidad: si la retención media es 6-10 meses a 99 € → LTV 600-1.000 €, así
  que un CAC de 80-150 € es sano. **Validar retención antes de escalar.**

## Copys — Meta (texto principal + titular)

**A · Pérdida**
> Estás en la obra, con las manos ocupadas… y el teléfono suena. Otra vez.
> Cada llamada que no coges es un cliente que llama al siguiente de la lista.
> Curro es tu recepcionista de voz: contesta 24/7, se entera de qué necesita el
> cliente y te lo manda al WhatsApp al instante. Desde 49 €/mes.
> - Titular: No pierdas otra obra por no coger el teléfono
> - CTA: Pruébalo gratis 7 días

**B · Manos libres**
> Tú a lo tuyo. Del teléfono se encarga Curro.
> Contesta tus llamadas cuando estás subido a un andamio, conduciendo o ya en
> casa. Apunta el trabajo, la zona y la urgencia, y te avisa por WhatsApp.
> - Titular: Tu recepcionista que nunca falla — 49 €/mes
> - CTA: Empezar prueba gratis

**C · Coste**
> Una recepcionista de verdad cuesta más de 1.200 € al mes. Curro, 49 €.
> Coge todas tus llamadas, cualifica al cliente y te pasa el aviso. Sin nóminas,
> sin bajas, 24/7.
> - Titular: La recepcionista de tu negocio por 49 €/mes
> - CTA: Probar gratis

**D · Demo/24-7 (para el vídeo con audio)**
> 🔊 Así contesta Curro a tus clientes 👇 (sube el volumen)
> Contesta como tú lo harías, se entera de todo y no se le escapa ni una llamada.
> Ni de noche, ni en festivo.
> - Titular: Escucha cómo suena tu nueva recepcionista
> - CTA: Pruébalo gratis 7 días

## Copys — Google Search (RSA)

- Titulares: Recepcionista Virtual 24/7 · Curro Coge Tus Llamadas · Para
  Autónomos y Oficios · Desde 49 €/mes IVA Incl. · No Pierdas Más Clientes ·
  Prueba Gratis 7 Días · Avisos al WhatsApp · Sin Permanencia
- Descripciones: "Curro contesta tus llamadas cuando no puedes, cualifica al
  cliente y te avisa al WhatsApp. Pruébalo gratis." · "Menos de lo que cuesta
  perder una sola obra. Recepcionista de voz IA 24/7 para tu negocio."
- Extensiones: sitelinks (Precios · Cómo funciona · Para tu gremio), textos
  destacados (24/7, Sin permanencia, Aviso al WhatsApp, Prueba gratis).

## Creativo (dirección)

- **9:16, 15-30 s.** Gancho 3 s ("otra vez sin coger el teléfono") → agitación →
  **Curro contesta (audio real)** → beneficio → CTA. Currito como cara de marca.
- **Estático de apoyo:** captura de WhatsApp con el aviso real →
  "Nuevo cliente: reforma de baño · Chamberí · URGENTE". Muy tangible.

## Landing de campaña (message-match)

- Ruta: `/lp/[gremio]` (p. ej. `soycurro.es/lp/reformas`). Un CTA único a
  `/registro`, cabecera/pie minimalistas, **noindex** (no compite con /para SEO).
- El mensaje del anuncio y el H1 de la landing deben coincidir. La landing hereda
  el subtítulo específico del gremio.
- Los parámetros UTM del anuncio pasan en la URL; para atribución completa hace
  falta el pixel (ver abajo).

## Embudo y eventos de conversión (pendiente de instalar pixel)

`PageView (LP)` → `Lead (registro)` → `InitiateCheckout` → `StartTrial/Purchase`.
Mapear a los eventos estándar de Meta / conversiones de Google Ads.

## ⚠️ Antes de gastar

1. **Optimizar por conversión necesita el pixel** (Meta Pixel + Google Ads tag +
   eventos). Sin él, para el test inicial usar **Lead Ads nativos de Meta**
   (formulario, sin pixel); para escalar, instalar el pixel primero.
2. **No escalar hasta que un alta reciba un número que funcione.** Sin número
   real + WhatsApp de producción, cada registro pagado no se puede cumplir. Para
   un test pequeño vale (onboarding manual < 10 min); para volumen, cerrar esos
   dos bloqueadores antes.
