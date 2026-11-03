import { describe, expect, it } from 'vitest';
import { formatClock } from '~/lib/clock';
import { coverScale, gridSizes } from '~/lib/sizes';
import { colorVarsCss, fontFaceCss } from '~/lib/theme';
import { portfolio } from '~/portfolio.config';

describe('formatClock', () => {
  it('shows 24-hour local time with seconds', () => {
    const date = new Date('2026-01-15T23:04:05Z');
    expect(formatClock(date, 'Europe/Oslo')).toBe('00:04:05');
    expect(formatClock(date, 'America/New_York')).toBe('18:04:05');
  });

  it('follows summer time', () => {
    expect(formatClock(new Date('2026-07-01T12:00:00Z'), 'Europe/Oslo')).toBe('14:00:00');
  });
});

describe('theme', () => {
  it('writes the colours as --site variables', () => {
    expect(colorVarsCss({ background: '#fff', footerInk: '#000' })).toBe(
      ':root{--site-background:#fff;--site-footer-ink:#000}'
    );
  });

  it('writes a face for each font file and a size-matched fallback', () => {
    const css = fontFaceCss(portfolio.fonts.sans);
    expect(css.match(/@font-face/g)).toHaveLength(portfolio.fonts.sans.files.length + 1);
    expect(css).toContain("font-family:'Site Sans Fallback'");
    expect(css).toContain(`size-adjust:${portfolio.fonts.sans.fallback.sizeAdjust}`);
  });
});

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('colours', () => {
  const c = portfolio.colors;
  it('keep body text at 4.5:1 or more', () => {
    expect(contrast(c.ink, c.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.muted, c.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.footerInk, c.footer)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.footerMuted, c.footer)).toBeGreaterThanOrEqual(4.5);
  });
});

/** The width a `sizes` value gives at a viewport, as a browser reads it. */
function evaluate(sizes: string, viewport: number) {
  for (const part of sizes.split(', ')) {
    const media = part.match(/^\(min-width: (\d+)px\) (.+)$/);
    if (media && viewport < Number(media[1])) continue;
    const value = media ? media[2] : part;
    const calc = value.match(/^calc\(([\d.]+)vw - ([\d.]+)px\)$/);
    if (calc) return (Number(calc[1]) * viewport) / 100 - Number(calc[2]);
    if (value.endsWith('vw')) return (Number.parseFloat(value) * viewport) / 100;
    return Number.parseFloat(value);
  }
  throw new Error('no size');
}

describe('gridSizes', () => {
  // The page width is the viewport less clamp(20px, 2.25vw, 44px) each side;
  // columns of 12 share 20px gutters. These are the widths the layout draws.
  const page = (vw: number) => vw - 2 * Math.min(Math.max(20, vw * 0.0225), 44);
  const span = (vw: number, n: number) => ((page(vw) - 11 * 20) / 12) * n + 20 * (n - 1);

  it('matches the page grid at every breakpoint', () => {
    for (const vw of [360, 767, 768, 900, 1023, 1024, 1440, 1512, 2000]) {
      expect(evaluate(gridSizes(), vw)).toBeCloseTo(page(vw), 0);
      expect(evaluate(gridSizes({ md: 6 }), vw)).toBeCloseTo(vw < 768 ? page(vw) : span(vw, 6), 0);
      const inset = vw < 768 ? page(vw) : span(vw, vw < 1024 ? 10 : 8);
      expect(evaluate(gridSizes({ md: 10, lg: 8 }), vw)).toBeCloseTo(inset, 0);
    }
  });

  it('allows for object-cover cropping and fixed thumbnails', () => {
    expect(evaluate(gridSizes({ md: 5, crop: { md: 1.5 } }), 1440)).toBeCloseTo(span(1440, 5) * 1.5, 0);
    expect(evaluate(gridSizes({ md: 2, base: '88px' }), 390)).toBe(88);
    expect(coverScale(1.5, 4 / 3)).toBe(1.13);
    expect(coverScale(0.8, 4 / 3)).toBe(1);
  });
});
