import type * as React from 'react';
import { Grain } from '~/components/art/Grain';
import { Phone } from '~/components/frames/Phone';
import { Mark } from './ui';

const TAU = Math.PI * 2;
/** Everything in the scenes moves on a 6 s loop, so motion ends where it began. */
export const wave = (time: number, phase = 0, period = 6) => Math.sin((time / period) * TAU + phase);
const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/** The balance shows from about 2 s to 4.4 s, as if someone held it, then hides again. */
export function revealAt(time: number) {
  const t = ((time % 6) + 6) % 6;
  return smooth(1.9, 2.45, t) * (1 - smooth(3.85, 4.4, t));
}
/** The fingertip arrives a moment before the reveal and lifts just before it hides. */
export function pressAt(time: number) {
  const t = ((time % 6) + 6) % 6;
  return smooth(1.55, 1.9, t) * (1 - smooth(3.75, 4.05, t));
}

export type Blob = {
  /** Centre and size, in px of the scene. */
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  blur?: number;
  rotate?: number;
  opacity?: number;
  /** How far it drifts over the loop, in px. */
  drift?: [number, number];
  phase?: number;
  /** `mark` draws Veil's disc-behind-bars at this size. */
  shape?: 'round' | 'pill' | 'mark';
  /** Strength of the wide glow frost scatters around a shape (0–1). */
  halo?: number;
};

function BlobShape({ blob, blur, opacity }: { blob: Blob; blur: number; opacity: number }) {
  const common: React.CSSProperties = { position: 'absolute', inset: 0, opacity, filter: blur ? `blur(${blur}px)` : undefined };
  if (blob.shape === 'mark') {
    return (
      <div style={common}>
        <Mark size={blob.w} color={blob.color} />
      </div>
    );
  }
  return (
    <div
      style={{
        ...common,
        borderRadius: blob.shape === 'pill' ? Math.min(blob.w, blob.h) / 2 : '50%',
        background: blob.color
      }}
    />
  );
}

function Shapes({ blobs, time, blurScale, halo = true }: { blobs: Blob[]; time: number; blurScale: number; halo?: boolean }) {
  return (
    <>
      {blobs.map((blob, index) => {
        const [dx, dy] = blob.drift ?? [0, 0];
        const phase = blob.phase ?? index;
        const x = blob.x + dx * wave(time, phase);
        const y = blob.y + dy * wave(time, phase + 1.3);
        const blur = (blob.blur ?? 60) * blurScale;
        const glow = halo ? (blob.halo ?? 0.7) : 0;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x - blob.w / 2,
              top: y - blob.h / 2,
              width: blob.w,
              height: blob.h,
              opacity: blob.opacity ?? 1,
              transform: `rotate(${blob.rotate ?? 0}deg)`
            }}
          >
            {glow ? <BlobShape blob={blob} blur={Math.max(blur, 10) * 2.6} opacity={glow} /> : null}
            <BlobShape blob={blob} blur={blur} opacity={1} />
          </div>
        );
      })}
    </>
  );
}

/**
 * Colour behind frosted glass: saturated shapes diffused by the frost, the
 * glass's own fine tooth, and soft daylight over it. With `clearFrom`, the
 * frosted pane ends at that x and clear glass shows the shapes beyond it.
 */
export function Frost({
  width,
  height,
  base = '#DCE1E7',
  blobs,
  time = 0,
  frost = 0.2,
  blurScale = 1,
  clearFrom,
  light = true,
  children
}: {
  width: number;
  height: number;
  base?: string;
  blobs: Blob[];
  time?: number;
  /** How much white the frost adds over the colour. */
  frost?: number;
  blurScale?: number;
  clearFrom?: number;
  light?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ width, height, position: 'absolute', inset: 0, overflow: 'hidden', background: base }}>
      <Shapes blobs={blobs} time={time} blurScale={blurScale} />
      {/* The frost: a pale veil, a cloudy unevenness and a fine tooth. */}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(238,241,244,${frost})` }} />
      <Grain opacity={0.12} frequency={0.006} seed={31} blend='soft-light' />
      <Grain opacity={0.36} frequency={0.85} seed={8} blend='overlay' />
      <Grain opacity={0.1} frequency={1.6} seed={9} blend='multiply' />

      {clearFrom !== undefined ? (
        <>
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${clearFrom}px)`, background: base }}>
            <Shapes blobs={blobs} time={time} blurScale={0.09} halo={false} />
            <Grain opacity={0.08} frequency={0.9} seed={12} blend='multiply' />
          </div>
          {/* The pane's edge: a shadow on the frost, a bright arris, the glass's thickness. */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: clearFrom - 22,
              width: 22,
              background: 'linear-gradient(90deg, rgba(20,23,40,0) 0%, rgba(20,23,40,0.1) 100%)'
            }}
          />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: clearFrom - 1.5, width: 2, background: 'rgba(255,255,255,0.85)' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: clearFrom + 0.5, width: 5, background: 'linear-gradient(90deg, rgba(40,60,70,0.28), rgba(40,60,70,0))' }} />
        </>
      ) : null}

      {light ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(128deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 34%, rgba(255,255,255,0) 58%, rgba(20,23,40,0.08) 100%)',
            mixBlendMode: 'soft-light'
          }}
        />
      ) : null}
      {children}
    </div>
  );
}

/** A phone resting against the glass, with a tight contact shadow and a wider soft one. */
export function PhoneOnGlass({
  left,
  top,
  width,
  rotate = 0,
  finish = 'graphite',
  shadow = 1,
  children
}: {
  left: number;
  top: number;
  width: number;
  rotate?: number;
  finish?: 'graphite' | 'silver';
  shadow?: number;
  children: React.ReactNode;
}) {
  const scale = width / 390;
  const w = 412 * scale;
  const h = 866 * scale;
  const layer = (dx: number, dy: number, blur: number, alpha: number, color = '16,20,48') => (
    <div
      style={{
        position: 'absolute',
        left: left + dx * scale,
        top: top + dy * scale,
        width: w,
        height: h,
        borderRadius: 64 * scale,
        background: `rgba(${color},${alpha * shadow})`,
        filter: `blur(${blur * scale}px)`,
        transform: `rotate(${rotate}deg)`,
        mixBlendMode: 'multiply'
      }}
    />
  );
  return (
    <>
      {layer(34, 52, 48, 0.26)}
      {layer(12, 16, 14, 0.3)}
      {layer(3, 4, 3, 0.35, '10,12,24')}
      <Phone width={width} finish={finish} style={{ position: 'absolute', left, top, transform: `rotate(${rotate}deg)` }}>
        {children}
      </Phone>
    </>
  );
}

/** Outer size of a Phone frame for a given screen width. */
export const phoneSize = (width: number) => ({ w: 412 * (width / 390), h: 866 * (width / 390) });
