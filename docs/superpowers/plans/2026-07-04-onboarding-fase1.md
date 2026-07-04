# Onboarding — Fase 1: planes, agenda API-key y wizard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el alta de admin (a) gatee capacidades por plan con precios/límites nuevos (Starter 49€ / Pro 99€ / Premium 199€), (b) conecte la agenda por API-key desde admin reutilizando el flujo existente, y (c) sea un wizard por pasos.

**Architecture:** Extender el scaffolding que YA existe — `lib/stripe/precios.ts` (precios), `lib/usage.ts` (límites por plan), `components/panel/cal-conectar.tsx` + `guardarCalIntegracion` (conectar Cal por API-key en el panel del cliente) — en vez de crear de cero. Se añade una capa fina de **entitlements** (`lib/plans.ts`) que define qué incluye cada plan, y se usa en cliente (habilitar/bloquear) y servidor (rechazar).

**Tech Stack:** Next.js (app router, server actions, RSC + client components), Supabase (admin client, service_role), Vapi, Zod, Vitest.

**Base:** worktree `/Users/javier/Desktop/Cladue/curro-onboarding`, rama `feat/onboarding-alta` (desde `origin/main`). La edición del contacto del dueño ya está hecha en `feat/editar-contacto-dueno` (dependencia resuelta; no se toca aquí).

---

## File Structure

- **Create** `lib/plans.ts` — mapa `plan → entitlements` (agenda, confirmacionCliente, numeroDedicado, multiNumero) + helpers `puede(plan, cap)`. Fuente única para gating.
- **Create** `lib/plans.test.ts` — tests del mapa/helpers.
- **Modify** `lib/stripe/precios.ts` — `PRECIO_MENSUAL` a 49/99/199 (y trial 0, cancelado 0).
- **Modify** `lib/usage.ts` — `LIMITE_LLAMADAS` alineado a los packs nuevos.
- **Modify** `lib/stripe/precios.test.ts` (o crear si no existe) — fija los precios nuevos.
- **Create** `app/admin/clientes/[id]/cal-actions.ts` — server action `guardarCalAdmin(businessId, formData)` que reutiliza `guardarCalIntegracion` + resincroniza el assistant, gated por entitlement.
- **Modify** `app/admin/clientes/[id]/page.tsx` — mostrar la conexión de agenda (reusar `CalConectar`) solo si el plan la incluye.
- **Create** `components/admin/wizard-alta.tsx` — client component: el formulario de alta en pasos, con gating por plan.
- **Modify** `app/admin/clientes/nuevo/page.tsx` — renderizar `<WizardAlta/>` en vez del form plano.
- **Modify** `app/admin/clientes/nuevo/actions.ts` — `crearClienteAdmin`: validar/gate capacidades por plan en servidor; aceptar `cal_api_key`/`cal_event_type_id` opcionales y crear `business_integrations` + `calConectado=true` al crear el assistant si vienen.

---

### Task 1: Entitlements por plan (`lib/plans.ts`)

**Files:**
- Create: `lib/plans.ts`
- Test: `lib/plans.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/plans.test.ts
import { describe, it, expect } from "vitest";
import { ENTITLEMENTS, puede, type Capacidad } from "@/lib/plans";

describe("entitlements por plan", () => {
  it("Starter: sin agenda, sin número dedicado, con aviso al dueño", () => {
    expect(puede("starter", "agenda")).toBe(false);
    expect(puede("starter", "numeroDedicado")).toBe(false);
    expect(puede("starter", "confirmacionCliente")).toBe(false);
  });

  it("Pro: agenda + confirmación + número dedicado, sin multi-número", () => {
    expect(puede("pro", "agenda")).toBe(true);
    expect(puede("pro", "confirmacionCliente")).toBe(true);
    expect(puede("pro", "numeroDedicado")).toBe(true);
    expect(puede("pro", "multiNumero")).toBe(false);
  });

  it("Premium: todo", () => {
    const caps: Capacidad[] = ["agenda", "confirmacionCliente", "numeroDedicado", "multiNumero"];
    for (const c of caps) expect(puede("premium", c)).toBe(true);
  });

  it("trial hereda features de Pro; cancelado no puede nada", () => {
    expect(puede("trial", "agenda")).toBe(true);
    expect(puede("cancelado", "agenda")).toBe(false);
  });

  it("todos los planes del tipo Plan están en ENTITLEMENTS", () => {
    expect(Object.keys(ENTITLEMENTS).sort()).toEqual(
      ["cancelado", "premium", "pro", "starter", "trial"].sort(),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/plans.test.ts`
Expected: FAIL ("Cannot find module '@/lib/plans'").

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/plans.ts
import type { Plan } from "@/lib/types";

/** Capacidades que un plan puede incluir (el aviso al dueño va SIEMPRE, no se lista). */
export type Capacidad =
  | "agenda"
  | "confirmacionCliente"
  | "numeroDedicado"
  | "multiNumero";

type Entitlement = Record<Capacidad, boolean>;

const NINGUNA: Entitlement = {
  agenda: false,
  confirmacionCliente: false,
  numeroDedicado: false,
  multiNumero: false,
};

const PRO: Entitlement = {
  agenda: true,
  confirmacionCliente: true,
  numeroDedicado: true,
  multiNumero: false,
};

export const ENTITLEMENTS: Record<Plan, Entitlement> = {
  trial: PRO, // el trial deja probar el "wow" (agenda incluida)
  starter: NINGUNA,
  pro: PRO,
  premium: { ...PRO, multiNumero: true },
  cancelado: NINGUNA,
};

/** ¿El plan incluye esta capacidad? Fuente única de verdad para el gating. */
export function puede(plan: Plan, cap: Capacidad): boolean {
  return ENTITLEMENTS[plan]?.[cap] ?? false;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/plans.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/plans.ts lib/plans.test.ts
git commit -m "feat(plans): entitlements por plan (agenda/confirmacion/numero/multi)"
```

---

### Task 2: Precios y límites nuevos (49/99/199)

**Files:**
- Modify: `lib/stripe/precios.ts`
- Modify: `lib/usage.ts:8-14` (`LIMITE_LLAMADAS`)
- Test: `lib/stripe/precios.test.ts`

- [ ] **Step 1: Read current prices**

Run: `sed -n '1,40p' lib/stripe/precios.ts`
Anota la forma exacta de `PRECIO_MENSUAL` (es `Record<Plan, number>` en euros/mes).

- [ ] **Step 2: Write the failing test**

```ts
// lib/stripe/precios.test.ts
import { describe, it, expect } from "vitest";
import { PRECIO_MENSUAL } from "@/lib/stripe/precios";

describe("precios mensuales por plan (packs 2026)", () => {
  it("Starter 49 · Pro 99 · Premium 199 · trial/cancelado 0", () => {
    expect(PRECIO_MENSUAL.starter).toBe(49);
    expect(PRECIO_MENSUAL.pro).toBe(99);
    expect(PRECIO_MENSUAL.premium).toBe(199);
    expect(PRECIO_MENSUAL.trial).toBe(0);
    expect(PRECIO_MENSUAL.cancelado).toBe(0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/stripe/precios.test.ts`
Expected: FAIL (los valores viejos eran starter 99 / pro 149).

- [ ] **Step 4: Update the prices**

En `lib/stripe/precios.ts`, poner `PRECIO_MENSUAL` a:

```ts
export const PRECIO_MENSUAL: Record<Plan, number> = {
  trial: 0,
  starter: 49,
  pro: 99,
  premium: 199,
  cancelado: 0,
};
```

- [ ] **Step 5: Update call limits to match packs**

En `lib/usage.ts`, `LIMITE_LLAMADAS` — alinear a los minutos de los packs (llamada media ≈ 2 min, así que límite de llamadas ≈ minutos/2, redondeado):

```ts
export const LIMITE_LLAMADAS: Record<Plan, number> = {
  trial: 15, // ~30 min
  starter: 35, // ~75 min
  pro: 75, // ~150 min
  premium: 225, // ~450 min
  cancelado: 0,
};
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run lib/stripe/precios.test.ts lib/metrics`
Expected: PASS. Si algún test de MRR fijaba 99/149, actualízalo a 49/99 (mismo patrón, nuevos números).

- [ ] **Step 7: Commit**

```bash
git add lib/stripe/precios.ts lib/stripe/precios.test.ts lib/usage.ts lib/metrics
git commit -m "feat(planes): precios 49/99/199 y límites de llamadas por pack"
```

---

### Task 3: Conectar agenda (API-key) desde el detalle del cliente en admin

Reutiliza el componente y el helper que YA existen en el panel del cliente
(`components/panel/cal-conectar.tsx`, `guardarCalIntegracion`, `actualizarAssistant`).

**Files:**
- Create: `app/admin/clientes/[id]/cal-actions.ts`
- Modify: `app/admin/clientes/[id]/page.tsx`
- Test: `app/admin/clientes/[id]/cal-actions.test.ts`

- [ ] **Step 1: Read the existing panel action to mirror it**

Run: `sed -n '100,170p' app/panel/ajustes/actions.ts`
Fíjate en cómo valida (`cal_api_key` min 8, `cal_event_type_id` min 1), llama a `guardarCalIntegracion` y resincroniza el assistant con `calConectado: true`.

- [ ] **Step 2: Write the failing test (gating por plan)**

```ts
// app/admin/clientes/[id]/cal-actions.test.ts
import { describe, it, expect } from "vitest";
import { calPermitidoParaPlan } from "./cal-actions";

describe("gating de agenda por plan en admin", () => {
  it("bloquea Starter, permite Pro/Premium/Trial", () => {
    expect(calPermitidoParaPlan("starter")).toBe(false);
    expect(calPermitidoParaPlan("pro")).toBe(true);
    expect(calPermitidoParaPlan("premium")).toBe(true);
    expect(calPermitidoParaPlan("trial")).toBe(true);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run "app/admin/clientes/[id]/cal-actions.test.ts"`
Expected: FAIL (módulo/func no existe).

- [ ] **Step 4: Implement the admin cal action**

```ts
// app/admin/clientes/[id]/cal-actions.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Plan } from "@/lib/types";
import { exigirAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { guardarCalIntegracion } from "@/lib/cal/integracion";
import { actualizarAssistant } from "@/lib/vapi/assistant";
import { puede } from "@/lib/plans";
import { configDesdeNegocio } from "@/lib/vapi/config-negocio"; // ver nota

/** Puro y testeable: ¿el plan permite agenda? */
export function calPermitidoParaPlan(plan: Plan): boolean {
  return puede(plan, "agenda");
}

const schema = z.object({
  cal_api_key: z.string().min(8),
  cal_event_type_id: z.string().min(1),
});

export async function guardarCalAdmin(businessId: string, formData: FormData) {
  await exigirAdmin();
  const admin = createAdminClient();

  const { data: biz } = await admin
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();
  if (!biz) redirect("/admin");
  if (!calPermitidoParaPlan(biz.plan as Plan)) {
    redirect(`/admin/clientes/${businessId}?error=plan_agenda`);
  }

  const parsed = schema.safeParse({
    cal_api_key: (formData.get("cal_api_key") as string)?.trim(),
    cal_event_type_id: (formData.get("cal_event_type_id") as string)?.trim(),
  });
  if (!parsed.success) redirect(`/admin/clientes/${businessId}?error=validacion`);

  await guardarCalIntegracion(admin, businessId, parsed.data);

  try {
    if (biz.vapi_assistant_id) {
      await actualizarAssistant(biz.vapi_assistant_id, {
        ...configDesdeNegocio(biz),
        calConectado: true,
      });
    }
  } catch (e) {
    console.error("[admin] no se pudo resincronizar el assistant tras conectar Cal:", e);
  }

  revalidatePath(`/admin/clientes/${businessId}`);
  redirect(`/admin/clientes/${businessId}?ok=1`);
}
```

> **Nota (Step 4a):** `configDesdeNegocio(biz)` mapea una fila `businesses` a `AssistantConfig`. Ya existe una función equivalente en `app/panel/ajustes/actions.ts` (`configDesdeNegocio`). Si no está exportada de forma reutilizable, extráela a `lib/vapi/config-negocio.ts` en un paso previo y reimpórtala en ambos sitios (DRY). Confírmalo con: `grep -rn "configDesdeNegocio" app/ lib/`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run "app/admin/clientes/[id]/cal-actions.test.ts"`
Expected: PASS.

- [ ] **Step 6: Surface the connector in the client detail (gated)**

En `app/admin/clientes/[id]/page.tsx`, importar el estado de Cal y el componente:

```tsx
import { calConectado as leerCalConectado } from "@/lib/cal/integracion";
import { puede } from "@/lib/plans";
import { CalConectar } from "@/components/panel/cal-conectar";
// ...dentro del RSC, con `biz` ya cargado y `admin` disponible:
const agendaPermitida = puede(biz.plan, "agenda");
const conectado = agendaPermitida
  ? await leerCalConectado(createAdminClient(), biz.id)
  : false;
// ...en el JSX:
{agendaPermitida ? (
  <CalConectar conectado={conectado} action={guardarCalAdmin.bind(null, biz.id)} />
) : (
  <p className="text-sm text-[var(--muted-foreground)]">
    La agenda automática está disponible en el plan Pro.
  </p>
)}
```

> **Nota:** revisa la firma de `CalConectar` en `components/panel/cal-conectar.tsx`; si hoy no acepta una prop `action` (usa la del panel por defecto), añádele una prop opcional `action?: (fd: FormData) => void` y úsala si viene. Cambio mínimo, no rompe el uso actual en `/panel/ajustes`.

- [ ] **Step 7: Commit**

```bash
git add "app/admin/clientes/[id]/cal-actions.ts" "app/admin/clientes/[id]/cal-actions.test.ts" "app/admin/clientes/[id]/page.tsx" components/panel/cal-conectar.tsx lib/vapi/config-negocio.ts 2>/dev/null
git commit -m "feat(admin): conectar agenda (API-key) desde el detalle del cliente, gated por plan"
```

---

### Task 4: Wizard de alta por pasos + gating en servidor

**Files:**
- Create: `components/admin/wizard-alta.tsx` (client component)
- Modify: `app/admin/clientes/nuevo/page.tsx` (renderiza el wizard)
- Modify: `app/admin/clientes/nuevo/actions.ts` (gating por plan + acepta cal opcional)
- Test: `app/admin/clientes/nuevo/actions.test.ts`

- [ ] **Step 1: Server gating — write the failing test**

```ts
// app/admin/clientes/nuevo/actions.test.ts
import { describe, it, expect } from "vitest";
import { capacidadesEfectivas } from "./actions";

describe("capacidades efectivas según plan en el alta", () => {
  it("ignora agenda/confirmación si el plan no las incluye (Starter)", () => {
    const c = capacidadesEfectivas("starter", { agenda: true, confirmacionCliente: true });
    expect(c.agenda).toBe(false);
    expect(c.confirmacionCliente).toBe(false);
  });
  it("respeta lo pedido si el plan lo permite (Pro)", () => {
    const c = capacidadesEfectivas("pro", { agenda: true, confirmacionCliente: false });
    expect(c.agenda).toBe(true);
    expect(c.confirmacionCliente).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/admin/clientes/nuevo/actions.test.ts`
Expected: FAIL (`capacidadesEfectivas` no existe).

- [ ] **Step 3: Add server gating helper + use it in `crearClienteAdmin`**

En `app/admin/clientes/nuevo/actions.ts` añadir (y exportar) el helper puro, ampliar el schema con `agenda`, `confirmacion_cliente`, `cal_api_key`, `cal_event_type_id` opcionales, y crear `business_integrations` + assistant con `calConectado` cuando proceda:

```ts
import { puede } from "@/lib/plans";
import type { Plan } from "@/lib/types";
import { guardarCalIntegracion } from "@/lib/cal/integracion";

export function capacidadesEfectivas(
  plan: Plan,
  pedidas: { agenda?: boolean; confirmacionCliente?: boolean },
) {
  return {
    agenda: Boolean(pedidas.agenda) && puede(plan, "agenda"),
    confirmacionCliente:
      Boolean(pedidas.confirmacionCliente) && puede(plan, "confirmacionCliente"),
  };
}
```

En `crearClienteAdmin`, tras parsear:
- `const caps = capacidadesEfectivas(d.plan, { agenda: formData.get("agenda") === "on", confirmacionCliente: formData.get("confirmacion_cliente") === "on" });`
- Pasar `calConectado: caps.agenda && Boolean(d.cal_api_key && d.cal_event_type_id)` al `crearAssistant(config)`.
- Tras insertar el negocio, si `caps.agenda && d.cal_api_key && d.cal_event_type_id`: `await guardarCalIntegracion(admin, biz.id, { cal_api_key: d.cal_api_key, cal_event_type_id: d.cal_event_type_id });`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/admin/clientes/nuevo/actions.test.ts`
Expected: PASS.

- [ ] **Step 5: Build the wizard client component**

Crear `components/admin/wizard-alta.tsx` como client component (`"use client"`) que envuelve el `<form action={crearClienteAdmin}>` y muestra los campos en pasos con estado local `paso`:
- Pasos: `["Negocio", "Plan", "Voz & tono", "Capacidades", "Teléfono", "Contacto", "Revisar"]`.
- El paso **Plan** setea un estado `plan`; el paso **Capacidades** deshabilita los checkboxes `agenda`/`confirmacion_cliente` si `!puede(plan, cap)` (importa `puede` de `@/lib/plans`, que es puro y client-safe).
- Los inputs de cada paso siguen dentro del MISMO `<form>` (se ocultan con CSS/estado, no se desmontan, para que el submit final envíe todo). Reusar `inputCls` y el patrón de campos del page.tsx actual.
- Botones Anterior/Siguiente (no submit) y en el último paso el submit `Crear cliente`.
- Teléfono: por ahora un placeholder (radio `phone_mode` desvío/nuevo, sin lógica de aprovisionamiento — es Fase 2).

> El código completo del componente es extenso; seguir el patrón de campos de `app/admin/clientes/nuevo/page.tsx` (los mismos `name=`), moviéndolos a `<Paso>`s. Mantener los `name` EXACTOS que espera `crearClienteAdmin` (nombre, email, ciudad, actividad, plan, voz, tono, whatsapp, servicios, zonas, horario, preguntas_clave, conocimiento, activo) y añadir `agenda`, `confirmacion_cliente`, `cal_api_key`, `cal_event_type_id`, `phone_mode`.

- [ ] **Step 6: Render the wizard in the page**

En `app/admin/clientes/nuevo/page.tsx`, sustituir el `<form>` plano por `<WizardAlta action={crearClienteAdmin} />` (el page.tsx sigue siendo RSC que hace `exigirAdmin()` y pasa la server action al client component).

- [ ] **Step 7: Typecheck, lint y test**

Run: `npx tsc --noEmit && npx eslint app/admin components/admin lib/plans.ts && npx vitest run`
Expected: sin errores; todos los tests en verde.

- [ ] **Step 8: Verificar en el navegador (preview)**

Levantar el dev server y comprobar el wizard: gating de capacidades por plan (Starter deshabilita agenda), navegación por pasos, y que al crear un cliente Pro con cal_api_key se crea `business_integrations` y el assistant queda con agendado. (Ver skill `verify`/`run`.)

- [ ] **Step 9: Commit**

```bash
git add app/admin/clientes/nuevo components/admin/wizard-alta.tsx
git commit -m "feat(admin): wizard de alta por pasos con gating por plan y agenda opcional"
```

---

## Self-Review

- **Cobertura del spec (Fase 1):** planes+precios+límites (Task 1-2) ✓ · agenda API-key en admin (Task 3) ✓ · wizard + gating servidor (Task 4) ✓. Teléfono real, checklist async, medición y OAuth quedan explícitamente para fases 2-4.
- **Placeholders:** el único bloque no-literal es el cuerpo del wizard (Task 4, Step 5), acotado con instrucciones exactas de `name=` y patrón a seguir por su tamaño; el resto lleva código completo.
- **Consistencia de tipos:** `Plan` viene de `lib/types`; `puede`/`ENTITLEMENTS`/`Capacidad` de `lib/plans`; `guardarCalIntegracion`/`calConectado` de `lib/cal/integracion`; `PRECIO_MENSUAL` de `lib/stripe/precios`. `configDesdeNegocio` se centraliza en `lib/vapi/config-negocio.ts` (Task 3 nota) y se reusa.

## Riesgos / notas

- Confirmar la firma real de `PRECIO_MENSUAL` y de `CalConectar` antes de editarlos (los steps lo piden con `sed`/`grep`).
- La rama `feat/editar-contacto-dueno` (contacto del dueño) debería mergearse a `main` antes o en paralelo; no bloquea esta fase pero conviven en el detalle del cliente.
