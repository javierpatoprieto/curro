/**
 * Datos de las landing pages por gremio (SEO). Cada gremio tiene copy PROPIO
 * (título, meta, subtítulo, dolores) para que las páginas no sean "finas" ni
 * contenido duplicado. Añadir un gremio = añadir una entrada aquí; la ruta
 * `app/para/[gremio]` y el sitemap se generan solos.
 */

export interface DolorCard {
  titulo: string;
  texto: string;
}

export interface Gremio {
  /** Segmento de URL: /para/{slug} */
  slug: string;
  /** Nombre en el H1 (resaltado en lima): "fontaneros". */
  nombre: string;
  /** <title> y OpenGraph. */
  metaTitle: string;
  /** meta description. */
  metaDescription: string;
  /** Subtítulo del hero. */
  subtitulo: string;
  /** Encabezado de la sección de dolores/beneficios. */
  doloresTitulo: string;
  /** 3 tarjetas de dolor/beneficio específicas del oficio. */
  dolores: DolorCard[];
  /** Ejemplo para la tarjeta flotante del hero. */
  ejemplo: { trabajo: string; zona: string; etiqueta: string };
}

export const GREMIOS: Gremio[] = [
  {
    slug: "fontaneros",
    nombre: "fontaneros",
    metaTitle: "Recepcionista con IA para fontaneros · Curro",
    metaDescription:
      "Curro coge el teléfono cuando estás con las manos en una fuga. Cualifica la urgencia y te pasa el cliente por WhatsApp. 24/7 en español. Prueba 7 días.",
    subtitulo:
      "Bajo un fregadero no puedes coger el móvil. Curro lo coge por ti, apunta la avería y te avisa al instante.",
    doloresTitulo: "Pensado para la fontanería del día a día",
    dolores: [
      {
        titulo: "Las urgencias no esperan",
        texto:
          "Una fuga que no coges a la primera llama al siguiente fontanero. Curro contesta al primer tono, 24/7.",
      },
      {
        titulo: "Con las manos ocupadas",
        texto:
          "En plena reparación no paras a atender. Curro atiende, pregunta lo justo y te manda el aviso.",
      },
      {
        titulo: "Presupuestos que se escapan",
        texto:
          "Cada llamada perdida es un presupuesto perdido. Curro capta al cliente y te lo pasa por WhatsApp con los datos.",
      },
    ],
    ejemplo: { trabajo: "Reparar fuga", zona: "Chamberí", etiqueta: "Urgente" },
  },
  {
    slug: "electricistas",
    nombre: "electricistas",
    metaTitle: "Recepcionista con IA para electricistas · Curro",
    metaDescription:
      "Curro coge las llamadas mientras estás en el cuadro. Cualifica la avería, toma los datos y te pasa el cliente por WhatsApp. 24/7 en español. Prueba 7 días.",
    subtitulo:
      "Subido a una escalera o con el cuadro abierto no atiendes el teléfono. Curro contesta, apunta la avería y te avisa.",
    doloresTitulo: "Hecho para el trabajo eléctrico",
    dolores: [
      {
        titulo: "Averías que corren prisa",
        texto:
          "Un cuadro que salta no espera. Curro contesta al primer tono y cualifica la urgencia.",
      },
      {
        titulo: "No puedes soltar los cables",
        texto:
          "Mientras trabajas, Curro atiende por ti, pregunta lo justo y te manda el aviso.",
      },
      {
        titulo: "Clientes que llaman al de al lado",
        texto:
          "Si no contestas, llaman al siguiente. Curro capta al cliente y te lo pasa por WhatsApp.",
      },
    ],
    ejemplo: { trabajo: "Cuadro que salta", zona: "Salamanca", etiqueta: "Urgente" },
  },
  {
    slug: "reformas",
    nombre: "reformas",
    metaTitle: "Recepcionista con IA para empresas de reformas · Curro",
    metaDescription:
      "Curro coge el teléfono mientras estás en la obra. Cualifica al cliente, toma los datos del proyecto y te lo pasa por WhatsApp. Prueba 7 días sin permanencia.",
    subtitulo:
      "En plena obra no oyes el móvil. Curro contesta cada llamada, apunta qué necesita el cliente y te avisa al instante.",
    doloresTitulo: "Pensado para las reformas",
    dolores: [
      {
        titulo: "En obra no oyes el teléfono",
        texto:
          "Entre ruido y polvo, las llamadas se pierden. Curro las coge todas por ti.",
      },
      {
        titulo: "Proyectos que valen mucho",
        texto:
          "Una reforma perdida es mucho dinero. Curro capta al cliente y toma los datos del trabajo.",
      },
      {
        titulo: "Visitas sin llamadas de ida y vuelta",
        texto:
          "Curro agenda la visita para valorar la obra y te ahorra el baile de llamadas.",
      },
    ],
    ejemplo: { trabajo: "Reforma de baño", zona: "Chamberí", etiqueta: "Presupuesto" },
  },
  {
    slug: "pintores",
    nombre: "pintores",
    metaTitle: "Recepcionista con IA para pintores · Curro",
    metaDescription:
      "Curro contesta el teléfono mientras estás pintando. Toma los datos del trabajo y te pasa el cliente por WhatsApp. 24/7 en español. Prueba 7 días.",
    subtitulo:
      "Con el rodillo en la mano no coges el móvil. Curro atiende, apunta qué hay que pintar y te avisa.",
    doloresTitulo: "A medida para pintores",
    dolores: [
      {
        titulo: "No sueltas el rodillo",
        texto: "Mientras pintas, Curro atiende por ti sin manchar nada.",
      },
      {
        titulo: "Presupuestos que se pierden",
        texto:
          "Cada llamada sin coger es un presupuesto para otro. Curro capta al cliente.",
      },
      {
        titulo: "Datos claros del trabajo",
        texto:
          "Curro pregunta metros, estancias y para cuándo, y te lo pasa por WhatsApp.",
      },
    ],
    ejemplo: { trabajo: "Pintar piso", zona: "Retiro", etiqueta: "Presupuesto" },
  },
  {
    slug: "cerrajeros",
    nombre: "cerrajeros",
    metaTitle: "Recepcionista con IA para cerrajeros · Curro",
    metaDescription:
      "Curro coge las urgencias de cerrajería cuando no puedes. Cualifica y te pasa el cliente por WhatsApp al instante. 24/7 en español. Prueba 7 días.",
    subtitulo:
      "Las urgencias de cerrajería no avisan. Curro contesta a cualquier hora, cualifica y te avisa al momento.",
    doloresTitulo: "Para la cerrajería y sus urgencias",
    dolores: [
      {
        titulo: "Urgencias a cualquier hora",
        texto:
          "Un cliente fuera de casa llama al que contesta. Curro contesta siempre, 24/7.",
      },
      {
        titulo: "No atiendes en plena apertura",
        texto: "Mientras trabajas, Curro coge la llamada y toma los datos.",
      },
      {
        titulo: "El que responde primero se lleva el trabajo",
        texto:
          "Curro contesta al primer tono y te pasa el cliente por WhatsApp.",
      },
    ],
    ejemplo: { trabajo: "Apertura de puerta", zona: "Centro", etiqueta: "Urgente" },
  },
  {
    slug: "climatizacion",
    nombre: "climatización",
    metaTitle: "Recepcionista con IA para climatización y aire acondicionado · Curro",
    metaDescription:
      "Curro coge el teléfono en plena temporada de calor. Cualifica la instalación o avería y te pasa el cliente por WhatsApp. 24/7 en español. Prueba 7 días.",
    subtitulo:
      "En temporada alta el teléfono no para y tú estás en un tejado. Curro atiende cada llamada por ti.",
    doloresTitulo: "Para instaladores de aire y climatización",
    dolores: [
      {
        titulo: "La temporada lo satura todo",
        texto:
          "En verano no das abasto con el teléfono. Curro coge todas las llamadas.",
      },
      {
        titulo: "Instalaciones que valen la pena",
        texto:
          "Una instalación perdida es mucho dinero. Curro capta al cliente y toma los datos.",
      },
      {
        titulo: "Avisos al instante",
        texto:
          "Curro te pasa cada cliente por WhatsApp con el tipo de trabajo y la zona.",
      },
    ],
    ejemplo: { trabajo: "Instalar aire", zona: "Tetuán", etiqueta: "Presupuesto" },
  },
];

/** Slugs para generateStaticParams y el sitemap. */
export const GREMIO_SLUGS = GREMIOS.map((g) => g.slug);

/** Devuelve el gremio por slug (o undefined). */
export function getGremio(slug: string): Gremio | undefined {
  return GREMIOS.find((g) => g.slug === slug);
}
