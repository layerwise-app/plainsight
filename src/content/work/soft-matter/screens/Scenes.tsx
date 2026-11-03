import type * as React from 'react';
import { Grain } from '~/components/art/Grain';
import { Browser } from '~/components/frames/Browser';
import { Phone } from '~/components/frames/Phone';
import { Scaled } from '~/components/frames/Scaled';
import { MARK_STATES, Mark, type MarkState, Wordmark } from './Brand';
import { coverScene, emptyScene, gardenScene, rest, swatchScene, swell } from './choreo';
import { SM } from './palette';
import { type Drop, type MaterialName, type SceneFn, SoftScene } from './SoftScene';

/** Cover: the scene as a campaign image, the wordmark set small beneath it. 1440 × 960. */
export function CoverScene({ time = 0, pixelRatio }: { time?: number; pixelRatio?: number }) {
  return (
    <div style={{ width: 1440, height: 960, position: 'relative', overflow: 'hidden' }}>
      <SoftScene scene={coverScene} width={1440} height={960} time={time} material='wax' pixelRatio={pixelRatio} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 742, display: 'flex', justifyContent: 'center' }}>
        <Wordmark size={21} color={SM.plum} />
      </div>
    </div>
  );
}

/** The studio floor with nothing on it, for setting screens in the same light. */
function Backdrop({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  const floor: SceneFn = () => ({ ...emptyScene(0), view: { eye: [0, 2.3, 12], target: [0, 0.9, 0], fov: 24 } });
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <SoftScene scene={floor} width={width} height={height} time={0} />
      <Grain opacity={0.08} frequency={0.8} />
      {children}
    </div>
  );
}

/** A page of softmatter.dk in a browser, in the studio light. 1440 × 900. */
export function BrowserShot({ children, url = 'softmatter.dk' }: { children: React.ReactNode; url?: string }) {
  const W = 1440;
  const H = 900;
  const scale = 0.94;
  const bw = 1240;
  const bh = 800;
  const left = (W - bw * scale) / 2;
  const top = (H - bh * scale) / 2 - 4;
  return (
    <Backdrop width={W} height={H}>
      <div
        style={{
          position: 'absolute',
          left: left + 40,
          top: top + 60,
          width: bw * scale - 80,
          height: bh * scale - 30,
          borderRadius: 30,
          background: 'rgba(58,42,140,0.34)',
          filter: 'blur(36px)'
        }}
      />
      <Scaled width={bw} height={bh} scale={scale} style={{ position: 'absolute', left, top }}>
        <Browser url={url} width={bw} height={bh}>
          {children}
        </Browser>
      </Scaled>
    </Backdrop>
  );
}

/** Three phones standing in the studio light. 1440 × 960. */
export function PhonesShot({ screens }: { screens: React.ReactNode[] }) {
  const W = 1440;
  const H = 960;
  const width = 318;
  const outer = width * (412 / 390);
  const tall = width * (866 / 390);
  const gap = 78;
  const total = screens.length * outer + (screens.length - 1) * gap;
  return (
    <Backdrop width={W} height={H}>
      {screens.map((screen, index) => {
        const left = (W - total) / 2 + index * (outer + gap);
        const top = (H - tall) / 2 + (index === 1 ? -16 : 16);
        return (
          <div key={index}>
            <div
              style={{
                position: 'absolute',
                left: left + 22,
                top: top + 40,
                width: outer - 20,
                height: tall - 20,
                borderRadius: 60,
                background: 'rgba(58,42,140,0.32)',
                filter: 'blur(26px)'
              }}
            />
            <Phone width={width} finish='silver' style={{ position: 'absolute', left, top }}>
              {screen}
            </Phone>
          </div>
        );
      })}
    </Backdrop>
  );
}

const SWATCHES: [string, string, string][] = [
  ['Lilac', SM.lilac, 'Haze, light, the big drop'],
  ['Peach', SM.peach, 'Warmth, the other drop'],
  ['Cream', SM.cream, 'Floor and paper'],
  ['Indigo', SM.indigo, 'The drop you steer'],
  ['Plum ink', SM.plum, 'Type, never black']
];

function Label({ children, color = SM.plumMuted }: { children: React.ReactNode; color?: string }) {
  return <div style={{ fontSize: 13, fontWeight: 600, color, letterSpacing: '-0.005em' }}>{children}</div>;
}

function MaterialTile({ material, width, height, label, note }: { material: MaterialName; width: number; height: number; label: string; note: string }) {
  return (
    <div>
      <div style={{ width, height, borderRadius: 14, overflow: 'hidden' }}>
        <SoftScene scene={swatchScene} width={width} height={height} time={0} material={material} />
      </div>
      <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: SM.plumMuted, marginTop: 2 }}>{note}</div>
    </div>
  );
}

/** The identity on one sheet: lockup, the mark's three states, colour, type, materials. 1440 × 960. */
export function IdentitySheet() {
  return (
    <div
      style={{
        width: 1440,
        height: 960,
        background: SM.cream,
        color: SM.plum,
        fontFamily: SM.text,
        fontWeight: 500,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Grain opacity={0.1} frequency={0.85} />
      <div style={{ position: 'absolute', left: 80, top: 72 }}>
        <Label>Lockup</Label>
        <div style={{ marginTop: 34 }}>
          <Wordmark size={104} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 1000, top: 72, width: 360 }}>
        <Label>The mark has three states</Label>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 34, marginTop: 30 }}>
          {(['apart', 'touching', 'joined'] as MarkState[]).map((state) => (
            <div key={state}>
              <div style={{ height: 70, display: 'flex', alignItems: 'flex-end' }}>
                <Mark size={62} state={state} />
              </div>
              <div style={{ fontSize: 13, marginTop: 12, textTransform: 'capitalize', fontWeight: 600 }}>{state}</div>
              <div style={{ fontSize: 12, color: SM.plumMuted, marginTop: 2 }}>{MARK_STATES[state].toFixed(2)} r</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 80, right: 80, top: 318, height: 1, background: SM.line }} />

      <div style={{ position: 'absolute', left: 80, top: 352 }}>
        <Label>Colour</Label>
        <div style={{ display: 'flex', gap: 28, marginTop: 24 }}>
          {SWATCHES.map(([name, color, use]) => (
            <div key={name} style={{ width: 128 }}>
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: 99,
                  background: color,
                  boxShadow: color === SM.cream ? `inset 0 0 0 1px ${SM.line}` : undefined
                }}
              />
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 14 }}>{name}</div>
              <div style={{ fontSize: 12.5, color: SM.plumMuted, marginTop: 2 }}>{color}</div>
              <div style={{ fontSize: 12.5, color: SM.plumSoft, marginTop: 6, lineHeight: 1.35 }}>{use}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 870, top: 352, width: 490 }}>
        <Label>Type</Label>
        <div style={{ fontFamily: SM.display, fontSize: 50, fontWeight: 500, letterSpacing: '-0.055em', lineHeight: 1.02, marginTop: 22 }}>
          Things that
          <br />
          give a little.
        </div>
        <div style={{ fontSize: 12.5, color: SM.plumMuted, marginTop: 12 }}>Unbounded 500, tracked −5.5%, for anything over 20 px</div>
        <p style={{ fontSize: 16, lineHeight: 1.5, marginTop: 22, maxWidth: 440 }}>
          Manrope 500 for reading. Set in plum ink, never black, so text sits in the same light as the work.
        </p>
        <div style={{ fontSize: 12.5, color: SM.plumMuted, marginTop: 8 }}>Manrope 500 and 600, 13 to 19 px</div>
      </div>

      <div style={{ position: 'absolute', left: 80, right: 80, top: 640, height: 1, background: SM.line }} />

      <div style={{ position: 'absolute', left: 80, top: 672 }}>
        <Label>Three materials, one scene</Label>
        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          <MaterialTile material='clay' width={232} height={132} label='Clay' note='Matte, heavy, slow to settle' />
          <MaterialTile material='wax' width={232} height={132} label='Wax' note='Warm inside, joins easily' />
          <MaterialTile material='glass' width={232} height={132} label='Glass' note='Bright, springy, holds its shape' />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 870, top: 672, width: 490 }}>
        <Label>In an exhibition credit, 9 pt</Label>
        <div
          style={{
            marginTop: 20,
            padding: '22px 24px',
            background: SM.paper,
            borderRadius: 4,
            boxShadow: `0 1px 0 ${SM.line}, 0 12px 30px -18px rgba(29,21,48,0.35)`
          }}
        >
          <div style={{ fontSize: 12, lineHeight: 1.5, color: SM.plumSoft, maxWidth: 300 }}>
            Slow Tide, 2024. Commissioned by Halvø Science Centre. Concept, software and installation by
          </div>
          <div style={{ marginTop: 10 }}>
            <Wordmark size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** A spring that overshoots once and settles, normalised to 0 → 1. */
function spring(t: number, stiffness = 180, damping = 17) {
  const w = Math.sqrt(stiffness);
  const z = damping / (2 * w);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
}

/** How things move: the motion guidelines board. 1440 × 900. */
export function MotionGuide() {
  const frames = [0, 60, 120, 200, 300, 420, 600];
  const plotW = 1280;
  const plotH = 150;
  const x = (ms: number) => 75 + (ms / 600) * (plotW - 150);
  const y = (v: number) => plotH - v * (plotH - 26);
  const curve = Array.from({ length: 129 }, (_, i) => {
    const ms = (i / 128) * 600;
    return `${i ? 'L' : 'M'}${x(ms).toFixed(1)},${y(spring(ms / 1000)).toFixed(1)}`;
  }).join('');
  const rules = [
    ['Nothing moves in a straight line', 'Every move is a spring. Linear easing is only for progress bars.'],
    ['Joining is quicker than parting', 'Two drops join in 500 ms and take 800 ms to come apart, the way wax does.'],
    ['Big things are slow', 'Duration grows with the square root of size. A drop twice as big takes 1.4 times as long.'],
    ['One join at a time', 'If two joins would overlap, the second waits. Eyes can only follow one.']
  ];
  return (
    <div
      style={{
        width: 1440,
        height: 900,
        background: SM.plum,
        color: SM.cream,
        fontFamily: SM.text,
        fontWeight: 500,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', left: 80, top: 72, width: 560 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: SM.lilac }}>Motion guidelines, page 3 of 11</div>
        <div style={{ fontFamily: SM.display, fontSize: 46, fontWeight: 500, letterSpacing: '-0.055em', lineHeight: 1.04, marginTop: 18 }}>
          How things join
        </div>
      </div>
      <p style={{ position: 'absolute', left: 800, top: 100, width: 520, fontSize: 16, lineHeight: 1.55, color: 'rgba(245,238,228,0.78)', margin: 0 }}>
        The mark and every interface we make share one spring: stiffness 180, damping 17. It overshoots once, by about
        8%, and settles in 500 ms. That small overshoot is what makes a join feel soft rather than mechanical.
      </p>

      <div style={{ position: 'absolute', left: 80, top: 250, width: plotW }}>
        <div style={{ position: 'relative', height: 172 }}>
          {frames.map((ms) => {
            const v = spring(ms / 1000);
            return (
              <div
                key={ms}
                style={{ position: 'absolute', left: x(ms) - 75, top: 0, width: 150, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ height: 120, display: 'flex', alignItems: 'flex-end' }}>
                  <Mark size={84} join={Math.min(1.08, v)} color={ms === 600 ? SM.peach : SM.cream} />
                </div>
                <div style={{ fontSize: 13, marginTop: 18, fontWeight: 600 }}>{ms} ms</div>
                <div style={{ fontSize: 12, marginTop: 2, color: 'rgba(245,238,228,0.5)' }}>{Math.round(v * 100)}%</div>
              </div>
            );
          })}
        </div>
        <svg width={plotW} height={plotH + 30} style={{ display: 'block', marginTop: 26, overflow: 'visible' }} aria-hidden='true'>
          {[0, 1].map((v) => (
            <g key={v}>
              <line x1={x(0)} x2={plotW} y1={y(v)} y2={y(v)} stroke='rgba(245,238,228,0.14)' strokeDasharray={v ? '3 5' : undefined} />
              <text x={plotW} y={y(v) - 8} textAnchor='end' fontSize={12} fill='rgba(245,238,228,0.5)' fontFamily={SM.text}>
                {v ? 'joined' : 'apart'}
              </text>
            </g>
          ))}
          <path d={curve} fill='none' stroke={SM.lilac} strokeWidth={2.5} strokeLinecap='round' />
          {frames.map((ms) => (
            <g key={ms}>
              <line x1={x(ms)} x2={x(ms)} y1={-14} y2={y(spring(ms / 1000)) - 8} stroke='rgba(245,238,228,0.16)' strokeDasharray='2 4' />
              <circle cx={x(ms)} cy={y(spring(ms / 1000))} r={5} fill={ms === 600 ? SM.peach : SM.cream} />
            </g>
          ))}
          <text x={x(300) + 14} y={y(1.08) - 12} fontSize={12} fill={SM.peach} fontFamily={SM.text}>
            overshoot 8%
          </text>
        </svg>
      </div>

      <div style={{ position: 'absolute', left: 80, right: 80, top: 672, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
        {rules.map(([title, body], index) => (
          <div key={title} style={{ borderTop: '1px solid rgba(245,238,228,0.16)', paddingTop: 18 }}>
            <div style={{ fontSize: 13, color: SM.lilac, fontWeight: 600 }}>{index + 1}</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8, letterSpacing: '-0.015em' }}>{title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 8, color: 'rgba(245,238,228,0.7)' }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Wax poster scene: three drops in a chain, the middle one joining both. */
const chainScene: SceneFn = (time) => {
  const g = swell(time, 6, 1.36);
  const drops: Drop[] = [
    rest(-0.62, 0.35, 0.72, SM.peach),
    rest(0.42 + 0.06 * g, -0.35, 0.56, SM.lilac),
    rest(1.05 + 0.1 * g, -1.25, 0.4, SM.cream),
    rest(-0.95, 1.45, 0.2, SM.indigo),
    rest(1.15, 0.75, 0.13, SM.peachDeep)
  ];
  return { drops, view: { eye: [0.3, 5.6, 9.4], target: [0.1, 0.2, -0.1], fov: 27 } };
};

/** Glass poster scene: the garden cluster, from higher up. */
const nightGarden: SceneFn = (time) => ({ ...gardenScene(time), view: { eye: [0.2, 5.2, 9], target: [0, 0.25, 0], fov: 28 } });

/** An open-studio poster, pasted on a wall. 1080 × 1440. */
export function Poster({ material }: { material: 'wax' | 'glass' }) {
  const W = 1080;
  const H = 1440;
  const pw = 820;
  const ph = Math.round(pw * Math.SQRT2);
  const left = (W - pw) / 2;
  const top = (H - ph) / 2 - 10;
  const glass = material === 'glass';
  const ink = SM.plum;
  const wall = glass ? '#D9CFCB' : '#E2DAD6';
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: `linear-gradient(178deg, ${wall}, color-mix(in srgb, ${wall} 88%, ${SM.plum}))` }}>
      <Grain opacity={0.2} frequency={0.7} />
      <Grain opacity={0.08} frequency={0.015} seed={9} />
      <div style={{ position: 'absolute', left: left + 18, top: top + 34, width: pw - 10, height: ph - 10, background: 'rgba(29,21,48,0.32)', filter: 'blur(22px)' }} />
      <div style={{ position: 'absolute', left, top, width: pw, height: ph, overflow: 'hidden', color: ink, fontFamily: SM.text, fontWeight: 500 }}>
        <SoftScene scene={glass ? nightGarden : chainScene} width={pw} height={ph} time={0} material={material} mood={glass ? 'peach' : 'studio'} />
        <div style={{ position: 'absolute', left: 44, right: 44, top: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Wordmark size={22} color={ink} />
          <div style={{ textAlign: 'right', fontSize: 17, lineHeight: 1.3, fontWeight: 600 }}>
            Open studio
            <br />
            6–8 June 2025
          </div>
        </div>
        <div style={{ position: 'absolute', left: 38, right: 44, bottom: 44 }}>
          <div style={{ fontFamily: SM.display, fontSize: 238, fontWeight: 500, letterSpacing: '-0.07em', lineHeight: 0.86, marginLeft: -6 }}>
            {material}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: glass ? 72 : 34, fontSize: 16, lineHeight: 1.4 }}>
            <span>
              {glass ? 'Room 3 of 3. Bright, springy, holds its shape.' : 'Room 2 of 3. Warm light inside, joins easily.'}
            </span>
            <span style={{ textAlign: 'right' }}>
              Refshaleøen, Copenhagen
              <br />
              Touch everything
            </span>
          </div>
        </div>
        <Grain opacity={0.12} frequency={0.9} />
      </div>
      {/* Paste and a little light across the paper. */}
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: pw,
          height: ph,
          background: 'linear-gradient(115deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 40%, rgba(29,21,48,0.06))',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

