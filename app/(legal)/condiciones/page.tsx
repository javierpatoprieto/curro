import type { Metadata } from "next";

export const metadata: Metadata = { title: "Condiciones de contratación" };

export default function CondicionesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Condiciones de contratación
      </h1>
      <p className="text-[var(--muted-foreground)]">
        Última actualización: 3 de julio de 2026
      </p>

      <h2 className="pt-4 text-lg font-semibold">1. Partes</h2>
      <p>
        El servicio Curro es prestado por Javier Pato Prieto (NIF 71449969D), con
        domicilio en Calle Los Remedios 64F, 39527 Liandres (Cantabria), España
        (en adelante, «Curro»). El cliente es la empresa o profesional que
        contrata el servicio (en adelante, el «Cliente»). Este servicio está
        dirigido a empresas y profesionales, no a consumidores.
      </p>

      <h2 className="pt-4 text-lg font-semibold">2. Objeto</h2>
      <p>
        Curro es un servicio de recepcionista con inteligencia artificial que
        atiende las llamadas del Cliente, cualifica a quien llama, registra la
        información y notifica los leads al Cliente por los canales configurados.
      </p>

      <h2 className="pt-4 text-lg font-semibold">3. Alta y periodo de prueba</h2>
      <p>
        El alta se realiza desde la web. La contratación incluye un periodo de
        prueba gratuito de 7 días. Para iniciarlo se requiere un medio de pago
        válido; si el Cliente no cancela antes de finalizar la prueba, la
        suscripción se activa automáticamente y se factura el primer periodo.
      </p>

      <h2 className="pt-4 text-lg font-semibold">4. Precios y facturación</h2>
      <p>
        Los precios son los indicados en la página de precios (planes de 49, 99
        y 199 €/mes), IVA incluido. La facturación es mensual y por
        adelantado, gestionada a través de Stripe.
        La suscripción se renueva automáticamente cada periodo salvo cancelación.
      </p>

      <h2 className="pt-4 text-lg font-semibold">
        5. Duración, renovación y cancelación
      </h2>
      <p>
        No existe permanencia. El Cliente puede cancelar en cualquier momento; la
        cancelación surte efecto al final del periodo ya facturado, sin
        devoluciones por periodos iniciados, salvo obligación legal.
      </p>

      <h2 className="pt-4 text-lg font-semibold">6. Obligaciones del Cliente</h2>
      <p>
        El Cliente se compromete a usar el servicio de forma lícita, a facilitar
        datos veraces, a informar a las personas que llaman del tratamiento de
        sus datos y de la grabación, y a no emplear el servicio para fines
        fraudulentos, spam o contrarios a la ley.
      </p>

      <h2 className="pt-4 text-lg font-semibold">7. Disponibilidad del servicio</h2>
      <p>
        Curro pone medios razonables para mantener el servicio disponible, pero no
        garantiza su funcionamiento ininterrumpido, ya que depende de proveedores
        externos (voz, telefonía, mensajería y pagos) y de terceros ajenos a su
        control.
      </p>

      <h2 className="pt-4 text-lg font-semibold">8. Protección de datos</h2>
      <p>
        Respecto de los datos de las personas que llaman, el Cliente es
        responsable del tratamiento y Curro actúa como encargado, tratándolos
        únicamente para prestar el servicio conforme a las instrucciones del
        Cliente y a la{" "}
        <a href="/privacidad" className="underline">
          política de privacidad
        </a>
        . El contrato de encargo del tratamiento (Anexo DPA, Art. 28 RGPD) forma
        parte de estas condiciones y se acepta junto con ellas en el momento del
        alta, sin necesidad de firma adicional.
      </p>

      <h2 className="pt-4 text-lg font-semibold">9. Responsabilidad</h2>
      <p>
        Curro no responde del lucro cesante ni de daños indirectos derivados del
        uso o de la imposibilidad de uso del servicio. En la medida permitida por
        la ley, la responsabilidad total se limita a los importes abonados por el
        Cliente en los tres meses anteriores al hecho que la origine.
      </p>

      <h2 className="pt-4 text-lg font-semibold">10. Propiedad intelectual</h2>
      <p>
        La marca, el software y los contenidos de Curro son propiedad de su
        titular o de sus licenciantes. La contratación no cede ningún derecho de
        propiedad intelectual más allá del uso del servicio durante su vigencia.
      </p>

      <h2 className="pt-4 text-lg font-semibold">11. Modificaciones</h2>
      <p>
        Curro puede modificar estas condiciones o los precios comunicándolo con
        antelación razonable. Si el Cliente no está de acuerdo, podrá cancelar
        antes de que los cambios surtan efecto.
      </p>

      <h2 className="pt-4 text-lg font-semibold">12. Legislación y jurisdicción</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier
        controversia, las partes se someten a los juzgados y tribunales que
        correspondan conforme a la normativa vigente.
      </p>

      <h2 className="pt-4 text-lg font-semibold">13. Contacto</h2>
      <p>
        Para cualquier cuestión sobre la contratación, escríbenos a{" "}
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
