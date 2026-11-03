import type * as React from 'react';
import { useId } from 'react';
import { seeded } from '~/components/art/random';
import { type Camera, type V2, type V3, add, dot, lambert, mix, multiply, norm, path, sub } from './space';
import type { Thing } from './Stage';

const circle = (c: V3, r: number, n = 48): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]];
  });

/** A stoneware cup of coffee on its saucer. */
export function cup({
  at,
  cam,
  light,
  handle = -0.45,
  glaze = '#e3d3bd',
  rim = '#6f4c34',
  key = 'cup'
}: {
  at: [number, number];
  cam: Camera;
  light: V3;
  /** Angle of the handle around the cup, radians from +x. */
  handle?: number;
  glaze?: string;
  rim?: string;
  key?: string;
}): Thing {
  const P = cam.project;
  const R = 74;
  const sz = 9;
  const base = 27;
  const top = 42;
  const Hc = 58;
  const radius = (t: number) => base + (top - base) * t ** 0.62;
  const c0: V3 = [at[0], at[1], 0];
  const ring = (t: number, n = 64) => circle([at[0], at[1], sz + t * Hc], radius(t), n);
  const view = norm(sub(cam.eye, c0));

  // Silhouette of the flared body: the extreme points of each ring on screen.
  const heights = Array.from({ length: 13 }, (_, i) => i / 12);
  const extremes = heights.map((t) => {
    const pts = ring(t).map(P);
    let left = pts[0];
    let right = pts[0];
    for (const p of pts) {
      if (p[0] < left[0]) left = p;
      if (p[0] > right[0]) right = p;
    }
    return { left, right };
  });
  const rimPts = ring(1).map(P);
  const basePts = ring(0).map(P);
  const nearHalf = (pts: V2[]) => pts.filter((_, i) => Math.sin((i / pts.length) * Math.PI * 2) < 0);
  const farHalf = (pts: V2[]) => pts.filter((_, i) => Math.sin((i / pts.length) * Math.PI * 2) >= 0);
  const sortX = (pts: V2[], dir: 1 | -1) => [...pts].sort((a, b) => (a[0] - b[0]) * dir);
  const body = [
    ...extremes.map((e) => e.left),
    ...sortX(farHalf(rimPts), 1),
    ...[...extremes].reverse().map((e) => e.right),
    ...sortX(nearHalf(basePts), -1)
  ];

  // Shade across the body: diffuse plus a glaze highlight.
  const half = norm(add(light, view));
  const stops = Array.from({ length: 15 }, (_, i) => {
    const a = Math.PI + (i / 14) * Math.PI; // left, through front, to right
    const n: V3 = norm([Math.cos(a), Math.sin(a), 0.18]);
    const diffuse = lambert(n, light, 0.36);
    const spec = Math.max(0, dot(n, half)) ** 60;
    const tone = mix(mix('#6d5649', '#ffffff', Math.min(1, diffuse / 0.85)), '#ffffff', 0);
    return { offset: i / 14, color: mix(multiply(glaze, tone), '#fffdf8', spec * 0.85) };
  });
  const midL = extremes[6].left;
  const midR = extremes[6].right;

  const saucerTop = circle([at[0], at[1], sz], R, 72);
  const saucerBottom = circle([at[0], at[1], 0], R * 0.8, 72);
  const saucerSide = [...sortX(nearHalf(saucerTop.map(P)), 1), ...sortX(nearHalf(saucerBottom.map(P)), -1)];

  const liquid = circle([at[0], at[1], sz + Hc * 0.86], radius(0.86) - 1, 64).map(P);
  const glint = P([at[0] - 12, at[1] - 10, sz + Hc * 0.86]);

  const hp = (s: number): V3 => {
    const t = 0.78 - s * 0.5;
    const out = radius(t) + 15 * Math.sin(Math.PI * s) ** 0.8 - 2;
    return [at[0] + Math.cos(handle) * out, at[1] + Math.sin(handle) * out, sz + t * Hc];
  };
  const handlePts = Array.from({ length: 17 }, (_, i) => hp(i / 16));
  const handleFront = Math.sin(handle) < 0;
  const handleTone = multiply(glaze, mix('#6d5649', '#ffffff', 0.55));
  const handleDraw = (
    <g>
      <path d={path(handlePts.map(P), false)} fill='none' stroke={handleTone} strokeWidth={7.5} strokeLinecap='round' />
      <path d={path(handlePts.map(P), false)} fill='none' stroke='#fff' strokeOpacity={0.35} strokeWidth={1.4} strokeLinecap='round' transform='translate(-1.2 -1.6)' />
    </g>
  );
  const id = `${key}`;

  return {
    key,
    depth: cam.depth(c0),
    footprint: circle([at[0], at[1], 0], R * 0.82, 24),
    contact: 0.9,
    solids: [saucerTop, [...ring(0, 24), ...ring(1, 24)]],
    strokes: [{ points: handlePts, width: 6 }],
    draw: (
      <CupArt
        id={id}
        saucerSide={saucerSide}
        saucerTop={saucerTop.map(P)}
        well={circle([at[0], at[1], sz - 1.5], base + 4, 48).map(P)}
        body={body}
        stops={stops}
        midL={midL}
        midR={midR}
        rim={rimPts}
        rimColour={rim}
        liquid={liquid}
        glint={glint}
        glaze={glaze}
        handleBehind={handleFront ? null : handleDraw}
        handleFront={handleFront ? handleDraw : null}
      />
    )
  };
}

function CupArt({
  id: _id,
  saucerSide,
  saucerTop,
  well,
  body,
  stops,
  midL,
  midR,
  rim,
  rimColour,
  liquid,
  glint,
  glaze,
  handleBehind,
  handleFront
}: {
  id: string;
  saucerSide: V2[];
  saucerTop: V2[];
  well: V2[];
  body: V2[];
  stops: { offset: number; color: string }[];
  midL: V2;
  midR: V2;
  rim: V2[];
  rimColour: string;
  liquid: V2[];
  glint: V2;
  glaze: string;
  handleBehind: React.ReactNode;
  handleFront: React.ReactNode;
}) {
  const id = useId().replaceAll(':', '');
  const xs = saucerTop.map((p) => p[0]);
  const ys = saucerTop.map((p) => p[1]);
  const sx0 = Math.min(...xs);
  const sx1 = Math.max(...xs);
  const sy0 = Math.min(...ys);
  const sy1 = Math.max(...ys);
  const lx = liquid.map((p) => p[0]);
  const ly = liquid.map((p) => p[1]);
  const cx = (Math.min(...lx) + Math.max(...lx)) / 2;
  const cy = (Math.min(...ly) + Math.max(...ly)) / 2;
  const rx = (Math.max(...lx) - Math.min(...lx)) / 2;
  const ry = (Math.max(...ly) - Math.min(...ly)) / 2;
  return (
    <g>
      <defs>
        <linearGradient id={`b${id}`} gradientUnits='userSpaceOnUse' x1={midL[0]} y1={0} x2={midR[0]} y2={0}>
          {stops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id={`s${id}`} gradientUnits='userSpaceOnUse' x1={sx0} y1={sy0} x2={sx1} y2={sy1}>
          <stop offset='0' stopColor={mix(glaze, '#ffffff', 0.35)} />
          <stop offset='0.6' stopColor={glaze} />
          <stop offset='1' stopColor={multiply(glaze, '#c9b8a8')} />
        </linearGradient>
        <linearGradient id={`i${id}`} gradientUnits='userSpaceOnUse' x1={cx - rx} y1={cy} x2={cx + rx} y2={cy}>
          <stop offset='0' stopColor={multiply(glaze, '#8f7a6c')} />
          <stop offset='1' stopColor={mix(glaze, '#ffffff', 0.4)} />
        </linearGradient>
        <radialGradient id={`c${id}`} cx={cx} cy={cy} r={rx} gradientUnits='userSpaceOnUse' gradientTransform={`translate(${cx} ${cy}) scale(1 ${ry / rx}) translate(${-cx} ${-cy})`}>
          <stop offset='0' stopColor='#2a120a' />
          <stop offset='0.72' stopColor='#3c1d0f' />
          <stop offset='0.92' stopColor='#7a4a2a' />
          <stop offset='1' stopColor='#a27148' />
        </radialGradient>
        <filter id={`g${id}`} x='-100%' y='-100%' width='300%' height='300%'>
          <feGaussianBlur stdDeviation={1.2} />
        </filter>
      </defs>
      <path d={path(saucerSide)} fill={multiply(glaze, '#9c8878')} />
      <path d={path(saucerTop)} fill={`url(#s${id})`} />
      <path d={path(saucerTop)} fill='none' stroke='#fff' strokeOpacity={0.4} strokeWidth={1} />
      <path d={path(well)} fill='none' stroke='#000' strokeOpacity={0.1} strokeWidth={1.2} />
      {handleBehind}
      <path d={path(body)} fill={`url(#b${id})`} />
      <path d={path(rim)} fill={`url(#i${id})`} />
      <path d={path(liquid)} fill={`url(#c${id})`} />
      <ellipse cx={glint[0]} cy={glint[1]} rx={rx * 0.16} ry={ry * 0.11} fill='#fff7e6' opacity={0.85} filter={`url(#g${id})`} />
      <path d={path(rim)} fill='none' stroke={rimColour} strokeOpacity={0.55} strokeWidth={1.6} />
      <path d={path(rim)} fill='none' stroke='#fff' strokeOpacity={0.5} strokeWidth={0.8} transform='translate(0 -0.8)' />
      {handleFront}
    </g>
  );
}

/** Roasted beans scattered on the table. */
export function beans({ cam, light, around, spread, count, seed = 3 }: { cam: Camera; light: V3; around: [number, number]; spread: [number, number]; count: number; seed?: number }): Thing[] {
  const random = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const x = around[0] + (random() - 0.5) * spread[0];
    const y = around[1] + (random() - 0.5) * spread[1];
    const angle = random() * Math.PI;
    const flat = random() < 0.55;
    const a = 8.4;
    const b = 6;
    const outline = (z: number, k = 1) =>
      Array.from({ length: 20 }, (_, j): V3 => {
        const t = (j / 20) * Math.PI * 2;
        const ex = Math.cos(t) * a * k;
        const ey = Math.sin(t) * b * k;
        return [x + ex * Math.cos(angle) - ey * Math.sin(angle), y + ex * Math.sin(angle) + ey * Math.cos(angle), z];
      });
    const top = outline(3.6);
    const crease: V3[] = Array.from({ length: 7 }, (_, j) => {
      const t = j / 6 - 0.5;
      const ex = t * a * 1.5;
      const ey = Math.sin(t * Math.PI * 2) * 0.8;
      return [x + ex * Math.cos(angle) - ey * Math.sin(angle), y + ex * Math.sin(angle) + ey * Math.cos(angle), 3.9];
    });
    const lit = lambert([0, 0, 1], light, 0.4);
    const colour = mix('#2a140b', '#5a2f18', lit * 0.8);
    return {
      key: `bean${i}`,
      depth: cam.depth([x, y, 0]),
      solids: [[...outline(0.5, 0.9), ...outline(4.2, 0.7)]],
      footprint: outline(0, 0.9),
      contact: 0.7,
      draw: (
        <g>
          <path d={path(top.map(cam.project))} fill={colour} />
          <path d={path(outline(4.2, 0.55).map(cam.project))} fill='#8a5530' opacity={0.35} transform='translate(-0.8 -0.6)' />
          {flat ? (
            <path d={path(crease.map(cam.project), false)} fill='none' stroke='#120804' strokeWidth={1.1} strokeLinecap='round' />
          ) : (
            <path d={path(crease.map(cam.project), false)} fill='none' stroke='#c08a5a' strokeOpacity={0.35} strokeWidth={1.2} strokeLinecap='round' transform='translate(-0.6 -0.8)' />
          )}
        </g>
      )
    } satisfies Thing;
  });
}

/**
 * Grums's letterbox box, closed, lying on the table: kraft board, printed
 * top, a tear strip along the front and Posten's label.
 */
export function mailer({
  at,
  yaw,
  cam,
  light,
  size = [330, 236, 62],
  key = 'box',
  top
}: {
  at: [number, number];
  yaw: number;
  cam: Camera;
  light: V3;
  size?: V3;
  key?: string;
  /** Artwork for the lid, drawn in a size[0] × size[1] box. */
  top: React.ReactNode;
}): Thing {
  const [L, Wd, Ht] = size;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const w = (x: number, y: number, z: number): V3 => [at[0] + x * c - y * s, at[1] + x * s + y * c, z];
  const corners = [
    w(-L / 2, -Wd / 2, 0), w(L / 2, -Wd / 2, 0), w(L / 2, Wd / 2, 0), w(-L / 2, Wd / 2, 0),
    w(-L / 2, -Wd / 2, Ht), w(L / 2, -Wd / 2, Ht), w(L / 2, Wd / 2, Ht), w(-L / 2, Wd / 2, Ht)
  ];
  const P = cam.project;
  const kraft = '#c49a69';
  const faces = [
    { pts: [4, 5, 6, 7], n: [0, 0, 1] as V3 },
    { pts: [0, 1, 5, 4], n: [s, -c, 0] as V3 },
    { pts: [1, 2, 6, 5], n: [c, s, 0] as V3 },
    { pts: [3, 0, 4, 7], n: [-c, -s, 0] as V3 },
    { pts: [2, 3, 7, 6], n: [-s, c, 0] as V3 }
  ];
  const visible = faces.filter((f) => dot(f.n, sub(cam.eye, corners[f.pts[0]])) > 0);
  const tone = (n: V3) => {
    const level = lambert(n, light, 0.3);
    return level > 0.72 ? mix(kraft, '#ffeed6', ((level - 0.72) / 0.28) * 0.25) : multiply(kraft, mix('#62493a', '#fffaf2', level / 0.72));
  };
  const topMatrix = (() => {
    const tl = P(corners[7]);
    const tr = P(corners[6]);
    const bl = P(corners[4]);
    const a = (tr[0] - tl[0]) / L;
    const b = (tr[1] - tl[1]) / L;
    const cc = (bl[0] - tl[0]) / Wd;
    const d = (bl[1] - tl[1]) / Wd;
    return `matrix(${a} ${b} ${cc} ${d} ${tl[0]} ${tl[1]})`;
  })();
  const frontMatrix = (() => {
    const tl = P(corners[4]);
    const tr = P(corners[5]);
    const bl = P(corners[0]);
    return `matrix(${(tr[0] - tl[0]) / L} ${(tr[1] - tl[1]) / L} ${(bl[0] - tl[0]) / Ht} ${(bl[1] - tl[1]) / Ht} ${tl[0]} ${tl[1]})`;
  })();
  const topLevel = lambert([0, 0, 1], light, 0.3);
  const frontVisible = visible.some((f) => f.pts[0] === 0);
  return {
    key,
    depth: cam.depth(w(0, 0, 0)),
    solids: [corners],
    footprint: corners.slice(0, 4),
    contact: 1,
    draw: (
      <g>
        {visible.map((f) => (
          <path key={f.pts.join()} d={path(f.pts.map((i) => P(corners[i])))} fill={tone(f.n)} />
        ))}
        <g transform={topMatrix}>
          <rect width={L} height={Wd} fill={kraft} />
          {top}
          <rect width={L} height={Wd} fill={mix('#62493a', '#fffaf2', Math.min(1, topLevel / 0.72))} style={{ mixBlendMode: 'multiply' }} />
          <rect width={L} height={Wd} fill='#ffeed6' opacity={Math.max(0, (topLevel - 0.72) / 0.28) * 0.22} style={{ mixBlendMode: 'screen' }} />
          <rect width={L} height={Wd} fill='none' stroke='#fff' strokeOpacity={0.3} strokeWidth={1.2} />
        </g>
        {frontVisible ? (
          <g transform={frontMatrix}>
            <rect y={Ht * 0.3} width={L} height={Ht * 0.2} fill='#000' opacity={0.06} />
            <line x1={0} x2={L} y1={Ht * 0.3} y2={Ht * 0.3} stroke='#000' strokeOpacity={0.22} strokeWidth={0.8} strokeDasharray='3 2' />
            <line x1={0} x2={L} y1={Ht * 0.5} y2={Ht * 0.5} stroke='#000' strokeOpacity={0.22} strokeWidth={0.8} strokeDasharray='3 2' />
            <text x={14} y={Ht * 0.44} fontSize={Ht * 0.12} fill={G2.espresso} opacity={0.7} style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, letterSpacing: '0.2em' }}>
              PULL TO OPEN →
            </text>
            <text x={L - 14} y={Ht * 0.82} textAnchor='end' fontSize={Ht * 0.12} fill={G2.espresso} opacity={0.55} style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, letterSpacing: '0.14em' }}>
              GRUMS KAFFE AS · SVARTLAMON · TRONDHEIM
            </text>
          </g>
        ) : null}
      </g>
    )
  };
}

const G2 = { espresso: '#2A1911', tomato: '#E2432C', cream: '#F3EBDC' };
