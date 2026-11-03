#!/usr/bin/env node
// pnpm render-studio
//
// Writes the two files made from src/portfolio.config.ts and the case studies:
//   public/<cv.href>      the studio CV linked from About (A4 PDF)
//   public/og-image.jpg   the default 1200×630 link preview image
// Run it again after changing the studio's details or the work.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const server = await createServer({
  configFile: false,
  root,
  publicDir: path.join(root, 'public'),
  logLevel: 'error',
  appType: 'custom',
  resolve: { alias: [{ find: /^~\//, replacement: `${path.join(root, 'src')}/` }] },
  server: { port: 0, host: '127.0.0.1' }
});
await server.listen();
const base = server.resolvedUrls?.local[0].replace(/\/$/, '');

const { portfolio } = await server.ssrLoadModule('/src/portfolio.config.ts');
const { projects } = await server.ssrLoadModule('/src/content/index.ts');
const { fontFaceCss, colorVarsCss } = await server.ssrLoadModule('/src/lib/theme.ts');

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
const years = projects.map((project) => project.year);

// Small JPEG thumbnails of each cover, so the PDF stays light.
const sharp = (await import('sharp')).default;
const fileOf = (url) => path.join(root, decodeURIComponent(url.split('?')[0]));
const thumbs = new Map();
for (const project of projects) {
  const smallest = project.cover.srcSet.split(',')[0]?.trim().split(' ')[0] || project.cover.src;
  const jpeg = await sharp(fileOf(smallest)).resize(420).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  thumbs.set(project.slug, `data:image/jpeg;base64,${jpeg.toString('base64')}`);
}
const today = new Date();

const baseCss = `
${fontFaceCss(portfolio.fonts.sans)}
${colorVarsCss(portfolio.colors)}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-family: 'Site Sans', 'Site Sans Fallback', Arial, sans-serif; color: var(--site-ink);
  background: var(--site-background); -webkit-font-smoothing: antialiased; }
.muted { color: var(--site-muted); }
`;

function cvHtml() {
  const row = (label, body) =>
    `<section class="row"><h2>${esc(label)}</h2><div>${body}</div></section>`;
  const work = projects
    .map(
      (project) => `
      <li class="work">
        <img src="${thumbs.get(project.slug)}" alt="">
        <p><strong>${esc(project.name)}</strong> <span class="muted">${project.year}</span><br>${esc(project.description)}</p>
        <p class="muted">${esc(project.client)}<br>${esc(project.disciplines.join(', '))}</p>
      </li>`
    )
    .join('');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
${baseCss}
@page { size: A4; margin: 16mm 16mm 14mm; }
body { font-size: 9.6pt; line-height: 1.38; letter-spacing: -0.005em; }
header { display: flex; justify-content: space-between; font-size: 9.6pt; padding-bottom: 18mm; }
header strong { font-weight: 600; letter-spacing: -0.02em; }
.lead { font-size: 21pt; line-height: 1.08; letter-spacing: -0.028em; max-width: 158mm; padding-bottom: 14mm; }
.row { display: grid; grid-template-columns: 44mm 1fr; column-gap: 6mm;
  padding: 3.4mm 0 5.2mm; border-top: 0.6pt solid var(--site-line); break-inside: avoid; }
h2 { font-size: 9.6pt; font-weight: 500; }
p + p { margin-top: 2.2mm; }
.pairs { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 6mm; }
.pairs dt { font-weight: 500; }
.lines li { display: grid; grid-template-columns: 18mm 1fr; column-gap: 4mm; list-style: none; }
.lines li + li { margin-top: 1.6mm; }
.columns { columns: 3; column-gap: 6mm; list-style: none; }
.page { break-before: page; }
.work-list { list-style: none; }
.work { display: grid; grid-template-columns: 26mm 1fr 44mm; column-gap: 5mm; break-inside: avoid; }
.work + .work { margin-top: 4mm; }
.work img { width: 26mm; height: 19.5mm; object-fit: cover; display: block; }
.work p + p { margin-top: 0; }
.work strong { font-weight: 500; }
footer { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between;
  font-size: 8.4pt; color: var(--site-muted); }
</style></head><body>
<header><strong>${esc(portfolio.name)}</strong>
  <span class="muted">Studio CV, ${today.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span></header>
<p class="lead">${esc(portfolio.statement)}</p>
${row('Studio', portfolio.bio.map((p) => `<p>${esc(p)}</p>`).join(''))}
${row(
  'People',
  `<dl class="pairs">${portfolio.team
    .map((person) => `<div><dt>${esc(person.name)}</dt><dd class="muted">${esc(person.role)}</dd></div>`)
    .join('')}</dl>`
)}
${row(
  'Services',
  `<dl class="pairs">${portfolio.services
    .map((service) => `<div><dt>${esc(service.name)}</dt><dd>${esc(service.detail)}</dd></div>`)
    .join('')}</dl>`
)}
${row(
  'Experience',
  `<ul class="lines">${portfolio.experience
    .map(
      (item) =>
        `<li><span class="muted">${esc(item.years)}</span><span>${esc(item.title)}. <span class="muted">${esc(item.detail)}</span></span></li>`
    )
    .join('')}</ul>`
)}
<div class="page">
  ${row(
    'Selected work',
    `<p class="muted" style="margin-bottom:5mm">${projects.length} projects, ${Math.min(...years)}–${Math.max(...years)}, each designed and built in the studio.</p>
     <ul class="work-list">${work}</ul>`
  )}
  ${row('Clients', `<ul class="columns">${portfolio.clients.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`)}
</div>
<footer><span>${esc(portfolio.name)}, ${esc(portfolio.location.city)}, ${esc(portfolio.location.country)}</span><span>${esc(portfolio.email)}</span></footer>
</body></html>`;
}

function shareHtml() {
  const covers = projects
    .slice(0, 3)
    .map((project) => `<img src="${esc(project.cover.src)}" alt="">`)
    .join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
${baseCss}
body { width: 1200px; height: 630px; padding: 40px 44px; display: flex; flex-direction: column; overflow: hidden; }
header { display: flex; justify-content: space-between; font-size: 22px; letter-spacing: -0.01em; }
header strong { font-weight: 600; letter-spacing: -0.03em; }
p { font-size: 46px; line-height: 1.04; letter-spacing: -0.03em; max-width: 1020px; margin-top: 52px; }
.covers { margin-top: auto; display: grid; grid-template-columns: 7fr 5fr 4fr; grid-template-rows: 214px; gap: 14px; }
.covers img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style></head><body>
<header><strong>${esc(portfolio.name)}</strong><span class="muted">${esc(portfolio.location.city)}</span></header>
<p>${esc(portfolio.statement)}</p>
<div class="covers">${covers}</div>
</body></html>`;
}

const launch = async () => {
  try {
    return await chromium.launch({ channel: 'chrome' });
  } catch {
    return chromium.launch();
  }
};
const browser = await launch();

async function open(html, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: viewport ? 2 : 1 });
  await page.route(`${base}/__studio`, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: html })
  );
  await page.goto(`${base}/__studio`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
  });
  return page;
}

try {
  const cvPage = await open(cvHtml());
  const cvFile = path.join(root, 'public', portfolio.cv.href.replace(/^\//, ''));
  await cvPage.pdf({ path: cvFile, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await cvPage.close();
  const pages = (await readFile(cvFile, 'latin1')).match(/\/Type\s*\/Page[^s]/g)?.length;
  console.log(`${path.relative(root, cvFile)}: ${pages} pages`);

  const sharePage = await open(shareHtml(), { width: 1200, height: 630 });
  const png = await sharePage.screenshot({ type: 'png' });
  await sharePage.close();
  const shareFile = path.join(root, 'public', 'og-image.jpg');
  await writeFile(
    shareFile,
    await sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toBuffer()
  );
  console.log(`${path.relative(root, shareFile)}: 1200×630`);
} finally {
  await browser.close();
  await server.close();
}
process.exit(0);
