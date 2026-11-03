import { GLYPHS, KERNING } from './glyphs';

/** Vertical metrics of Archivo, in em, for a line box with line-height 1. */
export const METRICS = {
  /** Cap height. */
  cap: 0.688,
  /** Where the baseline sits from the top of a line-height: 1 box. */
  baseline: 0.834,
  /** Top of accents such as Í and É. */
  accent: 0.881,
  /** Top of the ring on Å. */
  ring: 0.937
};

const FALLBACK: [number, number, number] = [0.42, 0.03, 0.03];
const HIGH = new Set([...'ÅÄÖÜÉÈÁÀÍÓÚÑ']);

export type MeasuredLine = {
  text: string;
  /** Sum of advances and kerning, in em. */
  advance: number;
  /** Width from the first ink to the last ink, in em. */
  ink: number;
  /** Left side bearing of the first glyph, in em. */
  lsb: number;
  /** Highest point above the cap height, in em (0 for plain capitals). */
  over: number;
};

export const normalise = (title: string) =>
  title
    .toLocaleUpperCase('nb-NO')
    .replace(/[\t\n]+/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();

export function measureLine(text: string): MeasuredLine {
  const chars = [...text];
  let advance = 0;
  let over = 0;
  chars.forEach((char, index) => {
    const glyph = GLYPHS[char] ?? FALLBACK;
    advance += glyph[0];
    if (index) advance += KERNING[chars[index - 1] + char] ?? 0;
    if (HIGH.has(char)) over = Math.max(over, (char === 'Å' ? METRICS.ring : METRICS.accent) - METRICS.cap);
  });
  const first = GLYPHS[chars[0]] ?? FALLBACK;
  const last = GLYPHS[chars[chars.length - 1]] ?? FALLBACK;
  return { text, advance, ink: Math.max(0.1, advance - first[1] - last[2]), lsb: first[1], over };
}

export type FittedLine = MeasuredLine & {
  /** Font size, in the same unit as `width`. */
  size: number;
  /** Space above this line, in the same unit. */
  gap: number;
};

export type Fit = { lines: FittedLine[]; height: number };

/** Every way of cutting `words` into at most `max` consecutive lines. */
function partitions(words: string[], max: number): string[][] {
  const out: string[][] = [];
  const walk = (start: number, lines: string[]) => {
    if (start === words.length) {
      out.push(lines);
      return;
    }
    if (lines.length === max) return;
    for (let end = start + 1; end <= words.length; end++) walk(end, [...lines, words.slice(start, end).join(' ')]);
  };
  walk(0, []);
  return out;
}

function layout(texts: string[], width: number, gap: number): Fit {
  let height = 0;
  const lines = texts.map((text, index) => {
    const measured = measureLine(text);
    const size = width / measured.ink;
    // Leave room for accents, so É never touches the line above.
    const lineGap = index ? Math.max(gap, measured.over * size + gap * 0.6) : measured.over * size;
    height += lineGap + METRICS.cap * size;
    return { ...measured, size, gap: lineGap };
  });
  return { lines, height };
}

/**
 * Marmor's one typographic rule: every line of a title is set to fill the
 * measure exactly. This picks the line breaks: as large as possible, never
 * taller than `maxHeight`, and no line that is only a one- or two-letter word.
 * A `/` in the title forces a break.
 */
export function fitTitle(
  title: string,
  { width, maxHeight, gap, maxLines = 4 }: { width: number; maxHeight: number; gap: number; maxLines?: number }
): Fit {
  const clean = normalise(title) || 'UTEN TITTEL';
  if (clean.includes('/')) {
    const forced = clean
      .split('/')
      .map((part) => part.trim())
      .filter(Boolean);
    return shrink(layout(forced.length ? forced : ['UTEN TITTEL'], width, gap), maxHeight, width);
  }
  const words = clean.split(' ').slice(0, 14);
  let best: Fit | null = null;
  let bestScore = -1;
  for (const texts of partitions(words, maxLines)) {
    if (texts.length > 1 && texts.some((text) => !text.includes(' ') && [...text].length <= 2)) continue;
    const fit = layout(texts, width, gap);
    if (fit.height > maxHeight) continue;
    const sizes = fit.lines.map((line) => line.size);
    const smallest = Math.min(...sizes);
    const spread = Math.max(...sizes) / smallest;
    // Prefer the biggest smallest line, then lines of a similar size.
    const score = smallest * (spread > 2.4 ? 0.75 : spread > 1.8 ? 0.92 : 1);
    if (score > bestScore) {
      best = fit;
      bestScore = score;
    }
  }
  return best ?? shrink(layout([words.join(' ')], width, gap), maxHeight, width);
}

/** When even one line is too tall for the space, scale everything down to fit. */
function shrink(fit: Fit, maxHeight: number, width: number): Fit {
  if (fit.height <= maxHeight) return fit;
  const factor = maxHeight / fit.height;
  let height = 0;
  const lines = fit.lines.map((line) => {
    const size = line.size * factor;
    const lineGap = line.gap * factor;
    height += lineGap + METRICS.cap * size;
    return { ...line, size: Math.min(size, width / line.ink), gap: lineGap };
  });
  return { lines, height };
}
