import type * as React from 'react';
import { seeded } from '~/components/art/random';
import { C, FONT, TITLE_STYLE } from './model';

type Point = [number, number];

/** Catmull-Rom through the anchors, sampled evenly enough for a drawn line. */
function spline(anchors: Point[], steps: number): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < anchors.length - 1; i++) {
    const p0 = anchors[Math.max(0, i - 1)];
    const p1 = anchors[i];
    const p2 = anchors[i + 1];
    const p3 = anchors[Math.min(anchors.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(anchors[anchors.length - 1]);
  return out;
}

type Segment = { x1: number; y1: number; x2: number; y2: number; w: number };

/** A vein: a wandering line that swells and thins, tapering at both ends. */
function vein(anchors: Point[], { width, seed, steps = 9, wobble = 0.5, taper = [0.08, 0.08] }: { width: number; seed: number; steps?: number; wobble?: number; taper?: [number, number] }): Segment[] {
  const random = seeded(seed);
  const phase = [random() * 6.28, random() * 6.28, random() * 6.28, random() * 6.28];
  const points = spline(anchors, steps);
  const n = points.length - 1;
  const segments: Segment[] = [];
  const at = (i: number): Point => {
    const t = i / n;
    const [x, y] = points[i];
    const [ax, ay] = points[Math.max(0, i - 1)];
    const [bx, by] = points[Math.min(n, i + 1)];
    const length = Math.hypot(bx - ax, by - ay) || 1;
    const offset = wobble * (Math.sin(t * 23 + phase[0]) * 0.6 + Math.sin(t * 57 + phase[1]) * 0.4);
    return [x + (-(by - ay) / length) * offset, y + ((bx - ax) / length) * offset];
  };
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const swell = 0.8 + 0.16 * Math.sin(t * 13 + phase[2]) + 0.1 * Math.sin(t * 37 + phase[3]);
    const ends = Math.min(1, t / taper[0], (1 - t) / taper[1]);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    segments.push({ x1, y1, x2, y2, w: width * swell * (0.25 + 0.75 * Math.sqrt(Math.max(0, ends))) });
  }
  return segments;
}

const MAIN: Point[] = [
  [8, 93],
  [9.6, 74],
  [8.4, 54],
  [10.2, 31],
  [11.2, 10],
  [19.5, 22.5],
  [27, 35],
  [33.5, 44],
  [40.5, 55.5],
  [46.8, 66.5],
  [53.2, 55],
  [60.5, 42.5],
  [68.5, 29.5],
  [78.8, 17],
  [88.2, 7.5],
  [89.4, 30],
  [91.2, 51],
  [89.8, 72],
  [92, 93]
];

const BRANCH: Point[] = [
  [33.5, 44],
  [30.6, 52],
  [28.8, 61],
  [25.6, 70.5],
  [24.4, 78]
];

const MAIN_SEGMENTS = vein(MAIN, { width: 7.6, seed: 1938, taper: [0.06, 0.06] });
const SEGMENTS = [...MAIN_SEGMENTS, ...vein(BRANCH, { width: 2.2, seed: 7, steps: 8, wobble: 0.3, taper: [0.02, 0.9] })];

/** The M, traced from a vein in the stair landing's Fauske marble. */
export function VeinMark({
  size = 40,
  color = C.black,
  style,
  hair = true
}: {
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
  /** Draw the hairline veins; leave them out below about 24 px. */
  hair?: boolean;
}) {
  const segments = hair ? SEGMENTS : MAIN_SEGMENTS;
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      aria-hidden='true'
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      <g stroke={color} strokeLinecap='round' fill='none'>
        {segments.map((s) => (
          <line key={`${s.x1.toFixed(2)},${s.y1.toFixed(2)},${s.w.toFixed(2)}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeWidth={s.w} />
        ))}
      </g>
    </svg>
  );
}

/** The mark with MARMOR KINO beside it. `height` is the mark's height in px or cqw. */
export function Lockup({
  height = 28,
  unit = 'px',
  color = C.black,
  sub
}: {
  height?: number;
  unit?: 'px' | 'cqw';
  color?: string;
  sub?: string;
}) {
  const h = (k: number) => `${height * k}${unit}`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: h(0.32), color }}>
      <VeinMark size={h(1)} color={color} hair={unit === 'cqw' || height > 24} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: h(0.08) }}>
        <span style={{ ...TITLE_STYLE, fontSize: h(0.62), lineHeight: 0.86, letterSpacing: '0.01em' }}>Marmor Kino</span>
        {sub ? <span style={{ fontFamily: FONT.mono, fontSize: h(0.3), lineHeight: 1.1 }}>{sub}</span> : null}
      </span>
    </span>
  );
}
