# Rediseño "Cartel" (neo-brutal) de la landing — Diseño

**Fecha:** 2026-07-02 · **Estado:** aprobado, en implementación
**Motivo:** la landing seguía leyéndose como "AI slop" (plantilla SaaS oscura genérica, paleta teal/coral muy vista, tipografía de moda). Se busca identidad propia y bold, de oficio/gremio.

## Dirección elegida: C · CARTEL (neo-brutal)
Póster hecho a mano: bordes negros gruesos, sombras duras, bloques planos, tipografía bestia. Loud, con carácter, anti-corporativo.

## Paleta (única fuente de verdad)
- `--color-bg` hueso `#FBF7F0` (fondo)
- `--color-ink` negro `#000000` (texto, bordes, sombras)
- `--color-azul` azul eléctrico `#1E4EE8` (primario)
- `--color-coral` coral `#FF5A3C` (acción/CTA)
- `--color-casco` amarillo casco `#FFCB05` (acento, checks; liga con Currito)
- `--color-white` `#ffffff` (tarjetas)

## Tipografía (next/font Google)
- Display: **Archivo Black** → `--font-display`. Titulares en MAYÚSCULAS, `line-height:.9`, tracking negativo.
- Mono: **Space Mono** → `--font-mono`. Kickers, etiquetas, datos.
- Texto: **Archivo** → `--font-sans`.

## Lenguaje neo-brutal (utilidades en globals.css)
- `.nb-border` borde 3px negro. `.nb-shadow` sombra dura `6px 6px 0 #000`.
- `.nb-card` fondo blanco + borde + sombra. `.btn-nb` botón sticker (relleno, borde, sombra; al pulsar/hover la sombra se encoge = efecto "hundir").
- Resaltados de palabra en bloque azul/coral (`.hl-azul`, `.hl-coral`).
- CERO degradados/blur/glow. Todo plano.
- Currito: cutouts existentes usados como pegatinas con borde negro.

## Secciones (misma estructura, reskin total)
Nav bordeada + CTA coral · Hero (titular bestia + tarjeta "llamada en directo") · Drama (bloque + Currito preocupado) · Cómo funciona (4 pasos en tarjetas numeradas mono) · Por qué (rejilla de bloques bordeados) · Precios (3 tarjetas, Pro elevada con sombra coral) · FAQ (acordeón bordeado) · CTA final (bloque azul a sangre + Currito pulgar) · Footer mono.

## Motion
Micro-interacciones: botones que se "hunden" (sombra→0 y translate en :active/hover), reveal al scroll (`.reveal` existente). Respeta `prefers-reduced-motion`.

## Alcance
- Reskin de `components/marketing/*` + tokens/fuentes (`app/globals.css`, `app/layout.tsx`).
- Login/registro/recuperar/nueva-contrasena alineados al sistema (coherencia).
- Fuera: panel, páginas legales, backend.

## Éxito
- No parece plantilla: identidad propia inmediata.
- Coherencia total del sistema (bordes/sombras/tipos).
- Rendimiento y accesibilidad AA no se sacrifican (contraste alto por diseño).
