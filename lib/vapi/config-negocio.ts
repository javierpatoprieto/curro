import type { Business } from "@/lib/types";
import type { AssistantConfig } from "@/lib/vapi/assistant";

/**
 * Arma la config del assistant desde la fila de `businesses` (para
 * re-sincronizar tras editar ajustes o conectar/desconectar Cal.com).
 * Compartido entre /panel/ajustes y /admin/clientes/[id].
 */
export function configDesdeNegocio(
  b: Pick<
    Business,
    | "nombre"
    | "ciudad"
    | "servicios"
    | "zonas"
    | "horario"
    | "tono"
    | "preguntas_clave"
    | "conocimiento"
  >,
  calConectado: boolean,
): AssistantConfig {
  return {
    negocio: b.nombre,
    ciudad: b.ciudad ?? null,
    servicios: b.servicios ?? null,
    zonas: b.zonas ?? null,
    horario: b.horario ?? null,
    tono: b.tono ?? null,
    preguntas_clave: b.preguntas_clave ?? null,
    conocimiento: b.conocimiento ?? null,
    calConectado,
  };
}
