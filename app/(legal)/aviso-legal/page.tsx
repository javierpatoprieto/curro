import type { Metadata } from "next";

export const metadata: Metadata = { title: "Aviso legal — Curro" };

export default function AvisoLegalPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Aviso legal</h1>
      <p className="text-[var(--muted-foreground)]">Última actualización: 2026</p>

      <h2 className="pt-4 text-lg font-semibold">Titular</h2>
      <p>
        Este sitio y el servicio Curro son operados por su titular (a completar
        con la razón social, NIF y domicilio). Documento orientativo pendiente de
        revisión legal.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Objeto</h2>
      <p>
        Curro ofrece un servicio de recepcionista con IA que atiende llamadas,
        cualifica clientes y notifica los leads a la empresa contratante.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Condiciones de uso</h2>
      <p>
        El uso del servicio implica la aceptación de estas condiciones. El
        servicio se presta por suscripción, con las tarifas indicadas en la
        página de precios. No hay permanencia y puede cancelarse en cualquier
        momento.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Responsabilidad</h2>
      <p>
        La empresa contratante es responsable de informar a sus clientes del
        tratamiento de sus datos y de usar el servicio conforme a la normativa
        aplicable.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Contacto</h2>
      <p>Para cualquier cuestión legal, escríbenos a nuestro correo de contacto.</p>
    </>
  );
}
