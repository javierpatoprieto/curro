import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subencargados del tratamiento",
};

interface Subencargado {
  nombre: string;
  finalidad: string;
  pais: string;
  transferencia: string;
  enlace: string;
}

/**
 * Lista de subencargados. Datos canónicos de la política de privacidad.
 * "Transferencia" indica la garantía para datos tratados fuera del EEE
 * (SCC = Cláusulas Contractuales Tipo; DPF = EU-US Data Privacy Framework).
 */
const SUBENCARGADOS: Subencargado[] = [
  {
    nombre: "Vapi",
    finalidad:
      "Voz IA: recepción de la llamada, grabación y orquestación (subcadena: OpenAI, Deepgram, ElevenLabs)",
    pais: "EE. UU.",
    transferencia: "SCC / DPF",
    enlace: "https://vapi.ai/privacy",
  },
  {
    nombre: "OpenAI",
    finalidad: "Modelo de lenguaje que cualifica la solicitud (vía Vapi)",
    pais: "EE. UU.",
    transferencia: "SCC / DPF",
    enlace: "https://openai.com/policies/privacy-policy",
  },
  {
    nombre: "Deepgram",
    finalidad: "Transcripción de voz a texto (vía Vapi)",
    pais: "EE. UU.",
    transferencia: "SCC / DPF",
    enlace: "https://deepgram.com/privacy",
  },
  {
    nombre: "ElevenLabs",
    finalidad: "Síntesis de voz del asistente (vía Vapi)",
    pais: "EE. UU.",
    transferencia: "SCC / DPF",
    enlace: "https://elevenlabs.io/privacy",
  },
  {
    nombre: "Twilio",
    finalidad: "Envío de notificaciones por WhatsApp",
    pais: "EE. UU. / Irlanda",
    transferencia: "SCC / DPF",
    enlace: "https://www.twilio.com/legal/privacy",
  },
  {
    nombre: "Supabase",
    finalidad: "Base de datos y autenticación (alojada en la UE, eu-west-1)",
    pais: "UE (eu-west-1)",
    transferencia: "Dentro del EEE",
    enlace: "https://supabase.com/privacy",
  },
  {
    nombre: "Resend",
    finalidad: "Envío de emails de aviso",
    pais: "EE. UU.",
    transferencia: "SCC / DPF",
    enlace: "https://resend.com/legal/privacy-policy",
  },
  {
    nombre: "Cal.com",
    finalidad: "Agendado de visitas",
    pais: "EE. UU. / UE",
    transferencia: "SCC",
    enlace: "https://cal.com/privacy",
  },
  {
    nombre: "Stripe",
    finalidad: "Pagos y facturación de la suscripción",
    pais: "EE. UU. / Irlanda",
    transferencia: "SCC / DPF",
    enlace: "https://stripe.com/privacy",
  },
  {
    nombre: "Vercel",
    finalidad: "Alojamiento de la aplicación web",
    pais: "EE. UU.",
    transferencia: "SCC / DPF",
    enlace: "https://vercel.com/legal/privacy-policy",
  },
  {
    nombre: "Google Analytics",
    finalidad: "Analítica web (solo con consentimiento del visitante)",
    pais: "EE. UU.",
    transferencia: "DPF (consentimiento)",
    enlace: "https://policies.google.com/privacy",
  },
];

export default function SubencargadosPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Subencargados del tratamiento
      </h1>
      <p className="text-[var(--muted-foreground)]">
        Última revisión: 9 de julio de 2026.
      </p>
      <p>
        Para prestar el servicio, Curro se apoya en los proveedores tecnológicos
        (subencargados) que se listan a continuación. Para cada uno se indica su
        finalidad, el país donde puede tratar los datos y la garantía aplicable a
        las transferencias internacionales fuera del Espacio Económico Europeo:
        Cláusulas Contractuales Tipo (SCC) o el marco EU-US Data Privacy
        Framework (DPF). Esta lista forma parte de la{" "}
        <Link href="/privacidad" className="underline">
          política de privacidad
        </Link>
        .
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="py-2 pr-4 font-semibold">Proveedor</th>
              <th className="py-2 pr-4 font-semibold">Finalidad</th>
              <th className="py-2 pr-4 font-semibold">País</th>
              <th className="py-2 pr-4 font-semibold">Transferencia</th>
              <th className="py-2 font-semibold">Más info</th>
            </tr>
          </thead>
          <tbody>
            {SUBENCARGADOS.map((s) => (
              <tr key={s.nombre} className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium whitespace-nowrap">
                  {s.nombre}
                </td>
                <td className="py-2 pr-4">{s.finalidad}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{s.pais}</td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {s.transferencia}
                </td>
                <td className="py-2">
                  <a
                    href={s.enlace}
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[var(--muted-foreground)]">
        Esta lista puede actualizarse cuando cambien los proveedores. Los enlaces
        remiten a las políticas de privacidad de cada proveedor, que pueden
        variar; consúltalas para el detalle vigente de sus garantías.
      </p>
    </>
  );
}
