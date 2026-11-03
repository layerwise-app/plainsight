import type * as React from 'react';
import { useId } from 'react';
import { G, METHODS, type Method, ROASTS, type Roast, type Size, wonk } from './brand';
import {
  TABLE,
  type Camera,
  camera,
  castOnto,
  sun,
  type Face,
  type V2,
  type V3,
  affine,
  cross,
  dot,
  lambert,
  mix,
  multiply,
  norm,
  path,
  place,
  sub,
  turn
} from './space';

/** Real proportions of Grums's side-gusset bags, in millimetres. */
export const BAG_DIMS: Record<Size, { W: number; D: number; H: number }> = {
  250: { W: 112, D: 64, H: 206 },
  500: { W: 134, D: 80, H: 256 },
  1000: { W: 160, D: 100, H: 326 }
};

export type BagSpec = {
  roast: Roast;
  size: Size;
  /** Footprint centre on the table. */
  at: [number, number];
  /** Radians around the vertical; negative turns the right gusset towards the camera. */
  yaw: number;
  /** Roast date, as “dd” and three-letter month. */
  date?: { dd: string; mon: string; weekday: string };
  method?: Method;
};

const taper = (v: number) => (v <= 0.46 ? 1 : Math.max(0, Math.cos(((v - 0.46) / 0.54) * (Math.PI / 2))) ** 0.8);

/** The bag as surfaces in world space. */
export function bagModel(spec: BagSpec) {
  const { W, D, H } = BAG_DIMS[spec.size];
  const S = H * 0.075;
  const Hb = H - S;
  const toWorld = place([spec.at[0], spec.at[1], 0], spec.yaw);
  const rotate = turn(spec.yaw);
  const widen = (v: number) => 1 + 0.028 * Math.sin(Math.PI * Math.min(1, v * 1.08));
  const front = (u: number, v: number): V3 => {
    const d = taper(v);
    const bulge = 0.12 * D * (1 - u * u) * d ** 0.8;
    return toWorld([(u * W * widen(v)) / 2, (-D / 2) * d - bulge, v * Hb]);
  };
  const back = (u: number, v: number): V3 => {
    const d = taper(v);
    const bulge = 0.06 * D * (1 - u * u) * d;
    return toWorld([(u * W * widen(v)) / 2, (D / 2) * d + bulge, v * Hb]);
  };
  const crease = (side: number, v: number): V3 => {
    const d = taper(v);
    const inset = (D / 2) * Math.sqrt(Math.max(0, 1 - d * d));
    return toWorld([side * ((W * widen(v)) / 2 - inset * 0.92), 0, v * Hb]);
  };
  /** s across 0–1, t up 0–1. */
  const seal = (s: number, t: number): V3 => toWorld([(s - 0.5) * W, 0, Hb + t * S]);

  const steps = 18;
  const range = (n: number) => Array.from({ length: n + 1 }, (_, i) => i / n);
  const frontOutline: V3[] = [
    ...range(steps).map((t) => front(-1 + 2 * t, 0)),
    ...range(steps).map((t) => front(1, t)),
    ...range(steps).map((t) => front(1 - 2 * t, 1)),
    ...range(steps).map((t) => front(-1, 1 - t))
  ];
  const gusset = (side: number): V3[] => [
    ...range(steps).map((t) => front(side, t)),
    ...range(steps).map((t) => back(side, 1 - t))
  ];
  const teeth = Math.round(W / 2.6);
  const sealOutline: V3[] = [
    seal(0, 0),
    seal(1, 0),
    seal(1, 0.46),
    seal(0.985, 0.52),
    seal(1, 0.58),
    ...Array.from({ length: teeth * 2 + 1 }, (_, i) => seal(1 - i / (teeth * 2), i % 2 === 0 ? 1 : 0.9)),
    seal(0, 0.58),
    seal(0.015, 0.52),
    seal(0, 0.46)
  ];
  const faces: Face[] = [
    frontOutline,
    [...range(steps).map((t) => back(-1 + 2 * t, 0)), ...range(steps).map((t) => back(1, t)), ...range(steps).map((t) => back(1 - 2 * t, 1)), ...range(steps).map((t) => back(-1, 1 - t))],
    gusset(1),
    gusset(-1),
    sealOutline
  ];
  const footprint: V3[] = [front(-1, 0), front(1, 0), back(1, 0), back(-1, 0)];
  return { W, D, H, S, Hb, front, back, crease, seal, frontOutline, gusset, sealOutline, faces, footprint, rotate, range, steps };
}

export type BagModel = ReturnType<typeof bagModel>;

const fd = (f: (u: number, v: number) => V3, u: number, v: number): V3 => {
  const e = 0.01;
  const du = sub(f(Math.min(1, u + e), v), f(Math.max(-1, u - e), v));
  const dv = sub(f(u, Math.min(1, v + e)), f(u, Math.max(0, v - e)));
  return norm(cross(du, dv));
};

/** The multiply colour a surface takes at a given light level. */
const toneAt = (level: number, ambient: string) => mix(ambient, '#fffaf2', Math.min(1, Math.max(0, level / 0.72)));
/** How much sunlight lifts a surface above its printed colour. */
const liftAt = (level: number) => Math.max(0, (level - 0.72) / 0.28) * 0.3;
const SUN = '#ffeed6';

/**
 * One Grums bag, drawn with a camera and a light. Put it inside an <svg>.
 * `ambient` is the colour shadows lean towards; `sheen` is how glossy the
 * paper reads.
 */
export function BagShape({
  spec,
  cam,
  light,
  ambient = '#5e4436',
  sheen = 0.16
}: {
  spec: BagSpec;
  cam: Camera;
  light: V3;
  ambient?: string;
  sheen?: number;
}) {
  const id = useId().replaceAll(':', '');
  const m = bagModel(spec);
  const roast = ROASTS[spec.roast];
  const base = roast.bag;
  const toScreen = (p: V3) => cam.project(p);
  const toEye = (p: V3) => sub(cam.eye, p);

  // Which gusset faces the camera.
  const rightNormal = m.rotate([1, 0, 0]);
  const side = dot(rightNormal, toEye(m.front(1, 0.3))) > 0 ? 1 : -1;

  // Front panel shading across its width, and again at the shoulders.
  const across = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
  const bodyLevels = across.map((u) => lambert(fd(m.front, u, 0.32), light, 0.26));
  const shoulderLevels = across.map((u) => lambert(fd(m.front, u, 0.86), light, 0.26));
  const bodyStops = bodyLevels.map((l) => toneAt(l, ambient));
  const shoulderStops = shoulderLevels.map((l) => toneAt(l, ambient));
  const b0 = toScreen(m.front(-1, 0.32));
  const b1 = toScreen(m.front(1, 0.32));
  const s0 = toScreen(m.front(-1, 0.86));
  const s1 = toScreen(m.front(1, 0.86));
  const v0 = toScreen(m.front(0, 0.5));
  const v1 = toScreen(m.front(0, 0.97));

  const frontPath = path(m.frontOutline.map(toScreen));
  const gussetPts = (half: 'front' | 'back') =>
    half === 'front'
      ? [...m.range(m.steps).map((t) => m.front(side, t)), ...m.range(m.steps).map((t) => m.crease(side, 1 - t))]
      : [...m.range(m.steps).map((t) => m.crease(side, t)), ...m.range(m.steps).map((t) => m.back(side, 1 - t))];
  const gussetTone = (half: 'front' | 'back', v: number) => {
    const a = half === 'front' ? m.front(side, v) : m.back(side, v);
    const c = m.crease(side, v);
    const up = sub(half === 'front' ? m.front(side, v + 0.02) : m.back(side, v + 0.02), a);
    let n = norm(cross(sub(c, a), up));
    const outward = m.rotate([side, 0, 0]);
    if (dot(n, outward) < 0) n = [-n[0], -n[1], -n[2]];
    const level = lambert(n, light, 0.26);
    return mix(multiply(base, toneAt(level, ambient)), SUN, liftAt(level));
  };
  const g0 = toScreen(m.front(side, 0.15));
  const g1 = toScreen(m.front(side, 0.95));

  // Flat artwork mapped onto the panel.
  const labelW = 0.8 * m.W;
  const labelH = labelW * 1.04;
  const lv1 = 0.565;
  const lv0 = lv1 - labelH / m.Hb;
  const labelMatrix = affine(toScreen(m.front(-0.8, lv1)), toScreen(m.front(0.8, lv1)), toScreen(m.front(-0.8, lv0)), labelW, labelH);
  const printW = 1.7 * (m.W / 2);
  const pv1 = 0.82;
  const pv0 = 0.6;
  const printH = (pv1 - pv0) * m.Hb;
  const printMatrix = affine(toScreen(m.front(-0.85, pv1)), toScreen(m.front(0.85, pv1)), toScreen(m.front(-0.85, pv0)), printW, printH);
  const valveMatrix = affine(toScreen(m.front(-0.2, 0.94)), toScreen(m.front(0.2, 0.94)), toScreen(m.front(-0.2, 0.86)), 0.2 * m.W, 0.08 * m.Hb);
  const sealMatrix = affine(toScreen(m.seal(0, 1)), toScreen(m.seal(1, 1)), toScreen(m.seal(0, 0)), m.W, m.S);
  const sealLevel = lambert(m.rotate([0, -1, 0.05]), light);
  const sealFill = multiply(mix(base, '#ffffff', 0.04), toneAt(sealLevel, ambient));
  const curve = (pts: [number, number][]) => path(pts.map(([u, v]) => toScreen(m.front(u, v))), false);
  const zip = curve(m.range(24).map((t) => [-1 + 2 * t, 0.955]));
  const wrinkles = [
    curve([[-0.98, 0.995], [-0.86, 0.9], [-0.74, 0.78], [-0.66, 0.66]]),
    curve([[-0.9, 0.998], [-0.72, 0.93], [-0.52, 0.86]]),
    curve([[0.97, 0.995], [0.84, 0.88], [0.72, 0.74]]),
    curve([[0.92, 0.998], [0.7, 0.94], [0.48, 0.9]]),
    curve([[-0.18, 0.999], [-0.05, 0.95], [0.12, 0.92]])
  ];
  const leftEdge = path(m.range(m.steps).map((t) => toScreen(m.front(-1, t))), false);
  const sheenLine = path(m.range(10).map((t) => toScreen(m.front(-0.46, 0.1 + t * 0.62))), false);
  const date = spec.date ?? { dd: '04', mon: 'NOV', weekday: 'MONDAY' };

  return (
    <g>
      <defs>
        <linearGradient id={`body${id}`} gradientUnits='userSpaceOnUse' x1={b0[0]} y1={b0[1]} x2={b1[0]} y2={b1[1]}>
          {bodyStops.map((c, i) => (
            <stop key={across[i]} offset={i / (across.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`shoulder${id}`} gradientUnits='userSpaceOnUse' x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]}>
          {shoulderStops.map((c, i) => (
            <stop key={across[i]} offset={i / (across.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`lift${id}`} gradientUnits='userSpaceOnUse' x1={b0[0]} y1={b0[1]} x2={b1[0]} y2={b1[1]}>
          {bodyLevels.map((l, i) => (
            <stop key={across[i]} offset={i / (across.length - 1)} stopColor={SUN} stopOpacity={liftAt(l)} />
          ))}
        </linearGradient>
        <linearGradient id={`liftTop${id}`} gradientUnits='userSpaceOnUse' x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]}>
          {shoulderLevels.map((l, i) => (
            <stop key={across[i]} offset={i / (across.length - 1)} stopColor={SUN} stopOpacity={liftAt(l)} />
          ))}
        </linearGradient>
        <filter id={`crease${id}`} x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation={m.W * 0.012} />
        </filter>
        <linearGradient id={`fade${id}`} gradientUnits='userSpaceOnUse' x1={v0[0]} y1={v0[1]} x2={v1[0]} y2={v1[1]}>
          <stop offset='0' stopColor='#fff' stopOpacity='0' />
          <stop offset='0.55' stopColor='#fff' stopOpacity='1' />
        </linearGradient>
        <mask id={`top${id}`}>
          <rect x='-5000' y='-5000' width='10000' height='10000' fill={`url(#fade${id})`} />
        </mask>
        <linearGradient id={`gf${id}`} gradientUnits='userSpaceOnUse' x1={g0[0]} y1={g0[1]} x2={g1[0]} y2={g1[1]}>
          <stop offset='0' stopColor={gussetTone('front', 0.15)} />
          <stop offset='0.55' stopColor={gussetTone('front', 0.6)} />
          <stop offset='1' stopColor={gussetTone('front', 0.95)} />
        </linearGradient>
        <linearGradient id={`gb${id}`} gradientUnits='userSpaceOnUse' x1={g0[0]} y1={g0[1]} x2={g1[0]} y2={g1[1]}>
          <stop offset='0' stopColor={gussetTone('back', 0.15)} />
          <stop offset='0.55' stopColor={gussetTone('back', 0.6)} />
          <stop offset='1' stopColor={gussetTone('back', 0.95)} />
        </linearGradient>
        <clipPath id={`clip${id}`}>
          <path d={frontPath} />
        </clipPath>
        <filter id={`blur${id}`} x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation={m.W * 0.06} />
        </filter>
      </defs>

      {/* Side gusset, back half first. */}
      <path d={path(gussetPts('back').map(toScreen))} fill={`url(#gb${id})`} />
      <path d={path(gussetPts('front').map(toScreen))} fill={`url(#gf${id})`} />
      <path
        d={path(m.range(m.steps).map((t) => toScreen(m.crease(side, t))), false)}
        fill='none'
        stroke='#000'
        strokeOpacity={0.16}
        strokeWidth={0.8}
      />

      {/* Front panel with its print and label. */}
      <g clipPath={`url(#clip${id})`} style={{ isolation: 'isolate' }}>
        <rect x={-5000} y={-5000} width={10000} height={10000} fill={base} />
        <g transform={printMatrix}>
          <BagPrint width={printW} height={printH} ink={roast.print} />
        </g>
        <g transform={labelMatrix}>
          <Label width={labelW} roast={spec.roast} size={spec.size} date={date} method={spec.method} />
        </g>
        <g transform={valveMatrix}>
          <Valve w={0.2 * m.W} h={0.08 * m.Hb} base={base} />
        </g>
        <path d={zip} fill='none' stroke='#000' strokeOpacity={0.16} strokeWidth={1.1} />
        <path d={zip} fill='none' stroke='#fff' strokeOpacity={0.2} strokeWidth={0.8} transform='translate(0 1.3)' />
        {/* Light and shade over everything printed. */}
        <path d={frontPath} fill={`url(#body${id})`} style={{ mixBlendMode: 'multiply' }} />
        <path d={frontPath} fill={`url(#shoulder${id})`} mask={`url(#top${id})`} style={{ mixBlendMode: 'multiply' }} />
        <path d={frontPath} fill={`url(#lift${id})`} style={{ mixBlendMode: 'screen' }} />
        <path d={frontPath} fill={`url(#liftTop${id})`} mask={`url(#top${id})`} style={{ mixBlendMode: 'screen' }} />
        <path
          d={sheenLine}
          fill='none'
          stroke='#fff'
          strokeWidth={m.W * 0.22}
          strokeLinecap='round'
          opacity={sheen * 0.8}
          filter={`url(#blur${id})`}
          style={{ mixBlendMode: 'screen' }}
        />
        <g filter={`url(#crease${id})`}>
          {wrinkles.map((d) => (
            <g key={d}>
              <path d={d} fill='none' stroke='#000' strokeOpacity={0.16} strokeWidth={m.W * 0.022} strokeLinecap='round' />
              <path d={d} fill='none' stroke='#fff' strokeOpacity={0.14} strokeWidth={m.W * 0.016} strokeLinecap='round' transform={`translate(${m.W * 0.02} ${m.W * 0.006})`} />
            </g>
          ))}
        </g>
        <path
          d={path([...m.range(8).map((t) => toScreen(m.front(-1 + 2 * t, 0))), ...m.range(8).map((t) => toScreen(m.front(1 - 2 * t, 0.035)))])}
          fill='#000'
          opacity={0.16}
        />
      </g>
      <path d={leftEdge} fill='none' stroke='#fff' strokeOpacity={0.22} strokeWidth={1} />

      {/* Crimped heat seal. */}
      <path d={path(m.sealOutline.map(toScreen))} fill={sealFill} />
      <g transform={sealMatrix}>
        <Crimp w={m.W} h={m.S} />
      </g>
    </g>
  );
}

/** The bag's printed face: wordmark and roastery line. */
function BagPrint({ width, height, ink }: { width: number; height: number; ink: string }) {
  const size = width * 0.34;
  return (
    <g fill={ink}>
      <text
        x={width / 2}
        y={height * 0.66}
        textAnchor='middle'
        fontSize={size}
        style={{ fontFamily: G.display, fontWeight: 900, fontVariationSettings: wonk(144, 100, 1), letterSpacing: '-0.02em' }}
      >
        grums
      </text>
      <text
        x={width / 2}
        y={height * 0.9}
        textAnchor='middle'
        fontSize={width * 0.045}
        style={{ fontFamily: G.sans, fontWeight: 600, letterSpacing: '0.22em' }}
      >
        KAFFEBRENNERI · TRONDHEIM
      </text>
    </g>
  );
}

function Valve({ w, h, base }: { w: number; h: number; base: string }) {
  const r = Math.min(w, h) * 0.42;
  return (
    <g transform={`translate(${w / 2} ${h / 2})`}>
      <circle r={r} fill={mix(base, '#000000', 0.12)} />
      <circle r={r * 0.78} fill={mix(base, '#ffffff', 0.08)} />
      <circle r={r * 0.78} fill='none' stroke='#000' strokeOpacity={0.18} strokeWidth={r * 0.08} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={Math.cos((i / 5) * Math.PI * 2) * r * 0.36} cy={Math.sin((i / 5) * Math.PI * 2) * r * 0.36} r={r * 0.07} fill='#000' opacity={0.3} />
      ))}
    </g>
  );
}

function Crimp({ w, h }: { w: number; h: number }) {
  const lines = Math.round(w / 1.5);
  return (
    <g>
      {Array.from({ length: lines }, (_, i) => {
        const x = (i + 0.5) * (w / lines);
        return (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={h * 0.12}
            y2={h * 0.86}
            stroke={i % 2 ? '#fff' : '#000'}
            strokeOpacity={i % 2 ? 0.16 : 0.15}
            strokeWidth={w / lines / 2.2}
          />
        );
      })}
      <line x1={0} x2={w} y1={h * 0.92} y2={h * 0.92} stroke='#000' strokeOpacity={0.18} strokeWidth={0.6} />
      <line x1={0} x2={w} y1={h * 0.08} y2={h * 0.08} stroke='#fff' strokeOpacity={0.22} strokeWidth={0.5} />
    </g>
  );
}

/**
 * The label, flat. Every bag carries one, printed in the roastery on
 * roasting day: the date first, then the coffee, then how to brew it.
 */
export function Label({
  width,
  roast,
  size,
  date,
  method,
  flat
}: {
  width: number;
  roast: Roast;
  size: Size;
  date: { dd: string; mon: string; weekday: string };
  method?: Method;
  /** Drawn on its own, with a crisp edge rather than a sticker shadow. */
  flat?: boolean;
}) {
  const k = width / 100;
  const r = ROASTS[roast];
  const height = width * 1.04;
  const brew = method ? METHODS[method] : null;
  const sans = (weight: number, sizeK: number, extra?: React.CSSProperties): React.CSSProperties => ({
    fontFamily: G.sans,
    fontWeight: weight,
    fontSize: sizeK * k,
    ...extra
  });
  const caps = { letterSpacing: '0.14em' };
  return (
    <g>
      {flat ? null : <rect x={0.4 * k} y={0.8 * k} width={width} height={height} rx={1.6 * k} fill='#000' opacity={0.12} />}
      <rect width={width} height={height} rx={1.6 * k} fill='#F6EFE3' />
      <rect width={width} height={height} rx={1.6 * k} fill='none' stroke='#000' strokeOpacity={0.08} strokeWidth={0.3 * k} />
      <g fill={G.espresso}>
        <text x={6 * k} y={10 * k} style={sans(600, 3.9, caps)}>
          ROASTED ON
        </text>
        <text x={94 * k} y={10 * k} textAnchor='end' style={sans(600, 3.9, caps)}>
          {date.weekday}
        </text>
        <text
          x={4.4 * k}
          y={47.5 * k}
          fill={G.tomato}
          style={{ fontFamily: G.display, fontWeight: 900, fontSize: 44 * k, letterSpacing: '-0.03em', fontVariationSettings: wonk(144, 100, 1) }}
        >
          {date.dd}
        </text>
        <text
          x={94 * k}
          y={30 * k}
          textAnchor='end'
          fill={G.tomato}
          style={{ fontFamily: G.display, fontWeight: 900, fontSize: 17 * k, letterSpacing: '-0.01em', fontVariationSettings: wonk(144, 100, 1) }}
        >
          {date.mon}
        </text>
        <text x={94 * k} y={38.5 * k} textAnchor='end' style={sans(600, 4.6, { letterSpacing: '0.06em' })}>
          2024
        </text>
        <rect x={6 * k} y={54 * k} width={88 * k} height={0.45 * k} />
        <text x={6 * k} y={66 * k} style={{ fontFamily: G.display, fontWeight: 700, fontSize: 10.5 * k, letterSpacing: '-0.01em', fontVariationSettings: wonk(48, 60, 1) }}>
          {r.coffee}
        </text>
        <text x={6 * k} y={73.5 * k} style={sans(500, 4.3)}>
          {r.origin} · {r.process}
        </text>
        <text x={6 * k} y={79.3 * k} style={sans(400, 4.3)} opacity={0.8}>
          {r.notes}
        </text>
        <rect x={6 * k} y={84 * k} width={88 * k} height={0.45 * k} />
        <text x={6 * k} y={91.2 * k} style={sans(700, 3.8, caps)}>
          {r.label.toUpperCase()} {roast === 'decaf' ? '' : 'ROAST'}
        </text>
        <text
          x={94 * k}
          y={92 * k}
          textAnchor='end'
          style={{ fontFamily: G.display, fontWeight: 800, fontSize: 8.5 * k, fontVariationSettings: wonk(72, 100, 1) }}
        >
          {size === 1000 ? '1 kg' : `${size} g`}
        </text>
        <text x={6 * k} y={98.6 * k} style={sans(500, 3.8)}>
          {brew ? `${brew.label}: ${brew.guide}` : 'Filter 15 g to 250 ml · Espresso 18 g to 36 g'}
        </text>
      </g>
    </g>
  );
}

/** The bag's outline on screen, for anything that needs to sit behind or on it. */
export function bagScreenFront(m: BagModel, cam: Camera): V2[] {
  return m.frontOutline.map((p) => cam.project(p));
}

/**
 * Bags on their own, in soft studio light, for the shop and the builder.
 * The 1 kg bag fills `height`, so smaller bags read smaller.
 */
export function BagArt({
  roast,
  size,
  count = 1,
  date,
  method,
  height = 220,
  width,
  yaw = -0.32,
  shadow = '#3a1e10'
}: {
  roast: Roast;
  size: Size;
  count?: number;
  date?: BagSpec['date'];
  method?: Method;
  height?: number;
  width?: number;
  yaw?: number;
  shadow?: string;
}) {
  const id = useId().replaceAll(':', '');
  const ref = BAG_DIMS[1000].H;
  const k = (height * 0.84) / ref;
  const shown = Math.min(count, 3);
  const dims = BAG_DIMS[size];
  const spread = dims.W * 0.62;
  const w = width ?? Math.round(height * 0.9 + (shown - 1) * spread * k);
  const eye: V3 = [-200, -3000, 760];
  const target: V3 = [0, 0, ref * 0.46];
  const dist = Math.hypot(eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]);
  const cam = camera({ eye, target, focal: k * dist, center: [w / 2 - 6 * k, height * 0.47] });
  const light = sun(38, 34);
  const floor = sun(30, 58);
  const specs: BagSpec[] = Array.from({ length: shown }, (_, i) => ({
    roast,
    size,
    at: [(i - (shown - 1) / 2) * spread, (shown - 1 - i) * 34 - 0],
    yaw: yaw + i * 0.05,
    date,
    method
  }));
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} aria-hidden='true' style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`s${id}`} x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation={10 * k} />
        </filter>
        <filter id={`c${id}`} x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation={3 * k} />
        </filter>
      </defs>
      {specs.map((spec, i) => {
        const m = bagModel(spec);
        return (
          <g key={i}>
            <g filter={`url(#s${id})`} opacity={0.16} fill={shadow}>
              {m.faces.map((face, j) => (
                <path key={j} d={path(face.map((p) => cam.project(castOnto(p, floor, TABLE))))} />
              ))}
            </g>
            <path d={path(m.footprint.map(cam.project))} fill={shadow} opacity={0.45} filter={`url(#c${id})`} />
          </g>
        );
      })}
      {specs.map((spec, i) => (
        <BagShape key={i} spec={spec} cam={cam} light={light} ambient='#6a5244' sheen={0.12} />
      ))}
    </svg>
  );
}
