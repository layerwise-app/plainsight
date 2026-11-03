import type * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { type Fit, METRICS, fitTitle } from './fit';
import { TITLE_STYLE } from './model';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? () => {} : useLayoutEffect;

/**
 * A title set to fill its measure, line by line. Sizes come from measured
 * glyph widths, so the first render (and the server render) is already
 * right; with `refine`, each line is measured again once the font has loaded
 * and nudged by the difference, for characters the table does not know.
 */
export function Title({
  text,
  width,
  maxHeight,
  gap,
  unit = 'cqw',
  maxLines,
  refine,
  color,
  as: Tag = 'div',
  style
}: {
  text: string;
  /** Measure, in `unit`. */
  width: number;
  maxHeight: number;
  gap: number;
  unit?: 'cqw' | 'px';
  maxLines?: number;
  refine?: boolean;
  color?: string;
  as?: 'div' | 'h1' | 'h2' | 'h3';
  style?: React.CSSProperties;
}) {
  const fit = fitTitle(text, { width, maxHeight, gap, maxLines });
  const [fix, setFix] = useState<Record<string, number>>({});
  const ref = useRef<HTMLElement>(null);
  const key = fit.lines.map((line) => line.text).join('|');

  useIsomorphicLayoutEffect(() => {
    if (!refine) return;
    let cancelled = false;
    const measure = () => {
      const root = ref.current;
      if (!root || cancelled) return;
      // Ignore any CSS transform scaling the poster, such as a preview thumbnail.
      const scale = root.getBoundingClientRect().width / (root.offsetWidth || 1) || 1;
      const next: Record<string, number> = {};
      for (const element of root.querySelectorAll<HTMLElement>('[data-advance]')) {
        const size = Number.parseFloat(getComputedStyle(element).fontSize);
        const actual = element.getBoundingClientRect().width / scale / size;
        const expected = Number(element.dataset.advance);
        const ratio = expected / actual;
        if (Number.isFinite(ratio) && Math.abs(ratio - 1) > 0.003 && Math.abs(ratio - 1) < 0.25) {
          next[element.dataset.text ?? ''] = ratio;
        }
      }
      setFix((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    };
    if (document.fonts?.status === 'loaded') measure();
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [key, refine]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      aria-label={text.replaceAll('/', ' ')}
      style={{ ...TITLE_STYLE, color, margin: 0, ...style }}
    >
      <TitleLines fit={fit} unit={unit} fix={fix} />
    </Tag>
  );
}

export function TitleLines({ fit, unit, fix = {} }: { fit: Fit; unit: 'cqw' | 'px'; fix?: Record<string, number> }) {
  return (
    <>
      {fit.lines.map((line, index) => {
        const size = line.size * (fix[line.text] ?? 1);
        return (
          <span
            key={index}
            aria-hidden='true'
            style={{
              display: 'block',
              fontSize: `${size}${unit}`,
              lineHeight: 1,
              height: `${METRICS.cap}em`,
              marginTop: line.gap ? `${line.gap}${unit}` : 0,
              whiteSpace: 'pre'
            }}
          >
            <span
              data-advance={line.advance}
              data-text={line.text}
              style={{
                display: 'inline-block',
                transform: `translate(${-line.lsb}em, ${-(METRICS.baseline - METRICS.cap)}em)`
              }}
            >
              {line.text}
            </span>
          </span>
        );
      })}
    </>
  );
}
