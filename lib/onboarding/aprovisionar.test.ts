import { describe, it, expect } from "vitest";
import { aprovisionarNegocio } from "@/lib/onboarding/aprovisionar";
import type { OnboardingStatus } from "@/lib/onboarding/estado";

/**
 * Stub in-memory del cliente admin de Supabase. Soporta solo lo que usa el
 * orquestador: businesses.select().eq().maybeSingle(), businesses.update().eq(),
 * y business_integrations.select().eq().maybeSingle(). Registra los updates.
 * (En test MOCK_PROVIDERS no es "false" → Vapi/Twilio corren en mock.)
 */
function fakeAdmin(opts: {
  business: Record<string, unknown>;
  integraciones?: Record<string, unknown> | null;
}) {
  const store: Record<string, unknown> = { ...opts.business };
  const updates: Record<string, unknown>[] = [];

  const admin = {
    from(table: string) {
      if (table === "businesses") {
        return {
          select() {
            return {
              eq() {
                return {
                  maybeSingle: async () => ({ data: { ...store }, error: null }),
                };
              },
            };
          },
          update(patch: Record<string, unknown>) {
            updates.push(patch);
            Object.assign(store, patch);
            return { eq: async () => ({ error: null }) };
          },
        };
      }
      if (table === "business_integrations") {
        return {
          select() {
            return {
              eq() {
                return {
                  maybeSingle: async () => ({
                    data: opts.integraciones ?? null,
                    error: null,
                  }),
                };
              },
            };
          },
        };
      }
      throw new Error(`tabla no soportada en stub: ${table}`);
    },
  };

  return { admin, store, updates };
}

const bizBase = {
  id: "b1",
  nombre: "Reformas García",
  ciudad: "Madrid",
  plan: "pro",
  activo: false,
  vapi_assistant_id: null,
  servicios: null,
  zonas: null,
  horario: null,
  tono: null,
  preguntas_clave: null,
  conocimiento: null,
  voz: "femenina",
  actividad: null,
  max_duracion_seg: null,
  phone_mode: "forward",
  forward_target: null,
  telefono_entrante: "+34600111222",
  vapi_phone_number_id: null,
  onboarding_status: {},
};

function estadoFinal(updates: Record<string, unknown>[]): OnboardingStatus {
  const conStatus = updates.filter((u) => "onboarding_status" in u);
  return (conStatus.at(-1)?.onboarding_status ?? {}) as OnboardingStatus;
}

describe("aprovisionarNegocio (plan pro, forward, sin Cal)", () => {
  it("crea assistant, configura desvío, activa la cuenta y persiste el estado", async () => {
    const { admin, store, updates } = fakeAdmin({ business: bizBase });
    const status = await aprovisionarNegocio(admin as never, "b1");

    // assistant creado (mock) y guardado
    expect(store.vapi_assistant_id).toMatch(/^asst_mock_/);
    expect(status.assistant.estado).toBe("hecho");

    // teléfono = forward: guarda forward_target y telefono_entrante, hecho
    expect(status.telefono.estado).toBe("hecho");
    expect(store.forward_target).toBe("+34600111222");

    // agenda permitida (pro) pero sin credenciales → pendiente
    expect(status.agenda.estado).toBe("pendiente");
    // whatsapp permitido (pro) → hecho
    expect(status.whatsapp.estado).toBe("hecho");

    // activo: assistant hecho + telefono hecho → cuenta activa
    expect(status.activo.estado).toBe("hecho");
    expect(store.activo).toBe(true);

    const st = estadoFinal(updates);
    expect(st.assistant?.estado).toBe("hecho");
  });
});

describe("aprovisionarNegocio (plan starter)", () => {
  it("omite agenda y whatsapp; con forward activa igualmente", async () => {
    const { admin, store } = fakeAdmin({
      business: { ...bizBase, plan: "starter" },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.agenda.estado).toBe("omitido");
    expect(status.whatsapp.estado).toBe("omitido");
    expect(status.telefono.estado).toBe("hecho");
    expect(status.activo.estado).toBe("hecho");
    expect(store.activo).toBe(true);
  });
});

describe("aprovisionarNegocio (agenda con credenciales)", () => {
  it("marca agenda como hecho cuando hay cal_api_key + event type", async () => {
    const { admin } = fakeAdmin({
      business: bizBase,
      integraciones: { cal_api_key: "cal_live_x", cal_event_type_id: "123" },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.agenda.estado).toBe("hecho");
  });
});

describe("aprovisionarNegocio (phone_mode new, pro)", () => {
  it("compra número (mock) y guarda vapi_phone_number_id + telefono_entrante", async () => {
    const { admin, store } = fakeAdmin({
      business: { ...bizBase, phone_mode: "new", telefono_entrante: null },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.telefono.estado).toBe("hecho");
    expect(store.vapi_phone_number_id).toMatch(/^mock_pn_/);
    expect(store.telefono_entrante).toMatch(/^\+34/);
  });

  it("es idempotente: no recompra si ya hay vapi_phone_number_id", async () => {
    const { admin, store } = fakeAdmin({
      business: {
        ...bizBase,
        phone_mode: "new",
        vapi_phone_number_id: "PNexistente",
        telefono_entrante: "+34910000000",
      },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.telefono.estado).toBe("hecho");
    // No se sobreescribe el número existente.
    expect(store.vapi_phone_number_id).toBe("PNexistente");
  });
});

describe("aprovisionarNegocio (phone_mode new, starter → no permitido)", () => {
  it("omite el teléfono y NO activa la cuenta (telefono omitido no es hecho)", async () => {
    const { admin, store } = fakeAdmin({
      business: { ...bizBase, plan: "starter", phone_mode: "new" },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.telefono.estado).toBe("omitido");
    // assistant hecho + telefono omitido → activo (omitido cuenta como "no bloquea")
    expect(status.activo.estado).toBe("hecho");
    expect(store.activo).toBe(true);
  });
});

describe("aprovisionarNegocio (phone_mode none)", () => {
  it("no configura teléfono (omitido) pero activa igualmente con assistant hecho", async () => {
    const { admin, store } = fakeAdmin({
      business: { ...bizBase, phone_mode: "none", telefono_entrante: null },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.telefono.estado).toBe("omitido");
    expect(status.activo.estado).toBe("hecho");
    expect(store.activo).toBe(true);
  });
});

describe("aprovisionarNegocio (soloPaso)", () => {
  it("reintenta solo el paso indicado y conserva el resto del estado previo", async () => {
    const previo: OnboardingStatus = {
      assistant: { estado: "hecho", detalle: "asst_mock_1" },
      telefono: { estado: "error", detalle: "Twilio 500" },
      agenda: { estado: "omitido" },
      whatsapp: { estado: "hecho" },
      activo: { estado: "pendiente" },
    };
    const { admin, store } = fakeAdmin({
      business: {
        ...bizBase,
        plan: "starter",
        vapi_assistant_id: "asst_mock_1",
        onboarding_status: previo,
      },
    });
    const status = await aprovisionarNegocio(admin as never, "b1", {
      soloPaso: "telefono",
    });
    // El paso reintentado pasa a hecho.
    expect(status.telefono.estado).toBe("hecho");
    // El assistant previo NO se re-crea; su detalle se conserva.
    expect(status.assistant.detalle).toBe("asst_mock_1");
    expect(store.vapi_assistant_id).toBe("asst_mock_1");
  });
});
