// How wide the site ever shows each image, so no larger size is written.
//
// Measured on the layouts in src/components and src/routes at viewports from
// 360 to 1512 px (the widest the design is tuned for), in device pixels on a
// 2x screen. Below 768 px every slot is the page width, which reaches 1454 px
// at 767 px, so no slot needs less than that except Work's small thumbnails.
// Update these if you change the layout's columns.
import path from 'node:path';
import { createServer } from 'vite';

export const SLOT_WIDTHS = {
  /** The page width: case covers, image blocks, before/after, demo stills, video posters. */
  full: 2880,
  /** An image block with `inset: true`: 8 of 12 columns. */
  inset: 1920,
  /** Each image of a `pair` block: half the page. */
  pair: 1456,
  /** `coverTall`: Home's portrait slots, 5 of 12 columns at most. */
  tall: 1456
};

/** `/src/content/work/kestrel/cover-1600.webp?x` → `cover` */
export const imageKey = (asset) =>
  path.basename(asset.src.split('?')[0]).replace(/(-\d+)?\.(webp|gif|jpg)$/, '');

/** The widest each named image of a case study is shown, by how its blocks use it. */
export function capsFor(study) {
  const caps = {};
  const use = (asset, width) => {
    if (!asset?.src) return;
    const key = imageKey(asset);
    caps[key] = Math.max(caps[key] ?? 0, width);
  };
  use(study.cover, SLOT_WIDTHS.full);
  use(study.coverTall, SLOT_WIDTHS.tall);
  for (const block of study.blocks ?? []) {
    if (block.type === 'image') use(block.image, block.inset ? SLOT_WIDTHS.inset : SLOT_WIDTHS.full);
    if (block.type === 'pair') for (const figure of block.images) use(figure.image, SLOT_WIDTHS.pair);
    if (block.type === 'beforeAfter') {
      use(block.before.image, SLOT_WIDTHS.full);
      use(block.after.image, SLOT_WIDTHS.full);
    }
    if (block.type === 'demo') use(block.still, SLOT_WIDTHS.full);
    if (block.type === 'video') use(block.poster, SLOT_WIDTHS.full);
  }
  return caps;
}

/**
 * Reads `src/content/work/<slug>.ts` for each slug and returns its caps, or
 * `{}` for a slug whose case study doesn't exist or doesn't load yet.
 */
export async function loadCaps(root, slugs) {
  const server = await createServer({
    configFile: false,
    root,
    logLevel: 'silent',
    appType: 'custom',
    resolve: { alias: [{ find: /^~\//, replacement: `${path.join(root, 'src')}/` }] },
    server: { middlewareMode: true, hmr: false, watch: null }
  });
  const result = {};
  try {
    for (const slug of slugs) {
      try {
        const module = await server.ssrLoadModule(`/src/content/work/${slug}.ts`);
        result[slug] = capsFor(module.default);
      } catch {
        result[slug] = {};
      }
    }
  } finally {
    await server.close();
  }
  return result;
}
