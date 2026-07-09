import { describe, it, expect, vi, beforeEach } from "vitest";

// Espiamos el borrado de grabación en Vapi (mock por defecto en el módulo real).
const borrarGrabacionVapi = vi.fn(async () => ({
  modo: "mock" as const,
  borrada: true,
  status: null,
}));
vi.mock("@/lib/vapi/grabaciones", () => ({
  borrarGrabacionVapi: (...a: unknown[]) => borrarGrabacionVapi(...(a as [])),
}));

import { suprimirLead } from "@/lib/rgpd/supresion";

/**
 * Stub del admin client de Supabase. Registra cada .delete() por tabla y
 * devuelve datos configurables para leads/call_events. Encadena
 * from().select().eq().maybeSingle() y from().delete().eq().
 */
function makeAdminStub(opts: {
  lead: { id: string } | null;
  callEvents: { vapi_call_id: string | null }[];
}) {
  const deletes: { tabla: string; columna: string; valor: string }[] = [];

  const admin = {
    from(tabla: string) {
      return {
        select(_cols: string) {
          return {
            eq(_col: string, _val: string) {
              return {
                // leads → maybeSingle; call_events → resultado directo (thenable)
                maybeSingle: async () => ({ data: opts.lead }),
                then: (
                  resolve: (r: { data: unknown }) => void,
                ) => resolve({ data: opts.callEvents }),
              };
            },
          };
        },
        delete() {
          return {
            eq(columna: string, valor: string) {
              deletes.push({ tabla, columna, valor });
              return Promise.resolve({ error: null });
            },
          };
        },
      };
    },
  };

  return { admin: admin as never, deletes };
}

describe("suprimirLead (DSAR)", () => {
  beforeEach(() => borrarGrabacionVapi.mockClear());

  it("borra grabaciones, messages, call_events y el lead", async () => {
    const { admin, deletes } = makeAdminStub({
      lead: { id: "lead-1" },
      callEvents: [{ vapi_call_id: "call_a" }, { vapi_call_id: "call_b" }],
    });

    const res = await suprimirLead(admin, "lead-1");

    expect(res.ok).toBe(true);
    expect(res.grabaciones).toBe(2);

    // Borra la grabación de cada call_event con vapi_call_id.
    expect(borrarGrabacionVapi).toHaveBeenCalledTimes(2);
    expect(borrarGrabacionVapi).toHaveBeenCalledWith("call_a");
    expect(borrarGrabacionVapi).toHaveBeenCalledWith("call_b");

    // Borra las 3 tablas por el id del lead.
    const tablas = deletes.map((d) => d.tabla);
    expect(tablas).toContain("messages");
    expect(tablas).toContain("call_events");
    expect(tablas).toContain("leads");
    for (const d of deletes) {
      expect(d.valor).toBe("lead-1");
    }
  });

  it("ignora call_events sin vapi_call_id (no llama a Vapi por ellos)", async () => {
    const { admin } = makeAdminStub({
      lead: { id: "lead-2" },
      callEvents: [{ vapi_call_id: null }, { vapi_call_id: "call_c" }],
    });

    const res = await suprimirLead(admin, "lead-2");
    expect(res.grabaciones).toBe(1);
    expect(borrarGrabacionVapi).toHaveBeenCalledTimes(1);
    expect(borrarGrabacionVapi).toHaveBeenCalledWith("call_c");
  });

  it("lead inexistente → ok:false, no borra nada ni llama a Vapi", async () => {
    const { admin, deletes } = makeAdminStub({ lead: null, callEvents: [] });

    const res = await suprimirLead(admin, "lead-fantasma");
    expect(res.ok).toBe(false);
    expect(res.motivo).toBe("no-encontrado");
    expect(deletes).toHaveLength(0);
    expect(borrarGrabacionVapi).not.toHaveBeenCalled();
  });

  it("un fallo al borrar la grabación no bloquea la supresión local", async () => {
    borrarGrabacionVapi.mockRejectedValueOnce(new Error("Vapi caído"));
    const { admin, deletes } = makeAdminStub({
      lead: { id: "lead-3" },
      callEvents: [{ vapi_call_id: "call_d" }],
    });

    const res = await suprimirLead(admin, "lead-3");
    expect(res.ok).toBe(true);
    expect(deletes.map((d) => d.tabla)).toContain("leads");
  });
});
