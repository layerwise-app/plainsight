// Shared by `pnpm add-images` and the sample-work renderer.
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const WIDTHS = [800, 1600, 2880];
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff']);

export const workDir = (root, slug) => path.join(root, 'src', 'content', 'work', slug);

/** `Agent list (final).PNG` → `agent-list-final` */
export function imageName(file) {
  return path
    .basename(file, path.extname(file))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/œ/g, 'oe')
    .replace(/ß/g, 'ss')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Widths to write for a source this wide. The largest is the source width, or
 * `max` (the widest its layout ever shows it), or 2880, whichever is smallest;
 * a standard width close below it is dropped, because the largest does its job.
 */
export function widthsFor(sourceWidth, max = Number.POSITIVE_INFINITY) {
  const top = Math.max(1, Math.round(Math.min(sourceWidth, max, WIDTHS.at(-1))));
  return [...WIDTHS.filter((w) => w * 1.25 <= top), top];
}

// How each image's encoding is picked:
// - Lossy WebP at the lowest quality whose SSIM, measured at half size (about
//   what a 2x screen shows), stays within MARGIN of a near-lossless encode.
//   Flat interface screens land on the floor (72, which keeps smooth
//   gradients from banding); grain, paper and photos land higher.
// - Flat-colour images, like halftones and diagrams, are also tried as a
//   lossless WebP of at most 256 colours. Each size keeps whichever is
//   smaller, as long as the palette is indistinguishable (PALETTE_SSIM).
const QUALITIES = [72, 76, 80, 84, 88];
const REFERENCE_QUALITY = 94;
const MARGIN = 0.015;
const PALETTE_SSIM = 0.995;

/** Greyscale pixels of an image, optionally resized to exactly `size`. */
async function lumaOf(image, size) {
  let pipeline = sharp(image.data ?? image, image.info ? { raw: image.info } : undefined).flatten({
    background: '#ffffff'
  });
  if (size) pipeline = pipeline.resize(size.width, size.height, { fit: 'fill' });
  const { data, info } = await pipeline.greyscale().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** Mean SSIM of two greyscale images over 8×8 windows, every 4 pixels. */
export function ssim(a, b) {
  if (a.width !== b.width || a.height !== b.height) throw new Error('ssim: sizes differ');
  const { width: w, height: h } = a;
  const A = a.data;
  const B = b.data;
  const C1 = (0.01 * 255) ** 2;
  const C2 = (0.03 * 255) ** 2;
  let sum = 0;
  let count = 0;
  for (let y = 0; y + 8 <= h; y += 4) {
    for (let x = 0; x + 8 <= w; x += 4) {
      let ma = 0;
      let mb = 0;
      for (let j = 0; j < 8; j++) {
        const row = (y + j) * w + x;
        for (let i = 0; i < 8; i++) {
          ma += A[row + i];
          mb += B[row + i];
        }
      }
      ma /= 64;
      mb /= 64;
      let va = 0;
      let vb = 0;
      let cov = 0;
      for (let j = 0; j < 8; j++) {
        const row = (y + j) * w + x;
        for (let i = 0; i < 8; i++) {
          const da = A[row + i] - ma;
          const db = B[row + i] - mb;
          va += da * da;
          vb += db * db;
          cov += da * db;
        }
      }
      va /= 63;
      vb /= 63;
      cov /= 63;
      sum += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      count++;
    }
  }
  return count ? sum / count : 1;
}

const raw = (image) => sharp(image.data, { raw: image.info });
const lossyWebp = (image, quality, effort = 6) =>
  raw(image).webp({ quality, effort, smartSubsample: true }).toBuffer();
async function paletteWebp(image) {
  const png = await raw(image).png({ palette: true, colours: 256, dither: 0, effort: 8 }).toBuffer();
  return sharp(png).webp({ lossless: true, effort: 6 }).toBuffer();
}

/**
 * Picks the lossy quality for an image at its largest width, and whether a
 * palette is worth trying: `{ quality, palette }`.
 */
export async function chooseEncoding(image) {
  const half = {
    width: Math.max(8, Math.round(image.info.width / 2)),
    height: Math.max(8, Math.round(image.info.height / 2))
  };
  const refHalf = await lumaOf(image, half);
  const score = async (quality) => ssim(refHalf, await lumaOf(await lossyWebp(image, quality, 4), half));
  const target = (await score(REFERENCE_QUALITY)) - MARGIN;

  let lo = 0;
  let hi = QUALITIES.length - 1;
  let best = hi;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if ((await score(QUALITIES[mid])) >= target) {
      best = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  const quality = QUALITIES[best];

  return { quality, palette: (await encode(image, quality, true)).palette };
}

/** The smaller of a lossy and (when `tryPalette`) a palette encode of one size. */
async function encode(image, quality, tryPalette) {
  const lossy = await lossyWebp(image, quality);
  if (!tryPalette) return { buffer: lossy, palette: false };
  const palette = await paletteWebp(image);
  if (palette.length < lossy.length && ssim(await lumaOf(image), await lumaOf(palette)) >= PALETTE_SSIM) {
    return { buffer: palette, palette: true };
  }
  return { buffer: lossy, palette: false };
}

async function blurOf(input) {
  const buffer = await sharp(input, { animated: false })
    .resize(16)
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

async function removeOldFiles(dir, name) {
  if (!existsSync(dir)) return;
  const pattern = new RegExp(`^${name}(-\\d+|-share)?\\.(webp|gif|jpg)$`);
  for (const file of await readdir(dir)) {
    if (pattern.test(file)) await unlink(path.join(dir, file));
  }
}

/**
 * Writes one image into a case study folder and returns its `images.json`
 * entry. GIFs are copied untouched; SVGs are rejected.
 *
 * - `max`: the widest its layout ever shows it, in device pixels on a 2x
 *   screen (see `scripts/lib/layout.mjs`). Larger sizes aren't written.
 * - `quality`: a fixed WebP quality instead of one picked for this image.
 * - `renderAt(width)`: draws the image natively at a smaller width (the
 *   sample-work renderer passes one). Used for palette images, whose smaller
 *   sizes stay flat-coloured, and so small, only when drawn at that size.
 */
export async function writeImage(dir, source, name = imageName(source), { max, quality, renderAt } = {}) {
  const ext = path.extname(source).toLowerCase();
  if (ext === '.svg') {
    throw new Error(`${path.basename(source)}: SVG isn't supported. Export it as PNG or JPG first.`);
  }
  if (ext !== '.gif' && !RASTER.has(ext)) {
    throw new Error(`${path.basename(source)}: use JPG, PNG, WebP, AVIF, TIFF or GIF.`);
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    throw new Error(`"${name}" isn't a usable image name. Use lowercase letters, digits and dashes.`);
  }

  await mkdir(dir, { recursive: true });
  await removeOldFiles(dir, name);
  const input = await readFile(source);
  const meta = await sharp(input, { animated: true }).metadata();
  const width = meta.width;
  const height = meta.pageHeight ?? meta.height;

  if (ext === '.gif') {
    const file = `${name}.gif`;
    await copyFile(source, path.join(dir, file));
    return {
      width,
      height,
      blur: await blurOf(input),
      sizes: [{ w: width, file }],
      animated: (meta.pages ?? 1) > 1
    };
  }

  // Bake EXIF rotation in, so phone photos stand the right way up.
  const upright = sharp(input).rotate();
  const sideways = (meta.orientation ?? 1) >= 5;
  const w0 = sideways ? height : width;
  const h0 = sideways ? width : height;
  const widths = widthsFor(w0, max);
  const at = (w) =>
    upright.clone().resize({ width: w, withoutEnlargement: true }).raw().toBuffer({ resolveWithObject: true });

  const largest = await at(widths.at(-1));
  const choice = quality ? { quality, palette: false } : await chooseEncoding(largest);
  const sizes = [];
  const native = async (w) =>
    sharp(await renderAt(w)).resize({ width: w }).raw().toBuffer({ resolveWithObject: true });
  for (const w of widths) {
    const image = w === widths.at(-1) ? largest : choice.palette && renderAt ? await native(w) : await at(w);
    const file = `${name}-${w}.webp`;
    const { buffer, palette } = await encode(image, choice.quality, choice.palette);
    await writeFile(path.join(dir, file), buffer);
    sizes.push(palette ? { w, file, palette } : { w, file });
  }

  const entry = { width: w0, height: h0, blur: await blurOf(input), sizes, quality: choice.quality };

  if (name === 'cover') {
    const file = `${name}-share.jpg`;
    await upright
      .clone()
      .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(dir, file));
    entry.share = file;
  }
  return entry;
}

export async function readManifest(dir) {
  const file = path.join(dir, 'images.json');
  if (!existsSync(file)) return {};
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function writeManifest(dir, manifest) {
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  );
  await writeFile(path.join(dir, 'images.json'), `${JSON.stringify(sorted, null, 2)}\n`);
  const loader = path.join(dir, 'images.ts');
  if (!existsSync(loader)) {
    await writeFile(
      loader,
      `// Written by \`pnpm add-images\`. Lists the images in this folder by name.
import { defineImages } from '~/content/media';
import meta from './images.json';

export const images = defineImages(
  meta,
  import.meta.glob<string>('./*.{webp,gif,jpg}', {
    eager: true,
    query: '?url',
    import: 'default'
  })
);
`
    );
  }
}

/**
 * Writes `src/content/work/<slug>.ts` with every field as a placeholder, unless
 * it exists. The cover is the image named `cover`, or the first one; each
 * other image becomes an image block.
 */
export async function writeStarter(root, slug, names) {
  const file = path.join(root, 'src', 'content', 'work', `${slug}.ts`);
  if (existsSync(file)) return false;
  const quote = (value) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
  const ref = (name) => (/^[a-z][a-z0-9]*$/.test(name) ? `images.${name}` : `images[${quote(name)}]`);
  const title = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  const cover = names.includes('cover') ? 'cover' : names[0];
  const rest = names.filter((name) => name !== cover);
  const blocks = (rest.length ? rest : [cover])
    .map((name) => `    { type: 'image', image: ${ref(name)}, alt: 'Describe what the image shows.' }`)
    .join(',\n');
  await writeFile(
    file,
    `import { defineCaseStudy } from '~/content/define';
import { images } from './${slug}/images';

export default defineCaseStudy({
  name: ${quote(title)},
  description: 'One line about what it is and who it is for.',
  disciplines: ['Product design'],
  client: 'Client name',
  year: ${new Date().getFullYear()},
  role: ['Product design'],
  team: ['Your name'],
  summary: 'One or two sentences for search results and link previews.',
  problem: ['What was not working, and for whom.'],
  decisions: [{ title: 'The main decision', body: 'What you chose and why.' }],
  outcome: ['What changed once it shipped.'],
  cover: ${ref(cover)},
  coverAlt: 'Describe what the cover shows.',
  blocks: [
${blocks}
  ]
});
`
  );
  return true;
}
