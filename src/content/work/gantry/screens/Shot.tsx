import type * as React from 'react';
import { Grain } from '~/components/art/Grain';
import { Browser } from '~/components/frames/Browser';
import { Scaled } from '~/components/frames/Scaled';
import { G } from './model';

export type FieldTone = 'stone' | 'orange';

export const FIELD = {
  stone: { background: '#E6E3DB', shadow: '58,44,28', grain: 0.16 },
  orange: { background: G.orange, shadow: '120,28,0', grain: 0.12 }
} as const;

/** A shadow that starts tight under the object and runs long to the lower right. */
export function longShadow(rgb: string, strength = 1, reach = 1) {
  return [
    `0 1px 2px rgba(${rgb},${0.16 * strength})`,
    `0 6px 14px -4px rgba(${rgb},${0.16 * strength})`,
    `${28 * reach}px ${40 * reach}px ${60 * reach}px -16px rgba(${rgb},${0.22 * strength})`,
    `${80 * reach}px ${120 * reach}px ${140 * reach}px -40px rgba(${rgb},${0.2 * strength})`
  ].join(', ');
}

/** A flat coloured field with a little grain, for laying screens on. */
export function Field({
  width,
  height,
  tone = 'stone',
  children
}: {
  width: number;
  height: number;
  tone?: FieldTone;
  children: React.ReactNode;
}) {
  const field = FIELD[tone];
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: field.background }}>
      {tone === 'orange' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(90% 80% at 30% 20%, rgba(255,140,80,0.35), rgba(255,91,31,0) 60%), radial-gradient(80% 70% at 85% 100%, rgba(170,40,0,0.22), rgba(170,40,0,0) 70%)'
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(90% 80% at 25% 15%, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)'
          }}
        />
      )}
      <Grain opacity={field.grain} frequency={0.8} />
      {children}
    </div>
  );
}

/** A Gantry screen in a browser window on a field. 1440 × 900. */
export function Shot({
  children,
  url = 'tovholm.gantry.app/build/refund-approvals',
  tone = 'stone',
  width = 1440,
  height = 900,
  scale = 0.94
}: {
  children: React.ReactNode;
  url?: string;
  tone?: FieldTone;
  width?: number;
  height?: number;
  scale?: number;
}) {
  const bw = 1240;
  const bh = 798;
  const left = Math.round((width - bw * scale) / 2);
  const top = Math.round((height - bh * scale) / 2);
  return (
    <Field width={width} height={height} tone={tone}>
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: bw * scale,
          height: bh * scale,
          borderRadius: 12 * scale,
          boxShadow: longShadow(FIELD[tone].shadow, tone === 'orange' ? 1.4 : 1)
        }}
      />
      <Scaled width={bw} height={bh} scale={scale} style={{ position: 'absolute', left, top }}>
        <Browser url={url} width={bw} height={bh}>
          {children}
        </Browser>
      </Scaled>
    </Field>
  );
}
