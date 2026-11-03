#!/usr/bin/env node
// pnpm render-icons
//
// Makes every icon from public/logo.svg: logo.png (1024 px), favicon.svg,
// favicon.ico (16, 32, 48), favicon.png, favicon-16x16.png, favicon-32x32.png,
// apple-touch-icon.png (180) and android-chrome-192x192/512x512.png.
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (file) => path.join(root, 'public', file);
const svg = await readFile(pub('logo.svg'));
// Drawn at 4× (density 288) and scaled down, so small sizes stay crisp.
const png = (size) => sharp(svg, { density: 288 }).resize(size, size).png().toBuffer();

const files = {
  'logo.png': 1024,
  'favicon.png': 32,
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512
};
for (const [file, size] of Object.entries(files)) {
  await writeFile(pub(file), await png(size));
  console.log(`public/${file}: ${size}×${size}`);
}
await copyFile(pub('logo.svg'), pub('favicon.svg'));
console.log('public/favicon.svg');

// An .ico is a small directory of PNGs.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const at = 6 + 16 * i;
  header.writeUInt8(size, at);
  header.writeUInt8(size, at + 1);
  header.writeUInt8(0, at + 2);
  header.writeUInt8(0, at + 3);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(images[i].length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += images[i].length;
});
await writeFile(pub('favicon.ico'), Buffer.concat([header, ...images]));
console.log(`public/favicon.ico: ${sizes.join(', ')}`);
