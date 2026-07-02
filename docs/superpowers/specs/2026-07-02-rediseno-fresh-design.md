# Rediseño "Fresh / En vivo" — Diseño

**Fecha:** 2026-07-02 · **Estado:** implementado y desplegado
**Motivo:** el rediseño neo-brutal ("Cartel") no encajaba con el público. Se busca una imagen **fresca, moderna, con mucho movimiento**, tipografías top y legibles, y copy **multi-gremio** (no solo obra/reformas). Se añade un **chatbot** de FAQs.

## Dirección: Fresh / En vivo
Luminoso, aireado, moderno. Verde vivo como color de marca ("en vivo/activo"), tipografía moderna, animaciones por todas partes, UI limpia con esquinas redondeadas y sombras suaves.

## Paleta (tokens en globals.css)
- `--color-paper` #FFFFFF · `--color-mist` #F4F6F4 (fondo alterno)
- `--color-ink` #0C0E12 (texto/secciones oscuras) · `--color-ink-soft` #3A4049
- `--color-verde` #12D97A (primario/acción) · `--color-verde-dark` #0BB867 · `--color-verde-soft` #E4FBF0
- `--color-violeta` #5B5BF5 (secundario) · `--color-violeta-soft` #ECEAFE

## Tipografía (next/font)
- Display: **Space Grotesk** (`.headline`, minúsculas, legible, moderno).
- Texto: **Inter**.

## Lenguaje visual
- `.card-fresh` (blanca, rounded-2xl, sombra suave), `.grad` (texto degradado verde→violeta), `.live-dot` (punto verde con pulso), `.section-dark` (fondo ink, texto blanco).
- Botones píldora verde (`ui.tsx`). Esquinas redondeadas, sombras suaves. Nada de bordes gruesos.
- **Movimiento**: `.marquee` (cinta de gremios), `.animate-float`, `.animate-rise-in` (burbujas de chat), reveal al scroll (`<Reveal>`), hover con `-translate-y`, tarjeta de "llamada en vivo" que cicla estados. Todo respeta `prefers-reduced-motion`.

## Copy — multi-gremio (NO solo obra)
Público = cualquier autónomo/gremio (fontaneros, electricistas, pintores, cerrajeros, climatización, reformas…). Se elimina "obra/andamio"; se usa neutro ("estés donde estés", "en plena faena", "a lo tuyo"). Cinta de gremios en el hero. Sin Currito de cuerpo entero con casco; Currito solo como avatar del asistente.

## Chatbot "Habla con Curro" (`components/chat/curro-chat.tsx`)
Widget flotante (cliente, sin backend): saludo + respuestas rápidas (FAQs) + entrada de texto con emparejamiento por palabras clave, animación de "escribiendo", avatar de Currito. Responde las preguntas frecuentes en línea.

## Secciones (misma estructura, reskin + copy neutro)
Nav glass · Hero animado + tarjeta "en vivo" · Cinta de gremios · Drama · Cómo funciona (4 pasos) · Por qué (sección oscura) · Precios (Pro en verde) · FAQ (acordeón) · CTA final (oscuro) · Footer (oscuro) · Chatbot flotante.

## Alcance / pendiente
- Hecho: toda la home + chatbot + fuentes/paleta/animaciones.
- Pendiente (opcional): alinear login/registro al 100% del estilo fresh (hoy heredan la paleta vía alias).
