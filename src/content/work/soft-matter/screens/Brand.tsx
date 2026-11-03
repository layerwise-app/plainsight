import type * as React from 'react';
import { SM } from './palette';

type Pt = [number, number];
const at = ([x, y]: Pt, a: number, r: number): Pt => [x + r * Math.cos(a), y + r * Math.sin(a)];
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const f = (p: Pt) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`;

/**
 * The bridge between two circles, as a path: the 2D version of the smooth
 * minimum in the scene's shader. Empty when they are too far apart to join.
 */
export function bridge(c1: Pt, r1: number, c2: Pt, r2: number, v = 0.5, handle = 2.4): string {
  const d = dist(c1, c2);
  // Drops only reach for each other once the gap is under a third of the small one.
  if (!r1 || !r2 || d > r1 + r2 + Math.min(r1, r2) * 0.3 || d <= Math.abs(r1 - r2)) return '';
  const overlap = d < r1 + r2;
  const u1 = overlap ? Math.acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d)) : 0;
  const u2 = overlap ? Math.acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d)) : 0;
  const between = Math.atan2(c2[1] - c1[1], c2[0] - c1[0]);
  const spread = Math.acos((r1 - r2) / d);
  const a1 = between + u1 + (spread - u1) * v;
  const a2 = between - u1 - (spread - u1) * v;
  const a3 = between + Math.PI - u2 - (Math.PI - u2 - spread) * v;
  const a4 = between - Math.PI + u2 + (Math.PI - u2 - spread) * v;
  const p1 = at(c1, a1, r1);
  const p2 = at(c1, a2, r1);
  const p3 = at(c2, a3, r2);
  const p4 = at(c2, a4, r2);
  const d2 = Math.min(v * handle, dist(p1, p3) / (r1 + r2)) * Math.min(1, (d * 2) / (r1 + r2));
  const h1 = at(p1, a1 - Math.PI / 2, r1 * d2);
  const h2 = at(p2, a2 + Math.PI / 2, r1 * d2);
  const h3 = at(p3, a3 + Math.PI / 2, r2 * d2);
  const h4 = at(p4, a4 - Math.PI / 2, r2 * d2);
  return `M ${f(p1)} C ${f(h1)} ${f(h3)} ${f(p3)} A ${r2} ${r2} 0 ${d > r1 ? 1 : 0} 0 ${f(p4)} C ${f(h4)} ${f(h2)} ${f(p2)} Z`;
}

export type MarkState = 'apart' | 'touching' | 'joined';

/** Centre distance of the small drop for each state, in units of the large drop's radius. */
export const MARK_STATES: Record<MarkState, number> = { apart: 2.05, touching: 1.68, joined: 1.22 };

/**
 * The mark: a large drop with a smaller one joining it, up and to the right.
 * `join` runs 0 (apart) to 1 (joined) for motion; `state` picks a fixed one.
 */
export function Mark({
  size = 28,
  color = SM.plum,
  state = 'joined',
  join,
  style
}: {
  /** Height in px. */
  size?: number;
  color?: string;
  state?: MarkState;
  join?: number;
  style?: React.CSSProperties;
}) {
  const r1 = 10;
  const r2 = 6.2;
  const k = join === undefined ? MARK_STATES[state] : MARK_STATES.apart + (MARK_STATES.joined - MARK_STATES.apart) * join;
  const angle = -0.62;
  const c1: Pt = [r1, 24 - r1];
  const c2: Pt = [c1[0] + Math.cos(angle) * k * r1, c1[1] + Math.sin(angle) * k * r1];
  const width = c2[0] + r2 + 0.5;
  const top = Math.min(0, c2[1] - r2);
  const h = 24 - top;
  const gap = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]) - r1 - r2;
  const path = bridge(c1, r1, c2, r2, gap > 0 ? 0.3 + 0.22 * Math.max(0, 1 - gap / (r2 * 0.3)) : 0.52);
  return (
    <svg
      width={(size * width) / h}
      height={size}
      viewBox={`0 ${top} ${width} ${h}`}
      aria-hidden='true'
      style={{ display: 'block', flex: 'none', overflow: 'visible', ...style }}
    >
      <circle cx={c1[0]} cy={c1[1]} r={r1} fill={color} />
      <circle cx={c2[0]} cy={c2[1]} r={r2} fill={color} />
      {path ? <path d={path} fill={color} /> : null}
    </svg>
  );
}

/** The wordmark, lowercase Unbounded, with the mark before it. */
export function Wordmark({
  size = 18,
  color = SM.plum,
  mark = true,
  style
}: {
  /** Font size in px. */
  size?: number;
  color?: string;
  mark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: size * 0.36,
        color,
        fontFamily: SM.display,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '-0.045em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style
      }}
    >
      {mark ? <Mark size={size * 0.8} color={color} style={{ alignSelf: 'baseline', transform: `translateY(${size * 0.02}px)` }} /> : null}
      soft matter
    </span>
  );
}
