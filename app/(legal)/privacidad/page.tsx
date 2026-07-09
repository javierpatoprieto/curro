import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Política de privacidad
      </h1>
      <p className="text-[var(--muted-foreground)]">
        Última revisión: 9 de julio de 2026. Revisamos este documento
        periódicamente; consúltalo de nuevo si han pasado meses desde tu última
        visita.
      </p>

      <h2 className="pt-4 text-lg font-semibold">
        Quién trata tus datos (rol dual)
      </h2>
      <p>
        Curro es un servicio de recepcionista con inteligencia artificial. En el
        tratamiento de datos intervienen dos figuras distintas, y de cuál seas
        depende a quién debes dirigirte:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Si eres cliente suscriptor de Curro</strong> (autónomo o
          empresa que contrata el servicio): el <strong>responsable</strong> de
          tus datos de cuenta, uso y facturación es Curro (Javier Pato Prieto).
          Puedes ejercer tus derechos con nosotros (más abajo).
        </li>
        <li>
          <strong>Si eres una persona que ha llamado</strong> al teléfono de un
          negocio atendido por Curro: el <strong>responsable</strong> de tus
          datos es <strong>el propio negocio</strong> (el autónomo o empresa que
          te atiende). Curro actúa como <strong>encargado del tratamiento</strong>{" "}
          por cuenta de ese negocio (Art. 28 RGPD), procesando la llamada en su
          nombre. Para ejercer tus derechos, dirígete al negocio al que llamaste
          (ver «Personas que llaman», más abajo).
        </li>
      </ul>

      <h2 className="pt-4 text-lg font-semibold">Responsable (Curro)</h2>
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
          <strong>Correo de contacto:</strong>{" "}
          <a href="mailto:hola@soycurro.es" className="underline">
            hola@soycurro.es
          </a>
        </li>
      </ul>

      <h2 className="pt-4 text-lg font-semibold">Qué datos tratamos</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Suscriptores:</strong> datos de la empresa cliente y de sus
          usuarios (nombre, email, teléfono), datos de uso del servicio y datos
          de facturación (a través de Stripe).
        </li>
        <li>
          <strong>Personas que llaman:</strong> nombre, teléfono, tipo de
          trabajo y zona, más la <strong>grabación de la llamada</strong> y su{" "}
          <strong>transcripción</strong>, que se procesan con{" "}
          <strong>inteligencia artificial</strong> para cualificar la solicitud y
          trasladarla al negocio.
        </li>
      </ul>

      <h2 className="pt-4 text-lg font-semibold">Finalidad y base jurídica</h2>
      <p>
        Como responsable de los datos de los suscriptores, tratamos los datos
        para prestar el servicio contratado (ejecución del contrato) y cumplir
        nuestras obligaciones de facturación (obligación legal). Respecto de las
        personas que llaman, Curro trata sus datos como encargado, siguiendo las
        instrucciones del negocio responsable, cuya base jurídica es atender y
        trasladar la solicitud de presupuesto (interés legítimo o medidas
        precontractuales). La grabación se realiza informando previamente al
        interlocutor al inicio de la llamada.
      </p>

      <h2 className="pt-4 text-lg font-semibold">
        Grabación, transcripción y procesado con IA
      </h2>
      <p>
        Al inicio de cada llamada, el asistente informa de que es un asistente
        virtual, de que la llamada <strong>se graba y se transcribe</strong>, y
        de que se procesa con inteligencia artificial para gestionar la
        solicitud; indica que el <strong>responsable</strong> es el negocio y
        remite a esta política. Si la persona no desea ser grabada ni que su
        llamada se trate con IA, puede pedir que <strong>le devuelva la llamada
        una persona</strong> del negocio.
      </p>

      <h2 className="pt-4 text-lg font-semibold">Plazos de conservación</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Grabación de audio:</strong> 30 días, tras los cuales se borra.
        </li>
        <li>
          <strong>Transcripción y datos del lead:</strong> 12 meses, tras los
          cuales se anonimizan o suprimen.
        </li>
        <li>
          <strong>Metadatos técnicos de la llamada</strong> (identificador,
          duración, coste): no conservamos el contenido íntegro; los metadatos
          residuales se purgan a los 30 días.
        </li>
        <li>
          <strong>Datos de facturación:</strong> 6 años (obligación legal
          mercantil y fiscal).
        </li>
        <li>
          <strong>Datos de la cuenta del suscriptor:</strong> durante la relación
          contractual y hasta 5 años después de su fin.
        </li>
        <li>
          <strong>Registros técnicos (logs):</strong> un máximo de 90 días.
        </li>
      </ul>

      <h2 className="pt-4 text-lg font-semibold">
        Encargados y subencargados del tratamiento
      </h2>
      <p>
        Nos apoyamos en proveedores tecnológicos (subencargados) para prestar el
        servicio. Puedes consultar la lista completa —con país, finalidad y
        garantía de transferencia internacional (Cláusulas Contractuales Tipo,
        SCC, o el marco EU-US Data Privacy Framework, DPF)— en la{" "}
        <Link href="/subencargados" className="underline">
          página de subencargados
        </Link>
        . En resumen: Vapi (voz, EE. UU.) y su subcadena OpenAI, Deepgram y
        ElevenLabs; Twilio (mensajería); Supabase (base de datos, alojada en la
        UE); Resend (email); Cal.com (agendado); Stripe (pagos); Vercel
        (alojamiento web) y Google Analytics (analítica web, solo con tu
        consentimiento; ver la{" "}
        <a href="/cookies" className="underline">
          política de cookies
        </a>
        ). Algunos tratan datos fuera del EEE con las garantías indicadas.
      </p>

      <h2 className="pt-4 text-lg font-semibold">
        Transferencias internacionales
      </h2>
      <p>
        Cuando un proveedor trata datos fuera del Espacio Económico Europeo
        (principalmente EE. UU.), la transferencia se ampara en Cláusulas
        Contractuales Tipo (SCC) de la Comisión Europea o en la certificación del
        proveedor bajo el EU-US Data Privacy Framework (DPF). El detalle por
        proveedor está en la{" "}
        <Link href="/subencargados" className="underline">
          página de subencargados
        </Link>
        .
      </p>

      <h2 className="pt-4 text-lg font-semibold">
        Tus derechos (suscriptores de Curro)
      </h2>
      <p>
        Si eres cliente suscriptor, puedes ejercer tus derechos de acceso,
        rectificación, supresión, oposición, limitación y portabilidad
        escribiendo a{" "}
        <a href="mailto:hola@soycurro.es" className="underline">
          hola@soycurro.es
        </a>
        . También puedes reclamar ante la Agencia Española de Protección de Datos
        (AEPD,{" "}
        <a
          href="https://www.aepd.es"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.aepd.es
        </a>
        ).
      </p>

      <h2 className="pt-4 text-lg font-semibold">
        Tus derechos (personas que llaman)
      </h2>
      <p>
        Si has llamado a un negocio atendido por Curro, el responsable de tus
        datos es <strong>ese negocio</strong>, no Curro. Para ejercer tus
        derechos de acceso, rectificación, supresión, oposición, limitación o
        portabilidad, <strong>dirígete directamente al negocio al que llamaste</strong>{" "}
        (por los mismos datos de contacto por los que contactaste con él). Curro,
        como encargado, atenderá tu solicitud a través de ese negocio y le presta
        los medios para suprimir tus datos (incluida la grabación). Igualmente,
        puedes reclamar ante la AEPD ({" "}
        <a
          href="https://www.aepd.es"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.aepd.es
        </a>
        ).
      </p>
    </>
  );
}
