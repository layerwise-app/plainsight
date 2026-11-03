#!/usr/bin/env node
// pnpm add-images <slug> <image> [more images] [--name <name>] [--max <px>]
//
// Saves each image into src/content/work/<slug>/ as WebP files at 800, 1600
// and 2880 px (never wider than the original, nor than the widest its case
// study shows it), records its size and a tiny blur placeholder in
// images.json, and writes a 1200×630 share JPG for an image named `cover`.
// Each image gets its own WebP quality: the lowest that looks the same.
// GIFs are copied untouched. SVGs are rejected.
//
// --max caps the widths by hand, for example `--max 1456` for an image that
// will only be shown half the page wide. Once the case study uses an image,
// its block sets the cap; `pnpm fit-images` applies it to images already added.
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  imageName,
  readManifest,
  workDir,
  writeImage,
  writeManifest,
  writeStarter
} from './lib/images.mjs';
import { loadCaps } from './lib/layout.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const [, value] = args.splice(index, 2);
  return value;
};
const forcedName = flag('--name');
const maxFlag = flag('--max');
const [slug, ...files] = args;

if (!slug || files.length === 0) {
  console.error('Usage: pnpm add-images <slug> <image> [more images] [--name <name>] [--max <px>]');
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(`"${slug}" isn't a usable slug. Use lowercase letters, digits and dashes.`);
  process.exit(1);
}
if (forcedName && files.length > 1) {
  console.error('--name works with one image at a time.');
  process.exit(1);
}
if (maxFlag !== undefined && !(Number(maxFlag) >= 16)) {
  console.error('--max takes a width in pixels, like --max 1456.');
  process.exit(1);
}

const root = process.cwd();
const dir = workDir(root, slug);
const manifest = await readManifest(dir);
const caps = existsSync(path.join(root, 'src', 'content', 'work', `${slug}.ts`))
  ? (await loadCaps(root, [slug]))[slug]
  : {};
let failed = false;

for (const file of files) {
  const name = forcedName ?? imageName(file);
  try {
    const max = maxFlag ? Number(maxFlag) : caps[name];
    const entry = await writeImage(dir, path.resolve(root, file), name, { max });
    manifest[name] = entry;
    const palette = entry.sizes.some((size) => size.palette) ? ', palette' : '';
    console.log(
      `${name}: ${entry.width}×${entry.height}, ${entry.sizes.map((s) => s.file).join(', ')}${entry.share ? `, ${entry.share}` : ''} (q${entry.quality ?? '-'}${palette})`
    );
  } catch (error) {
    failed = true;
    console.error(error instanceof Error ? error.message : error);
  }
}

if (Object.keys(manifest).length > 0) {
  await writeManifest(dir, manifest);
  if (await writeStarter(root, slug, Object.keys(manifest))) {
    console.log(`Created src/content/work/${slug}.ts. Fill in its text next.`);
  }
}
process.exit(failed ? 1 : 0);
