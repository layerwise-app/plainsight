import type * as React from 'react';
import { useId } from 'react';
import { Grain } from '~/components/art/Grain';
import { seeded } from '~/components/art/random';

const rgb = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);

/** A narrow spike in a transfer table: picks out the contour lines of a noise field. */
function spike(at: number, width: number, steps = 64) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const d = Math.abs(i / steps - at) / width;
    return Math.max(0, 1 - d * d).toFixed(3);
  }).join(' ');
}

/**
 * Polished white marble: soft cloud, a web of fine grey veins and a few
 * stronger ones, all following one direction.
 */
export function Marble({
  width,
  height,
  seed = 3,
  tone = '#ECE8E0',
  vein = '#6d675d',
  angle = -34,
  scale = 1,
  strength = 1,
  style
}: {
  width: number;
  height: number;
  seed?: number;
  tone?: string;
  vein?: string;
  angle?: number;
  /** Larger is a closer look at the stone. */
  scale?: number;
  strength?: number;
  style?: React.CSSProperties;
}) {
  const id = useId().replaceAll(':', '');
  const d = Math.ceil(Math.hypot(width, height));
  const [r, g, b] = rgb(vein);
  const box = { x: width / 2 - d / 2, y: height / 2 - d / 2, width: d, height: d };
  const color = `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}`;
  return (
    <svg aria-hidden='true' width={width} height={height} style={{ position: 'absolute', inset: 0, ...style }}>
      <defs>
        <filter id={`cloud${id}`} filterUnits='userSpaceOnUse' {...box}>
          <feTurbulence type='fractalNoise' baseFrequency={`${0.0011 / scale} ${0.0034 / scale}`} numOctaves={4} seed={seed} />
          <feColorMatrix type='matrix' values={`${color}  2.2 0 0 0 -0.95`} />
        </filter>
        <filter id={`vein${id}`} filterUnits='userSpaceOnUse' {...box}>
          <feTurbulence type='fractalNoise' baseFrequency={`${0.0016 / scale} ${0.0058 / scale}`} numOctaves={5} seed={seed + 7} />
          <feColorMatrix type='matrix' values={`${color}  1 0 0 0 0`} />
          <feComponentTransfer>
            <feFuncA type='table' tableValues={spike(0.5, 0.018)} />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation={0.45 * scale} />
        </filter>
        <filter id={`fine${id}`} filterUnits='userSpaceOnUse' {...box}>
          <feTurbulence type='fractalNoise' baseFrequency={`${0.003 / scale} ${0.011 / scale}`} numOctaves={4} seed={seed + 19} />
          <feColorMatrix type='matrix' values={`${color}  1 0 0 0 0`} />
          <feComponentTransfer>
            <feFuncA type='table' tableValues={`${spike(0.42, 0.012)}`} />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width={width} height={height} fill={tone} />
      <g transform={`rotate(${angle} ${width / 2} ${height / 2})`}>
        <rect {...box} filter={`url(#cloud${id})`} opacity={0.2 * strength} />
        <rect {...box} filter={`url(#fine${id})`} opacity={0.32 * strength} />
        <rect {...box} filter={`url(#vein${id})`} opacity={0.62 * strength} />
      </g>
    </svg>
  );
}

/**
 * What a paste-up does to a printed poster: seams where the sheets overlap,
 * a few creases and air bubbles, and the wall's texture coming through.
 */
export function PasteUp({
  width,
  height,
  sheets = [4, 2],
  seed = 2,
  wrinkles = 14
}: {
  width: number;
  height: number;
  sheets?: [number, number];
  seed?: number;
  wrinkles?: number;
}) {
  const id = useId().replaceAll(':', '');
  const random = seeded(seed);
  const sw = width / sheets[0];
  const sh = height / sheets[1];
  const seamsX = Array.from({ length: sheets[0] - 1 }, (_, i) => Math.round((i + 1) * sw + (random() - 0.5) * 3));
  const seamsY = Array.from({ length: sheets[1] - 1 }, (_, i) => Math.round((i + 1) * sh + (random() - 0.5) * 3));
  const tints = Array.from({ length: sheets[0] * sheets[1] }, () => (random() - 0.5) * 0.06);
  const creases = Array.from({ length: wrinkles }, () => {
    // Creases gather near seams and edges, where the paper was smoothed last.
    const nearSeam = random() < 0.65 && seamsX.length;
    const x = nearSeam ? seamsX[Math.floor(random() * seamsX.length)] + (random() - 0.5) * sw * 0.5 : random() * width;
    const y = random() * height;
    const angle = (random() < 0.5 ? -1 : 1) * (0.5 + random() * 0.9);
    const length = 40 + random() * Math.min(width, height) * 0.22;
    return { x, y, dx: Math.cos(angle) * length, dy: Math.sin(angle) * length, bend: (random() - 0.5) * 10 };
  });
  const bubbles = Array.from({ length: 3 }, () => ({
    x: random() * width,
    y: random() * height,
    rx: 8 + random() * 10,
    ry: 5 + random() * 5
  }));
  return (
    <div aria-hidden='true' style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg aria-hidden='true' width={width} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <filter id={`soft${id}`} x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation='5' />
          </filter>
          <linearGradient id={`seamx${id}`} x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0' stopColor='#000' stopOpacity='0.2' />
            <stop offset='1' stopColor='#000' stopOpacity='0' />
          </linearGradient>
          <linearGradient id={`seamy${id}`} x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0' stopColor='#000' stopOpacity='0.18' />
            <stop offset='1' stopColor='#000' stopOpacity='0' />
          </linearGradient>
          <radialGradient id={`bub${id}`}>
            <stop offset='0' stopColor='#fff' stopOpacity='0.14' />
            <stop offset='0.7' stopColor='#fff' stopOpacity='0.03' />
            <stop offset='1' stopColor='#000' stopOpacity='0.08' />
          </radialGradient>
          <linearGradient id={`sheen${id}`} x1='0' x2='1' y1='0' y2='1'>
            <stop offset='0' stopColor='#fff' stopOpacity='0.07' />
            <stop offset='0.5' stopColor='#fff' stopOpacity='0' />
            <stop offset='1' stopColor='#000' stopOpacity='0.08' />
          </linearGradient>
        </defs>
        {tints.map((tint, i) => (
          <rect
            key={i}
            x={(i % sheets[0]) * sw}
            y={Math.floor(i / sheets[0]) * sh}
            width={sw}
            height={sh}
            fill={tint > 0 ? '#fff' : '#000'}
            opacity={Math.abs(tint)}
          />
        ))}
        <rect width={width} height={height} fill={`url(#sheen${id})`} />
        {seamsX.map((x) => (
          <g key={`x${x}`}>
            <rect x={x} y={0} width={7} height={height} fill={`url(#seamx${id})`} />
            <rect x={x - 1} y={0} width={1.2} height={height} fill='#fff' opacity={0.16} />
          </g>
        ))}
        {seamsY.map((y) => (
          <g key={`y${y}`}>
            <rect x={0} y={y} width={width} height={6} fill={`url(#seamy${id})`} />
            <rect x={0} y={y - 1} width={width} height={1.2} fill='#fff' opacity={0.15} />
          </g>
        ))}
        <g filter={`url(#soft${id})`}>
          {creases.map((c) => {
            const d = `M${c.x} ${c.y} q ${c.dx / 2 + c.bend} ${c.dy / 2 - c.bend} ${c.dx} ${c.dy}`;
            return (
              <g key={`${c.x}-${c.y}`}>
                <path d={d} fill='none' stroke='#fff' strokeWidth={10} strokeLinecap='round' opacity={0.08} />
                <path d={d} fill='none' stroke='#000' strokeWidth={9} strokeLinecap='round' opacity={0.08} transform='translate(6 5)' />
              </g>
            );
          })}
        </g>
        {bubbles.map((b) => (
          <ellipse key={`${b.x}-${b.y}`} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={`url(#bub${id})`} />
        ))}
        <rect x={0.5} y={0.5} width={width - 1} height={height - 1} fill='none' stroke='#000' strokeOpacity={0.14} />
      </svg>
      <Grain opacity={0.2} frequency={0.85} seed={seed + 5} />
    </div>
  );
}

/** Flagstones in front of the wall, seen from standing height. */
export function Pavement({
  width,
  top,
  height,
  horizon,
  tone = '#827e76',
  seed = 4
}: {
  width: number;
  top: number;
  height: number;
  /** Eye height in the picture, for the joints' perspective. */
  horizon: number;
  tone?: string;
  seed?: number;
}) {
  const id = useId().replaceAll(':', '');
  const random = seeded(seed);
  const cx = width / 2;
  const depth = top - horizon;
  const spread = (top + height - horizon) / depth;
  const slab = 150;
  const columns = Array.from({ length: Math.ceil(width / slab) + 6 }, (_, i) => (i - 3) * slab + ((random() - 0.5) * 8 + 30));
  const rows = [0.3, 0.72].map((t) => top + height * t * t + height * 0.2 * t);
  return (
    <svg aria-hidden='true' width={width} height={top + height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={`pv${id}`} x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0' stopColor='#000' stopOpacity='0.32' />
          <stop offset='0.18' stopColor='#000' stopOpacity='0.08' />
          <stop offset='1' stopColor='#fff' stopOpacity='0.06' />
        </linearGradient>
        <linearGradient id={`damp${id}`} x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0' stopColor='#2a261f' stopOpacity='0' />
          <stop offset='1' stopColor='#2a261f' stopOpacity='0.34' />
        </linearGradient>
        <filter id={`stain${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.006 0.02' numOctaves={3} seed={seed + 3} />
          <feColorMatrix type='matrix' values='0 0 0 0 0.12  0 0 0 0 0.11  0 0 0 0 0.1  2.6 0 0 0 -1.2' />
        </filter>
        <filter id={`grit${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves={2} seed={seed} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 3.8' />
        </filter>
      </defs>
      <rect x={0} y={top - 46} width={width} height={46} fill={`url(#damp${id})`} />
      <rect x={0} y={top} width={width} height={height} fill={tone} />
      {columns.map((x, i) => {
        const shade = (random() - 0.5) * 0.08;
        const x2 = columns[i + 1];
        if (x2 === undefined) return null;
        const bx = cx + (x - cx) * spread;
        const bx2 = cx + (x2 - cx) * spread;
        return (
          <path
            key={`s${x}`}
            d={`M${x} ${top} L${x2} ${top} L${bx2} ${top + height} L${bx} ${top + height} Z`}
            fill={shade > 0 ? '#fff' : '#000'}
            opacity={Math.abs(shade)}
          />
        );
      })}
      <rect x={0} y={top} width={width} height={height} filter={`url(#grit${id})`} opacity={0.34} />
      <rect x={0} y={top} width={width} height={height} filter={`url(#stain${id})`} opacity={0.5} />
      <rect x={0} y={top} width={width} height={height} fill={`url(#pv${id})`} />
      {columns.map((x) => (
        <line key={x} x1={x} y1={top} x2={cx + (x - cx) * spread} y2={top + height} stroke='#3b372f' strokeOpacity={0.32} strokeWidth={1.4} />
      ))}
      {rows.map((y) => (
        <line key={y} x1={0} x2={width} y1={y} y2={y} stroke='#3b372f' strokeOpacity={0.3} strokeWidth={1.2 + (y - top) / height} />
      ))}
      <line x1={0} x2={width} y1={top} y2={top} stroke='#2a261f' strokeOpacity={0.55} strokeWidth={2} />
    </svg>
  );
}

const PASTE = 0.8;
/** When each poster in a three-poster loop starts going up, over six seconds. */
const STARTS = [5.2, 1.3, 3.3];

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * A bill-poster's week in six seconds: each poster is brushed on over the
 * last, top to bottom. At 0 s and 6 s the first poster sits alone and dry.
 */
export function pasteState(time: number, count: number) {
  const t = ((time % 6) + 6) % 6;
  if (count < 2) return { under: 0, over: -1, progress: 0 };
  for (let i = 0; i < count; i++) {
    const start = STARTS[i];
    if (t >= start && t < start + PASTE) {
      return { under: (i + count - 1) % count, over: i, progress: smooth((t - start) / PASTE) };
    }
  }
  // Holding: whichever poster went up most recently.
  let current = 0;
  let latest = -1;
  for (let i = 0; i < count; i++) {
    const end = STARTS[i] + PASTE;
    const since = (t - end + 6) % 6;
    if (latest === -1 || since < latest) {
      latest = since;
      current = i;
    }
  }
  return { under: current, over: -1, progress: 0 };
}

/** Lays posters over each other as `pasteState` says, with the roll of wet paper at the edge. */
export function PasteStack({
  height,
  posters,
  time = 0
}: {
  /** Accepted so callers can pass the frame size; the stack fills its parent. */
  width?: number;
  height: number;
  posters: React.ReactNode[];
  time?: number;
}) {
  const state = pasteState(time, posters.length);
  const roll = Math.max(10, height * 0.028);
  const edge = state.progress * (height + roll * 2.2);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>{posters[state.under]}</div>
      {state.over >= 0 ? (
        <>
          {/* Shadow the roll throws on the poster below. */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: edge - roll * 0.2,
              height: roll * 2.6,
              background: 'linear-gradient(rgba(20,16,12,0.42), rgba(20,16,12,0))'
            }}
          />
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 ${Math.max(0, height - edge + roll)}px 0)` }}>
            {posters[state.over]}
            {/* Fresh paste: darker and glossy just behind the brush. */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: edge - roll - height * 0.32,
                height: height * 0.32,
                background: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,${0.22 * (1 - state.progress ** 6)}))`,
                mixBlendMode: 'multiply'
              }}
            />
          </div>
          {/* The paper still rolled up, its blank back showing. */}
          <div
            style={{
              position: 'absolute',
              left: -2,
              right: -2,
              top: edge - roll,
              height: roll,
              borderRadius: roll / 2,
              background:
                'linear-gradient(#fbf9f4 0%, #e9e4da 38%, #c9c2b5 72%, #9d958a 100%)',
              boxShadow: '0 2px 3px rgba(0,0,0,0.25)'
            }}
          />
        </>
      ) : null}
    </div>
  );
}

/**
 * Board-marked cast concrete: formwork panels each a little different in
 * tone, seams with a slight lip, tie holes, cloudy mottling, sparse pores
 * and rain streaks running down from the seams.
 */
export function CastConcrete({
  width,
  height,
  tone = '#a9a59c',
  panel = [416, 208],
  offset = [0, 0],
  seed = 5,
  streaks = 7
}: {
  width: number;
  height: number;
  tone?: string;
  panel?: [number, number];
  /** Where the first full panel starts. */
  offset?: [number, number];
  seed?: number;
  streaks?: number;
}) {
  const id = useId().replaceAll(':', '');
  const random = seeded(seed);
  const [pw, ph] = panel;
  const xs: number[] = [];
  for (let x = offset[0] - pw; x < width; x += pw) xs.push(x);
  const ys: number[] = [];
  for (let y = offset[1] - ph; y < height; y += ph) ys.push(y);
  const panels = xs.flatMap((x) => ys.map((y) => ({ x, y, tint: (random() - 0.5) * 0.09 })));
  const ties = xs.flatMap((x) => ys.map((y) => [x + pw / 2 + (random() - 0.5) * 3, y + ph / 2 + (random() - 0.5) * 3]));
  const runs = Array.from({ length: streaks }, () => {
    const y = ys[1 + Math.floor(random() * Math.max(1, ys.length - 2))] ?? 0;
    return { x: random() * width, y, w: 14 + random() * 50, h: 80 + random() * 260, o: 0.05 + random() * 0.08 };
  });
  return (
    <svg aria-hidden='true' width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <filter id={`mot${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.0032 0.0045' numOctaves={4} seed={seed} />
          <feColorMatrix type='matrix' values='0 0 0 0 0.16  0 0 0 0 0.15  0 0 0 0 0.13  2.4 0 0 0 -1.05' />
        </filter>
        <filter id={`pore${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves={2} seed={seed + 2} />
          <feColorMatrix type='matrix' values='0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.08  -26 0 0 0 7.6' />
        </filter>
        <filter id={`fine${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves={2} seed={seed + 4} />
          <feColorMatrix type='saturate' values='0' />
        </filter>
        <filter id={`blur${id}`} x='-50%' y='-10%' width='200%' height='120%'>
          <feGaussianBlur stdDeviation='6 2' />
        </filter>
        <linearGradient id={`run${id}`} x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0' stopColor='#2a261f' stopOpacity='1' />
          <stop offset='1' stopColor='#2a261f' stopOpacity='0' />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill={tone} />
      {panels.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={pw} height={ph} fill={p.tint > 0 ? '#fff' : '#000'} opacity={Math.abs(p.tint)} />
      ))}
      <rect width={width} height={height} filter={`url(#mot${id})`} opacity={0.5} />
      <rect width={width} height={height} filter={`url(#fine${id})`} opacity={0.1} style={{ mixBlendMode: 'multiply' }} />
      <rect width={width} height={height} filter={`url(#pore${id})`} opacity={0.4} />
      <g filter={`url(#blur${id})`}>
        {runs.map((r) => (
          <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={`url(#run${id})`} opacity={r.o} />
        ))}
      </g>
      {xs.map((x) => (
        <g key={`sx${x}`}>
          <line x1={x} x2={x} y1={0} y2={height} stroke='#2a261f' strokeOpacity={0.24} strokeWidth={1.3} />
          <line x1={x + 1.5} x2={x + 1.5} y1={0} y2={height} stroke='#fff' strokeOpacity={0.12} strokeWidth={1} />
        </g>
      ))}
      {ys.map((y) => (
        <g key={`sy${y}`}>
          <line x1={0} x2={width} y1={y} y2={y} stroke='#2a261f' strokeOpacity={0.22} strokeWidth={1.3} />
          <line x1={0} x2={width} y1={y + 1.5} y2={y + 1.5} stroke='#fff' strokeOpacity={0.12} strokeWidth={1} />
        </g>
      ))}
      {ties.map(([x, y]) => (
        <g key={`t${x}-${y}`}>
          <circle cx={x} cy={y} r={7.5} fill='#fff' opacity={0.1} />
          <circle cx={x} cy={y} r={6} fill='#3a352d' opacity={0.38} />
          <circle cx={x - 1} cy={y - 1} r={4} fill='#1f1c17' opacity={0.55} />
        </g>
      ))}
    </svg>
  );
}

/**
 * Low late-afternoon sun outdoors: a warm wash where the light lands and a
 * cool, soft-edged shadow from a building across the street.
 */
export function LowSun({
  width,
  height,
  shade,
  extra = [],
  opacity = 0.44,
  softness = 12
}: {
  width: number;
  height: number;
  /** The shadow's outline, in px. */
  shade: [number, number][];
  /** Smaller shadows, such as a lamp post. */
  extra?: { d: string; opacity?: number; blur?: number }[];
  opacity?: number;
  softness?: number;
}) {
  const id = useId().replaceAll(':', '');
  const points = shade.map(([x, y]) => `${x},${y}`).join(' ');
  return (
    <svg aria-hidden='true' width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <filter id={`s${id}`} x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation={softness} />
        </filter>
        {extra.map((shape, i) => (
          <filter key={i} id={`e${id}${i}`} x='-50%' y='-20%' width='200%' height='140%'>
            <feGaussianBlur stdDeviation={shape.blur ?? 3} />
          </filter>
        ))}
        <linearGradient id={`warm${id}`} x1='0' y1='0' x2='1' y2='0.6'>
          <stop offset='0' stopColor='#ffc98a' stopOpacity='0.55' />
          <stop offset='0.7' stopColor='#ffd9a8' stopOpacity='0.3' />
          <stop offset='1' stopColor='#ffd9a8' stopOpacity='0.1' />
        </linearGradient>
        <radialGradient id={`vig${id}`} cx='0.42' cy='0.4' r='0.85'>
          <stop offset='0.55' stopColor='#1d1a16' stopOpacity='0' />
          <stop offset='1' stopColor='#1d1a16' stopOpacity='0.3' />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill={`url(#warm${id})`} style={{ mixBlendMode: 'soft-light' }} />
      <g style={{ mixBlendMode: 'multiply' }}>
        <polygon points={points} fill='#2b2c38' opacity={opacity} filter={`url(#s${id})`} />
        {extra.map((shape, i) => (
          <path key={i} d={shape.d} fill='#2b2c38' opacity={shape.opacity ?? opacity * 0.8} filter={`url(#e${id}${i})`} />
        ))}
      </g>
      <rect width={width} height={height} fill={`url(#vig${id})`} style={{ mixBlendMode: 'multiply' }} />
    </svg>
  );
}
