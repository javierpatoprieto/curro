"use client";

import { useState } from "react";
import { puede } from "@/lib/plans";
import type { Plan } from "@/lib/types";

export const inputCls =
  "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--ring)]";

export const SECTORES = [
  "fontanería",
  "electricidad",
  "reformas",
  "pintura",
  "cerrajería",
  "climatización y aire acondicionado",
  "albañilería",
  "carpintería",
  "cristalería",
  "multiservicios del hogar",
];

const PASOS = [
  "Negocio",
  "Plan",
  "Voz & tono",
  "Capacidades",
  "Teléfono",
  "Contacto",
  "Revisar",
] as const;

export function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

/**
 * Wizard de alta de cliente por pasos. Es UN solo <form>: los pasos que no se
 * están mostrando se ocultan con `hidden` (CSS) en vez de desmontarse, así que
 * al enviar el formulario en el último paso viajan TODOS los campos.
 */
export function WizardAlta({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [paso, setPaso] = useState(0);
  const [plan, setPlan] = useState("pro");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [agenda, setAgenda] = useState(false);
  const [confirmacionCliente, setConfirmacionCliente] = useState(false);

  const agendaPermitida = puede(plan as Plan, "agenda");
  const confirmacionPermitida = puede(plan as Plan, "confirmacionCliente");

  const ultimo = paso === PASOS.length - 1;

  const puedeAvanzar = paso !== 0 || (nombre.trim().length > 1 && email.trim().length > 3);

  return (
    <form action={action} className="space-y-6">
      {/* Indicador de pasos */}
      <ol className="flex flex-wrap items-center gap-2 text-xs">
        {PASOS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={
                "flex size-6 items-center justify-center rounded-full font-semibold " +
                (i === paso
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : i < paso
                    ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]")
              }
            >
              {i + 1}
            </span>
            <span
              className={
                i === paso
                  ? "font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)]"
              }
            >
              {label}
            </span>
            {i < PASOS.length - 1 && (
              <span className="mx-1 text-[var(--muted-foreground)]">›</span>
            )}
          </li>
        ))}
      </ol>

      {/* Paso 1: Negocio */}
      <div className={paso === 0 ? "space-y-4" : "hidden"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nombre del negocio *">
            <input
              name="nombre"
              required
              placeholder="Reformas García"
              className={inputCls}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Campo>
          <Campo label="Email del propietario *">
            <input
              name="email"
              type="email"
              required
              placeholder="dueno@negocio.es"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Campo>
          <Campo label="Ciudad">
            <input name="ciudad" placeholder="Madrid" className={inputCls} />
          </Campo>
          <Campo label="Tipo de empresa">
            <input
              name="actividad"
              list="sectores"
              placeholder="fontanería, reformas, electricidad…"
              className={inputCls}
            />
            <datalist id="sectores">
              {SECTORES.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Campo>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="activo" defaultChecked className="size-4" />
          Cuenta activa desde el alta (atiende llamadas ya)
        </label>

        <Campo label="Enlace de Cal.com (opcional)">
          <input
            name="cal_link"
            type="url"
            placeholder="https://cal.com/negocio/visita"
            className={inputCls}
          />
        </Campo>
        <Campo label="Servicios que ofrece">
          <textarea
            name="servicios"
            rows={2}
            placeholder="Reformas integrales, baños, cocinas, pintura… (y lo que NO hace)"
            className={inputCls}
          />
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Zonas que cubre">
            <input name="zonas" placeholder="Madrid capital y alrededores" className={inputCls} />
          </Campo>
          <Campo label="Horario">
            <input name="horario" placeholder="L-V 9-18h" className={inputCls} />
          </Campo>
        </div>
        <Campo label="Preguntas que Curro debe hacer siempre">
          <textarea
            name="preguntas_clave"
            rows={2}
            placeholder="¿Es vivienda o local? ¿Metros aproximados? ¿Para cuándo?"
            className={inputCls}
          />
        </Campo>
        <Campo label="Base de conocimiento / FAQ">
          <textarea
            name="conocimiento"
            rows={3}
            placeholder="Info que Curro puede usar (garantías, financiación, tiempos…)"
            className={inputCls}
          />
        </Campo>
      </div>

      {/* Paso 2: Plan */}
      <div className={paso === 1 ? "space-y-4" : "hidden"}>
        <Campo label="Plan *">
          <select
            name="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className={inputCls}
          >
            {["trial", "starter", "pro", "premium"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Campo>
        <p className="text-sm text-[var(--muted-foreground)]">
          El plan determina qué capacidades puede usar el cliente (agenda,
          confirmación al cliente, número dedicado…).
        </p>
      </div>

      {/* Paso 3: Voz & tono */}
      <div className={paso === 2 ? "space-y-4" : "hidden"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Voz de Curro">
            <select name="voz" defaultValue="femenina" className={inputCls}>
              <option value="femenina">Femenina</option>
              <option value="masculina">Masculina</option>
            </select>
          </Campo>
          <Campo label="Tono">
            <select name="tono" defaultValue="cercano" className={inputCls}>
              <option value="cercano">Cercano</option>
              <option value="profesional">Profesional</option>
              <option value="comercial">Comercial</option>
            </select>
          </Campo>
        </div>
      </div>

      {/* Paso 4: Capacidades */}
      <div className={paso === 3 ? "space-y-4" : "hidden"}>
        <label
          className={
            "flex items-center gap-2 text-sm " +
            (!agendaPermitida ? "opacity-50" : "")
          }
        >
          <input
            type="checkbox"
            name="agenda"
            className="size-4"
            disabled={!agendaPermitida}
            checked={agenda && agendaPermitida}
            onChange={(e) => setAgenda(e.target.checked)}
          />
          Agenda (Cal.com){" "}
          {!agendaPermitida && (
            <span className="text-xs text-[var(--muted-foreground)]">
              (disponible en Pro)
            </span>
          )}
        </label>

        {agenda && agendaPermitida && (
          <div className="grid gap-4 sm:grid-cols-2 pl-6">
            <Campo label="Cal.com API key">
              <input name="cal_api_key" placeholder="cal_live_…" className={inputCls} />
            </Campo>
            <Campo label="Cal.com Event Type ID">
              <input name="cal_event_type_id" placeholder="123456" className={inputCls} />
            </Campo>
          </div>
        )}

        <label
          className={
            "flex items-center gap-2 text-sm " +
            (!confirmacionPermitida ? "opacity-50" : "")
          }
        >
          <input
            type="checkbox"
            name="confirmacion_cliente"
            className="size-4"
            disabled={!confirmacionPermitida}
            checked={confirmacionCliente && confirmacionPermitida}
            onChange={(e) => setConfirmacionCliente(e.target.checked)}
          />
          Confirmación al cliente{" "}
          {!confirmacionPermitida && (
            <span className="text-xs text-[var(--muted-foreground)]">
              (disponible en Pro)
            </span>
          )}
        </label>
      </div>

      {/* Paso 5: Teléfono */}
      <div className={paso === 4 ? "space-y-4" : "hidden"}>
        <p className="text-sm text-[var(--muted-foreground)]">
          Cómo recibe Curro las llamadas. Al crear el cliente se monta
          automáticamente y verás el estado por pasos en su ficha. El número
          nuevo (Twilio) corre en modo simulado hasta tener el bundle
          regulatorio; el desvío usa el número que indiques abajo.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="phone_mode"
            value="forward"
            defaultChecked
            className="size-4"
          />
          Desvío del número propio
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="phone_mode" value="new" className="size-4" />
          Número nuevo
        </label>

        <Campo label="Número entrante (el que atiende Curro)">
          <input
            name="telefono_entrante"
            placeholder="+34910000000"
            className={inputCls}
          />
        </Campo>
        <p className="text-sm text-[var(--muted-foreground)]">
          Es el número al que enrutan las llamadas: Curro identifica el
          negocio por este número cuando entra una llamada.
        </p>
      </div>

      {/* Paso 6: Contacto */}
      <div className={paso === 5 ? "space-y-4" : "hidden"}>
        <Campo label="WhatsApp del dueño (avisos)">
          <input name="whatsapp" placeholder="+34600000000" className={inputCls} />
        </Campo>
      </div>

      {/* Paso 7: Revisar */}
      <div className={paso === 6 ? "space-y-4" : "hidden"}>
        <p className="text-sm text-[var(--muted-foreground)]">
          Revisa los pasos anteriores y confirma. Al crear el cliente se monta
          el asistente de voz de Vapi con esta configuración y se da de alta el
          negocio y su propietario.
        </p>
        <div className="rounded-md border border-[var(--border)] p-3 text-sm">
          <p>
            <span className="font-medium">Negocio:</span> {nombre || "—"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {email || "—"}
          </p>
          <p>
            <span className="font-medium">Plan:</span> {plan}
          </p>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          disabled={paso === 0}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          Anterior
        </button>

        {!ultimo ? (
          <button
            type="button"
            onClick={() => puedeAvanzar && setPaso((p) => Math.min(PASOS.length - 1, p + 1))}
            disabled={!puedeAvanzar}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-40"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
          >
            Crear cliente y montar a Curro
          </button>
        )}
      </div>
    </form>
  );
}
