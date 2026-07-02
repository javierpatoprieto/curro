const GREMIOS = [
  "Fontaneros",
  "Electricistas",
  "Reformas",
  "Pintores",
  "Cerrajeros",
  "Climatización",
  "Carpinteros",
  "Cristaleros",
  "Albañiles",
  "Manitas",
  "Jardineros",
  "Mudanzas",
];

/** Cinta infinita de gremios: movimiento + mensaje "para cualquier oficio". */
export function Gremios() {
  const items = [...GREMIOS, ...GREMIOS];
  return (
    <section
      aria-label="Gremios para los que sirve Curro"
      className="overflow-hidden border-y border-ink/6 bg-mist py-5"
    >
      <div className="marquee items-center gap-8">
        {items.map((g, i) => (
          <span
            key={i}
            aria-hidden={i >= GREMIOS.length}
            className="flex items-center gap-8 whitespace-nowrap font-display text-lg font-semibold text-ink-soft/70"
          >
            {g}
            <span className="text-verde">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
