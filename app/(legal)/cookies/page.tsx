import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Política de cookies</h1>
      <p className="text-[var(--muted-foreground)]">
        Última actualización: 2 de julio de 2026
      </p>

      <h2 className="pt-4 text-lg font-semibold">Qué son las cookies</h2>
      <p>
        Las cookies son pequeños archivos que un sitio web guarda en tu navegador
        para que ciertas funciones operen correctamente.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Qué cookies usamos</h2>
      <p>
        Curro solo utiliza <strong>cookies técnicas o esenciales</strong>,
        necesarias para el inicio de sesión y para mantener tu sesión mientras
        usas el panel (gestionadas por nuestro proveedor de autenticación,
        Supabase). <strong>No usamos cookies de analítica, publicidad ni
        seguimiento de terceros.</strong>
      </p>

      <h2 className="pt-4 text-lg font-semibold">Consentimiento</h2>
      <p>
        Las cookies estrictamente necesarias no requieren consentimiento previo,
        por lo que no mostramos un banner de cookies. Si en el futuro
        incorporamos cookies analíticas o de terceros, actualizaremos esta
        política y solicitaremos tu consentimiento cuando corresponda.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Cómo gestionarlas</h2>
      <p>
        Puedes bloquear o eliminar las cookies desde la configuración de tu
        navegador. Ten en cuenta que, si bloqueas las cookies esenciales, es
        posible que no puedas iniciar sesión ni usar el panel.
      </p>
    </>
  );
}
