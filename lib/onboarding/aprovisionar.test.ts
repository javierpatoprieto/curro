import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  aprovisionarNegocio,
  AprovisionamientoError,
} from "@/lib/onboarding/aprovisionar";
import type { OnboardingStatus } from "@/lib/onboarding/estado";

/**
 * Espiamos el módulo de Vapi para poder contar creaciones/actualizaciones de
 * assistant (idempotencia, duplicados) y forzar fallos del paso crítico. El
 * resto del módulo se conserva; solo interceptamos crear/actualizar.
 */
const vapiSpies = vi.hoisted(() => ({
  crear: vi.fn(async () => `asst_mock_${Date.now()}`),
  actualizar: vi.fn(async () => {}),
}));

const numeroSpies = vi.hoisted(() => ({
  buscar: vi.fn(async () => "+34910000000"),
  comprar: vi.fn(async (num: string) => ({
    sid: `mock_pn_${Date.now()}`,
    phoneNumber: num,
  })),
}));

vi.mock("@/lib/vapi/assistant", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/vapi/assistant")>();
  return {
    ...real,
    crearAssistant: (...args: unknown[]) => vapiSpies.crear(...(args as [])),
    actualizarAssistant: (...args: unknown[]) =>
      vapiSpies.actualizar(...(args as [])),
  };
});

vi.mock("@/lib/twilio/numeros", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/twilio/numeros")>();
  return {
    ...real,
    buscarNumeroES: (...args: unknown[]) => numeroSpies.buscar(...(args as [])),
    comprarNumero: (...args: unknown[]) =>
      numeroSpies.comprar(...(args as [never])),
  };
});

beforeEach(() => {
  vapiSpies.crear.mockReset();
  vapiSpies.crear.mockImplementation(async () => `asst_mock_${Date.now()}`);
  vapiSpies.actualizar.mockReset();
  vapiSpies.actualizar.mockImplementation(async () => {});
  numeroSpies.buscar.mockReset();
  numeroSpies.buscar.mockImplementation(async () => "+34910000000");
  numeroSpies.comprar.mockReset();
  numeroSpies.comprar.mockImplementation(async (num: string) => ({
    sid: `mock_pn_${Date.now()}`,
    phoneNumber: num,
  }));
});

/**
 * Stub in-memory del cliente admin de Supabase. Soporta solo lo que usa el
 * orquestador: businesses.select().eq().maybeSingle(), businesses.update().eq(),
 * y business_integrations.select().eq().maybeSingle(). Registra los updates.
 * (En test MOCK_PROVIDERS no es "false" → Vapi/Twilio corren en mock.)
 *
 * `updateError`: si se indica, TODOS los update().eq() devuelven ese error (para
 * probar que `persistir()` lanza en fallo de escritura — defect 9).
 */
function fakeAdmin(opts: {
  business: Record<string, unknown>;
  integraciones?: Record<string, unknown> | null;
  updateError?: { message: string } | null;
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
            return {
              eq: async () => {
                if (opts.updateError) return { error: opts.updateError };
                updates.push(patch);
                Object.assign(store, patch);
                return { error: null };
              },
            };
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

  // Defect 4: un reintento `soloPaso` DEBE re-evaluar la puerta de activación.
  it("reintento soloPaso re-activa la cuenta cuando el paso arreglado la desbloquea", async () => {
    const previo: OnboardingStatus = {
      assistant: { estado: "hecho", detalle: "asst_mock_1" },
      telefono: { estado: "error", detalle: "Twilio 500" },
      agenda: { estado: "omitido" },
      whatsapp: { estado: "omitido" },
      activo: { estado: "pendiente" }, // quedó pendiente porque el tel falló
    };
    const { admin, store } = fakeAdmin({
      business: {
        ...bizBase,
        plan: "starter",
        activo: false,
        vapi_assistant_id: "asst_mock_1",
        onboarding_status: previo,
      },
    });
    const status = await aprovisionarNegocio(admin as never, "b1", {
      soloPaso: "telefono",
    });
    expect(status.telefono.estado).toBe("hecho");
    // La cuenta, antes inactiva, ahora se activa (defect 4).
    expect(status.activo.estado).toBe("hecho");
    expect(store.activo).toBe(true);
  });
});

describe("aprovisionarNegocio (fallo del assistant → señal DURA, defect 1 y 5)", () => {
  it("si el assistant falla: NO activa, escribe activo:false y LANZA AprovisionamientoError", async () => {
    vapiSpies.crear.mockRejectedValueOnce(new Error("Vapi 500: boom"));
    const { admin, store } = fakeAdmin({
      // El alta admin inserta activo:true por defecto; si el assistant falla,
      // NO puede quedarse activo sin asistente (defect 5).
      business: { ...bizBase, activo: true },
    });

    await expect(
      aprovisionarNegocio(admin as never, "b1"),
    ).rejects.toBeInstanceOf(AprovisionamientoError);

    // El paso crítico quedó en error y la cuenta se desactivó explícitamente.
    const persistido = store.onboarding_status as OnboardingStatus;
    expect(persistido.assistant?.estado).toBe("error");
    expect(persistido.activo?.estado).toBe("pendiente");
    // Defect 5: activo se escribió a false, no se dejó el true obsoleto.
    expect(store.activo).toBe(false);
  });

  it("un fallo NO crítico (teléfono en error) NO lanza AprovisionamientoError", async () => {
    // Assistant OK; forzamos el paso teléfono a fallar (número).
    numeroSpies.buscar.mockRejectedValueOnce(new Error("Twilio 500"));
    const { admin, store } = fakeAdmin({
      business: { ...bizBase, phone_mode: "new", telefono_entrante: null },
    });
    // No debe lanzar: el teléfono no es crítico (se reintenta a mano).
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.assistant.estado).toBe("hecho");
    expect(status.telefono.estado).toBe("error");
    // La cuenta NO se activa (teléfono no hecho/omitido) y activo:false explícito.
    expect(status.activo.estado).toBe("pendiente");
    expect(store.activo).toBe(false);
  });
});

describe("aprovisionarNegocio (persistir lanza en error de escritura, defect 9)", () => {
  it("propaga un error si el update de Supabase devuelve { error }", async () => {
    const { admin } = fakeAdmin({
      business: { ...bizBase },
      updateError: { message: 'column "onboarding_status" does not exist' },
    });
    await expect(aprovisionarNegocio(admin as never, "b1")).rejects.toThrow(
      /no se pudo persistir/,
    );
  });
});

describe("aprovisionarNegocio (assistant idempotente, defect 10)", () => {
  it("si ya existe vapi_assistant_id: ACTUALIZA, no CREA otro assistant", async () => {
    const { admin, store } = fakeAdmin({
      business: { ...bizBase, vapi_assistant_id: "asst_existente_1" },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(status.assistant.estado).toBe("hecho");
    // No se creó un assistant nuevo (evita el duplicado de pago).
    expect(vapiSpies.crear).not.toHaveBeenCalled();
    expect(vapiSpies.actualizar).toHaveBeenCalledTimes(1);
    // El id existente se conserva.
    expect(store.vapi_assistant_id).toBe("asst_existente_1");
    expect(status.assistant.detalle).toBe("asst_existente_1");
  });

  it("si NO existe: crea UNA vez y persiste el id de inmediato", async () => {
    vapiSpies.crear.mockResolvedValueOnce("asst_nuevo_1");
    const { admin, store } = fakeAdmin({
      business: { ...bizBase, vapi_assistant_id: null },
    });
    const status = await aprovisionarNegocio(admin as never, "b1");
    expect(vapiSpies.crear).toHaveBeenCalledTimes(1);
    expect(store.vapi_assistant_id).toBe("asst_nuevo_1");
    expect(status.assistant.estado).toBe("hecho");
  });
});
