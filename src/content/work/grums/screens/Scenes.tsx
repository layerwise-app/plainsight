import { Grain } from '~/components/art/Grain';
import { Sunlight } from '~/components/art/Sunlight';
import { Browser } from '~/components/frames/Browser';
import { Phone } from '~/components/frames/Phone';
import { Scaled } from '~/components/frames/Scaled';
import { loop } from '~/components/art/random';
import type * as React from 'react';
import { type BagSpec, BagShape, bagModel } from './Bag';
import { beans, cup } from './Props';
import { camera, sun, type Camera, type V3 } from './space';
import { Plaster, Stage, Tabletop, type Thing, leafShadows } from './Stage';

export const WALL = '#E7D9C5';
export const TERRACOTTA = '#B86A49';

export function bagThing(spec: BagSpec, cam: Camera, light: V3, key: string, sheen?: number): Thing {
  const m = bagModel(spec);
  return {
    key,
    depth: cam.depth([spec.at[0], spec.at[1], 0]),
    faces: m.faces,
    footprint: m.footprint,
    draw: <BagShape spec={spec} cam={cam} light={light} sheen={sheen} />
  };
}

function Frame({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: WALL }}>
      {children}
      <Grain opacity={0.2} frequency={0.78} />
      <Grain opacity={0.08} frequency={0.014} seed={12} />
    </div>
  );
}

/** Cover: the four roasts on a terracotta tabletop in low morning sun. 1440 × 960. */
export function CoverScene({ time = 0 }: { time?: number }) {
  const W = 1440;
  const H = 960;
  const drift = loop(time, 6);
  const light = sun(31 + drift * 5, 17 + drift * 1.2);
  const cam = camera({ eye: [-40, -2700, 1240], target: [10, 120, 120], focal: 3900, center: [706, 528] });
  const wallY = 430;
  const junction = cam.project([0, wallY, 0])[1];
  const specs: (BagSpec & { key: string })[] = [
    { key: 'light', roast: 'light', size: 1000, at: [-300, 215], yaw: -0.46, date: { dd: '04', mon: 'NOV', weekday: 'MONDAY' } },
    { key: 'decaf', roast: 'decaf', size: 500, at: [-128, 122], yaw: -0.3, date: { dd: '28', mon: 'OCT', weekday: 'MONDAY' } },
    { key: 'medium', roast: 'medium', size: 500, at: [32, 18], yaw: -0.14, date: { dd: '04', mon: 'NOV', weekday: 'MONDAY' } },
    { key: 'dark', roast: 'dark', size: 250, at: [186, -58], yaw: 0.36, date: { dd: '31', mon: 'OCT', weekday: 'THURSDAY' } }
  ];
  const things: Thing[] = [
    ...specs.map((s) => bagThing(s, cam, light, s.key)),
    cup({ at: [338, -128], cam, light, handle: -0.3 }),
    ...beans({ cam, light, around: [130, -150], spread: [170, 56], count: 11, seed: 5 })
  ];
  const leaves = leafShadows({ center: [300, 110], reach: 360, count: 54, time, seed: 8 });
  return (
    <Frame width={W} height={H}>
      <Stage
        width={W}
        height={H}
        cam={cam}
        light={light}
        wallY={wallY}
        things={things}
        leaves={leaves}
        wallFill={<Plaster width={W} height={H} tone={WALL} />}
        tableFill={<Tabletop width={W} height={H} top={junction} tone={TERRACOTTA} />}
      />
    </Frame>
  );
}

/** A shop page in a browser, on the same plaster in the same morning light. 1440 × 900. */
export function BrowserShot({ children, url, time = 0 }: { children: React.ReactNode; url: string; time?: number }) {
  const W = 1440;
  const H = 900;
  const scale = 0.93;
  const bw = 1240;
  const bh = 798;
  const left = (W - bw * scale) / 2;
  const top = (H - bh * scale) / 2;
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: WALL }}>
      <Grain opacity={0.2} frequency={0.78} />
      <Grain opacity={0.08} frequency={0.014} seed={12} />
      <Sunlight
        width={W}
        height={H}
        time={time}
        origin={[0.5, -0.24]}
        pane={[0.17, 0.66]}
        columns={2}
        rows={1}
        bars={24}
        shear={0.52}
        shadow={0.28}
        shadowColor='#4a2616'
        leaves={40}
        leafCenter={[0.92, 0.08]}
        seed={9}
      />
      <div
        style={{
          position: 'absolute',
          left: left + 30,
          top: top + 36,
          width: bw * scale,
          height: bh * scale,
          borderRadius: 14,
          background: 'rgba(74,38,22,0.4)',
          filter: 'blur(26px)'
        }}
      />
      <Scaled width={bw} height={bh} scale={scale} style={{ position: 'absolute', left, top }}>
        <Browser url={url} width={bw} height={bh}>
          {children}
        </Browser>
      </Scaled>
    </div>
  );
}

/** A phone lying on a coloured table in the same hard light. 1200 × 1500. */
export function PhoneShot({
  children,
  tone,
  rotate = -4,
  time = 0,
  seed = 5,
  leafCenter = [0.12, 0.1]
}: {
  children: React.ReactNode;
  tone: string;
  rotate?: number;
  time?: number;
  seed?: number;
  leafCenter?: [number, number];
}) {
  const W = 1200;
  const H = 1500;
  const screenW = 520;
  const pw = (screenW * 412) / 390;
  const ph = (screenW * 866) / 390;
  const left = (W - pw) / 2;
  const top = (H - ph) / 2;
  const turn = `rotate(${rotate}deg)`;
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: tone }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
        <Plaster width={W} height={H} tone={tone} seed={seed} />
      </svg>
      <Grain opacity={0.16} frequency={0.8} />
      <div
        style={{
          position: 'absolute',
          left: left + 46,
          top: top + 52,
          width: pw,
          height: ph,
          borderRadius: 82,
          background: 'rgba(52,20,8,0.5)',
          filter: 'blur(14px)',
          transform: turn
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: left + 8,
          top: top + 10,
          width: pw,
          height: ph,
          borderRadius: 82,
          background: 'rgba(30,10,4,0.45)',
          filter: 'blur(5px)',
          transform: turn
        }}
      />
      <Phone width={screenW} style={{ position: 'absolute', left, top, transform: turn }}>
        {children}
      </Phone>
      <Sunlight
        width={W}
        height={H}
        time={time}
        origin={[-0.3, -0.2]}
        pane={[1.2, 1.5]}
        columns={1}
        rows={1}
        bars={0}
        shear={0.3}
        shadow={0.34}
        shadowColor='#3e1d10'
        leaves={56}
        leafCenter={leafCenter}
        seed={seed}
      />
    </div>
  );
}
