import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { btnBosqueLg } from "./ui";
import type { Gremio } from "@/lib/gremios";
import { PROVINCIAS, indiceEstable, type Provincia } from "@/lib/provincias";

/** Primera letra en mayúscula (los nombres de gremio van en minúscula). */
function cap1(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Une una lista en lenguaje natural: "A, B y C". */
function listaNatural(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

/**
 * Frase localizada del hero, elegida de forma estable según el gremio+provincia
 * para que las páginas de un mismo gremio no repitan el mismo texto (anti-duplicado).
 */
function lineaHero(gremio: Gremio, p: Provincia): string {
  const prov = p.nombre;
  const variantes = [
    `En ${prov} y toda su provincia, Curro coge el teléfono cuando tú no puedes: contesta, apunta al cliente y te lo pasa por WhatsApp.`,
    `Trabajes donde trabajes en ${prov}, Curro atiende la llamada por ti, cualifica al cliente y te avisa al instante por WhatsApp.`,
    `Curro contesta tus llamadas de ${gremio.nombre} en ${prov} a cualquier hora, apunta lo que necesita el cliente y te lo pasa al momento.`,
    `¿Te entra una llamada mientras trabajas en ${prov}? Curro la coge por ti, toma los datos y te la pasa por WhatsApp sin perder al cliente.`,
  ];
  return variantes[indiceEstable(gremio.slug + p.slug) % variantes.length];
}

/** Hero de la landing por gremio (y opcionalmente por provincia). */
export function GremioHero({
  gremio,
  provincia,
}: {
  gremio: Gremio;
  provincia?: Provincia;
}) {
  const { ejemplo } = gremio;
  const enProvincia = provincia ? ` en ${provincia.nombre}` : "";
  return (
    <section className="bg-nieve">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-linea3 bg-white px-3 py-1.5 text-xs font-semibold text-bosque">
            <span className="size-1.5 rounded-full bg-lima" />
            Recepcionista con IA · {gremio.nombre}
            {provincia ? ` · ${provincia.nombre}` : ""}
          </span>

          <h1 className="titular mt-6 text-5xl text-bosque sm:text-6xl lg:text-[4.4rem]">
            El recepcionista con IA para{" "}
            <span className="marca-lima">{gremio.nombre}</span>
            {enProvincia}.
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-bosque-soft">
            {gremio.subtitulo}
          </p>

          {provincia && (
            <p className="mt-3 max-w-lg leading-relaxed text-bosque-soft">
              {lineaHero(gremio, provincia)}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/registro" className={btnBosqueLg}>
              Probar gratis 7 días
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-bosque transition-opacity hover:opacity-70"
            >
              Ver cómo funciona
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </a>
          </div>

          <p className="mt-7 text-sm text-bosque-soft">
            Sin permanencia · Listo en 10 min · Cancelas cuando quieras
          </p>
        </div>

        {/* Imagen real: la llamada entrante */}
        <div className="relative lg:justify-self-end">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-linea3">
            <Image
              src="/img/llamada.jpg"
              alt="Un profesional sujeta el móvil con una llamada entrante que Curro atiende por él"
              width={880}
              height={1100}
              priority
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-linea3 bg-nieve/95 p-3 shadow-lg backdrop-blur">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bosque text-lima">
                <PhoneCall className="size-5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bosque">
                  Curro está atendiendo
                </p>
                <p className="truncate text-xs text-bosque-soft">
                  {ejemplo.trabajo} · {ejemplo.zona} · {ejemplo.etiqueta}
                </p>
              </div>
              <span aria-hidden className="ml-auto flex h-5 items-end gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-bosque"
                    style={{
                      height: "100%",
                      animation: `curro-wave ${0.7 + i * 0.1}s ease-in-out ${i * 0.1}s infinite`,
                      transformOrigin: "bottom",
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Sección de dolores/beneficios específicos del gremio (3 tarjetas). */
export function GremioDolores({
  gremio,
  provincia,
}: {
  gremio: Gremio;
  provincia?: Provincia;
}) {
  const titulo = provincia
    ? `Curro para ${gremio.nombre} en ${provincia.nombre}`
    : gremio.doloresTitulo;
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <h2 className="titular max-w-2xl text-4xl text-bosque sm:text-5xl">
          {titulo}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gremio.dolores.map((d) => (
            <div
              key={d.titulo}
              className="rounded-2xl border border-linea3 bg-nieve p-6"
            >
              <h3 className="text-lg font-semibold text-bosque">{d.titulo}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-bosque-soft">
                {d.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Enlaces a las páginas por provincia de un gremio (para la página nacional). */
export function GremioProvincias({ gremio }: { gremio: Gremio }) {
  return (
    <section className="bg-nieve">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <h2 className="titular text-3xl text-bosque sm:text-4xl">
          Curro para {gremio.nombre} en tu provincia
        </h2>
        <p className="mt-3 max-w-2xl text-bosque-soft">
          Estés donde estés, Curro coge el teléfono por ti. Elige tu provincia:
        </p>
        <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {PROVINCIAS.map((p) => (
            <Link
              key={p.slug}
              href={`/para/${gremio.slug}/${p.slug}`}
              className="text-bosque-soft transition-colors hover:text-bosque"
            >
              {gremio.nombre} en {p.nombre}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

/**
 * Sección de zonas: capital + municipios REALES de la provincia. Es el bloque de
 * contenido local único que diferencia cada página (anti thin-content).
 */
export function GremioZonas({
  gremio,
  provincia,
}: {
  gremio: Gremio;
  provincia: Provincia;
}) {
  const cap = provincia.capital;
  const lista = listaNatural(provincia.municipios);
  const g = gremio.nombre;
  const i = indiceEstable(gremio.slug + provincia.slug);

  const h2Variantes = [
    `${cap1(g)} en ${provincia.nombre} y toda su provincia`,
    `Curro para ${g} en la provincia de ${provincia.nombre}`,
    `Cubrimos ${provincia.nombre} entero para ${g}`,
  ];
  const introVariantes = [
    `Curro atiende llamadas de ${g} en ${provincia.nombre}: desde ${cap} hasta ${lista}. Da igual el municipio, coge el teléfono por ti y te pasa el cliente por WhatsApp.`,
    `Estés en ${cap} o en ${lista}, Curro coge las llamadas de ${g} en toda la provincia de ${provincia.nombre} y te avisa al instante.`,
    `De ${cap} a ${lista}: Curro no deja escapar ninguna llamada de ${g} en ${provincia.nombre}. Contesta, cualifica y te lo pasa por WhatsApp.`,
  ];

  const zonas = [cap, ...provincia.municipios];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <h2 className="titular max-w-3xl text-3xl text-bosque sm:text-4xl">
          {h2Variantes[i % h2Variantes.length]}
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-bosque-soft">
          {introVariantes[i % introVariantes.length]}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {zonas.map((z) => (
            <span
              key={z}
              className="rounded-full border border-linea3 bg-nieve px-3 py-1.5 text-sm text-bosque"
            >
              {z}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
