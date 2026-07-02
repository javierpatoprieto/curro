/** Botones compartidos — dirección "Fresh": píldoras, verde vivo, sombra suave. */

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all";

export const btnPrimary = `${base} bg-verde px-6 py-3 text-sm text-ink shadow-lg shadow-verde/25 hover:bg-verde-dark hover:-translate-y-0.5 ${focus}`;

export const btnPrimarySm = `${base} bg-verde px-5 py-2.5 text-sm text-ink shadow-md shadow-verde/25 hover:bg-verde-dark hover:-translate-y-0.5 ${focus}`;

export const btnPrimaryLg = `${base} bg-verde px-7 py-4 text-base text-ink shadow-lg shadow-verde/30 hover:bg-verde-dark hover:-translate-y-0.5 ${focus}`;

/** Secundario claro (borde suave). */
export const btnGhost = `${base} border border-ink/12 bg-white px-6 py-3 text-sm text-ink hover:border-ink/25 hover:-translate-y-0.5 ${focus}`;

/** Secundario sobre fondo oscuro. */
export const btnGhostDark = `${base} border border-white/20 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur hover:bg-white/20 ${focus}`;
