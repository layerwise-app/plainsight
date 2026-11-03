import { portfolio } from '~/portfolio.config';
import type { FontConfig } from '~/portfolio.config';

const cssString = (value: string) => `'${value.replaceAll("'", "\\'")}'`;

/** `@font-face` rules for the site font and its size-matched fallback. */
export function fontFaceCss(font: FontConfig, alias = 'Site Sans'): string {
  const faces = font.files.map(
    (file) =>
      `@font-face{font-family:${cssString(alias)};src:url(${cssString(file.src)}) format('woff2');font-weight:${file.weight};font-style:${file.style};font-display:swap}`
  );
  const { fallback } = font;
  faces.push(
    `@font-face{font-family:${cssString(`${alias} Fallback`)};src:${fallback.local.map((name) => `local(${cssString(name)})`).join(',')};size-adjust:${fallback.sizeAdjust};ascent-override:${fallback.ascentOverride};descent-override:${fallback.descentOverride};line-gap-override:${fallback.lineGapOverride}}`
  );
  return faces.join('');
}

/** The config's colours as the `--site-*` variables app.css reads. */
export function colorVarsCss(colors: Record<string, string>): string {
  const vars = Object.entries(colors)
    .map(([key, value]) => `--site-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value}`)
    .join(';');
  return `:root{${vars}}`;
}

export const themeCss = `${fontFaceCss(portfolio.fonts.sans)}${colorVarsCss(portfolio.colors)}`;

/** The upright file of the site font, preloaded so text renders in it at once. */
export const preloadFont =
  portfolio.fonts.sans.files.find((file) => file.style === 'normal')?.src ??
  portfolio.fonts.sans.files[0]?.src;
