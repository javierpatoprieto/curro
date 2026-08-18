import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";

export const metadata: Metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Política de cookies</h1>
      <p className="text-[var(--muted-foreground)]">
        Última actualización: 3 de julio de 2026
      </p>

      <h2 className="pt-4 text-lg font-semibold">Qué son las cookies</h2>
      <p>
        Las cookies son pequeños archivos que un sitio web guarda en tu navegador
        para que ciertas funciones operen correctamente o para obtener información
        sobre el uso del sitio.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Cookies que usamos</h2>
      <p>
        <strong>1. Técnicas o esenciales.</strong> Necesarias para el inicio de
        sesión y para mantener tu sesión mientras usas el panel (gestionadas por
        nuestro proveedor de autenticación, Supabase). No requieren
        consentimiento y no se pueden desactivar.
      </p>
      <p>
        <strong>2. Analíticas (Google Analytics 4).</strong> Nos permiten medir de
        forma estadística cómo se usa la web (páginas vistas, origen del tráfico)
        para mejorarla. Utilizan cookies como <code>_ga</code> y{" "}
        <code>_ga_&lt;id&gt;</code>, con una duración de hasta 2 años. El proveedor
        es Google, que puede tratar datos fuera del EEE con las garantías
        previstas en la normativa. <strong>Estas cookies solo se instalan si das
        tu consentimiento</strong>; hasta entonces, Google Analytics no se carga.
      </p>
      <p>
        <strong>3. Publicidad y medición de conversión (Meta Pixel y Google
        Ads).</strong> Nos permiten medir la eficacia de nuestras campañas de
        publicidad (por ejemplo, saber que un registro o una alta de suscripción
        proviene de un anuncio) y optimizarlas. El <strong>Meta Pixel</strong> (de
        Meta Platforms) usa cookies como <code>_fbp</code> y{" "}
        <strong>Google Ads</strong> (de Google) cookies como <code>_gcl_au</code>,
        con una duración de hasta 90 días–2 años. Ambos proveedores pueden tratar
        datos fuera del EEE con las garantías previstas en la normativa (ver la{" "}
        <a href="/subencargados" className="underline">
          página de subencargados
        </a>
        ). <strong>Estas cookies de marketing solo se cargan si das tu
        consentimiento</strong>; si lo rechazas, ni el Pixel ni Google Ads se
        inicializan.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Consentimiento</h2>
      <p>
        Al entrar por primera vez te mostramos un aviso para aceptar o rechazar
        las cookies analíticas y de publicidad. Hasta que aceptes, ninguna de
        ellas (Google Analytics, Meta Pixel ni Google Ads) se carga. Puedes
        cambiar tu decisión en cualquier momento aquí: <CookieSettingsButton />.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Cómo gestionarlas</h2>
      <p>
        Además, puedes bloquear o eliminar las cookies desde la configuración de
        tu navegador. Ten en cuenta que, si bloqueas las cookies esenciales, es
        posible que no puedas iniciar sesión ni usar el panel.
      </p>
    </>
  );
}
