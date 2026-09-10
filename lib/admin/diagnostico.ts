/**
 * Diagnóstico de configuración: qué partes de Curro están funcionando de verdad
 * y cuáles siguen en mock o incompletas.
 *
 * Existe porque el gate de cada adaptador es doble (`MOCK_PROVIDERS=false` Y las
 * claves del proveedor) y está repartido por medio repo: sin esto, la única
 * forma de saber si una llamada real acabaría en un WhatsApp real era probarlo
 * en producción. Aquí se ve de un vistazo desde /admin/estado.
 *
 * Módulo PURO: recibe las variables ya leídas y NO importa `@/lib/env`, para
 * poder testear cualquier combinación. Solo mira la PRESENCIA de cada variable;
 * nunca devuelve su valor (la página lo pinta tal cual, así que ningún secreto
 * puede escaparse por aquí).
 */

/**
 * - `real`: llama al proveedor de verdad.
 * - `mock`: configurado, pero simulado porque MOCK_PROVIDERS no es "false".
 * - `incompleto`: faltan variables, no funcionaría ni quitando el mock.
 * - `off`: opcional y desactivado (no es un problema, es una decisión).
 */
export type EstadoCapacidad = "real" | "mock" | "incompleto" | "off";

export interface Capacidad {
  id: string;
  nombre: string;
  estado: EstadoCapacidad;
  /** Qué implica el estado actual, en una frase. */
  resumen: string;
  /** Variables que faltan (nombres, nunca valores). */
  faltan: string[];
  /** Matiz que conviene leer aunque el estado sea bueno. */
  aviso?: string;
}

export interface EntradaDiagnostico {
  /** Variables de entorno (solo se mira si tienen valor). */
  vars: Record<string, string | undefined>;
  /** `env.mockProviders`: true salvo que MOCK_PROVIDERS sea "false". */
  mockProviders: boolean;
}

const tiene = (vars: EntradaDiagnostico["vars"], k: string): boolean =>
  Boolean(vars[k]?.trim());

const faltantes = (vars: EntradaDiagnostico["vars"], ks: string[]): string[] =>
  ks.filter((k) => !tiene(vars, k));

/**
 * Estado de un adaptador con gate doble: incompleto si le faltan claves, mock si
 * las tiene pero el modo mock está activo, real si ambas cosas están bien.
 */
function estadoConGate(
  faltan: string[],
  mockProviders: boolean,
): EstadoCapacidad {
  if (faltan.length > 0) return "incompleto";
  return mockProviders ? "mock" : "real";
}

/** Capacidades en el orden en que importan para lanzar. */
export function construirDiagnostico({
  vars,
  mockProviders,
}: EntradaDiagnostico): Capacidad[] {
  const caps: Capacidad[] = [];

  // 1. Base de datos: sin esto la app ni arranca en producción (lib/env.ts).
  const faltanDatos = faltantes(vars, [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]);
  caps.push({
    id: "datos",
    nombre: "Base de datos (Supabase)",
    estado: faltanDatos.length > 0 ? "incompleto" : "real",
    resumen:
      faltanDatos.length > 0
        ? "Imprescindible: en producción la app rompe al arrancar sin esto."
        : "Datos y auth de los dueños funcionando.",
    faltan: faltanDatos,
  });

  // 2. El interruptor general. Manda sobre todos los adaptadores de abajo.
  caps.push({
    id: "modo",
    nombre: "Modo de proveedores",
    estado: mockProviders ? "mock" : "real",
    resumen: mockProviders
      ? 'MOCK_PROVIDERS no es "false": todo se simula, no sale nada al exterior.'
      : "MOCK_PROVIDERS=false: los adaptadores llaman a los proveedores reales.",
    faltan: [],
    aviso: mockProviders
      ? "Mientras esté así, ninguna llamada, WhatsApp o email es real por mucho que estén las claves."
      : undefined,
  });

  // 3. Voz: el corazón del producto.
  const faltanVoz = faltantes(vars, ["VAPI_API_KEY", "VAPI_WEBHOOK_SECRET"]);
  caps.push({
    id: "voz",
    nombre: "Agente de voz (Vapi)",
    estado: estadoConGate(faltanVoz, mockProviders),
    resumen:
      "Crea el assistant de cada negocio y recibe el end-of-call-report en /api/webhooks/vapi.",
    faltan: faltanVoz,
    aviso: !tiene(vars, "VAPI_WEBHOOK_SECRET")
      ? "Sin VAPI_WEBHOOK_SECRET el webhook responde 500 en producción a propósito."
      : undefined,
  });

  // 4. Números +34: el bloqueo conocido (bundle regulatorio ES).
  const faltanNumeros = faltantes(vars, [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_ADDRESS_SID",
    "TWILIO_BUNDLE_SID",
  ]);
  caps.push({
    id: "numeros",
    nombre: "Números +34 (Twilio)",
    estado: estadoConGate(faltanNumeros, mockProviders),
    resumen:
      "Compra el número español y lo importa en Vapi para atender las entrantes.",
    faltan: faltanNumeros,
    aviso:
      faltanNumeros.includes("TWILIO_ADDRESS_SID") ||
      faltanNumeros.includes("TWILIO_BUNDLE_SID")
        ? "Comprar un número ES exige Address + Regulatory Bundle aprobados en Twilio."
        : undefined,
  });

  // 5. WhatsApp: dos proveedores posibles; gana Twilio si está completo.
  const faltanWaTwilio = faltantes(vars, [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_WHATSAPP_FROM",
  ]);
  const faltanWaMeta = faltantes(vars, [
    "WHATSAPP_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
  ]);
  const viaTwilio = faltanWaTwilio.length === 0;
  const viaMeta = faltanWaMeta.length === 0;
  const sinPlantillas =
    viaTwilio &&
    faltantes(vars, ["TWILIO_WA_CONTENT_CLIENTE", "TWILIO_WA_CONTENT_DUENO"])
      .length > 0;
  caps.push({
    id: "whatsapp",
    nombre: "WhatsApp (aviso del lead)",
    estado: viaTwilio || viaMeta ? estadoConGate([], mockProviders) : "incompleto",
    resumen: viaTwilio
      ? "Se enviará por Twilio (tiene prioridad sobre Meta)."
      : viaMeta
        ? "Se enviará por Meta (Cloud API)."
        : "Sin proveedor configurado: el aviso al dueño y al cliente no sale.",
    faltan: viaTwilio || viaMeta ? [] : faltanWaTwilio,
    aviso: sinPlantillas
      ? "Sin TWILIO_WA_CONTENT_* se manda texto libre: solo llega al sandbox o dentro de la ventana de 24 h."
      : undefined,
  });

  // 6. Email: el segundo canal de aviso.
  const faltanEmail = faltantes(vars, ["RESEND_API_KEY", "EMAIL_FROM"]);
  caps.push({
    id: "email",
    nombre: "Email (Resend)",
    estado: estadoConGate(faltanEmail, mockProviders),
    resumen: "Aviso por email al dueño, además del WhatsApp.",
    faltan: faltanEmail,
    aviso: !tiene(vars, "EMAIL_FROM")
      ? "Sin EMAIL_FROM se usa un remitente de otro dominio y el envío falla."
      : undefined,
  });

  // 7. Cobros.
  const faltanPagos = faltantes(vars, [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_STARTER",
    "STRIPE_PRICE_PRO",
    "STRIPE_PRICE_PREMIUM",
  ]);
  caps.push({
    id: "pagos",
    nombre: "Suscripciones (Stripe)",
    estado: estadoConGate(faltanPagos, mockProviders),
    resumen:
      "Checkout con 7 días de prueba; el webhook activa el negocio y crea el assistant.",
    faltan: faltanPagos,
    aviso:
      faltanPagos.length === 0
        ? "Comprueba en Stripe que los tres Prices son 49 / 99 / 199 €: el código no valida el importe."
        : undefined,
  });

  // 8. Enlaces absolutos: webhooks, emails y URLs de Stripe salen de aquí.
  const hayUrl = tiene(vars, "APP_URL") || tiene(vars, "NEXT_PUBLIC_APP_URL");
  caps.push({
    id: "url",
    nombre: "URL pública de la app",
    estado: hayUrl ? "real" : "incompleto",
    resumen:
      "Se usa para el server.url de Vapi, los enlaces del email y las URLs de Stripe.",
    faltan: hayUrl ? [] : ["APP_URL"],
  });

  // 9. Retención RGPD: implementada, pero el cron solo corre con secreto.
  const hayCron = tiene(vars, "CRON_SECRET");
  caps.push({
    id: "retencion",
    nombre: "Retención RGPD (cron)",
    estado: hayCron ? "real" : "off",
    resumen: hayCron
      ? "El cron diario borra grabaciones y datos fuera de plazo."
      : "Sin CRON_SECRET el endpoint no corre: nada se borra por plazo.",
    faltan: hayCron ? [] : ["CRON_SECRET"],
  });

  // 10. Superadmin: fail-closed sin contraseña.
  const hayAdminPass = tiene(vars, "ADMIN_PASSWORD");
  caps.push({
    id: "admin",
    nombre: "Acceso de superadmin",
    estado: hayAdminPass ? "real" : "incompleto",
    resumen: hayAdminPass
      ? "Panel /admin protegido por contraseña."
      : "Sin ADMIN_PASSWORD no entra nadie (fail-closed).",
    faltan: hayAdminPass ? [] : ["ADMIN_PASSWORD"],
    aviso: !tiene(vars, "ADMIN_SESSION_SECRET")
      ? "Sin ADMIN_SESSION_SECRET la sesión se firma con la propia contraseña."
      : undefined,
  });

  // 11. Demo de voz en la web: opcional, pero es el gancho de la landing.
  const faltanDemo = faltantes(vars, [
    "NEXT_PUBLIC_VAPI_PUBLIC_KEY",
    "NEXT_PUBLIC_VAPI_DEMO_ASSISTANT_ID",
  ]);
  caps.push({
    id: "demo",
    nombre: "Demo de voz en /demo",
    estado: faltanDemo.length > 0 ? "off" : "real",
    resumen:
      faltanDemo.length > 0
        ? "La demo por navegador no está activa."
        : "Los visitantes pueden hablar con Curro desde la web.",
    faltan: faltanDemo,
  });

  // 12. Rate limit: sin Upstash es best-effort por instancia.
  const faltanRl = faltantes(vars, [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ]);
  caps.push({
    id: "ratelimit",
    nombre: "Rate limit de webhooks",
    estado: faltanRl.length > 0 ? "off" : "real",
    resumen:
      faltanRl.length > 0
        ? "Contador en memoria por instancia (aproximado)."
        : "Cuota global compartida vía Upstash.",
    faltan: faltanRl,
  });

  return caps;
}

/**
 * Lo que impide, HOY, que la llamada de un cliente real acabe en un aviso real:
 * el camino mínimo es datos → modo real → voz → número → aviso (WhatsApp o email).
 */
export function bloqueosParaLlamadaReal(caps: Capacidad[]): string[] {
  const por = (id: string) => caps.find((c) => c.id === id);
  const bloqueos: string[] = [];

  const datos = por("datos");
  if (datos && datos.estado !== "real") bloqueos.push(datos.nombre);

  const modo = por("modo");
  if (modo?.estado === "mock") bloqueos.push(modo.nombre);

  for (const id of ["voz", "numeros"]) {
    const c = por(id);
    if (c && c.estado !== "real") bloqueos.push(c.nombre);
  }

  // El aviso puede salir por WhatsApp o por email: basta con uno de los dos.
  const wa = por("whatsapp");
  const email = por("email");
  if (wa?.estado !== "real" && email?.estado !== "real") {
    bloqueos.push("Aviso al dueño (WhatsApp o email)");
  }

  return bloqueos;
}
