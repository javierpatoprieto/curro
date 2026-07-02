/** Clases compartidas de la landing (botones), para no repetirlas. */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export const btnPrimary =
  `inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-strong hover:-translate-y-0.5 ${focusRing}`;

/** Variante compacta para la barra de navegación. */
export const btnPrimarySm =
  `inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-all hover:bg-brand-strong ${focusRing}`;

export const btnPrimaryLg =
  `inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-strong hover:-translate-y-0.5 ${focusRing}`;

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-transparent px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink/5";

/** Botón fantasma sobre fondo oscuro. */
export const btnGhostDark =
  "inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 bg-transparent px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cream/10";
