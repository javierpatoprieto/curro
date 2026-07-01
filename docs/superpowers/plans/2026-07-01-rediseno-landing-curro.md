# Rediseño de la landing de Curro — Plan de implementación

> **Para trabajadores agénticos:** ejecutar tarea a tarea. Verificación por preview + typecheck + lint + build (no TDD unitario: es una landing visual sin lógica testeable; los tests existentes son de negocio y deben seguir en verde).

**Goal:** Rehacer la home de Curro como landing bold con mascota Currito (3D premium), logo, paleta ampliada y 10 secciones, sin tocar panel/legal/backend.

**Architecture:** Componentes de sección independientes en `components/marketing/`, ensamblados en `app/page.tsx`. Tokens de marca en `app/globals.css` (Tailwind v4 `@theme`). Assets 3D de Currito generados por IA a partir de la referencia oficial y servidos optimizados desde `public/currito/`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, next/font, next/image.

**Spec:** `docs/superpowers/specs/2026-07-01-rediseno-landing-curro-design.md`

---

## Tarea 1: Sistema de marca (paleta + tipografía)
**Files:** Modify `app/globals.css`, `app/layout.tsx`
- [ ] Añadir tokens `--color-casco: #ffc53d` y `--color-mono: #2f6bff` en `:root` y exponerlos en `@theme inline` como `--color-casco`/`--color-mono`.
- [ ] Subir el peso de la display: usar Bricolage Grotesque con `weight` hasta 800; ajustar `--font-display`.
- [ ] Añadir utilidades de sección: `.section-dark` (fondo ink, texto crema) y `.full-bleed`.
- [ ] Verificar: `npm run typecheck`.

## Tarea 2: Generar assets de Currito
**Files:** Create `public/currito/*.webp`
- [ ] Generar poses a partir de la referencia oficial (consistencia de cara): hero cuerpo entero al teléfono, preocupado, señalando, escena en obra (fondo), pulgar arriba, cabeza (logo/favicon).
- [ ] Recortar fondo donde haga falta (remove-background) y exportar a WebP optimizado.
- [ ] Colocar en `public/currito/` con nombres claros (`hero.webp`, `preocupado.webp`, `senala.webp`, `obra.webp`, `pulgar.webp`, `cabeza.webp`).

## Tarea 3: Logo + Nav
**Files:** Create `components/marketing/logo.tsx`, `components/marketing/nav.tsx`
- [ ] `Logo`: wordmark "curro" en display pesada + `cabeza.webp` como avatar; prop `soloTexto`.
- [ ] `Nav`: logo + "Entrar" + botón coral "Probar Curro"; sticky, transparente sobre hero.

## Tarea 4: Hero
**Files:** Create `components/marketing/hero.tsx`; Modify `app/page.tsx`
- [ ] Sección `section-dark` a sangre: titular gigante, subcopy, CTA coral + línea de confianza, `hero.webp` con `priority`, ondas de voz.
- [ ] Montar `Nav` + `Hero` en `app/page.tsx` y verificar en preview.

## Tarea 5: Secciones de contenido
**Files:** Create en `components/marketing/`: `drama.tsx`, `pasos.tsx`, `escena-obra.tsx`, `por-que.tsx`, `prueba.tsx`
- [ ] `drama`: dato grande + `preocupado.webp`.
- [ ] `pasos`: 4 pasos con `senala.webp`, reutilizando `hero-demo.tsx` en Captura/Avisa.
- [ ] `escena-obra`: full-bleed con `obra.webp`.
- [ ] `por-que`: bloques bold numerados (24/7, español, personalizable, avisa al instante).
- [ ] `prueba`: demo real del móvil + ficha de datos + aviso WhatsApp, reencuadrado.

## Tarea 6: Precios + FAQ + CTA final + Footer
**Files:** Create `precios.tsx`, `faq.tsx`, `cta-final.tsx`, `footer.tsx`
- [ ] `precios`: Básico/Pro/Premium (según `lib/stripe/plans.ts`), coral en recomendado.
- [ ] `faq`: acordeón accesible (grabación legal, número, idioma, permanencia).
- [ ] `cta-final`: full-bleed con `pulgar.webp` + CTA.
- [ ] `footer`: enlaces legales + marca.

## Tarea 7: Ensamblado, motion y pulido
**Files:** Modify `app/page.tsx`, `app/globals.css`
- [ ] Ensamblar todas las secciones en orden.
- [ ] Scroll-reveal en secciones (`animate-rise`), respetar `prefers-reduced-motion`.
- [ ] `alt` descriptivos, foco visible, contraste AA.

## Tarea 8: Verificación final
- [ ] `npm run typecheck` · `npm run lint` · `npm test` (35 en verde) · `npm run build`.
- [ ] Preview: revisar hero, secciones, responsive (móvil/tablet), consola sin errores.
- [ ] Commit y push de la rama.
