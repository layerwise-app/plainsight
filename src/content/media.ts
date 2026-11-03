import type { ImageAsset } from './types';

/** One entry of an `images.json` written by `pnpm add-images`. */
export type RawImage = {
  width: number;
  height: number;
  blur: string;
  sizes: { w: number; file: string; palette?: boolean }[];
  share?: string;
  animated?: boolean;
  /** The WebP quality `pnpm add-images` picked for this image. */
  quality?: number;
};

/**
 * Turns a folder's `images.json` and its files (from `import.meta.glob`) into
 * named images: `images.cover`, `images['agent-list']`.
 */
export function defineImages<T extends Record<string, RawImage>>(
  meta: T,
  urls: Record<string, string>
): { [K in keyof T]: ImageAsset } {
  const url = (file: string) => {
    const found = urls[`./${file}`];
    if (!found) {
      throw new Error(
        `Image file "${file}" is listed in images.json but missing. Run pnpm add-images again.`
      );
    }
    return found;
  };

  const out = {} as { [K in keyof T]: ImageAsset };
  for (const key of Object.keys(meta) as (keyof T & string)[]) {
    const raw = meta[key];
    const sizes = [...raw.sizes].sort((a, b) => a.w - b.w);
    const middle = sizes[Math.min(1, sizes.length - 1)];
    out[key] = {
      src: url(middle.file),
      srcSet: raw.animated
        ? ''
        : sizes.map((size) => `${url(size.file)} ${size.w}w`).join(', '),
      width: raw.width,
      height: raw.height,
      blur: raw.blur,
      share: raw.share ? url(raw.share) : undefined,
      animated: raw.animated
    };
  }
  return out;
}
