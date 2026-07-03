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

/* --- Dirección "Reflex": verde bosque con texto lima, radio moderado --- */

const baseR =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors";
const focusR =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bosque/30 focus-visible:ring-offset-2 focus-visible:ring-offset-nieve";

export const btnBosque = `${baseR} bg-bosque px-6 py-3 text-sm text-lima hover:bg-bosque/90 ${focusR}`;

export const btnBosqueSm = `${baseR} bg-bosque px-5 py-2.5 text-sm text-lima hover:bg-bosque/90 ${focusR}`;

export const btnBosqueLg = `${baseR} bg-bosque px-7 py-3.5 text-[15px] text-lima hover:bg-bosque/90 ${focusR}`;

/** Secundario claro: borde bosque sobre nieve. */
export const btnBosqueLinea = `${baseR} border border-bosque/20 bg-transparent px-6 py-3 text-sm text-bosque hover:border-bosque/45 ${focusR}`;

const focusLima =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lima/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bosque";

/** Primario para secciones OSCURAS (bosque): lima sólido con texto bosque. */
export const btnLima = `${baseR} bg-lima px-6 py-3 text-sm text-bosque hover:bg-lima-dark ${focusLima}`;

export const btnLimaLg = `${baseR} bg-lima px-7 py-3.5 text-[15px] text-bosque hover:bg-lima-dark ${focusLima}`;

/** Secundario para secciones oscuras: borde nieve. */
export const btnNieveLinea = `${baseR} border border-nieve/25 bg-transparent px-6 py-3 text-sm text-nieve hover:bg-nieve/10 ${focusLima}`;
