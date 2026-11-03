import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { imageName, ssim, widthsFor, writeImage } from '../scripts/lib/images.mjs';
import { capsFor, imageKey, SLOT_WIDTHS } from '../scripts/lib/layout.mjs';

describe('imageName', () => {
  it('turns a file name into a key', () => {
    expect(imageName('/tmp/Agent list (final).PNG')).toBe('agent-list-final');
    expect(imageName('Fjellhagen — Årsmøte.jpg')).toBe('fjellhagen-arsmote');
  });
});

describe('widthsFor', () => {
  it('never upscales and keeps the original width when smaller', () => {
    expect(widthsFor(500)).toEqual([500]);
    expect(widthsFor(1200)).toEqual([800, 1200]);
    expect(widthsFor(2880)).toEqual([800, 1600, 2880]);
    expect(widthsFor(6000)).toEqual([800, 1600, 2880]);
  });

  it('stops at the widest the layout shows', () => {
    expect(widthsFor(6000, 1456)).toEqual([800, 1456]);
    expect(widthsFor(6000, 1920)).toEqual([800, 1920]);
    expect(widthsFor(1000, 1456)).toEqual([800, 1000]);
  });
});

describe('ssim', () => {
  const grey = (values: number[]) => ({ data: Uint8Array.from(values), width: 8, height: values.length / 8 });
  it('is 1 for identical images and lower for different ones', () => {
    const a = grey(Array.from({ length: 64 }, (_, i) => (i * 7) % 255));
    const b = grey(Array.from({ length: 64 }, (_, i) => (i * 13) % 255));
    expect(ssim(a, a)).toBeCloseTo(1, 6);
    expect(ssim(a, b)).toBeLessThan(0.9);
  });
});

describe('writeImage', () => {
  let dir: string;
  let source: string;

  beforeAll(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'plainsight-images-'));
    source = path.join(dir, 'source.png');
    await sharp({ create: { width: 3200, height: 2000, channels: 3, background: '#d24b2a' } })
      .png()
      .toFile(source);
  });
  afterAll(() => rm(dir, { recursive: true, force: true }));

  it('caps the sizes and records the quality it picked', async () => {
    const entry: { sizes: { w: number }[]; quality?: number } = await writeImage(
      path.join(dir, 'capped'),
      source,
      'pair-shot',
      { max: SLOT_WIDTHS.pair }
    );
    expect(entry.sizes.map((s) => s.w)).toEqual([800, 1456]);
    expect(entry.quality).toBeGreaterThanOrEqual(72);
  });

  it('writes three WebP sizes, a blur and a share image for the cover', async () => {
    const out = path.join(dir, 'out');
    const entry: { width: number; height: number; blur: string; sizes: { w: number }[]; share?: string } =
      await writeImage(out, source, 'cover');
    expect(entry.width).toBe(3200);
    expect(entry.height).toBe(2000);
    expect(entry.blur).toMatch(/^data:image\/webp;base64,/);
    expect(entry.sizes.map((s) => s.w)).toEqual([800, 1600, 2880]);
    expect(entry.share).toBe('cover-share.jpg');
    expect((await readdir(out)).sort()).toEqual([
      'cover-1600.webp',
      'cover-2880.webp',
      'cover-800.webp',
      'cover-share.jpg'
    ]);
    const share = await sharp(path.join(out, 'cover-share.jpg')).metadata();
    expect([share.width, share.height]).toEqual([1200, 630]);
  });

  it('rejects SVG', async () => {
    const svg = path.join(dir, 'logo.svg');
    await writeFile(svg, '<svg xmlns="http://www.w3.org/2000/svg"/>');
    await expect(writeImage(path.join(dir, 'svg'), svg)).rejects.toThrow(/SVG/);
  });

  it('copies GIFs untouched', async () => {
    const gif = path.join(dir, 'loop.gif');
    await sharp({ create: { width: 40, height: 30, channels: 3, background: '#000' } }).gif().toFile(gif);
    const entry = await writeImage(path.join(dir, 'gif'), gif);
    expect(entry.sizes).toEqual([{ w: 40, file: 'loop.gif' }]);
  });
});

describe('capsFor', () => {
  const asset = (file: string) => ({ src: `/src/content/work/demo/${file}` });
  it('takes the widest block each image appears in', () => {
    const caps = capsFor({
      cover: asset('cover-1600.webp'),
      coverTall: asset('cover-tall-1456.webp'),
      blocks: [
        { type: 'pair', images: [{ image: asset('a-1456.webp') }, { image: asset('b-1456.webp') }] },
        { type: 'image', image: asset('a-1600.webp') },
        { type: 'image', image: asset('kit-1920.webp'), inset: true },
        { type: 'text', body: [] }
      ]
    });
    expect(caps).toEqual({
      cover: SLOT_WIDTHS.full,
      'cover-tall': SLOT_WIDTHS.tall,
      a: SLOT_WIDTHS.full,
      b: SLOT_WIDTHS.pair,
      kit: SLOT_WIDTHS.inset
    });
  });

  it('reads the image name from its file', () => {
    expect(imageKey(asset('poster-1961-800.webp?v=1'))).toBe('poster-1961');
    expect(imageKey(asset('loop.gif'))).toBe('loop');
  });
});
