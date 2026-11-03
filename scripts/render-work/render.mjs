#!/usr/bin/env node
// pnpm render-work [slug ...] [--names a,b] [--only stills|motion] [--check] [--sources <dir>]
//
// Renders the sample work's React screens (src/content/work/<slug>/screens/)
// to images and short MP4 loops beside each case study. Stills go through the
// same code as `pnpm add-images`. Motion needs `ffmpeg` on PATH (or FFMPEG=…);
// with libvmaf, each loop's quality is tuned to VMAF_TARGET.
// --check writes quick 1x PNGs to a temp folder instead, for looking only.
// --sources writes the lossless PNG stills and motion frames to <dir>/<slug>/
// instead, for comparing encoders.
//
// Each still is rendered at the widest its case study shows it (see
// scripts/lib/layout.mjs), so its largest size is drawn, not scaled down.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { readManifest, WIDTHS, workDir, writeImage, writeManifest } from '../lib/images.mjs';
import { loadCaps } from '../lib/layout.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const [, value] = args.splice(index, 2);
  return value;
};
const check = args.includes('--check');
if (check) args.splice(args.indexOf('--check'), 1);
const names = flag('--names')?.split(',');
const sourcesDir = flag('--sources');
const only = flag('--only');

const allSlugs = (await readdir(path.join(root, 'src/content/work'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && existsSync(path.join(root, 'src/content/work', entry.name, 'screens/index.tsx')))
  .map((entry) => entry.name);
const slugs = args.length ? args : allSlugs;
const caps = await loadCaps(root, slugs);

const server = await createServer({
  configFile: false,
  root: here,
  publicDir: path.join(root, 'public'),
  logLevel: 'error',
  plugins: [react(), tailwindcss()],
  resolve: { alias: [{ find: /^~\//, replacement: `${path.join(root, 'src')}/` }] },
  // No reloads: the renderer writes into the files this server reads.
  server: { port: 0, host: '127.0.0.1', fs: { allow: [root] }, hmr: false, watch: null }
});
await server.listen();
const base = server.resolvedUrls?.local[0];

const launch = async () => {
  try {
    return await chromium.launch({ channel: 'chrome' });
  } catch {
    return chromium.launch();
  }
};
const browser = await launch();
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';
// Each loop gets the highest CRF whose VMAF against its own frames stays at
// VMAF_TARGET or above. Without ffmpeg's libvmaf, FALLBACK_CRF is used.
const VMAF_TARGET = 91;
const CRFS = [22, 24, 26, 28, 30, 32];
const FALLBACK_CRF = 26;
const checkDir = path.join(os.tmpdir(), 'render-check');

function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
    let errors = '';
    child.stderr.on('data', (chunk) => {
      errors += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve(errors) : reject(new Error(errors.slice(-2000)))));
  });
}

const EVEN = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';

/** Encodes the frames in `framesDir` as an H.264 loop at `crf`. */
function encodeLoop(framesDir, fps, crf, out) {
  return run(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-framerate', String(fps),
    '-i', path.join(framesDir, '%04d.jpg'),
    '-vf', EVEN,
    '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'animation', '-crf', String(crf),
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    out
  ]);
}

/** VMAF of an encoded loop against its frames, or null without libvmaf. */
async function vmaf(file, framesDir, fps) {
  try {
    const log = await run(ffmpeg, [
      '-loglevel', 'info',
      '-i', file,
      '-framerate', String(fps),
      '-i', path.join(framesDir, '%04d.jpg'),
      '-lavfi', `[1:v]${EVEN},format=yuv420p[ref];[0:v][ref]libvmaf=n_threads=8`,
      '-f', 'null', '-'
    ]);
    const score = log.match(/VMAF score: ([\d.]+)/);
    return score ? Number(score[1]) : null;
  } catch {
    return null;
  }
}

/** The smallest loop at or above VMAF_TARGET: `{ crf, score }`. */
async function encodeTuned(framesDir, fps, out) {
  let best = null;
  let last = null;
  let lo = 0;
  let hi = CRFS.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    last = CRFS[mid];
    await encodeLoop(framesDir, fps, last, out);
    const score = await vmaf(out, framesDir, fps);
    if (score === null) {
      await encodeLoop(framesDir, fps, FALLBACK_CRF, out);
      return { crf: FALLBACK_CRF, score: null };
    }
    if (score >= VMAF_TARGET) {
      best = { crf: CRFS[mid], score };
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  best ??= { crf: CRFS[0], score: null };
  if (best.crf !== last) await encodeLoop(framesDir, fps, best.crf, out);
  return best;
}

async function openFrame(slug, kind, name, width, height, scale) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  const problems = [];
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => message.type() === 'error' && problems.push(message.text()));
  await page.goto(`${base}?slug=${slug}&kind=${kind}&name=${name}`);
  await page.evaluate(() => window.__ready);
  if (problems.length) console.warn(`  ${slug}/${name}: ${problems.join(' | ')}`);
  return page;
}

try {
  for (const slug of slugs) {
    const dir = workDir(root, slug);
    const listing = await browser.newPage();
    await listing.goto(`${base}?slug=${slug}`);
    const manifest = await listing.evaluate(() => window.__manifest());
    await listing.close();
    const images = await readManifest(dir);
    const temp = await mkdtemp(path.join(os.tmpdir(), `render-${slug}-`));
    console.log(`${slug}`);

    if (only !== 'motion') {
      for (const [name, still] of Object.entries(manifest.stills)) {
        if (names && !names.includes(name)) continue;
        const cap = caps[slug]?.[name];
        const scale = check ? 1 : Math.min(cap ?? WIDTHS.at(-1), WIDTHS.at(-1)) / still.width;
        const page = await openFrame(slug, 'still', name, still.width, still.height, scale);
        if (sourcesDir) {
          await mkdir(path.join(sourcesDir, slug), { recursive: true });
          await page.screenshot({ path: path.join(sourcesDir, slug, `${name}.png`) });
          console.log(`  ${name}: ${Math.round(still.width * scale)}×${Math.round(still.height * scale)}`);
        } else if (check) {
          await mkdir(path.join(checkDir, slug), { recursive: true });
          const file = path.join(checkDir, slug, `${name}.png`);
          await page.screenshot({ path: file });
          console.log(`  ${name} → ${file}`);
        } else {
          const file = path.join(temp, `${name}.png`);
          await page.screenshot({ path: file });
          const renderAt = async (width) => {
            const small = await openFrame(slug, 'still', name, still.width, still.height, width / still.width);
            const buffer = await small.screenshot();
            await small.close();
            return buffer;
          };
          images[name] = await writeImage(dir, file, name, { max: cap, renderAt });
          const { width, height, sizes, quality } = images[name];
          const palette = sizes.filter((size) => size.palette).map((size) => size.w);
          console.log(
            `  ${name}: ${width}×${height}, ${sizes.map((size) => size.w).join('/')}, q${quality}${palette.length ? `, palette at ${palette.join('/')}` : ''}`
          );
        }
        await page.close();
      }
      if (!check && !sourcesDir) await writeManifest(dir, images);
    }

    if (only !== 'stills' && !check) {
      for (const [name, motion] of Object.entries(manifest.motion)) {
        if (names && !names.includes(name)) continue;
        const scale = motion.outputWidth / motion.width;
        const page = await openFrame(slug, 'motion', name, motion.width, motion.height, scale);
        const framesDir = sourcesDir ? path.join(sourcesDir, slug, name) : path.join(temp, name);
        await mkdir(framesDir, { recursive: true });
        const count = Math.round(motion.duration * motion.fps);
        for (let frame = 0; frame < count; frame++) {
          await page.evaluate((time) => window.__setTime(time), frame / motion.fps);
          await page.screenshot({
            path: path.join(framesDir, `${String(frame).padStart(4, '0')}.jpg`),
            type: 'jpeg',
            quality: 94
          });
        }
        await page.close();
        if (sourcesDir) {
          console.log(`  ${name}: ${count} frames`);
          continue;
        }
        const out = path.join(dir, `${name}.mp4`);
        const { crf, score } = await encodeTuned(framesDir, motion.fps, out);
        console.log(`  ${name}.mp4: ${count} frames, crf ${crf}${score ? `, VMAF ${score.toFixed(1)}` : ''}`);
      }
    }
    await rm(temp, { recursive: true, force: true });
  }
} finally {
  await browser.close();
  await server.close();
}
