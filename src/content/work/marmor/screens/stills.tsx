import type * as React from 'react';
import { useId } from 'react';
import { seeded } from '~/components/art/random';
import { C, type StillKind } from './model';

type Inks = { tone: string; ink: string; paper: string; id: string };

/**
 * Film stills, as the posters print them: two inks (the month's colour and
 * black) on marble paper. Each is drawn in a 100 × 100 box and cropped to fit.
 */
export function Still({
  kind,
  tone,
  ink = C.black,
  paper = C.marble,
  grain = true,
  style
}: {
  kind: StillKind;
  tone: string;
  ink?: string;
  paper?: string;
  grain?: boolean;
  style?: React.CSSProperties;
}) {
  const id = useId().replaceAll(':', '');
  const Draw = DRAW[kind] ?? DRAW.sun;
  return (
    <svg
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid slice'
      aria-hidden='true'
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    >
      <Draw tone={tone} ink={ink} paper={paper} id={id} />
      {grain ? (
        <>
          <filter id={`n${id}`} x='0' y='0' width='100%' height='100%'>
            <feTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves={2} seed={4} />
            <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.25' />
          </filter>
          <rect x='-50' y='-50' width='200' height='200' filter={`url(#n${id})`} opacity={0.16} />
        </>
      ) : null}
    </svg>
  );
}

function Sun({ tone, ink, paper, id }: Inks) {
  const bars = Array.from({ length: 11 }, (_, i) => {
    const y = 61.4 + i * 1.55 + i * i * 0.2;
    const h = 0.55 + i * 0.14;
    const w = 30 - i * 2.1 + (i % 3) * 1.6;
    return { y, h, w, x: 57 - w / 2 + ((i * 7) % 5) - 2 };
  });
  return (
    <>
      <defs>
        <linearGradient id={`sky${id}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor={ink} stopOpacity={0.62} />
          <stop offset='0.62' stopColor={ink} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`up${id}`}>
          <rect width='100' height='60' />
        </clipPath>
      </defs>
      <rect width='100' height='100' fill={tone} />
      <rect width='100' height='60' fill={`url(#sky${id})`} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} y={8 + i * 2.1} width='100' height={0.35 + i * 0.02} fill={ink} opacity={0.12} />
      ))}
      <circle cx='57' cy='60' r='18.5' fill={paper} clipPath={`url(#up${id})`} />
      <rect y='60' width='100' height='40' fill={ink} />
      {bars.map((bar, i) => (
        <rect key={bar.y} x={bar.x} y={bar.y} width={bar.w} height={bar.h} fill={i % 4 === 3 ? tone : paper} opacity={1 - i * 0.06} />
      ))}
      <path d='M-2 60 L-2 50.5 C 5 49.6, 12 46.2, 19.5 46.4 C 25 46.6, 29.5 51, 34.5 55.4 C 36.6 57.3, 38.6 58.8, 41 60 Z' fill={ink} />
      <path d='M12.6 46.2 h4.2 v-3.1 l-2.1 -2 l-2.1 2 Z' fill={ink} />
      <rect x='14.1' y='43.9' width='1' height='1.1' fill={paper} />
    </>
  );
}

function Orchard({ tone, ink, paper }: Inks) {
  const rows = [
    { y: 15.5, r: 2.6, xs: [33, 44.5, 55.5, 67] },
    { y: 24, r: 4, xs: [27, 42, 58, 73] },
    { y: 38, r: 6.4, xs: [18, 39, 61, 82] },
    { y: 62, r: 10.5, xs: [6, 35, 65, 94] }
  ];
  return (
    <>
      <rect width='100' height='100' fill={ink} />
      {rows.map((row) => (
        <rect key={`g${row.y}`} x='-5' y={row.y + row.r * 1.02} width='110' height={row.r * 0.06 + 0.15} fill={tone} opacity={0.4} />
      ))}
      {rows.flatMap((row, ri) =>
        row.xs.map((x, xi) => {
          const lit = ri === 2 && xi === 2;
          const r = row.r;
          const arc = (from: number, to: number, rr: number) => {
            const a = (from * Math.PI) / 180;
            const b = (to * Math.PI) / 180;
            return `M${x + Math.cos(a) * rr} ${row.y + Math.sin(a) * rr} A ${rr} ${rr} 0 0 1 ${x + Math.cos(b) * rr} ${row.y + Math.sin(b) * rr}`;
          };
          return (
            <g key={`${row.y}-${x}`}>
              <ellipse cx={x + r * 0.35} cy={row.y + r * 1.02} rx={r * 1.1} ry={r * 0.16} fill={lit ? paper : tone} opacity={lit ? 0.5 : 0.22} />
              <circle cx={x} cy={row.y} r={r} fill={lit ? paper : tone} />
              <circle cx={x + r * 0.18} cy={row.y + r * 0.2} r={r * 0.78} fill={lit ? tone : ink} opacity={lit ? 0.18 : 0.32} />
              <path d={arc(200, 268, r * 0.72)} fill='none' stroke={lit ? tone : paper} strokeWidth={r * 0.13} strokeLinecap='round' opacity={0.95} />
              <circle cx={x + r * 0.44} cy={row.y + r * 0.42} r={r * 0.09} fill={lit ? tone : paper} opacity={0.8} />
            </g>
          );
        })
      )}
      <rect x='60.6' y='0' width='0.5' height={38 - 6.4} fill={paper} opacity={0.35} />
    </>
  );
}

function Ferro({ tone, ink, paper }: Inks) {
  const beam = (x1: number, y1: number, x2: number, y2: number, w: number) => {
    const length = Math.hypot(x2 - x1, y2 - y1);
    const nx = (-(y2 - y1) / length) * (w / 2);
    const ny = ((x2 - x1) / length) * (w / 2);
    return `M${x1 + nx} ${y1 + ny} L${x2 + nx} ${y2 + ny} L${x2 - nx} ${y2 - ny} L${x1 - nx} ${y1 - ny} Z`;
  };
  const rivets = (x1: number, y1: number, x2: number, y2: number, offset: number, count: number) =>
    Array.from({ length: count }, (_, i) => {
      const t = (i + 0.5) / count;
      const length = Math.hypot(x2 - x1, y2 - y1);
      return [x1 + (x2 - x1) * t + (-(y2 - y1) / length) * offset, y1 + (y2 - y1) * t + ((x2 - x1) / length) * offset];
    });
  return (
    <>
      <rect width='100' height='100' fill={tone} />
      <path d='M54 -2 L66 -2 L41 102 L22 102 Z' fill={paper} opacity={0.92} />
      <path d='M66 -2 L70 -2 L45 102 L41 102 Z' fill={paper} opacity={0.4} />
      <path d={beam(-10, 18, 110, 64, 17)} fill={ink} />
      <path d={beam(16, -10, 74, 110, 11)} fill={ink} />
      <path d={beam(-10, 84, 110, 84, 9)} fill={ink} />
      <path d={beam(-10, 18, 110, 64, 1.4)} fill={tone} opacity={0.55} transform='translate(0 -6.2)' />
      {rivets(-10, 18, 110, 64, -5.4, 22).map(([x, y]) => (
        <circle key={`a${x}`} cx={x} cy={y} r={0.75} fill={paper} opacity={0.7} />
      ))}
      {rivets(-10, 84, 110, 84, 2.8, 26).map(([x, y]) => (
        <circle key={`b${x}`} cx={x} cy={y} r={0.6} fill={tone} opacity={0.9} />
      ))}
    </>
  );
}

function City({ tone, ink, paper }: Inks) {
  const random = seeded(42);
  const houses: { x: number; y: number; w: number; h: number; roof: number }[] = [];
  for (let row = 0; row < 6; row++) {
    let x = -6 + random() * 4;
    const base = 36 + row * 12;
    while (x < 104) {
      const w = 7 + random() * 9;
      const h = 9 + random() * 10;
      houses.push({ x, y: base - h + Math.sin(x / 14 + row) * 3, w, h: h + 14, roof: random() < 0.6 ? 2 + random() * 2.5 : 0 });
      x += w + 0.6;
    }
  }
  const flakes = Array.from({ length: 140 }, () => ({ x: random() * 100, y: random() * 100, r: 0.18 + random() ** 3 * 0.55 }));
  return (
    <>
      <rect width='100' height='100' fill={ink} />
      <path d='M-2 34 C 18 22, 34 30, 52 20 C 66 13, 82 22, 102 16 L102 50 L-2 50 Z' fill={tone} opacity={0.28} />
      {houses.map((house, i) => {
        const windows = [];
        for (let wy = house.y + 2.4; wy < house.y + house.h - 2; wy += 3.6) {
          for (let wx = house.x + 1.4; wx < house.x + house.w - 2; wx += 2.8) {
            const on = ((i * 31 + Math.round(wx * 7) + Math.round(wy * 3)) % 9) < 2;
            windows.push(<rect key={`${wx}-${wy}`} x={wx} y={wy} width={1.1} height={1.6} fill={on ? paper : ink} opacity={on ? 0.95 : 0.35} />);
          }
        }
        return (
          <g key={i}>
            {house.roof ? <path d={`M${house.x} ${house.y} L${house.x + house.w / 2} ${house.y - house.roof} L${house.x + house.w} ${house.y} Z`} fill={tone} /> : null}
            <rect x={house.x} y={house.y} width={house.w} height={house.h} fill={tone} />
            <rect x={house.x + house.w * 0.72} y={house.y} width={house.w * 0.28} height={house.h} fill={ink} opacity={0.28} />
            {house.roof ? <path d={`M${house.x - 0.4} ${house.y} L${house.x + house.w / 2} ${house.y - house.roof} L${house.x + house.w + 0.4} ${house.y}`} fill='none' stroke={paper} strokeWidth={0.5} opacity={0.85} /> : <rect x={house.x} y={house.y - 0.5} width={house.w} height={0.6} fill={paper} opacity={0.8} />}
            {windows}
          </g>
        );
      })}
      {flakes.map((f) => (
        <circle key={`${f.x}-${f.y}`} cx={f.x} cy={f.y} r={f.r} fill={paper} opacity={0.85} />
      ))}
    </>
  );
}

function Water({ tone, ink, paper }: Inks) {
  return (
    <>
      <rect width='100' height='100' fill={ink} />
      {Array.from({ length: 16 }, (_, i) => {
        const rx = 3 + i * 5.2 + i * i * 0.12;
        return (
          <ellipse
            key={i}
            cx='50'
            cy='56'
            rx={rx}
            ry={rx * 0.3}
            fill='none'
            stroke={tone}
            strokeWidth={1.6 - i * 0.07}
            opacity={1 - i * 0.045}
          />
        );
      })}
      <ellipse cx='50' cy='56' rx='5.2' ry='1.5' fill={paper} />
      <rect x='49.3' y='0' width='1.4' height='54' fill={paper} opacity={0.9} />
      <rect x='49.65' y='0' width='0.7' height='54' fill={tone} opacity={0.5} />
    </>
  );
}

function Forest({ tone, ink, paper, id }: Inks) {
  const random = seeded(11);
  const sun = 63;
  const front: { x: number; w: number }[] = [];
  const back: { x: number; w: number }[] = [];
  for (let x = -2; x < 104; x += 3 + random() * 9) front.push({ x, w: 1.1 + random() ** 1.8 * 4.2 });
  for (let x = 0; x < 104; x += 1.6 + random() * 4) back.push({ x, w: 0.4 + random() * 1.1 });
  return (
    <>
      <defs>
        <linearGradient id={`sky${id}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor={ink} stopOpacity={0.6} />
          <stop offset='0.45' stopColor={ink} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`glow${id}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor={paper} stopOpacity={0} />
          <stop offset='1' stopColor={paper} stopOpacity={0.92} />
        </linearGradient>
      </defs>
      <rect width='100' height='100' fill={tone} />
      <rect width='100' height='100' fill={`url(#sky${id})`} />
      <rect y='40' width='100' height='22' fill={`url(#glow${id})`} />
      <circle cx={sun} cy='55' r='6.5' fill={paper} />
      {back.map((t) => (
        <rect key={`b${t.x}`} x={t.x} y='-2' width={t.w} height='64' fill={tone} />
      ))}
      <rect y='62' width='100' height='40' fill={paper} />
      {front.map((t) => {
        const spread = 2.3;
        const x2 = t.x + (t.x - sun) * spread;
        return (
          <path
            key={`s${t.x}`}
            d={`M${t.x} 62 L${t.x + t.w} 62 L${x2 + t.w * 3.2} 102 L${x2} 102 Z`}
            fill={tone}
            opacity={0.62}
          />
        );
      })}
      {front.map((t) => (
        <rect key={t.x} x={t.x} y='-2' width={t.w} height='64.4' fill={ink} />
      ))}
    </>
  );
}

function Noon({ tone, ink, paper }: Inks) {
  return (
    <>
      <rect width='100' height='100' fill={tone} />
      <path d='M-2 -2 L102 -2 L102 20 L-2 42 Z' fill={ink} />
      <circle cx='79' cy='9.5' r='5.6' fill={paper} />
      <rect x='38' y='40' width='21' height='62' fill={ink} />
      <path d='M39.6 102 L49 102 L43.4 58 L39.6 58 Z' fill={paper} />
      <rect x='70' y='48' width='0.8' height='54' fill={ink} />
      <path d='M70.8 101 L101 79 L101 79.8 L70.8 101.8 Z' fill={ink} />
      {[86, 91, 96].map((y) => (
        <rect key={y} x='-2' y={y} width='40' height='0.35' fill={ink} />
      ))}
      {[86, 91, 96].map((y) => (
        <rect key={`r${y}`} x='59' y={y} width='45' height='0.35' fill={ink} />
      ))}
    </>
  );
}

function Window({ tone, ink, paper, id }: Inks) {
  const pane = (x: number, y: number) => `M${x} ${y} L${x + 14} ${y} L${x + 24} ${y + 22} L${x + 10} ${y + 22} Z`;
  return (
    <>
      <defs>
        <filter id={`soft${id}`}>
          <feGaussianBlur stdDeviation='3' />
        </filter>
      </defs>
      <rect width='100' height='100' fill={ink} />
      <g filter={`url(#soft${id})`} fill={tone} opacity={0.9}>
        <path d='M24 30 L56 30 L80 80 L48 80 Z' />
      </g>
      <g fill={paper}>
        <path d={pane(26, 32)} />
        <path d={pane(41.5, 32)} />
        <path d={pane(37, 56)} />
        <path d={pane(52.5, 56)} />
      </g>
      <rect x='0' y='88' width='100' height='0.4' fill={tone} opacity={0.5} />
      <rect x='8' y='0' width='0.4' height='100' fill={tone} opacity={0.35} />
    </>
  );
}

function Wharf({ tone, ink, paper }: Inks) {
  const random = seeded(5);
  const houses: { x: number; w: number; h: number }[] = [];
  let x = -4;
  while (x < 104) {
    const w = 6 + random() * 4;
    houses.push({ x, w, h: 16 + random() * 12 });
    x += w + 0.4;
  }
  const gable = (house: { x: number; w: number; h: number }, base: number, flip: boolean) => {
    const top = flip ? base + house.h : base - house.h;
    const peak = flip ? top + house.w * 0.55 : top - house.w * 0.55;
    return `M${house.x} ${base} L${house.x} ${top} L${house.x + house.w / 2} ${peak} L${house.x + house.w} ${top} L${house.x + house.w} ${base} Z`;
  };
  return (
    <>
      <rect width='100' height='100' fill={ink} />
      {houses.map((house, i) => (
        <path key={house.x} d={gable(house, 58, false)} fill={tone} opacity={i % 2 ? 1 : 0.82} />
      ))}
      {houses.map((house) => (
        <rect key={`w${house.x}`} x={house.x + house.w / 2 - 0.7} y={58 - house.h + 2} width='1.4' height='2' fill={paper} opacity={0.9} />
      ))}
      <rect y='58' width='100' height='0.6' fill={paper} />
      {houses.map((house) => (
        <path key={`r${house.x}`} d={gable(house, 58.6, true)} fill={tone} opacity={0.38} />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} y={60 + i * 2.6} width='100' height={1.1 + i * 0.05} fill={ink} />
      ))}
    </>
  );
}

function Fox({ tone, ink, paper }: Inks) {
  const random = seeded(17);
  const stars = Array.from({ length: 60 }, () => ({ x: random() * 100, y: random() * 52, r: 0.2 + random() ** 4 * 0.9 }));
  return (
    <>
      <rect width='100' height='100' fill={ink} />
      {stars.map((star) => (
        <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} fill={paper} />
      ))}
      <path d='M-2 78 C 24 64, 62 62, 102 72 L102 102 L-2 102 Z' fill={tone} opacity={0.5} />
      <path d='M50 66 L40 50 L43 38 L48 47 L52 47 L57 38 L60 50 Z' fill={tone} />
      <path d='M40 50 L50 66 L60 50 L56 86 L44 86 Z' fill={tone} />
      <path d='M44 86 L56 86 L72 84 C 76 83, 78 79, 76 76 L66 80 Z' fill={tone} />
      <path d='M44 54 L48 56 L46 52 Z M56 54 L52 56 L54 52 Z' fill={ink} />
      <path d='M50 66 L47.5 61 L52.5 61 Z' fill={paper} />
    </>
  );
}

const DRAW: Record<StillKind, (inks: Inks) => React.ReactNode> = {
  sun: Sun,
  orchard: Orchard,
  ferro: Ferro,
  city: City,
  water: Water,
  forest: Forest,
  noon: Noon,
  window: Window,
  wharf: Wharf,
  fox: Fox
};
