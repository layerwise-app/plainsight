import { useId } from 'react';
import { seeded } from './random';

type SunlightProps = {
  width: number;
  height: number;
  /** Seconds; leaves sway with it. */
  time?: number;
  /** Seconds for one full sway, so motion loops cleanly. */
  period?: number;
  /** Where the window light starts, as a share of width and height. */
  origin?: [number, number];
  /** Size of one pane of light, as a share of width and height. */
  pane?: [number, number];
  columns?: number;
  rows?: number;
  /** Gap left by the window bars, in px. */
  bars?: number;
  /** Horizontal shear of the light: positive leans right. */
  shear?: number;
  /** How dark the shadow side is (0–1). */
  shadow?: number;
  shadowColor?: string;
  /** Warm light colour added where the sun lands. */
  glow?: string;
  /** Number of leaf shadows; 0 for none. */
  leaves?: number;
  /** Centre of the leaf cluster, as a share of width and height. */
  leafCenter?: [number, number];
  softness?: number;
  seed?: number;
};

/**
 * Afternoon sun through a window: soft shadow everywhere, sheared panes of
 * light, and a cluster of leaf shadows that sway. Lay it over a wall and
 * whatever hangs on it.
 */
export function Sunlight({
  width,
  height,
  time = 0,
  period = 6,
  origin = [0.1, -0.1],
  pane = [0.22, 0.42],
  columns = 2,
  rows = 2,
  bars = 14,
  shear = 0.35,
  shadow = 0.42,
  shadowColor = '#3b2a1c',
  glow = '#ffd9a8',
  leaves = 34,
  leafCenter = [0.72, 0.3],
  softness = 10,
  seed = 7
}: SunlightProps) {
  const id = useId().replaceAll(':', '');
  const panes: string[] = [];
  const pw = pane[0] * width;
  const ph = pane[1] * height;
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      const x = origin[0] * width + c * (pw + bars) + r * (ph + bars) * shear;
      const y = origin[1] * height + r * (ph + bars);
      const s = ph * shear;
      panes.push(`M${x},${y} L${x + pw},${y} L${x + pw + s},${y + ph} L${x + s},${y + ph} Z`);
    }
  }

  const random = seeded(seed);
  const phase = (time / period) * Math.PI * 2;
  // Leaf shadows hang off a few branches, each swaying around its base.
  const branchCount = leaves ? Math.max(2, Math.round(leaves / 12)) : 0;
  const stems: string[] = [];
  const leafShapes: { cx: number; cy: number; rx: number; ry: number; rotate: number }[] = [];
  const reach = Math.min(width, height) * 0.38;
  for (let b = 0; b < branchCount; b++) {
    const baseX = leafCenter[0] * width + (random() - 0.5) * reach * 0.9;
    const baseY = leafCenter[1] * height + (random() - 0.5) * reach * 0.5;
    const heading = Math.PI * (0.55 + random() * 0.9) + Math.sin(phase + b * 1.3) * 0.05;
    const length = reach * (0.55 + random() * 0.5);
    const bend = (random() - 0.5) * 0.9;
    const points: [number, number, number][] = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = heading + bend * t + Math.sin(phase * 1 + b + t * 2) * 0.04 * t;
      const prev = points[i - 1] ?? [baseX, baseY, angle];
      const step = length / steps;
      points.push(i === 0 ? [baseX, baseY, angle] : [prev[0] + Math.cos(angle) * step, prev[1] + Math.sin(angle) * step, angle]);
    }
    stems.push(points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(''));
    const perBranch = Math.round(leaves / branchCount);
    for (let l = 0; l < perBranch; l++) {
      const t = 0.15 + (l / perBranch) * 0.85;
      const [x, y, angle] = points[Math.min(steps, Math.round(t * steps))];
      const side = l % 2 === 0 ? 1 : -1;
      const size = 1 - t * 0.35;
      const tilt = angle + side * (0.7 + random() * 0.5) + Math.sin(phase + l * 0.9 + b) * 0.12;
      const rx = (16 + random() * 14) * size;
      leafShapes.push({
        cx: x + Math.cos(tilt) * rx * 0.9,
        cy: y + Math.sin(tilt) * rx * 0.9,
        rx,
        ry: rx * (0.32 + random() * 0.12),
        rotate: (tilt * 180) / Math.PI
      });
    }
  }

  return (
    <svg
      aria-hidden='true'
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter id={`soft${id}`} x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation={softness} />
        </filter>
        <filter id={`leaf${id}`} x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation={softness * 0.45} />
        </filter>
        <mask id={`light${id}`} maskUnits='userSpaceOnUse' x='0' y='0' width={width} height={height}>
          <rect width={width} height={height} fill='black' />
          <g filter={`url(#soft${id})`} fill='white'>
            {panes.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g filter={`url(#leaf${id})`} fill='black'>
            {stems.map((d) => (
              <path key={d} d={d} fill='none' stroke='black' strokeWidth={2.4} strokeLinecap='round' />
            ))}
            {leafShapes.map((leaf) => (
              <ellipse
                key={`${leaf.cx}-${leaf.cy}`}
                cx={leaf.cx}
                cy={leaf.cy}
                rx={leaf.rx}
                ry={leaf.ry}
                transform={`rotate(${leaf.rotate} ${leaf.cx} ${leaf.cy})`}
              />
            ))}
          </g>
        </mask>
        <mask id={`shade${id}`} maskUnits='userSpaceOnUse' x='0' y='0' width={width} height={height}>
          <rect width={width} height={height} fill='white' />
          <rect width={width} height={height} fill='black' mask={`url(#light${id})`} />
        </mask>
      </defs>
      <rect width={width} height={height} fill={shadowColor} opacity={shadow} mask={`url(#shade${id})`} style={{ mixBlendMode: 'multiply' }} />
      <rect width={width} height={height} fill={glow} opacity={0.32} mask={`url(#light${id})`} style={{ mixBlendMode: 'soft-light' }} />
    </svg>
  );
}
