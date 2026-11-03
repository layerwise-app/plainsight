import { type ReactNode, useId } from 'react';
import { seeded } from '~/components/art/random';
import { type Camera, type Face, type Plane, type V2, type V3, TABLE, castOnto, hull, path, wall } from './space';

/** Something standing on the table: how to draw it and what shadow it throws. */
export type Thing = {
  key: string;
  /** Larger is further from the camera; drawn first. */
  depth: number;
  draw: ReactNode;
  /** Faces whose shadows are unioned into the object's shadow. */
  faces?: Face[];
  /** Point clouds whose shadow is their convex hull (cups, discs). */
  solids?: V3[][];
  /** Thick lines that cast shadows, like a cup handle. */
  strokes?: { points: V3[]; width: number }[];
  /** Footprint on the table, for a soft contact shadow. */
  footprint?: V3[];
  contact?: number;
};

type Leaf = { cx: number; cy: number; rx: number; ry: number; rotate: number };

/** Shadows of a branch outside the window, swaying on a loop. */
export function leafShadows({
  center,
  reach,
  count,
  time = 0,
  period = 6,
  seed = 7
}: {
  center: V2;
  reach: number;
  count: number;
  time?: number;
  period?: number;
  seed?: number;
}) {
  const random = seeded(seed);
  const phase = (time / period) * Math.PI * 2;
  const branchCount = Math.max(2, Math.round(count / 12));
  const stems: string[] = [];
  const leaves: Leaf[] = [];
  for (let b = 0; b < branchCount; b++) {
    const baseX = center[0] + (random() - 0.5) * reach * 0.9;
    const baseY = center[1] + (random() - 0.5) * reach * 0.5;
    const heading = Math.PI * (0.55 + random() * 0.9) + Math.sin(phase + b * 1.3) * 0.05;
    const length = reach * (0.55 + random() * 0.5);
    const bend = (random() - 0.5) * 0.9;
    const points: [number, number, number][] = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = heading + bend * t + Math.sin(phase + b + t * 2) * 0.05 * t;
      const prev = points[i - 1] ?? [baseX, baseY, angle];
      const step = length / steps;
      points.push(i === 0 ? [baseX, baseY, angle] : [prev[0] + Math.cos(angle) * step, prev[1] + Math.sin(angle) * step, angle]);
    }
    stems.push(points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(''));
    const perBranch = Math.round(count / branchCount);
    for (let l = 0; l < perBranch; l++) {
      const t = 0.15 + (l / perBranch) * 0.85;
      const [x, y, angle] = points[Math.min(steps, Math.round(t * steps))];
      const side = l % 2 === 0 ? 1 : -1;
      const size = 1 - t * 0.35;
      const tilt = angle + side * (0.7 + random() * 0.5) + Math.sin(phase + l * 0.9 + b) * 0.14;
      const rx = (reach / 14 + random() * (reach / 11)) * size;
      leaves.push({
        cx: x + Math.cos(tilt) * rx * 0.9,
        cy: y + Math.sin(tilt) * rx * 0.9,
        rx,
        ry: rx * (0.32 + random() * 0.12),
        rotate: (tilt * 180) / Math.PI
      });
    }
  }
  return { stems, leaves };
}

/**
 * A wall, a tabletop and the things on it, lit by one low sun. Every shadow
 * goes into a single mask, so overlapping shadows never darken twice.
 */
export function Stage({
  width,
  height,
  cam,
  light,
  wallY,
  things,
  wallFill,
  tableFill,
  shadowColor = '#4a2616',
  shadowOpacity = 0.58,
  leaves,
  windowEdge,
  children
}: {
  width: number;
  height: number;
  cam: Camera;
  light: V3;
  /** Distance of the wall from the origin, in world units. */
  wallY: number;
  things: Thing[];
  wallFill: ReactNode;
  tableFill: ReactNode;
  shadowColor?: string;
  shadowOpacity?: number;
  leaves?: ReturnType<typeof leafShadows>;
  /** A polygon in screen space that the window frame keeps in shade. */
  windowEdge?: V2[];
  children?: ReactNode;
}) {
  const id = useId().replaceAll(':', '');
  const back = wall(wallY);
  const junction = cam.project([0, wallY, 0])[1];
  const onto = (plane: Plane, face: V3[]) => face.map((p) => cam.project(castOnto(p, light, plane)));
  const shadowShapes = (plane: Plane) => (
    <>
      {things.flatMap((thing) => [
        ...(thing.faces ?? []).map((face, i) => <path key={`${thing.key}f${i}`} d={path(onto(plane, face))} />),
        ...(thing.solids ?? []).map((solid, i) => <path key={`${thing.key}s${i}`} d={path(hull(onto(plane, solid)))} />),
        ...(thing.strokes ?? []).map((stroke, i) => (
          <path
            key={`${thing.key}k${i}`}
            d={path(onto(plane, stroke.points), false)}
            fill='none'
            stroke='white'
            strokeWidth={stroke.width}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        ))
      ])}
    </>
  );
  const cast = (
    <>
      <g clipPath={`url(#table${id})`}>{shadowShapes(TABLE)}</g>
      <g clipPath={`url(#wall${id})`}>{shadowShapes(back)}</g>
    </>
  );
  const sorted = [...things].sort((a, b) => b.depth - a.depth);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, display: 'block' }} aria-hidden='true'>
      <defs>
        <clipPath id={`table${id}`}>
          <rect x={-200} y={junction} width={width + 400} height={height - junction + 200} />
        </clipPath>
        <clipPath id={`wall${id}`}>
          <rect x={-200} y={-200} width={width + 400} height={junction + 200} />
        </clipPath>
        <filter id={`sharp${id}`} x='-10%' y='-10%' width='120%' height='120%'>
          <feGaussianBlur stdDeviation={0.9} />
        </filter>
        <filter id={`soft${id}`} x='-10%' y='-10%' width='120%' height='120%'>
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <filter id={`contact${id}`} x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation={3.2} />
        </filter>
        <filter id={`leaf${id}`} x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation={3.4} />
        </filter>
        <filter id={`edge${id}`} x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <mask id={`shade${id}`} maskUnits='userSpaceOnUse' x={0} y={0} width={width} height={height}>
          <rect width={width} height={height} fill='black' />
          <g fill='white' filter={`url(#sharp${id})`}>
            {cast}
          </g>
          <g fill='white' filter={`url(#soft${id})`} opacity={0.32}>
            {cast}
          </g>
          {leaves ? (
            <g filter={`url(#leaf${id})`} fill='white' clipPath={`url(#wall${id})`}>
              {leaves.stems.map((d) => (
                <path key={d} d={d} fill='none' stroke='white' strokeWidth={2.6} strokeLinecap='round' />
              ))}
              {leaves.leaves.map((leaf) => (
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
          ) : null}
          {windowEdge ? <path d={path(windowEdge)} fill='white' filter={`url(#edge${id})`} /> : null}
        </mask>
        <mask id={`contactMask${id}`} maskUnits='userSpaceOnUse' x={0} y={0} width={width} height={height}>
          <rect width={width} height={height} fill='black' />
          <g fill='white' filter={`url(#contact${id})`}>
            {things.map((thing) =>
              thing.footprint ? (
                <path key={thing.key} d={path(hull(thing.footprint.map((p) => cam.project(p))))} opacity={thing.contact ?? 0.9} />
              ) : null
            )}
          </g>
        </mask>
      </defs>
      <g clipPath={`url(#wall${id})`}>{wallFill}</g>
      <g clipPath={`url(#table${id})`}>{tableFill}</g>
      <rect width={width} height={height} fill={shadowColor} opacity={shadowOpacity} mask={`url(#shade${id})`} style={{ mixBlendMode: 'multiply' }} />
      <rect width={width} height={height} fill='#1d0f08' opacity={0.55} mask={`url(#contactMask${id})`} style={{ mixBlendMode: 'multiply' }} />
      {sorted.map((thing) => (
        <g key={thing.key}>{thing.draw}</g>
      ))}
      {children}
    </svg>
  );
}

/** Plaster: a warm wall with slow mottling and fine grain. */
export function Plaster({ width, height, tone, seed = 4 }: { width: number; height: number; tone: string; seed?: number }) {
  const id = useId().replaceAll(':', '');
  return (
    <g>
      <defs>
        <filter id={`m${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.0045 0.006' numOctaves={4} seed={seed} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1' />
        </filter>
        <filter id={`p${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves={2} seed={seed + 3} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 3.6' />
        </filter>
      </defs>
      <rect width={width} height={height} fill={tone} />
      <rect width={width} height={height} filter={`url(#m${id})`} opacity={0.14} />
      <rect width={width} height={height} filter={`url(#p${id})`} opacity={0.12} />
    </g>
  );
}

/** Terracotta-tinted plaster for the tabletop, mottled along the depth. */
export function Tabletop({
  width,
  height,
  top,
  tone,
  seed = 9
}: {
  width: number;
  height: number;
  top: number;
  tone: string;
  seed?: number;
}) {
  const id = useId().replaceAll(':', '');
  return (
    <g>
      <defs>
        <filter id={`m${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.0035 0.012' numOctaves={4} seed={seed} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.05' />
        </filter>
        <filter id={`p${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.8 1.4' numOctaves={2} seed={seed + 2} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -8 4.2' />
        </filter>
        <linearGradient id={`d${id}`} x1='0' y1={top} x2='0' y2={height} gradientUnits='userSpaceOnUse'>
          <stop offset='0' stopColor='#fff' stopOpacity={0.08} />
          <stop offset='0.4' stopColor='#fff' stopOpacity={0} />
          <stop offset='1' stopColor='#000' stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect y={top} width={width} height={height - top} fill={tone} />
      <rect y={top} width={width} height={height - top} filter={`url(#m${id})`} opacity={0.2} />
      <rect y={top} width={width} height={height - top} filter={`url(#p${id})`} opacity={0.16} />
      <rect y={top} width={width} height={height - top} fill={`url(#d${id})`} />
    </g>
  );
}
