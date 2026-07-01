# Rediseño de la landing de Curro — Diseño

**Fecha:** 2026-07-01
**Estado:** aprobado (pendiente de plan de implementación)
**Alcance:** Home completa + sistema de marca (logo, mascota, paleta, motion). El panel y las páginas legales quedan fuera.

## Problema

La landing actual es técnicamente correcta (paleta aqua/teal + coral, tipos Bricolage Grotesque + Instrument Sans, demo animada del móvil, resaltador, retícula "plano de obra") pero **se percibe como "AI slop"**: rejilla de tarjetas con iconos lucide, layout plano y "seguro", sin personalidad propia, sin ilustración ni imagen full-bleed. Podría ser de cualquier SaaS.

## Objetivo

Convertirla en una landing **sorprendente, bold y con marca propia**, imposible de confundir con una plantilla, apoyándose en una **mascota** ("Currito") y una dirección de arte 3D premium, imágenes a sangre y tipografía pesada. Estética alineada con el gusto del dueño (Javier): bold/visual, NO minimalista-editorial.

## Decisiones de marca

### Mascota: Currito (FIJADA)

"Curro" = trabajo en castellano; "Currito" = el currante. Es la cara de la marca.

- **Qué es:** un currante humano, "el maestro de toda la vida": rechoncho, bajito, entrañable.
- **Estilo:** render **3D juguete de vinilo premium** (luz de estudio suave, acabado pulido, mucho carácter). NO flat, NO fotográfico.
- **Señas propias (para NO parecer un obrero genérico ni Super Mario):**
  - Bigote de maestro **cano/gris** (no el bigote redondo de Mario), cejas pobladas.
  - **Casco amarillo** con chapa/distintivo de marca en el frente.
  - **Mono azul** sobre **camiseta coral de marca** (no naranja).
  - **Pinganillo/auriculares con micro** visibles + **teléfono en la mano** → cuenta la promesa del producto: *él coge el teléfono*.
- **Referencia oficial:** `design/currito-referencias/currito-oficial.jpg` (busto 3/4, avatar principal) y `currito-primerplano.jpg` (primer plano "hablando").
- **Poses a generar** a partir del personaje fijado: cuerpo entero al teléfono (hero), preocupado (drama), señalando/explicando (pasos), escena en obra con fondo (full-bleed), pulgar arriba/celebrando (CTA final), cabeza/busto (logo + favicon).
- **Consistencia:** guardar el personaje como asset de librería (LoRA/character reference) para que todas las poses mantengan la misma cara.

### Logotipo

- **Lockup:** wordmark **"curro"** en la tipografía display pesada + **cabeza de Currito** (casco) como avatar a la izquierda.
- **Favicon / marca corta:** cabeza de Currito.
- **Variante solo-texto** para espacios reducidos.

### Paleta

Anclada en Currito; "escenario de obra" oscuro para el drama, coral para la acción.

| Rol | Token | Color | Uso |
|---|---|---|---|
| Escenario oscuro | `--color-ink` | `#06232b` | fondos full-bleed, hero, CTA final |
| Base clara | `--color-cream` | `#f3fbfb` | secciones claras |
| **Acción** | `--color-brand` | `#ff6b4a` | CTAs, resaltador, urgencia |
| Acción hover | `--color-brand-strong` | `#e8482a` | hover de CTAs |
| Acento fresco | `--color-fresh` | `#14b8a6` | iconos, líneas, detalles |
| Acento fresco legible | `--color-fresh-strong` | `#0c7f74` | texto teal sobre claro |
| **Energía (nuevo)** | `--color-casco` | `#ffc53d` | pops, badges, subrayados; liga con el casco |
| Profundo (nuevo) | `--color-mono` | `#2f6bff` | acento puntual; liga con el mono |

Disciplina de uso: tinta+crema como escenario, **coral = única acción**, teal+amarillo como acentos, azul con cuentagotas. Los tokens viven en `app/globals.css` (Tailwind v4 `@theme`).

### Tipografía

- **Display:** muy pesado y con carácter — subir Bricolage Grotesque a 800, o cambiar a una grotesca más chunky si se quiere más golpe (a decidir en implementación). Titulares **enormes**, condensados, a sangre.
- **Texto:** Instrument Sans.

## Estructura de la home

Enfoque **híbrido**: "mundo Currito" (escenas 3D a sangre) + **prueba de producto real** (la demo animada del móvil que ya existe), para lograr wow sin perder credibilidad.

1. **Nav** — logo lockup · "Entrar" · botón coral "Probar Curro".
2. **Hero** (escenario oscuro a sangre) — titular gigante (p. ej. *"Tú en la obra. Currito al teléfono."*), Currito 3D cuerpo entero con el móvil, CTA coral + línea de confianza, ondas de voz animadas.
3. **El drama** — *"Cada llamada perdida es una obra que se va a la competencia."* Dato grande + Currito "preocupado".
4. **Cómo funciona** — 4 pasos (Suena · Atiende · Captura · Avisa) con Currito señalando; **reutiliza la demo animada del móvil** (`components/marketing/hero-demo.tsx`) como prueba en Captura/Avisa.
5. **Escena 3D full-bleed** — Currito en la obra cogiendo el teléfono mientras el dueño trabaja tranquilo.
6. **Por qué Curro** — 24/7 · español natural · personalizable por negocio · avisa al instante. Bloques bold con número, sin iconitos genéricos.
7. **Prueba de producto** — demo real del móvil + ficha de datos capturados + aviso WhatsApp, reencuadrado bold.
8. **Precios** — Básico / Pro / Premium, coral en el recomendado. Refleja `lib/stripe/plans.ts`.
9. **FAQ** — legalidad de la grabación, número, idioma, permanencia, etc.
10. **CTA final full-bleed** — Currito con el pulgar arriba, "Pon a Currito a coger el teléfono" + footer.

## Motion

Reutilizar/ampliar utilidades ya existentes en `globals.css`: scroll-reveal (`animate-rise`), parallax suave de Currito, contadores de números, resaltador coral (`.marker`), waveform (`.wave-bar`). **Todo respeta `prefers-reduced-motion`** (ya contemplado). Sin librerías pesadas si se puede evitar; si hace falta scroll-driven, evaluar coste antes de añadir dependencia.

## Consideraciones técnicas

- **Stack:** Next.js 16 (App Router), Tailwind CSS v4 (tokens en `@theme`), shadcn/ui. Todo en español.
- **Imágenes:** las escenas 3D son pesadas → exportar optimizadas (WebP/AVIF), usar `next/image` con `sizes` y `priority` solo en el hero. Presupuesto de peso por vista y lazy-load del resto.
- **Rendimiento:** cuidar LCP del hero (imagen grande) y CLS (reservar espacio). Objetivo: Lighthouse ≥ 90 en móvil.
- **Accesibilidad:** contraste AA (coral sobre oscuro y sobre claro verificado), `alt` descriptivos en Currito, foco visible, navegación por teclado, `prefers-reduced-motion`.
- **SEO/OG:** mantener `metadata` y `metadataBase` en `app/layout.tsx`; imagen OG con Currito. Marca ya renombrada a "Curro" (hecho en PR#1).
- **Componentización:** cada sección un componente en `components/marketing/` (p. ej. `hero.tsx`, `drama.tsx`, `pasos.tsx`, `escena-obra.tsx`, `por-que.tsx`, `prueba.tsx`, `precios.tsx`, `faq.tsx`, `cta-final.tsx`) para mantener `app/page.tsx` legible. Reutilizar `hero-demo.tsx`.

## Fuera de alcance

- Panel (`app/panel/**`) y su lavado visual.
- Páginas legales (privacidad, aviso legal).
- Cambios de backend/producto (webhooks, Stripe, Supabase).

## Criterios de éxito

- La home ya **no parece una plantilla**: hay una mascota y un mundo propios.
- Currito es **coherente** en todas las poses (misma cara).
- Se mantiene la **prueba de producto** (demo real) → credibilidad.
- **Rendimiento y accesibilidad** no se sacrifican por el impacto visual (Lighthouse móvil ≥ 90, AA).
- La estructura vende: del drama (pierdes llamadas) a la solución (Currito) a la prueba a los precios a la acción.
