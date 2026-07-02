# Emails de Curro — plantillas y configuración

## 1. Plantillas de auth (Supabase)

En **Supabase → Authentication → Email Templates**, pega el HTML de cada fichero
y pon el asunto sugerido:

| Plantilla de Supabase | Fichero | Asunto |
|---|---|---|
| Confirm signup | `confirmar-cuenta.html` | Confirma tu cuenta de Curro |
| Reset Password | `recuperar-contrasena.html` | Restablece tu contraseña de Curro |

Ambas usan la variable `{{ .ConfirmationURL }}` (el enlace de acción). Las demás
plantillas (Magic Link, Invite, etc.) no se usan con el flujo actual de
email+contraseña, así que no hace falta tocarlas.

## 2. SMTP propio con Resend (producción)

El email integrado de Supabase está limitado (pocos/hora) y con peor
entregabilidad. Para producción, configura SMTP de Resend:

1. **Resend** → verifica el dominio **soycurro.es** (añade los registros DNS que
   te indique: SPF, DKIM). Crea una **API key**.
2. **Supabase → Authentication → SMTP Settings** → *Enable Custom SMTP*:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: *(la API key de Resend)*
   - Sender email: `no-reply@soycurro.es`
   - Sender name: `Curro`
3. Sube los límites en **Authentication → Rate Limits** si hace falta.

> El mismo dominio verificado sirve para los avisos de leads (`EMAIL_FROM`), que
> ya usan Resend por API.

## 3. Portal de facturación (Stripe)

El botón del panel (`/panel/facturacion`) abre el **Customer Portal** de Stripe.
Hay que activarlo una vez:

1. **Stripe → Settings → Billing → Customer portal** → actívalo.
2. En *Functionality*, habilita: **Invoices** (descarga de facturas),
   **Update payment method** y **Cancel subscriptions**.
3. Rellena los datos de negocio (nombre, dirección) que aparecerán en la factura.

Con el Checkout ya se recogen **dirección + NIF/CIF** (`billing_address_collection`
+ `tax_id_collection`), así que las facturas salen válidas para desgravar.
