import type * as React from 'react';
import { useCallback } from 'react';
import { Browser } from '~/components/frames/Browser';
import { Phone } from '~/components/frames/Phone';
import { Scaled } from '~/components/frames/Scaled';
import { DotCanvas, paintDots } from './Dots';
import { type Landscape, type Moment, buildLandscape, frame, moment, tallSpec, valueAt, wideSpec } from './landscape';
import { Mark } from './ui';
import { halo } from './MapView';
import { DOMAIN, I, anomalyColor, fmtC } from './model';

let wide: Landscape | undefined;
let tall: Landscape | undefined;
const getWide = () => {
  wide ??= buildLandscape(wideSpec());
  return wide;
};
const getTall = () => {
  tall ??= buildLandscape(tallSpec());
  return tall;
};

/** A hairline label pinned to a point on the print. */
function Pin({
  x,
  y,
  length,
  name,
  detail,
  align = 'left',
  down
}: {
  x: number;
  y: number;
  length: number;
  name: string;
  detail: string;
  align?: 'left' | 'right';
  down?: boolean;
}) {
  const textTop = down ? y + length + 6 : y - length - 34;
  return (
    <>
      <svg
        aria-hidden='true'
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
        width={1}
        height={1}
      >
        <line x1={x} x2={x} y1={down ? y + 3.5 : y - 3.5} y2={down ? y + length : y - length} stroke={I.ink} strokeWidth={0.75} />
        <circle cx={x} cy={y} r={3.5} fill='none' stroke={I.ink} strokeWidth={1} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: align === 'left' ? x - 1 : undefined,
          right: align === 'right' ? `calc(100% - ${x + 1}px)` : undefined,
          top: textTop,
          textAlign: align,
          color: I.ink,
          whiteSpace: 'nowrap',
          lineHeight: 1.25,
          textShadow: halo(I.paper)
        }}
      >
        <div style={{ fontFamily: I.sans, fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>{name}</div>
        <div style={{ fontFamily: I.mono, fontSize: 11.5, letterSpacing: '-0.01em', marginTop: 2 }}>{detail}</div>
      </div>
    </>
  );
}

/** The year and a small key, set like the caption of a print. */
function Colophon({ year, left, top, width = 300 }: { year: number; left: number; top: number; width?: number }) {
  const steps = 25;
  return (
    <div style={{ position: 'absolute', left, top, width, color: I.ink }}>
      <div style={{ fontFamily: I.mono, fontSize: 46, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 400 }}>{year}</div>
      <div style={{ fontFamily: I.sans, fontSize: 12.5, lineHeight: 1.4, marginTop: 12, letterSpacing: '-0.005em' }}>
        Voss, annual mean temperature against the <span style={{ whiteSpace: 'nowrap' }}>1961–1990</span> normal
      </div>
      <div style={{ display: 'flex', marginTop: 12, height: 6 }}>
        {Array.from({ length: steps }, (_, i) => {
          const v = -DOMAIN + (2 * DOMAIN * (i + 0.5)) / steps;
          return <span key={v} style={{ flex: 1, background: anomalyColor(v) }} />;
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: I.mono, fontSize: 10.5, marginTop: 5 }}>
        <span>−2.5</span>
        <span>0</span>
        <span>+2.5 °C</span>
      </div>
    </div>
  );
}

function Print({ scene, time }: { scene: Landscape; time: number }) {
  const now: Moment = moment(time);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `now` is rebuilt every render; redraw only when its values change
  const draw = useCallback(
    (context: CanvasRenderingContext2D) => paintDots(context, frame(scene, now)),
    [scene, now.year, now.ripple]
  );
  return <DotCanvas width={scene.spec.width} height={scene.spec.height} draw={draw} style={{ position: 'absolute', inset: 0 }} />;
}

const shownYear = (now: Moment) => (now.ripple > 0.5 ? 1961 : Math.round(now.year));

/** Cover: the fjord at Granvin as a halftone print. 1440 × 960. */
export function CoverScene({ time = 0 }: { time?: number }) {
  const scene = getWide();
  const now = moment(time);
  const { width: W, height: H, layers } = scene.spec;
  const peakX = W * 0.575;
  const peakY = layers[0].top(peakX) + 10;
  const myrkX = W * 0.8;
  const myrkY = layers[2].shore(myrkX) - 612 / layers[2].metres;
  const granX = W * 0.515;
  const granY = scene.spec.horizon - 4;
  const value = (x: number, y: number) => fmtC(valueAt(scene, x, y, now));
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: I.paper }}>
      <Print scene={scene} time={time} />
      <Pin x={peakX} y={peakY} length={58} name='Lønahorgi' detail={`1,410 m\u2002\u2002${value(peakX, peakY)}`} />
      <Pin x={myrkX} y={myrkY} length={72} name='Myrkdalen' detail={`612 m\u2002\u2002${value(myrkX, myrkY)}`} />
      <Pin x={granX} y={granY} length={54} name='Granvin' detail={`22 m\u2002\u2002${value(granX, granY)}`} down align='right' />
      <Colophon year={shownYear(now)} left={W - 400} top={148} />
    </div>
  );
}

/** Portrait cover: one mountain, top to fjord. 1152 × 1440. */
export function TallScene({ time = 0 }: { time?: number }) {
  const scene = getTall();
  const now = moment(time);
  const { width: W, height: H, layers } = scene.spec;
  const peakX = W * 0.62;
  const peakY = layers[1].top(peakX) + 10;
  const midX = W * 0.8;
  const midY = layers[1].shore(midX) - 612 / layers[1].metres;
  const lowX = W * 0.3;
  const lowY = scene.spec.horizon - 3;
  const value = (x: number, y: number) => fmtC(valueAt(scene, x, y, now));
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: I.paper }}>
      <Print scene={scene} time={time} />
      <Pin x={peakX} y={peakY} length={60} name='Lønahorgi' detail={`1,410 m\u2002\u2002${value(peakX, peakY)}`} />
      <Pin x={midX} y={midY} length={64} name='Myrkdalen' detail={`612 m\u2002\u2002${value(midX, midY)}`} />
      <Pin x={lowX} y={lowY} length={50} name='Granvin' detail={`22 m\u2002\u2002${value(lowX, lowY)}`} down />
      <Colophon year={shownYear(now)} left={84} top={318} />
    </div>
  );
}

const BACKDROPS = {
  sand: { background: '#E3DDCB', shadow: 'rgba(60,48,30,0.32)' },
  ink: { background: '#1F2523', shadow: 'rgba(0,0,0,0.55)' },
  cold: { background: '#2C5C9E', shadow: 'rgba(10,22,44,0.5)' },
  rain: { background: '#1E7F86', shadow: 'rgba(6,30,32,0.5)' }
} as const;

export type Backdrop = keyof typeof BACKDROPS;

/** A flat colour from the palette with a soft field of print dots. */
export function Ground({
  width,
  height,
  tone = 'sand',
  children
}: {
  width: number;
  height: number;
  tone?: Backdrop;
  children: React.ReactNode;
}) {
  const backdrop = BACKDROPS[tone];
  const light = tone === 'sand';
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: backdrop.background }}>
      <svg aria-hidden='true' width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={`dots-${tone}`} width={8} height={6.928} patternUnits='userSpaceOnUse'>
            <circle cx={2} cy={1.732} r={0.9} fill={light ? 'rgba(60,48,30,0.10)' : 'rgba(255,255,255,0.07)'} />
            <circle cx={6} cy={5.196} r={0.9} fill={light ? 'rgba(60,48,30,0.10)' : 'rgba(255,255,255,0.07)'} />
          </pattern>
        </defs>
        <rect width={width} height={height} fill={`url(#dots-${tone})`} />
      </svg>
      {children}
    </div>
  );
}

/** A product screen in a browser window on a palette ground. 1440 × 900. */
export function Shot({
  children,
  url = 'isobar.no/voss',
  tone = 'sand',
  width = 1440,
  height = 900
}: {
  children: React.ReactNode;
  url?: string;
  tone?: Backdrop;
  width?: number;
  height?: number;
}) {
  const scale = 0.94;
  const bw = 1240;
  const bh = 798;
  const left = (width - bw * scale) / 2;
  const top = (height - bh * scale) / 2;
  return (
    <Ground width={width} height={height} tone={tone}>
      <div
        style={{
          position: 'absolute',
          left: left + 10,
          top: top + 28,
          width: bw * scale - 20,
          height: bh * scale - 10,
          borderRadius: 14,
          background: BACKDROPS[tone].shadow,
          filter: 'blur(30px)'
        }}
      />
      <Scaled width={bw} height={bh} scale={scale} style={{ position: 'absolute', left, top }}>
        <Browser url={url} width={bw} height={bh}>
          {children}
        </Browser>
      </Scaled>
    </Ground>
  );
}

/** Phones in a row on a palette ground. 1440 × 960. */
export function PhonesShot({ screens, tone = 'rain' }: { screens: React.ReactNode[]; tone?: Backdrop }) {
  const W = 1440;
  const H = 960;
  const width = 318;
  const gap = 84;
  const outer = width * (412 / 390);
  const total = screens.length * outer + (screens.length - 1) * gap;
  return (
    <Ground width={W} height={H} tone={tone}>
      {screens.map((screen, index) => {
        const left = (W - total) / 2 + index * (outer + gap);
        const top = (H - width * (866 / 390)) / 2 + (index === 1 ? -18 : 18);
        return (
          <div key={index}>
            <div
              style={{
                position: 'absolute',
                left: left + 22,
                top: top + 34,
                width: outer,
                height: width * (866 / 390),
                borderRadius: 60,
                background: BACKDROPS[tone].shadow,
                filter: 'blur(24px)'
              }}
            />
            <Phone width={width} style={{ position: 'absolute', left, top }}>
              {screen}
            </Phone>
          </div>
        );
      })}
    </Ground>
  );
}

/** Two A4 pages of the council report, side by side. 1440 × 960. */
export function ReportScene({ pages, tone = 'sand' }: { pages: React.ReactNode[]; tone?: Backdrop }) {
  const W = 1440;
  const H = 960;
  const scale = 0.755;
  const pw = 794 * scale;
  const ph = 1123 * scale;
  const gap = 44;
  const total = pages.length * pw + (pages.length - 1) * gap;
  return (
    <Ground width={W} height={H} tone={tone}>
      {pages.map((page, index) => {
        const left = (W - total) / 2 + index * (pw + gap);
        const top = (H - ph) / 2 + (index ? 10 : -10);
        return (
          <div key={index}>
            <div
              style={{
                position: 'absolute',
                left: left + 8,
                top: top + 18,
                width: pw - 8,
                height: ph - 6,
                background: BACKDROPS[tone].shadow,
                filter: 'blur(18px)'
              }}
            />
            <Scaled width={794} height={1123} scale={scale} style={{ position: 'absolute', left, top }}>
              {page}
            </Scaled>
          </div>
        );
      })}
    </Ground>
  );
}

let poster: Landscape | undefined;
const getPoster = () => {
  poster ??= buildLandscape(tallSpec(1056, 1130));
  return poster;
};

/** A launch poster for the council chamber: one year of the fjord, with its numbers. 1200 × 1500. */
export function PosterScene({ year }: { year: number }) {
  const scene = getPoster();
  const now: Moment = { year, ripple: 0 };
  // biome-ignore lint/correctness/useExhaustiveDependencies: `now` is rebuilt every render; redraw only when the year changes
  const draw = useCallback(
    (context: CanvasRenderingContext2D) => paintDots(context, frame(scene, now)),
    [scene, year]
  );
  const { layers } = scene.spec;
  const peakX = scene.spec.width * 0.62;
  const peakY = layers[1].top(peakX) + 10;
  const lowX = scene.spec.width * 0.3;
  const lowY = scene.spec.horizon - 3;
  const peak = valueAt(scene, peakX, peakY, now);
  const low = valueAt(scene, lowX, lowY, now);
  return (
    <div style={{ width: 1200, height: 1500, position: 'relative', overflow: 'hidden', background: '#E3DDCB' }}>
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 50,
          width: 1080,
          height: 1400,
          background: I.paper,
          boxShadow: '0 30px 60px -30px rgba(60,48,30,0.45), 0 2px 6px rgba(60,48,30,0.12)'
        }}
      >
        <div style={{ position: 'absolute', left: 12, top: 30 }}>
          <DotCanvas width={1056} height={1130} draw={draw} />
        </div>
        <div style={{ position: 'absolute', left: 48, right: 48, top: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: I.sans, fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>
            <Mark size={20} />
            Isobar
          </span>
          <span style={{ fontFamily: I.mono, fontSize: 13, color: I.ink2 }}>Voss · {year - 1960} of 65</span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 48,
            right: 48,
            bottom: 44,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 40,
            alignItems: 'end',
            color: I.ink
          }}
        >
          <div style={{ fontFamily: I.mono, fontSize: 150, lineHeight: 0.8, letterSpacing: '-0.06em' }}>{year}</div>
          <div style={{ paddingBottom: 4 }}>
            <div style={{ fontFamily: I.sans, fontSize: 19, lineHeight: 1.35, letterSpacing: '-0.015em', textWrap: 'pretty' }}>
              At the fjord {fmtC(low)}. On Lønahorgi {fmtC(peak)}. Against the{' '}
              <span style={{ whiteSpace: 'nowrap' }}>1961–1990</span> normal.
            </div>
            <div style={{ display: 'flex', marginTop: 18, height: 8 }}>
              {Array.from({ length: 25 }, (_, i) => {
                const v = -DOMAIN + (2 * DOMAIN * (i + 0.5)) / 25;
                return <span key={v} style={{ flex: 1, background: anomalyColor(v) }} />;
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: I.mono, fontSize: 12, marginTop: 6 }}>
              <span>−2.5</span>
              <span>0</span>
              <span>+2.5 °C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
