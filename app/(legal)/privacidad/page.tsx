import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Política de privacidad</h1>
      <p className="text-[var(--muted-foreground)]">Última actualización: 2026</p>

      <h2 className="pt-4 text-lg font-semibold">Quiénes somos</h2>
      <p>
        Curro es un servicio de recepcionista con inteligencia artificial para
        empresas de reformas y multiservicios del hogar. Este documento es una
        plantilla orientativa; debe revisarse con asesoría legal antes de
        publicarse.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Qué datos tratamos</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Datos de la empresa cliente y de sus usuarios (nombre, email, teléfono).</li>
        <li>
          Datos de las personas que llaman: nombre, teléfono, tipo de trabajo,
          zona y la grabación y transcripción de la llamada.
        </li>
        <li>Datos de uso y facturación (a través de Stripe).</li>
      </ul>

      <h2 className="pt-4 text-lg font-semibold">Grabación de llamadas</h2>
      <p>
        Al inicio de cada llamada se informa de que se trata de un asistente
        virtual y de que la llamada se graba, con fines de gestión del
        presupuesto y mejora del servicio.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Encargados del tratamiento</h2>
      <p>
        Usamos proveedores para prestar el servicio: Vapi (voz), Supabase (base
        de datos), WhatsApp/Meta y Resend (comunicaciones) y Stripe (pagos).
      </p>

      <h2 className="pt-4 text-lg font-semibold">Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión y
        oposición escribiendo a nuestro correo de contacto.
      </p>
    </>
  );
}
