import type * as React from 'react';
import { useId } from 'react';
import { Grain } from '~/components/art/Grain';
import { loop } from '~/components/art/random';
import { G } from './model';
import { BindingsPlane, DatabasePlane, PH, PORTS, PW, QueriesPlane, ToolPlane } from './Planes';

type Point = [number, number];

export type View = {
  /** Tilt and turn of the stack, in degrees. */
  rx: number;
  rz: number;
  /** Scale of every plane. */
  k: number;
  /** Distance between planes, in plane pixels. */
  gap: number;
  /** Distance from the lowest plane to the ground its shadow falls on. */
  ground: number;
  /** Screen position of the middle of the stack. */
  cx: number;
  cy: number;
  /** Where shadows fall, in plane pixels per pixel of height. */
  light: [number, number];
  /** Slab thickness. */
  thickness: number;
};

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Same maths as the CSS transform below, so SVG lines meet the planes exactly. */
function projector(view: View) {
  const a = rad(view.rx);
  const b = rad(view.rz);
  const mid = (view.gap * 3) / 2;
  return (x: number, y: number, z: number): Point => {
    const u = x - PW / 2;
    const v = y - PH / 2;
    const x1 = u * Math.cos(b) - v * Math.sin(b);
    const y1 = u * Math.sin(b) + v * Math.cos(b);
    const y2 = y1 * Math.cos(a) - (z - mid) * Math.sin(a);
    return [view.cx + view.k * x1, view.cy + view.k * y2];
  };
}

function planeStyle(view: View, z: number): React.CSSProperties {
  const mid = (view.gap * 3) / 2;
  return {
    position: 'absolute',
    left: view.cx - PW / 2,
    top: view.cy - PH / 2,
    width: PW,
    height: PH,
    transformOrigin: '50% 50%',
    transform: `scale(${view.k}) rotateX(${view.rx}deg) rotateZ(${view.rz}deg) translateZ(${z - mid}px)`
  };
}

const poly = (points: Point[]) => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

function corners(project: ReturnType<typeof projector>, z: number, dx = 0, dy = 0): Point[] {
  return [
    project(dx, dy, z),
    project(PW + dx, dy, z),
    project(PW + dx, PH + dy, z),
    project(dx, PH + dy, z)
  ];
}

const LAYERS = [
  { key: 'data', label: 'Database', Plane: DatabasePlane, side: '#000000', shade: 0 },
  { key: 'queries', label: 'Queries', Plane: QueriesPlane, side: '#C9C5BB', shade: 0.16 },
  { key: 'bindings', label: 'Bindings', Plane: BindingsPlane, side: '#B9C0D2', shade: 0.14 },
  { key: 'tool', label: 'Interface', Plane: ToolPlane, side: '#CFCCC3', shade: 0 }
] as const;

/**
 * The refund tool pulled apart into the four layers Gantry keeps in view:
 * the interface, its bindings, the queries and the database underneath.
 */
export function Stack({
  view,
  width,
  height,
  pulse,
  labels
}: {
  view: View;
  width: number;
  height: number;
  /** 0–1 along the chain from the interface to the database; omit for none. */
  pulse?: number;
  /** Name each layer beside its left corner. */
  labels?: boolean;
}) {
  const id = useId().replaceAll(':', '');
  const project = projector(view);
  const zs = LAYERS.map((_, index) => index * view.gap);
  const ground = -view.ground;
  const [lx, ly] = view.light;
  const svg = { position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' } as const;

  const ports = [PORTS.table, PORTS.form];
  const top = zs[3];
  const pulseZ = pulse === undefined ? undefined : top - pulse * top;

  return (
    <>
      {/* Shadows on the ground, longer and softer the higher the plane. */}
      <svg width={width} height={height} style={svg} aria-hidden='true'>
        <defs>
          {zs.map((z, index) => (
            <filter key={z} id={`gs${id}${index}`} x='-30%' y='-30%' width='160%' height='160%'>
              <feGaussianBlur stdDeviation={(6 + (z - ground) * 0.11) * view.k} />
            </filter>
          ))}
        </defs>
        {zs.map((z, index) => {
          const h = z - ground;
          return (
            <polygon
              key={z}
              points={poly(corners(project, ground, lx * h, ly * h))}
              fill='rgb(110,24,0)'
              opacity={0.34 - index * 0.045}
              filter={`url(#gs${id}${index})`}
            />
          );
        })}
      </svg>

      {LAYERS.map(({ key, Plane, side, shade }, index) => {
        const z = zs[index];
        const t = view.thickness;
        const [tl, tr, br, bl] = corners(project, z);
        const [tlb, , brb, blb] = corners(project, z - t);
        const next = zs[index + 1];
        return (
          <div key={key}>
            {/* The slab's front faces. */}
            <svg width={width} height={height} style={svg} aria-hidden='true'>
              <polygon points={poly([tl, bl, blb, tlb])} fill={side} />
              <polygon points={poly([bl, br, brb, blb])} fill={side} style={{ filter: 'brightness(0.86)' }} />
            </svg>
            <div style={planeStyle(view, z)}>
              <Plane />
            </div>
            {/* The shadow of the plane above, falling on this one. */}
            {next !== undefined && shade ? (
              <svg width={width} height={height} style={svg} aria-hidden='true'>
                <defs>
                  <clipPath id={`clip${id}${index}`}>
                    <polygon points={poly([tl, tr, br, bl])} />
                  </clipPath>
                  <filter id={`ps${id}${index}`} x='-30%' y='-30%' width='160%' height='160%'>
                    <feGaussianBlur stdDeviation={18 * view.k} />
                  </filter>
                </defs>
                <g clipPath={`url(#clip${id}${index})`}>
                  <polygon
                    points={poly(corners(project, z, lx * view.gap, ly * view.gap))}
                    fill='rgb(60,40,20)'
                    opacity={shade}
                    filter={`url(#ps${id}${index})`}
                  />
                </g>
              </svg>
            ) : null}
            {/* Bindings running up to the next plane. */}
            {next !== undefined ? (
              <svg width={width} height={height} style={svg} aria-hidden='true'>
                {ports.map((port) => {
                  const [x1, y1] = project(port.x, port.y, z);
                  const [x2, y2] = project(port.x, port.y, next);
                  const showPulse = pulseZ !== undefined && pulseZ <= next && pulseZ >= z;
                  const [px, py] = showPulse ? project(port.x, port.y, pulseZ) : [0, 0];
                  return (
                    <g key={port.x}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={G.ink} strokeWidth={1.6} />
                      {showPulse ? (
                        <>
                          <circle cx={px} cy={py} r={9} fill='#fff' opacity={0.35} />
                          <circle cx={px} cy={py} r={4} fill='#fff' stroke={G.ink} strokeWidth={1.5} />
                        </>
                      ) : null}
                    </g>
                  );
                })}
              </svg>
            ) : null}
          </div>
        );
      })}

      {labels
        ? LAYERS.map(({ key, label }, index) => {
            const [x, y] = project(0, 0, zs[index]);
            return (
              <div
                key={key}
                style={{
                  position: 'absolute',
                  right: width - x + 14,
                  top: y - 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: G.mono,
                  fontSize: 12.5,
                  lineHeight: '16px',
                  color: G.ink,
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ opacity: 0.55 }}>0{index + 1}</span>
                {label}
                <span style={{ width: 34, height: 1, background: G.ink, opacity: 0.6 }} />
              </div>
            );
          })
        : null}
    </>
  );
}

function OrangeField({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: G.orange }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(70% 60% at 22% 12%, rgba(255,150,96,0.55), rgba(255,91,31,0) 70%), radial-gradient(70% 70% at 90% 100%, rgba(176,44,0,0.32), rgba(176,44,0,0) 70%)'
        }}
      />
      <Grain opacity={0.14} frequency={0.85} />
      {children}
    </div>
  );
}

/** Cover: the refund tool as an exploded view on signal orange. 1440 × 960. */
export function CoverScene({ time = 0 }: { time?: number }) {
  const breathe = loop(time, 6);
  const view: View = {
    rx: 56,
    rz: -28,
    k: 0.6,
    gap: 200 + breathe * 36,
    ground: 120,
    cx: 748,
    cy: 468,
    light: [0.1, 0.42],
    thickness: 9
  };
  return (
    <OrangeField width={1440} height={960}>
      <Stack view={view} width={1440} height={960} pulse={(time / 3) % 1} labels />
    </OrangeField>
  );
}

/** Portrait cover: the same stack, pulled further apart. 1152 × 1440. */
export function TallScene({ time = 0 }: { time?: number }) {
  const breathe = loop(time, 6);
  const view: View = {
    rx: 56,
    rz: -28,
    k: 0.665,
    gap: 330 + breathe * 56,
    ground: 140,
    cx: 650,
    cy: 708,
    light: [0.1, 0.38],
    thickness: 9
  };
  return (
    <OrangeField width={1152} height={1440}>
      <Stack view={view} width={1152} height={1440} pulse={(time / 3) % 1} labels />
    </OrangeField>
  );
}
