import { describe, it, expect } from "vitest";
import { notificarNuevoLead } from "@/lib/messaging/notify";

// Admin de Supabase falso: captura las filas insertadas en `messages`.
// (En test, MOCK_PROVIDERS no es "false", así que los clientes usan mocks.)
function fakeAdmin() {
  const inserted: { table: string; row: Record<string, unknown> }[] = [];
  const admin = {
    from: (table: string) => ({
      insert: async (row: Record<string, unknown>) => {
        inserted.push({ table, row });
        return { error: null };
      },
    }),
  };
  return { admin, inserted };
}

const lead = {
  id: "lead_1",
  cliente_nombre: "María López",
  cliente_telefono: "+34611111111",
  tipo_trabajo: "Reforma de baño",
  zona: "Chamberí",
  urgencia: true,
};

describe("notificarNuevoLead", () => {
  it("envía al cliente (WhatsApp) y al dueño (WhatsApp + email) y lo registra", async () => {
    const { admin, inserted } = fakeAdmin();
    const res = await notificarNuevoLead({
      admin: admin as never,
      business: { id: "b1", nombre: "Reformas García", cal_link: "https://cal.com/x" },
      lead,
      owners: [{ nombre: "Antonio", email: "a@reformas.es", whatsapp: "+34600000000" }],
    });

    expect(res.enviados).toBe(3);
    expect(inserted).toHaveLength(3);
    expect(inserted.filter((m) => m.row.canal === "whatsapp")).toHaveLength(2);
    expect(inserted.filter((m) => m.row.canal === "email")).toHaveLength(1);
    expect(inserted.every((m) => m.row.estado_envio === "enviado")).toBe(true);
    expect(inserted.every((m) => m.row.direccion === "saliente")).toBe(true);
  });

  it("sin teléfono de cliente, solo notifica al dueño", async () => {
    const { admin, inserted } = fakeAdmin();
    const res = await notificarNuevoLead({
      admin: admin as never,
      business: { id: "b1", nombre: "Reformas García", cal_link: null },
      lead: { ...lead, cliente_telefono: null },
      owners: [{ nombre: "Antonio", email: "a@reformas.es", whatsapp: null }],
    });
    expect(res.enviados).toBe(1);
    expect(inserted).toHaveLength(1);
    expect(inserted[0].row.canal).toBe("email");
  });
});
