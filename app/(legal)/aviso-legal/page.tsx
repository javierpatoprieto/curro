import type { Metadata } from "next";

export const metadata: Metadata = { title: "Aviso legal" };

export default function AvisoLegalPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Aviso legal</h1>
      <p className="text-[var(--muted-foreground)]">
        Última actualización: 2 de julio de 2026
      </p>

      <h2 className="pt-4 text-lg font-semibold">Titular del sitio</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de que el
        titular de este sitio web y del servicio Curro es:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Titular:</strong> Javier Pato Prieto
        </li>
        <li>
          <strong>NIF:</strong> 71449969D
        </li>
        <li>
          <strong>Domicilio:</strong> Calle Los Remedios 64F, 39527 Liandres
          (Cantabria), España
        </li>
        <li>
          <strong>Correo de contacto:</strong> hola@soycurro.es
        </li>
      </ul>

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

      <h2 className="pt-4 text-lg font-semibold">Propiedad intelectual</h2>
      <p>
        La marca, el logotipo, los contenidos y el software de Curro son
        propiedad de su titular o de sus licenciantes. No se permite su
        reproducción o uso sin autorización.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Responsabilidad</h2>
      <p>
        La empresa contratante es responsable de informar a sus clientes del
        tratamiento de sus datos y de usar el servicio conforme a la normativa
        aplicable.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Legislación aplicable</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier
        controversia serán competentes los juzgados y tribunales que correspondan
        conforme a la normativa vigente, incluida, en su caso, la de consumo.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Contacto</h2>
      <p>
        Para cualquier cuestión legal, escríbenos a{" "}
        <a href="mailto:hola@soycurro.es" className="underline">
          hola@soycurro.es
        </a>
        .
      </p>

      <p className="pt-6 text-sm text-[var(--muted-foreground)]">
        Documento orientativo; se recomienda su revisión por asesoría legal antes
        de su publicación definitiva.
      </p>
    </>
  );
}
