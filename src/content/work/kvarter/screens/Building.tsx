import type * as React from 'react';
import { useId } from 'react';
import { seeded } from '~/components/art/random';

/** The block at dusk: Kvarter's colours with the light going. */
export const D = {
  skyTop: '#141B30',
  sky1: '#1E2944',
  sky2: '#343A62',
  sky3: '#6E4F72',
  horizon: '#C9714F',
  brick: '#7F3826',
  brickLine: 'rgba(40,14,8,0.3)',
  brickHi: 'rgba(255,190,150,0.05)',
  concrete: '#8C8277',
  concreteDark: '#655D56',
  concreteLight: '#A69A8A',
  frame: '#C7BDAE',
  frameShade: '#968C7F',
  glass: '#252F52',
  glassHi: '#33406B',
  lit: '#FFC857',
  litDeep: '#F0A040',
  litPale: '#FFE4A3',
  panel: '#30573F',
  panelDark: '#244432',
  leafDark: '#22382B',
  leaf: '#335A40',
  leafLight: '#6F9157',
  leafBright: '#9DB466',
  hedge: '#1C2E23',
  trunk: '#CFC6B6',
  trunkShade: '#A69C8C',
  paper: '#F3ECE1'
};

const FADE = 0.14;

/** 0 → 1 while `t` (mod period) is inside [a, b), with short fades. */
export function inside(t: number, a: number, b: number, period = 6) {
  const u = (((t - a) % period) + period) % period;
  const d = (((b - a) % period) + period) % period;
  if (u < d) return Math.min(1, u / FADE);
  return Math.max(0, 1 - (u - d) / FADE);
}

export type Lighting = {
  /** Which openings are lit at rest, by id. */
  base: (id: number) => boolean;
  /** Windows that switch, [id, on/off at, back at], in seconds of a 6 s loop. */
  events: [number, number, number][];
  /** Stair climbs: [section, start] — each landing's sensor light follows. */
  climbs: [number, number][];
};

type Opening = { id: number; level: number };

const BAY = { win: 104, bal: 176, stair: 58 };
const SECTION = ['win', 'bal', 'stair', 'bal', 'win'] as const;
export const SECTION_WIDTH = SECTION.reduce((sum, bay) => sum + BAY[bay], 0);

/** One pane of glass, dark or lit, with an interior picked by `kind`. */
function Glass({ x, y, w, h, level, kind, grad }: { x: number; y: number; w: number; h: number; level: number; kind: number; grad: string }) {
  const curtains = kind % 3 === 0;
  const lamp = kind % 4 === 1;
  const plant = kind % 5 === 2;
  const blind = kind % 6 === 3;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={D.glass} />
      <path d={`M${x + w * 0.15},${y + h} L${x + w * 0.55},${y} L${x + w * 0.75},${y} L${x + w * 0.35},${y + h}Z`} fill={D.glassHi} opacity={0.55} />
      {curtains ? (
        <>
          <rect x={x} y={y} width={w * 0.18} height={h} fill='#1B2340' />
          <rect x={x + w * 0.82} y={y} width={w * 0.18} height={h} fill='#1B2340' />
        </>
      ) : null}
      {level > 0 ? (
        <g opacity={level}>
          <rect x={x} y={y} width={w} height={h} fill={`url(#${grad})`} />
          {curtains ? (
            <>
              <path d={`M${x},${y} h${w * 0.2} q${-w * 0.06},${h * 0.5} ${w * 0.03},${h} h${-w * 0.23}z`} fill='#E89A3E' />
              <path d={`M${x + w},${y} h${-w * 0.2} q${w * 0.06},${h * 0.5} ${-w * 0.03},${h} h${w * 0.23}z`} fill='#E89A3E' />
            </>
          ) : null}
          {lamp ? (
            <>
              <line x1={x + w * 0.5} y1={y} x2={x + w * 0.5} y2={y + h * 0.28} stroke='#9A5A22' strokeWidth={1.2} />
              <path d={`M${x + w * 0.36},${y + h * 0.4} a${w * 0.14},${w * 0.12} 0 0 1 ${w * 0.28},0z`} fill='#B4652A' />
              <ellipse cx={x + w * 0.5} cy={y + h * 0.43} rx={w * 0.16} ry={3} fill='#FFF3CF' opacity={0.9} />
            </>
          ) : null}
          {blind ? <rect x={x} y={y} width={w} height={h * 0.42} fill='#F7D58C' /> : null}
          {blind ? <rect x={x} y={y + h * 0.42 - 2} width={w} height={2} fill='#C98A3A' /> : null}
        </g>
      ) : null}
      {plant ? (
        <g>
          <rect x={x + w * 0.62} y={y + h - 12} width={12} height={12} rx={2} fill={level > 0.5 ? '#9A4A24' : '#1A2038'} />
          <circle cx={x + w * 0.62 + 6} cy={y + h - 18} r={9} fill={level > 0.5 ? '#3E6B4E' : '#18213A'} />
          <circle cx={x + w * 0.62 + 13} cy={y + h - 24} r={6} fill={level > 0.5 ? '#4F7D5B' : '#1A2440'} />
        </g>
      ) : null}
    </g>
  );
}

/** A framed window with a fixed and an opening pane, and a concrete sill. */
function Window({ x, y, w, h, level, kind, grad }: { x: number; y: number; w: number; h: number; level: number; kind: number; grad: string }) {
  const f = 4.5;
  const split = Math.round(w * 0.44);
  return (
    <g>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} fill={D.brickLine} />
      <rect x={x} y={y} width={w} height={h} fill={D.frame} />
      <Glass x={x + f} y={y + f} w={w - f * 2} h={h - f * 2} level={level} kind={kind} grad={grad} />
      <rect x={x + split - 1.5} y={y + f} width={3.5} height={h - f * 2} fill={D.frame} />
      <rect x={x + f} y={y + f} width={w - f * 2} height={1.4} fill={D.frameShade} opacity={0.9} />
      <rect x={x - 6} y={y + h} width={w + 12} height={6} fill={D.concreteLight} />
      <rect x={x - 6} y={y + h + 6} width={w + 12} height={2.5} fill={D.concreteDark} />
    </g>
  );
}

/**
 * A 1962 brick block, drawn as a flat elevation. `floors` storeys over a
 * basement, sections of window · balcony · stair · balcony · window.
 */
export function Facade({
  left,
  top,
  width,
  floors,
  floorH = 128,
  time = 0,
  lighting,
  offset = 0,
  seed = 12,
  numbers = ['10', '12', '14', '16']
}: {
  left: number;
  top: number;
  /** How far the block runs, in px. */
  width: number;
  floors: number;
  floorH?: number;
  time?: number;
  lighting: Lighting;
  /** Shift the bay pattern sideways, in px. */
  offset?: number;
  seed?: number;
  numbers?: string[];
}) {
  const uid = useId().replaceAll(':', '');
  const grad = `lit${uid}`;
  const random = seeded(seed);
  const parapet = 24;
  const plinth = 56;
  const groundY = top + parapet + floors * floorH;
  const height = parapet + floors * floorH + plinth;
  let id = 0;
  const lit = (opening: number): Opening => {
    let level = lighting.base(opening) ? 1 : 0;
    for (const [target, a, b] of lighting.events) {
      if (target !== opening) continue;
      const switched = inside(time, a, b);
      level = lighting.base(opening) ? 1 - switched : switched;
    }
    return { id: opening, level };
  };

  const bays: React.ReactNode[] = [];
  const slabs: React.ReactNode[] = [];
  const glows: React.ReactNode[] = [];
  let x = left - offset;
  let section = 0;
  while (x < left + width) {
    for (const bay of SECTION) {
      const bw = BAY[bay];
      for (let floor = 0; floor < floors; floor++) {
        const floorTop = groundY - (floor + 1) * floorH;
        const floorBottom = groundY - floor * floorH;
        const kind = Math.floor(random() * 12);
        if (bay === 'win') {
          const o = lit(id++);
          const w = 64;
          const h = 76;
          const wx = x + (bw - w) / 2;
          const wy = floorTop + 30;
          bays.push(<Window key={`w${o.id}`} x={wx} y={wy} w={w} h={h} level={o.level} kind={kind} grad={grad} />);
          if (o.level > 0) glows.push(<rect key={`g${o.id}`} x={wx - 8} y={wy - 6} width={w + 16} height={h + 16} opacity={o.level} />);
        } else if (bay === 'bal') {
          const o = lit(id++);
          const dw = 46;
          const dh = floorH - 24;
          const mirrored = SECTION.indexOf(bay) !== -1 && x % 2 === 1;
          const dx = x + 22;
          const wx = x + 22 + dw + 14;
          const wy = floorTop + 30;
          const extras = random();
          bays.push(
            <g key={`b${o.id}`}>
              <rect x={x + 10} y={floorTop + 14} width={bw - 20} height={floorH - 14} fill='rgba(40,14,8,0.28)' />
              <rect x={dx} y={floorTop + 24} width={dw} height={dh} fill={D.frame} />
              <Glass x={dx + 4} y={floorTop + 28} w={dw - 8} h={dh - 4} level={o.level} kind={kind + 1} grad={grad} />
              <Window x={wx} y={wy} w={72} h={76} level={o.level} kind={kind} grad={grad} />
              {/* What people keep on balconies */}
              {extras < 0.22 ? (
                <g>
                  <path d={`M${x + 30},${floorBottom - 68} h${bw - 60}`} stroke='#cfc6b6' strokeWidth={1.5} />
                  {[0, 1, 2, 3].map((i) => (
                    <rect key={i} x={x + 40 + i * 26} y={floorBottom - 67} width={18} height={14 + (i % 2) * 6} fill={i % 2 ? '#d9cfc0' : '#b9c4cf'} />
                  ))}
                </g>
              ) : null}
              {extras > 0.62 && extras < 0.8 ? (
                <g>
                  <rect x={x + bw - 60} y={floorBottom - 76} width={4} height={30} fill='#2a2f45' />
                  <rect x={x + bw - 60} y={floorBottom - 76} width={22} height={4} fill='#2a2f45' />
                </g>
              ) : null}
            </g>
          );
          if (o.level > 0) {
            glows.push(<rect key={`gd${o.id}`} x={dx - 6} y={floorTop + 20} width={dw + 12} height={dh + 8} opacity={o.level} />);
            glows.push(<rect key={`gw${o.id}`} x={wx - 8} y={wy - 6} width={88} height={92} opacity={o.level} />);
          }
          // The balcony itself: slab, moss panel, rail, plants on top.
          const plants = extras > 0.35 && extras < 0.7;
          const string = extras > 0.86;
          slabs.push(
            <g key={`s${o.id}`}>
              {string ? (
                <g>
                  <path
                    d={`M${x + 8},${floorTop + 22} Q${x + bw / 2},${floorTop + 46} ${x + bw - 8},${floorTop + 22}`}
                    fill='none'
                    stroke='#2a2233'
                    strokeWidth={1}
                  />
                  {Array.from({ length: 9 }, (_, i) => {
                    const t = (i + 0.5) / 9;
                    const px = x + 8 + t * (bw - 16);
                    const py = floorTop + 22 + 4 * t * (1 - t) * 24 * 0.5 * 2;
                    return <circle key={i} cx={px} cy={py + 2} r={2.2} fill={D.litPale} />;
                  })}
                </g>
              ) : null}
              {plants ? (
                <g>
                  <circle cx={x + 28} cy={floorBottom - 56} r={11} fill={D.leaf} />
                  <circle cx={x + 42} cy={floorBottom - 60} r={9} fill={D.leafLight} />
                  <circle cx={x + 52} cy={floorBottom - 54} r={8} fill={D.leaf} />
                  {mirrored ? null : <circle cx={x + bw - 34} cy={floorBottom - 56} r={9} fill={D.leafLight} />}
                </g>
              ) : null}
              <rect x={x + 4} y={floorBottom - 50} width={bw - 8} height={42} fill={D.panel} />
              <rect x={x + 4} y={floorBottom - 50} width={bw - 8} height={3} fill='rgba(255,255,255,0.08)' />
              {[0.25, 0.5, 0.75].map((t) => (
                <rect key={t} x={x + 4 + (bw - 8) * t - 0.75} y={floorBottom - 50} width={1.5} height={42} fill={D.panelDark} />
              ))}
              <rect x={x} y={floorBottom - 54} width={bw} height={5} fill={D.frame} />
              <rect x={x - 4} y={floorBottom - 8} width={bw + 8} height={12} fill={D.concrete} />
              <rect x={x - 4} y={floorBottom + 4} width={bw + 8} height={3} fill={D.concreteDark} />
            </g>
          );
        } else {
          // Stairwell: tall landing windows on motion-sensor lights.
          const level = Math.max(
            0,
            ...lighting.climbs.filter(([s]) => s === section).map(([, start]) => inside(time, start + floor * 0.42, start + floor * 0.42 + 2.6))
          );
          const sx = x + (bw - 30) / 2;
          const sy = floorTop + 20;
          bays.push(
            <g key={`st${section}-${floor}`}>
              <rect x={sx - 4} y={sy - 4} width={38} height={floorH - 28} fill={D.frame} />
              <rect x={sx} y={sy} width={30} height={floorH - 36} fill={D.glass} />
              <rect x={sx} y={sy} width={30} height={floorH - 36} fill={D.litPale} opacity={level * 0.92} />
              <rect x={sx} y={sy + (floorH - 36) * 0.5} width={30} height={3} fill={D.frame} />
            </g>
          );
          if (level > 0) glows.push(<rect key={`gs${section}-${floor}`} x={sx - 10} y={sy - 8} width={50} height={floorH - 20} opacity={level * 0.8} />);
        }
      }
      if (bay === 'stair') {
        // The entrance, with its canopy, lamp and house number.
        const ex = x - 8;
        const number = numbers[section % numbers.length];
        bays.push(
          <g key={`e${section}`}>
            <rect x={ex} y={groundY - 6} width={bw + 16} height={plinth + 6} fill={D.concreteDark} />
            <rect x={ex + 10} y={groundY - 2} width={bw - 4} height={plinth + 2} fill={D.litPale} opacity={0.85} />
            <rect x={ex + 10 + (bw - 4) / 2 - 1} y={groundY - 2} width={2} height={plinth + 2} fill={D.frameShade} />
            <rect x={ex - 14} y={groundY - 16} width={bw + 44} height={10} fill={D.concreteLight} />
            <circle cx={ex + bw + 30} cy={groundY + 6} r={4} fill={D.lit} />
            <text
              x={ex + bw / 2 + 8}
              y={groundY - 22}
              textAnchor='middle'
              fill={D.frame}
              fontFamily="'Bricolage Grotesque', sans-serif"
              fontWeight={700}
              fontStretch='75%'
              fontSize={15}
            >
              {number}
            </text>
          </g>
        );
        glows.push(<circle key={`ge${section}`} cx={ex + bw + 30} cy={groundY + 6} r={26} opacity={0.9} />);
        glows.push(<rect key={`gd${section}`} x={ex} y={groundY - 10} width={bw + 20} height={plinth + 10} opacity={0.7} />);
        section++;
      }
      if (bay === 'win' || bay === 'bal') {
        // Basement windows. The laundry room's is lit, porthole and all.
        const o = lit(id++);
        const bx = x + (bw - 54) / 2;
        const by = groundY + 16;
        const laundry = o.level > 0;
        bays.push(
          <g key={`bs${o.id}`}>
            <rect x={bx} y={by} width={54} height={22} fill={D.concreteDark} />
            <rect x={bx + 3} y={by + 3} width={48} height={16} fill={D.glass} />
            {laundry ? (
              <g opacity={o.level}>
                <rect x={bx + 3} y={by + 3} width={48} height={16} fill={D.litPale} />
                <rect x={bx + 10} y={by + 6} width={16} height={13} fill='#E8E1D4' />
                <circle cx={bx + 18} cy={by + 13} r={4} fill='#8796B0' />
                <rect x={bx + 29} y={by + 6} width={16} height={13} fill='#E8E1D4' />
                <circle cx={bx + 37} cy={by + 13} r={4} fill='#8796B0' />
              </g>
            ) : null}
          </g>
        );
        if (laundry) glows.push(<rect key={`gb${o.id}`} x={bx - 6} y={by - 6} width={66} height={34} opacity={o.level * 0.8} />);
      }
      x += bw;
    }
  }

  // Roof furniture: vents and one stubborn antenna.
  const roof = [0.16, 0.42, 0.71, 0.9].map((t, i) => {
    const rx = left + width * t;
    return (
      <g key={t}>
        <rect x={rx} y={top - 26} width={i % 2 ? 26 : 40} height={28} fill={D.concreteDark} />
        <rect x={rx - 3} y={top - 30} width={(i % 2 ? 26 : 40) + 6} height={5} fill={D.concrete} />
        {i === 1 ? (
          <g stroke='#3b3550' strokeWidth={2}>
            <line x1={rx + 13} y1={top - 30} x2={rx + 13} y2={top - 110} />
            <line x1={rx - 14} y1={top - 96} x2={rx + 40} y2={top - 96} />
            <line x1={rx - 6} y1={top - 82} x2={rx + 32} y2={top - 82} />
            <line x1={rx - 20} y1={top - 108} x2={rx + 46} y2={top - 108} />
          </g>
        ) : null}
      </g>
    );
  });

  return (
    <g clipPath={`url(#clip${uid})`}>
      <defs>
        <clipPath id={`clip${uid}`}>
          <rect x={left} y={top - 160} width={width} height={height + 200} />
        </clipPath>
        <linearGradient id={grad} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor={D.litPale} />
          <stop offset='0.55' stopColor={D.lit} />
          <stop offset='1' stopColor={D.litDeep} />
        </linearGradient>
        <pattern id={`brick${uid}`} width='28' height='9' patternUnits='userSpaceOnUse' x={left - offset}>
          <rect width='28' height='9' fill={D.brick} />
          <rect y='8' width='28' height='1' fill={D.brickLine} />
          <rect x='13.5' y='0' width='1' height='4' fill={D.brickLine} />
          <rect x='0' y='4' width='28' height='1' fill={D.brickLine} />
          <rect x='0' y='4.5' width='1' height='4' fill={D.brickLine} />
          <rect x='4' y='0' width='9' height='4' fill={D.brickHi} />
        </pattern>
        <filter id={`glow${uid}`} x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='14' />
        </filter>
        <linearGradient id={`shade${uid}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#1E2944' stopOpacity='0.22' />
          <stop offset='1' stopColor='#1E2944' stopOpacity='0.5' />
        </linearGradient>
      </defs>
      {roof}
      <rect x={left} y={top} width={width} height={height} fill={`url(#brick${uid})`} />
      <rect x={left} y={top} width={width} height={parapet} fill={D.concrete} />
      <rect x={left} y={top} width={width} height={4} fill={D.concreteLight} />
      <rect x={left} y={top + parapet} width={width} height={3} fill={D.concreteDark} />
      <rect x={left} y={groundY} width={width} height={plinth} fill={D.concreteDark} />
      <rect x={left} y={groundY} width={width} height={6} fill={D.concrete} />
      {bays}
      {slabs}
      <rect x={left} y={top} width={width} height={height} fill={`url(#shade${uid})`} style={{ mixBlendMode: 'multiply' }} />
      <g filter={`url(#glow${uid})`} fill={D.lit} opacity={0.26} style={{ mixBlendMode: 'screen' }}>
        {glows}
      </g>
    </g>
  );
}

/** A birch in late April: pale trunk, fine twigs, the first small leaves gathered at the tips. */
export function Birch({ x, y, height, seed = 4, time = 0, scale = 1 }: { x: number; y: number; height: number; seed?: number; time?: number; scale?: number }) {
  const random = seeded(seed);
  const sway = Math.sin((time / 6) * Math.PI * 2);
  const top = y - height;
  const lean = 10 * scale;
  const trunk = `M${x - 12 * scale},${y} C${x - 10 * scale},${y - height * 0.5} ${x - 3 * scale + lean * 0.5},${top + height * 0.25} ${x + lean},${top} L${x + 2 * scale + lean},${top} C${x + 5 * scale + lean * 0.5},${top + height * 0.3} ${x + 10 * scale},${y - height * 0.5} ${x + 12 * scale},${y}Z`;
  const xAt = (t: number) => x + lean * t ** 2;
  const limbs: { d: string; w: number }[] = [];
  const leaves: { cx: number; cy: number; r: number; tone: string }[] = [];
  const addLeaves = (cx: number, cy: number, count: number, spread: number) => {
    for (let l = 0; l < count; l++) {
      const pick = random();
      leaves.push({
        cx: cx + (random() - 0.5) * spread,
        cy: cy + (random() - 0.5) * spread * 0.8 + spread * 0.15,
        r: (1.8 + random() * 2.6) * scale,
        tone: pick < 0.32 ? D.leafDark : pick < 0.6 ? D.leaf : pick < 0.88 ? D.leafLight : D.leafBright
      });
    }
  };
  for (let i = 0; i < 16; i++) {
    const t = 0.22 + (i / 16) * 0.74;
    const bx = xAt(t);
    const by = y - height * t;
    const side = i % 2 ? 1 : -1;
    const len = (120 + random() * 130) * (1 - t * 0.5) * scale;
    const rise = 0.25 + random() * 0.45;
    const ex = bx + side * len;
    const ey = by - len * rise + len * 0.15;
    const mx = bx + side * len * 0.55;
    const my = by - len * rise * 0.7;
    const tip = sway * (2 + t * 4);
    limbs.push({ d: `M${bx},${by} Q${mx},${my} ${ex + tip},${ey}`, w: 2.6 * scale * (1 - t * 0.5) });
    // Twigs droop from each limb, as birch twigs do.
    for (let k = 0; k < 4; k++) {
      const u = 0.35 + k * 0.18;
      const tx = bx + (mx - bx) * 2 * u * (1 - u) + (ex - bx) * u * u + tip * u;
      const ty = by + (my - by) * 2 * u * (1 - u) + (ey - by) * u * u;
      const tl = (30 + random() * 40) * scale;
      const fx = tx + side * tl * (0.3 + random() * 0.4);
      const fy = ty + tl * (0.5 + random() * 0.4);
      limbs.push({ d: `M${tx},${ty} Q${tx + side * tl * 0.4},${ty - tl * 0.1} ${fx + tip * 1.5},${fy}`, w: 1 * scale });
      addLeaves(fx + tip * 1.5, fy - tl * 0.25, 6 + Math.floor(random() * 6), tl * 0.9);
    }
    addLeaves(ex + tip, ey, 10, 40 * scale);
  }
  const marks = Array.from({ length: 22 }, () => ({ t: random(), w: 5 + random() * 10, side: random() < 0.5 ? -1 : 1 }));
  return (
    <g>
      {limbs.map((limb) => (
        <path key={limb.d} d={limb.d} fill='none' stroke='#8F877C' strokeWidth={limb.w} strokeLinecap='round' opacity={0.9} />
      ))}
      <path d={trunk} fill={D.trunk} />
      <path
        d={`M${x + 2 * scale},${y} C${x + 3 * scale},${y - height * 0.5} ${x + 2 * scale + lean * 0.5},${top + height * 0.3} ${x + lean},${top} L${x + 2 * scale + lean},${top} C${x + 5 * scale + lean * 0.5},${top + height * 0.3} ${x + 10 * scale},${y - height * 0.5} ${x + 12 * scale},${y}Z`}
        fill={D.trunkShade}
        opacity={0.55}
      />
      {marks.map((mark) => {
        const my = y - mark.t * height * 0.9;
        const half = (12 - mark.t * 9) * scale;
        const mx = xAt(mark.t);
        return (
          <rect
            key={`${mark.t}`}
            x={mx - half + (mark.side > 0 ? half * 0.5 : 0)}
            y={my}
            width={Math.min(half * 1.5, mark.w * scale * (1 - mark.t * 0.5))}
            height={2.2 * scale}
            rx={1}
            fill='#2B2A33'
            opacity={0.7}
          />
        );
      })}
      {leaves.map((leaf) => (
        <ellipse
          key={`${leaf.cx.toFixed(2)}-${leaf.cy.toFixed(2)}`}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.r}
          ry={leaf.r * 0.78}
          fill={leaf.tone}
        />
      ))}
    </g>
  );
}

/** A clipped hedge from `from` to `to`, with a darker underside. */
export function Hedge({ y, from = -20, to, seed = 9, color = D.hedge }: { y: number; from?: number; to: number; seed?: number; color?: string }) {
  const random = seeded(seed);
  const bumps: string[] = [];
  let x = from;
  while (x < to) {
    const w = Math.min(to - x, 40 + random() * 40);
    bumps.push(`a${w / 2},${10 + random() * 10} 0 0 1 ${w},0`);
    x += w;
  }
  const sprigs = Array.from({ length: Math.round((to - from) / 9) }, () => ({
    x: from + random() * (to - from),
    y: y - 6 + random() * 30,
    r: 1.6 + random() * 2.6,
    light: random() < 0.3
  }));
  return (
    <g>
      <path d={`M${from},${y + 6} ${bumps.join(' ')} V${y + 500} H${from}Z`} fill={color} />
      {sprigs.map((sprig) => (
        <circle key={`${sprig.x}-${sprig.y}`} cx={sprig.x} cy={sprig.y} r={sprig.r} fill={sprig.light ? '#2F4A37' : '#15231B'} />
      ))}
    </g>
  );
}

/** The way in: a paved path from the door to the bottom of the frame. */
export function Path({ x, y, width, bottom }: { x: number; y: number; width: number; bottom: number }) {
  return (
    <g>
      <path d={`M${x},${y} h${width} l${width * 0.6},${bottom - y} h${-width * 2.2}z`} fill='#4C4A55' />
      <path d={`M${x},${y} h${width} l${width * 0.6},${bottom - y} h${-width * 2.2}z`} fill='#FFE4A3' opacity={0.08} />
    </g>
  );
}

/** Far off: a lower block in silhouette with a few lit windows, and a line of trees. */
export function Distance({ x, y, width, groundY, seed = 3 }: { x: number; y: number; width: number; groundY: number; seed?: number }) {
  const random = seeded(seed);
  const windows: { wx: number; wy: number; on: boolean }[] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col * 26 < width + 160; col++) {
      windows.push({ wx: x + 22 + col * 26, wy: y + 22 + row * 30, on: random() < 0.3 });
    }
  }
  const crowns = Array.from({ length: Math.round(width / 26) + 4 }, (_, i) => ({
    cx: x - 40 + i * 26 + random() * 12,
    cy: groundY - 70 - random() * 90,
    r: 34 + random() * 30
  }));
  return (
    <g>
      <rect x={x} y={y} width={width + 200} height={groundY - y} fill='#262E4B' />
      <rect x={x} y={y} width={width + 200} height={8} fill='#2E3757' />
      {windows.map((w) => (
        <rect key={`${w.wx}-${w.wy}`} x={w.wx} y={w.wy} width={11} height={14} fill={w.on ? D.lit : '#20283F'} opacity={w.on ? 0.7 : 1} />
      ))}
      {crowns.map((c) => (
        <circle key={`${c.cx}`} cx={c.cx} cy={c.cy} r={c.r} fill='#18261F' />
      ))}
      <rect x={x - 80} y={groundY - 80} width={width + 300} height={200} fill='#18261F' />
    </g>
  );
}

/** Lamp post with its pool of light. */
export function Lamp({ x, y, height }: { x: number; y: number; height: number }) {
  return (
    <g>
      <radialGradient id={`pool${x}`}>
        <stop offset='0' stopColor={D.lit} stopOpacity='0.42' />
        <stop offset='0.35' stopColor={D.lit} stopOpacity='0.14' />
        <stop offset='1' stopColor={D.lit} stopOpacity='0' />
      </radialGradient>
      <circle cx={x} cy={y - height + 10} r={110} fill={`url(#pool${x})`} />
      <rect x={x - 2.5} y={y - height} width={5} height={height} fill='#2A2F45' />
      <path d={`M${x - 16},${y - height + 4} h32 l-6,-14 h-20z`} fill='#2A2F45' />
      <ellipse cx={x} cy={y - height + 5} rx={11} ry={3.5} fill={D.litPale} />
    </g>
  );
}

/** Dusk sky: deep blue overhead, the last warm light low down, a few stars, a moon. */
export function Sky({ width, height, horizon, moon }: { width: number; height: number; horizon: number; moon?: [number, number] }) {
  const id = useId().replaceAll(':', '');
  const random = seeded(31);
  const stars = Array.from({ length: 26 }, () => ({ x: random() * width, y: random() * horizon * 0.62, r: 0.7 + random() * 1.1, o: 0.35 + random() * 0.5 }));
  return (
    <g>
      <defs>
        <linearGradient id={`sky${id}`} x1='0' y1='0' x2='0' y2={horizon} gradientUnits='userSpaceOnUse'>
          <stop offset='0' stopColor={D.skyTop} />
          <stop offset='0.42' stopColor={D.sky1} />
          <stop offset='0.72' stopColor={D.sky2} />
          <stop offset='0.9' stopColor={D.sky3} />
          <stop offset='1' stopColor={D.horizon} />
        </linearGradient>
      </defs>
      <radialGradient id={`halo${id}`}>
        <stop offset='0' stopColor={D.paper} stopOpacity='0.14' />
        <stop offset='1' stopColor={D.paper} stopOpacity='0' />
      </radialGradient>
      <rect width={width} height={height} fill={`url(#sky${id})`} />
      {stars.map((star) => (
        <circle key={`${star.x}`} cx={star.x} cy={star.y} r={star.r} fill={D.paper} opacity={star.o} />
      ))}
      {moon ? (
        <g>
          <circle cx={moon[0]} cy={moon[1]} r={90} fill={`url(#halo${id})`} />
          <circle cx={moon[0]} cy={moon[1]} r={22} fill='#F1E6CF' />
          <circle cx={moon[0] + 9} cy={moon[1] - 5} r={19} fill={D.sky1} opacity={0.94} />
        </g>
      ) : null}
    </g>
  );
}
