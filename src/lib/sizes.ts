// `sizes` attributes for images in the page grid, so browsers pick the right
// file. `sizes` can't read CSS variables, so the page padding
// (`--page-x: clamp(20px, 2.25vw, 44px)`), the 20px gutter and the md/lg
// breakpoints from app.css and Tailwind are written out here.

const PAGE_X = { min: 20, vw: 2.25, max: 44 };
const GUTTER = 20;
const MD = 768;
const LG = 1024;
// Where the page padding stops growing and starts: 20px = 2.25vw, 44px = 2.25vw.
const PAD_GROWS = Math.ceil(PAGE_X.min / (PAGE_X.vw / 100));
const PAD_STOPS = Math.ceil(PAGE_X.max / (PAGE_X.vw / 100));

type Columns = {
  /** Columns of 12 from 768px. Below that every image is the page width. */
  md?: number;
  /** Columns of 12 from 1024px; defaults to `md`. */
  lg?: number;
  /** A fixed width below 768px instead of the page width, like a thumbnail. */
  base?: string;
  /** How much wider than its frame the image is drawn (`object-cover`), below and from 768px. */
  crop?: { base?: number; md?: number };
};

const round = (value: number) => Math.round(value * 100) / 100;

/** `calc()` for `columns` of 12 when the page padding is `pad` px, or 2.25vw when `pad` is null. */
function width(columns: number, pad: number | null, scale: number) {
  const f = columns / 12;
  const gutters = columns < 12 ? GUTTER * (1 - f) : 0;
  const vw = round((pad === null ? 100 - 2 * PAGE_X.vw : 100) * f * scale);
  const px = round(((pad === null ? 0 : 2 * pad * f) + gutters) * scale);
  return px ? `calc(${vw}vw - ${px}px)` : `${vw}vw`;
}

/** A `sizes` value for an image spanning `columns` of the page grid. */
export function gridSizes({ md = 12, lg = md, base, crop = {} }: Columns = {}): string {
  const cm = crop.md ?? 1;
  const cb = crop.base ?? 1;
  return [
    `(min-width: ${PAD_STOPS}px) ${width(lg, PAGE_X.max, cm)}`,
    `(min-width: ${LG}px) ${width(lg, null, cm)}`,
    `(min-width: ${PAD_GROWS}px) ${width(md, null, cm)}`,
    `(min-width: ${MD}px) ${width(md, PAGE_X.min, cm)}`,
    base ?? width(12, PAGE_X.min, cb)
  ].join(', ');
}

/** How much wider than a frame of `frameAspect` an image of `imageAspect` is drawn by `object-cover`. */
export const coverScale = (imageAspect: number, frameAspect: number) =>
  Math.max(1, round(imageAspect / frameAspect));
