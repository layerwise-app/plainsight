import { useId } from 'react';
import { Grain } from '~/components/art/Grain';
import { seeded } from '~/components/art/random';
import { Sunlight } from '~/components/art/Sunlight';
import { Label } from './Bag';
import { G, ROASTS, wonk } from './brand';
import { BoxLid } from './Packaging';
import { Plaster } from './Stage';
import { TERRACOTTA } from './Scenes';

const S = 1.5; // px per mm
const SHADOW: [number, number] = [0.62, 0.5]; // shadow offset per mm of height

const display = (weight: number, size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: G.display,
  fontWeight: weight,
  fontSize: size,
  fontVariationSettings: wonk(144, 100, 1),
  ...extra
});
const sans = (weight: number, size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: G.sans,
  fontWeight: weight,
  fontSize: size,
  ...extra
});

/** A 500 g bag lying on its back, seen from above, crimp to the right. Drawn in mm. */
function FlatBag({ roast = 'medium' as const }: { roast?: 'medium' }) {
  const id = useId().replaceAll(':', '');
  const r = ROASTS[roast];
  const L = 262;
  const W = 140;
  const seal = 20;
  const body = L - seal;
  return (
    <g>
      <defs>
        <radialGradient id={`pillow${id}`} cx='0.42' cy='0.4' r='0.75'>
          <stop offset='0' stopColor='#fff6e8' />
          <stop offset='0.55' stopColor='#fff3e2' />
          <stop offset='0.85' stopColor='#c9a58e' />
          <stop offset='1' stopColor='#8c5a48' />
        </radialGradient>
        <linearGradient id={`edge${id}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#fff' stopOpacity={0.35} />
          <stop offset='0.12' stopColor='#fff' stopOpacity={0} />
          <stop offset='0.86' stopColor='#000' stopOpacity={0} />
          <stop offset='1' stopColor='#000' stopOpacity={0.3} />
        </linearGradient>
        <clipPath id={`body${id}`}>
          <path d={`M10 4 Q4 4 3 12 L1 ${W - 12} Q2 ${W - 4} 10 ${W - 4} L${body} ${W - 10} L${body} 10 Z`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#body${id})`} style={{ isolation: 'isolate' }}>
        <rect width={L} height={W} fill={r.bag} />
        {/* Base gusset, folded flat at the left end. */}
        <rect width={34} height={W} fill='#000' opacity={0.1} />
        <path d={`M0 0 L34 ${W / 2} L0 ${W}`} fill='none' stroke='#000' strokeOpacity={0.18} strokeWidth={0.8} />
        <text
          transform={`translate(${body - 54} ${W / 2}) rotate(90)`}
          fill={G.cream}
          style={display(900, 34, { letterSpacing: '-0.02em' })}
          textAnchor='middle'
        >
          grums
        </text>
        <g transform={`translate(${body - 66} ${W / 2 - 50}) rotate(90)`}>
          <Label width={100} roast='medium' size={500} date={{ dd: '04', mon: 'NOV', weekday: 'MONDAY' }} method='cafetiere' />
        </g>
        <rect width={L} height={W} fill={`url(#pillow${id})`} style={{ mixBlendMode: 'multiply' }} />
        <rect width={L} height={W} fill={`url(#edge${id})`} />
        <path d={`M40 22 Q120 34 200 18`} fill='none' stroke='#fff' strokeOpacity={0.18} strokeWidth={5} strokeLinecap='round' filter='blur(2px)' />
      </g>
      {/* Crimped seal. */}
      <g transform={`translate(${body} 6)`}>
        <rect width={seal} height={W - 12} fill={r.bag} />
        <rect width={seal} height={W - 12} fill='#000' opacity={0.06} />
        {Array.from({ length: Math.round((W - 12) / 1.6) }, (_, i) => (
          <line key={i} x1={2} x2={seal - 3} y1={i * 1.6 + 0.8} y2={i * 1.6 + 0.8} stroke={i % 2 ? '#fff' : '#000'} strokeOpacity={0.16} strokeWidth={0.6} />
        ))}
        <path
          d={`M${seal - 2} 0 ${Array.from({ length: Math.round((W - 12) / 2.4) + 1 }, (_, i) => `L${i % 2 ? seal : seal - 2} ${Math.min(W - 12, i * 2.4)}`).join(' ')}`}
          fill='none'
          stroke='#000'
          strokeOpacity={0.2}
          strokeWidth={0.6}
        />
      </g>
    </g>
  );
}

/** The brew card that comes in every first box: the method the subscriber told us, in big figures. */
function BrewCard() {
  const w = 148;
  const h = 105;
  return (
    <g>
      <rect width={w} height={h} rx={1.5} fill={G.espresso} />
      <text x={9} y={14} fill={G.kraft} style={sans(600, 4.2, { letterSpacing: '0.18em' })}>
        YOUR CAFETIÈRE
      </text>
      <text x={w - 9} y={14} fill={G.kraft} textAnchor='end' style={sans(600, 4.2, { letterSpacing: '0.18em' })}>
        LA PRADERA
      </text>
      {[
        ['17', 'g', 'coffee, coarse'],
        ['280', 'ml', 'water at 94°'],
        ['4', 'min', 'then press slowly']
      ].map(([n, unit, note], i) => (
        <g key={n} transform={`translate(${[9, 52, 114][i]} 0)`}>
          <text y={52} fill={G.cream} style={display(900, 30, { letterSpacing: '-0.04em' })}>
            {n}
          </text>
          <text y={62} fill={G.tomato} style={display(800, 8)}>
            {unit}
          </text>
          <text y={70} fill={G.cream} opacity={0.7} style={sans(500, 3.6)}>
            {note}
          </text>
        </g>
      ))}
      <rect x={9} y={80} width={w - 18} height={0.35} fill={G.cream} opacity={0.4} />
      <text x={9} y={90} fill={G.cream} style={sans(500, 4)}>
        Too strong? Try 15 g. Too thin? Grind finer, not more.
      </text>
      <text x={9} y={97} fill={G.cream} opacity={0.65} style={sans(500, 4)}>
        Text SKIP or LATER to 2290 to move your next bag.
      </text>
    </g>
  );
}

/** The letterbox box, opened, from above, with the bag and the brew card. 1440 × 960. */
export function LetterboxScene({ time = 0 }: { time?: number }) {
  const id = useId().replaceAll(':', '');
  const W = 1440;
  const H = 960;
  const L = 330;
  const D = 236;
  const tx = 214;
  const ty = 452;
  const lidY = ty - D * S;
  const random = seeded(17);
  const beans = Array.from({ length: 9 }, () => ({
    x: 700 + random() * 200,
    y: 836 + random() * 70,
    a: random() * 180,
    flat: random() < 0.5
  }));
  const shadow = (h: number): [number, number] => [SHADOW[0] * h * S, SHADOW[1] * h * S];
  const [bx, by] = shadow(62);
  const [cx, cy] = shadow(1.5);
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
        <defs>
          <filter id={`s${id}`} x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation={2.2} />
          </filter>
          <filter id={`soft${id}`} x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation={7} />
          </filter>
          <linearGradient id={`floor${id}`} x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0' stopColor='#d9c7ad' />
            <stop offset='1' stopColor='#efe3cf' />
          </linearGradient>
        </defs>
        <Plaster width={W} height={H} tone={TERRACOTTA} seed={21} />

        {/* Shadows on the table. */}
        <g fill='#3e1d10' opacity={0.5} style={{ mixBlendMode: 'multiply' }}>
          <g filter={`url(#s${id})`}>
            <path d={`M${tx + L * S} ${ty} l${bx} ${by} v${D * S} l${-bx} ${-by} Z M${tx} ${ty + D * S} l${bx} ${by} h${L * S} l${-bx} ${-by} Z`} />
            <rect x={tx + bx} y={ty + by} width={L * S} height={D * S} />
            <rect x={tx + cx} y={lidY + cy} width={L * S} height={D * S} />
            <g transform={`translate(${880 + cx * 1.4} ${118 + cy * 1.4}) rotate(4) scale(${S * 1.18})`}>
              <rect width={148} height={105} />
            </g>
            <g transform={`translate(${905 + bx} ${452 + by}) rotate(-6) scale(${S})`}>
              <rect width={L} height={D} />
            </g>
            {beans.map((b) => (
              <ellipse key={`${b.x}s`} cx={b.x + 6} cy={b.y + 5} rx={12} ry={8.5} transform={`rotate(${b.a} ${b.x + 6} ${b.y + 5})`} />
            ))}
          </g>
        </g>

        {/* Lid, opened back and lying flat: the inside is printed. */}
        <g transform={`translate(${tx} ${lidY}) scale(${S})`}>
          <rect width={L} height={D} fill='#f3eadb' />
          <rect width={L} height={D} fill='none' stroke='#b48c5c' strokeWidth={2.4} />
          <rect y={-30} x={12} width={L - 24} height={30} rx={3} fill='#efe4d2' />
          <rect y={-30} x={12} width={L - 24} height={30} rx={3} fill='none' stroke='#b48c5c' strokeWidth={1.2} />
          <text x={26} y={44} fill={G.tomato} style={display(900, 34, { letterSpacing: '-0.03em' })}>
            Hei Marte.
          </text>
          <text x={26} y={72} fill={G.espresso} style={display(600, 13.5, { letterSpacing: '-0.01em' })}>
            Your La Pradera was roasted on Monday 4 November.
          </text>
          <text x={26} y={90} fill={G.espresso} style={display(600, 13.5, { letterSpacing: '-0.01em' })}>
            It tastes best from day 4 to day 30, so no rush.
          </text>
          <rect x={26} y={112} width={L - 52} height={0.6} fill={G.espresso} opacity={0.3} />
          <text x={26} y={132} fill={G.espresso} opacity={0.75} style={sans(600, 6.4, { letterSpacing: '0.16em' })}>
            YOUR NEXT BAG
          </text>
          <text x={26} y={176} fill={G.tomato} style={display(900, 46, { letterSpacing: '-0.04em' })}>
            18
          </text>
          <text x={84} y={160} fill={G.tomato} style={display(900, 15)}>
            NOV
          </text>
          <text x={84} y={176} fill={G.espresso} style={sans(500, 7.2)}>
            Roasted Monday, in your letterbox Wednesday
          </text>
          <text x={26} y={206} fill={G.espresso} opacity={0.75} style={sans(500, 7.2)}>
            Two days before, we text you. Reply SKIP to miss one, or LATER to push it a week.
          </text>
          <text x={L - 20} y={D - 14} textAnchor='end' fill={G.espresso} opacity={0.5} style={sans(600, 5.4, { letterSpacing: '0.16em' })}>
            PLEASE RECYCLE WITH CARDBOARD
          </text>
        </g>

        {/* Tray. */}
        <g transform={`translate(${tx} ${ty}) scale(${S})`}>
          <rect width={L} height={D} fill='#c49a69' />
          <rect x={5} y={5} width={L - 10} height={D - 10} fill={`url(#floor${id})`} />
          {/* Inner walls: top and left in shade, bottom and right in sun. */}
          <path d={`M5 5 H${L - 5} L${L - 14} 13 H14 Z`} fill='#8d6a45' />
          <path d={`M5 5 V${D - 5} L14 ${D - 13} V13 Z`} fill='#9b7650' />
          <path d={`M5 ${D - 5} H${L - 5} L${L - 14} ${D - 12} H14 Z`} fill='#e0c49d' />
          <path d={`M${L - 5} 5 V${D - 5} L${L - 14} ${D - 12} V13 Z`} fill='#d7b88f' />
          <rect x={14} y={13} width={L - 28} height={D - 26} fill='#3e1d10' opacity={0.18} filter={`url(#soft${id})`} transform='translate(-8 -8)' style={{ mixBlendMode: 'multiply' }} />
          <g transform='translate(34 46)'>
            <rect x={6} y={8} width={262} height={140} rx={10} fill='#3e1d10' opacity={0.35} filter={`url(#s${id})`} />
            <FlatBag />
          </g>
          {/* Dust flaps folded out at the sides. */}
          <path d={`M0 0 L-26 10 L-26 ${D - 10} L0 ${D}`} fill='#b88f5f' />
          <path d={`M${L} 0 L${L + 26} 10 L${L + 26} ${D - 10} L${L} ${D}`} fill='#c9a170' />
          <line x1={0} x2={L} y1={0} y2={0} stroke='#000' strokeOpacity={0.15} strokeWidth={1} />
        </g>

        {/* The next box, still closed. */}
        <g transform={`translate(905 452) rotate(-6) scale(${S})`}>
          <rect width={L} height={D} fill='#c49a69' />
          <BoxLid />
          <rect width={L} height={D} fill='none' stroke='#fff' strokeOpacity={0.28} strokeWidth={1.4} />
          <rect y={D - 3} width={L} height={3} fill='#000' opacity={0.12} />
        </g>

        {/* Brew card. */}
        <g transform={`translate(880 118) rotate(4) scale(${S * 1.18})`}>
          <BrewCard />
        </g>

        {beans.map((b) => (
          <g key={b.x} transform={`rotate(${b.a} ${b.x} ${b.y})`}>
            <ellipse cx={b.x} cy={b.y} rx={12} ry={8.5} fill='#3a1c0e' />
            <ellipse cx={b.x - 2} cy={b.y - 2} rx={8} ry={5} fill='#6e3d20' opacity={0.5} />
            <path d={`M${b.x - 9} ${b.y} q4 -3 9 0 t9 0`} fill='none' stroke={b.flat ? '#140803' : '#a8754a'} strokeOpacity={b.flat ? 0.9 : 0.4} strokeWidth={1.6} strokeLinecap='round' />
          </g>
        ))}
      </svg>
      <Sunlight
        width={W}
        height={H}
        time={time}
        origin={[-0.08, -0.3]}
        pane={[0.62, 1.5]}
        columns={1}
        rows={1}
        bars={0}
        shear={0.34}
        shadow={0.42}
        shadowColor='#3e1d10'
        leaves={46}
        leafCenter={[0.9, 0.14]}
        seed={3}
      />
      <Grain opacity={0.18} frequency={0.8} />
    </div>
  );
}

