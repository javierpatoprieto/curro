# Base de datos (Supabase)

Esquema multi-tenant con **Row Level Security**. Todo se aísla por `business_id`.

## Aplicar el esquema

### Opción A — SQL Editor (rápido)

1. Entra en tu proyecto de Supabase → **SQL Editor**.
2. Pega y ejecuta el contenido de [`schema.sql`](./schema.sql).
3. (Opcional, para desarrollo) pega y ejecuta [`seed.sql`](./seed.sql).

### Opción B — Supabase CLI

```bash
supabase db execute --file supabase/schema.sql
supabase db execute --file supabase/seed.sql   # solo desarrollo
```

## Modelo de datos

| Tabla         | Para qué                                                        |
| ------------- | -------------------------------------------------------------- |
| `businesses`  | El tenant (empresa de reformas).                              |
| `owners`      | Usuarios del tenant, ligados a `auth.users` vía `user_id`.    |
| `leads`       | Cada oportunidad captada por la IA.                          |
| `messages`    | WhatsApp/email enviados y recibidos (con `estado_envio`).    |
| `call_events` | Payloads crudos de Vapi + duración y coste estimado.        |

## Cómo funciona el aislamiento (RLS)

- Los usuarios acceden con la **anon key**; RLS solo les deja ver filas de los
  negocios a los que pertenecen (según `owners.user_id = auth.uid()`).
- La función `current_business_ids()` (SECURITY DEFINER) resuelve esos negocios
  sin recursión de políticas.
- Los **webhooks** y el **onboarding** usan la `service_role` key, que **salta
  RLS**; ese código es responsable de filtrar por `business_id`.

## Enlazar un usuario a un owner

Cuando el dueño entra por primera vez con **magic link**, Supabase crea su fila en
`auth.users`. Para asociarla a su `owner` (y que RLS le muestre sus datos),
enlaza por email:

```sql
update public.owners o
set user_id = u.id
from auth.users u
where u.email = o.email
  and o.user_id is null;
```

> En Fase 5 (onboarding) esto se automatizará al crear el negocio.

## Probar el aislamiento

Con dos negocios y dos usuarios distintos, cada uno autenticado con su sesión,
una consulta `select * from leads` debe devolver **solo** sus propios leads.
En Fase 6 añadiremos un test automatizado de esto.
