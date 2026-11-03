#!/usr/bin/env node
// pnpm fit-images [slug ...]
//
// Deletes image sizes that no layout ever asks for. Each case study's blocks
// say how wide an image is shown (see scripts/lib/layout.mjs); every size
// wider than the first one that covers that width is removed. Nothing is
// re-encoded. Run it after placing images in a case study's blocks.
import { existsSync } from 'node:fs';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { readManifest, workDir, writeManifest } from './lib/images.mjs';
import { loadCaps } from './lib/layout.mjs';

const root = process.cwd();
const all = (await readdir(path.join(root, 'src', 'content', 'work'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && existsSync(path.join(workDir(root, entry.name), 'images.json')))
  .map((entry) => entry.name);
const slugs = process.argv.length > 2 ? process.argv.slice(2) : all;
const caps = await loadCaps(root, slugs);
let saved = 0;

for (const slug of slugs) {
  const dir = workDir(root, slug);
  const manifest = await readManifest(dir);
  let changed = false;
  for (const [name, entry] of Object.entries(manifest)) {
    const cap = caps[slug]?.[name];
    if (!cap || entry.animated) continue;
    const sizes = [...entry.sizes].sort((a, b) => a.w - b.w);
    const covering = sizes.findIndex((size) => size.w >= cap);
    if (covering === -1 || covering === sizes.length - 1) continue;
    for (const size of sizes.slice(covering + 1)) {
      const file = path.join(dir, size.file);
      if (existsSync(file)) {
        saved += (await stat(file)).size;
        await unlink(file);
      }
      console.log(`${slug}/${size.file}: removed, ${name} is never shown wider than ${cap} px`);
    }
    entry.sizes = sizes.slice(0, covering + 1);
    changed = true;
  }
  if (changed) await writeManifest(dir, manifest);
}
console.log(saved ? `Saved ${(saved / 1048576).toFixed(1)} MB.` : 'Every image is already the right size.');
