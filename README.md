# AtiendeReformas

Recepcionista con **IA** para pequeñas empresas de reformas y multiservicios del
hogar en España. Cuando el dueño está en obra y no coge el teléfono, un agente de
voz atiende la llamada 24/7, cualifica al cliente y le pasa el lead al instante
por WhatsApp, además de agendar la visita de valoración.

SaaS **multi-tenant** por suscripción. Cada negocio (tenant) tiene su número, su
asistente de voz y su panel, con aislamiento total de datos vía RLS.

## Stack

- **Next.js 16** (App Router, TypeScript) — UI + API en un solo proyecto.
- **Supabase** (Postgres + Auth + RLS) — datos y autenticación (magic link).
- **Vapi** — agente de voz que atiende las llamadas.
- **WhatsApp Cloud API** (Meta) — notificaciones.
- **Resend** — email.
- **Cal.com** — agenda de visitas (enlace por tenant).
- **Stripe** — suscripciones.
- **Tailwind CSS v4 + shadcn/ui** — interfaz, en español.
- **Vitest** — tests de lógica de negocio.

## Arrancar en local

Requisitos: Node.js ≥ 20.9 y npm.

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
cp .env.example .env.local
#   Para desarrollo puedes dejar MOCK_PROVIDERS=true y arrancar sin cuentas.
#   Para datos reales, rellena las claves de Supabase (mínimo).

# 3. Base de datos (si usas Supabase real)
#   Aplica supabase/schema.sql y supabase/seed.sql. Ver supabase/README.md.

# 4. Servidor de desarrollo
npm run dev
#   → http://localhost:3000
```

## Scripts

| Comando             | Qué hace                                        |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo (Turbopack).            |
| `npm run build`     | Build de producción.                           |
| `npm start`         | Sirve el build de producción.                  |
| `npm run lint`      | ESLint.                                         |
| `npm run typecheck` | Comprobación de tipos (`tsc --noEmit`).        |
| `npm test`          | Tests con Vitest.                              |

## Estructura

```
app/                 Rutas (App Router): páginas y API (route handlers)
components/ui/       Componentes shadcn/ui
lib/                 Lógica: env, tipos, clientes de Supabase, adaptadores
supabase/            schema.sql (con RLS) + seed.sql + guía
tests/               Tests de Vitest
```

## Modelo multi-tenant

Todo se aísla por `business_id` mediante **Row Level Security**:

- **Usuarios** (dueños) entran con magic link y solo ven los datos de su negocio.
- **Webhooks** (Vapi/Stripe/Meta) usan la `service_role` key y filtran por
  `business_id` en el código.

Detalles en [`supabase/README.md`](./supabase/README.md).

## Estado del proyecto

Construcción por fases:

- [x] **Fase 0** — Scaffold: proyecto, Supabase + RLS, seed, tests, este README.
- [x] **Fase 1** — Auth (magic link) y panel base.
- [x] **Fase 2** — Webhook de Vapi (parser + tests). Ver [docs/vapi.md](./docs/vapi.md).
- [x] **Fase 3** — WhatsApp + email al crear lead (adaptadores + mocks, reintentos, `messages`).
- [ ] Fase 4 — Panel de leads funcional.
- [ ] Fase 5 — Onboarding + Stripe.
- [ ] Fase 6 — Cumplimiento y pulido.

## Despliegue

App en **Vercel**, base de datos en **Supabase**. Este proyecto es independiente
del resto del repositorio y tiene su propio despliegue y variables de entorno.
