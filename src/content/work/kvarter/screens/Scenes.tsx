import type * as React from 'react';
import { Grain } from '~/components/art/Grain';
import { seeded } from '~/components/art/random';
import { Phone } from '~/components/frames/Phone';
import { Birch, D, Distance, Facade, Hedge, Lamp, type Lighting, Path, Sky } from './Building';
import { Browser } from '~/components/frames/Browser';
import { Scaled } from '~/components/frames/Scaled';
import { AdminScreen } from './Admin';
import { ResourceArt } from './Booking';
import { FAULTS, FaultArt } from './Faults';
import { FeedScreen } from './Feed';
import { K, head, label } from './model';
import { Mark } from './ui';

const LIT = (() => {
  const random = seeded(77);
  return Array.from({ length: 600 }, () => random() < 0.42);
})();

/** Each bay numbers its floors, then its basement window; only the laundry room's basement is lit. */
const base = (laundry: number, floors: number) => (id: number) => (id % (floors + 1) === floors ? id === laundry : LIT[id]);

export const COVER_LIGHTS: Lighting = {
  base: base(17, 5),
  events: [
    [13, 0.3, 2.9],
    [19, 0.9, 3.5],
    [25, 1.5, 4.4],
    [44, 2.1, 5.1],
    [15, 2.7, 5.5],
    [27, 3.1, 0.2],
    [42, 3.7, 0.8],
    [21, 4.2, 1.2],
    [3, 4.8, 1.6],
    [45, 5.3, 2.2]
  ],
  climbs: [[0, 1.0]]
};

export const TALL_LIGHTS: Lighting = {
  base: base(26, 8),
  events: [
    [21, 0.3, 2.8],
    [43, 0.9, 3.6],
    [57, 1.5, 4.2],
    [13, 2.1, 5.0],
    [66, 2.7, 5.6],
    [33, 3.2, 0.3],
    [11, 3.8, 0.9],
    [59, 4.4, 1.4],
    [48, 4.9, 1.9],
    [68, 5.4, 2.4]
  ],
  climbs: [
    [0, 1.1],
    [1, 3.9]
  ]
};

/** A phone in the scene, with the shadow and the little light it throws. */
function HeroPhone({ x, y, width, rotate = 0, children }: { x: number; y: number; width: number; rotate?: number; children: React.ReactNode }) {
  const w = width * (412 / 390);
  const h = width * (866 / 390);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - 40,
          top: y - 30,
          width: w + 80,
          height: h + 60,
          borderRadius: 120,
          background: 'rgba(255,214,140,0.16)',
          filter: 'blur(40px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x + 30,
          top: y + 50,
          width: w,
          height: h,
          borderRadius: 64,
          background: 'rgba(8,10,22,0.6)',
          filter: 'blur(30px)',
          transform: `rotate(${rotate}deg)`
        }}
      />
      <Phone width={width} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotate}deg)` }}>
        {children}
      </Phone>
    </>
  );
}

/** Cover: a 1962 brick block at dusk, windows coming on, the co-op’s feed in front. 1440 × 960. */
export function CoverScene({ time = 0 }: { time?: number }) {
  const W = 1440;
  const H = 960;
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: D.sky1 }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
        <Sky width={W} height={H} horizon={520} moon={[1322, 132]} />
        <Distance x={1180} y={520} width={300} groundY={900} />
        <Facade left={-40} top={210} width={1280} floors={5} time={time} lighting={COVER_LIGHTS} offset={-44} />
        <rect x={0} y={930} width={W} height={H - 930} fill='#232433' />
        <Path x={282} y={930} width={58} bottom={H} />
        <Lamp x={560} y={940} height={200} />
        <Hedge y={922} from={-20} to={262} />
        <Hedge y={922} from={362} to={W + 20} seed={5} />
        <Birch x={150} y={990} height={760} time={time} seed={5} />
      </svg>
      <Grain opacity={0.2} frequency={0.85} />
      <Grain opacity={0.08} frequency={0.02} seed={9} blend='soft-light' />
      <HeroPhone x={792} y={164} width={290}>
        <FeedScreen />
      </HeroPhone>
    </div>
  );
}

/** Portrait cover: a taller block, more sky, the phone low in the frame. 1152 × 1440. */
export function TallScene({ time = 0 }: { time?: number }) {
  const W = 1152;
  const H = 1440;
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: D.sky1 }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
        <Sky width={W} height={H} horizon={330} moon={[214, 150]} />
        <Facade left={-40} top={262} width={1240} floors={8} floorH={122} time={time} lighting={TALL_LIGHTS} offset={40} seed={21} numbers={['3', '5', '7']} />
        <rect x={0} y={1318} width={W} height={H - 1318} fill='#232433' />
        <Path x={200} y={1318} width={58} bottom={H} />
        <Path x={818} y={1318} width={58} bottom={H} />
        <Lamp x={112} y={1440} height={240} />
        <Hedge y={1318} from={-20} to={178} seed={4} />
        <Hedge y={1318} from={282} to={796} seed={6} />
        <Hedge y={1318} from={900} to={W + 20} seed={8} />
        <Birch x={1018} y={1480} height={1000} time={time} seed={11} scale={1.15} />
      </svg>
      <Grain opacity={0.2} frequency={0.85} />
      <Grain opacity={0.08} frequency={0.02} seed={9} blend='soft-light' />
      <HeroPhone x={404} y={590} width={306}>
        <FeedScreen />
      </HeroPhone>
    </div>
  );
}


export type Tone = 'brick' | 'paper' | 'dusk' | 'moss' | 'yellow';

const TONES: Record<Tone, { ground: string; shadow: string }> = {
  brick: { ground: K.brick, shadow: 'rgba(70,18,6,0.5)' },
  paper: { ground: K.paper, shadow: 'rgba(80,60,30,0.3)' },
  dusk: { ground: K.dusk, shadow: 'rgba(5,8,20,0.6)' },
  moss: { ground: K.moss, shadow: 'rgba(10,30,18,0.5)' },
  yellow: { ground: K.yellow, shadow: 'rgba(110,70,0,0.35)' }
};

/** A flat ground in one of Kvarter’s colours; brick gets its coursing. */
export function Ground({ tone, width, height, children }: { tone: Tone; width: number; height: number; children?: React.ReactNode }) {
  const id = `${tone}${width}${height}`;
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: TONES[tone].ground }}>
      {tone === 'brick' ? (
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
          <pattern id={`course${id}`} width='96' height='34' patternUnits='userSpaceOnUse'>
            <rect width='96' height='34' fill={K.brick} />
            <rect y='16' width='96' height='1.5' fill='rgba(80,22,8,0.22)' />
            <rect y='33' width='96' height='1.5' fill='rgba(80,22,8,0.22)' />
            <rect x='47' y='0' width='1.5' height='17' fill='rgba(80,22,8,0.22)' />
            <rect x='0' y='17' width='1.5' height='17' fill='rgba(80,22,8,0.22)' />
            <rect x='4' y='2' width='38' height='12' fill='rgba(255,210,180,0.05)' />
            <rect x='52' y='19' width='40' height='12' fill='rgba(60,10,0,0.05)' />
          </pattern>
          <rect width={width} height={height} fill={`url(#course${id})`} />
        </svg>
      ) : null}
      <Grain opacity={tone === 'paper' || tone === 'yellow' ? 0.18 : 0.24} frequency={0.8} />
      <Grain opacity={0.08} frequency={0.012} seed={21} />
      {children}
    </div>
  );
}

/** Phones in a row on one of Kvarter’s colours. */
export function PhonesShot({
  screens,
  tone,
  width = 1440,
  height = 960,
  phone = 318,
  gap = 84,
  lift = [18, -18, 18]
}: {
  screens: React.ReactNode[];
  tone: Tone;
  width?: number;
  height?: number;
  phone?: number;
  gap?: number;
  lift?: number[];
}) {
  const pw = phone * (412 / 390);
  const ph = phone * (866 / 390);
  const total = screens.length * pw + (screens.length - 1) * gap;
  return (
    <Ground tone={tone} width={width} height={height}>
      {screens.map((screen, index) => {
        const left = (width - total) / 2 + index * (pw + gap);
        const top = (height - ph) / 2 + (lift[index] ?? 0);
        return (
          <div key={index}>
            <div
              style={{
                position: 'absolute',
                left: left + 26,
                top: top + 36,
                width: pw,
                height: ph,
                borderRadius: 60,
                background: TONES[tone].shadow,
                filter: 'blur(24px)'
              }}
            />
            <Phone width={phone} style={{ position: 'absolute', left, top }}>
              {screen}
            </Phone>
          </div>
        );
      })}
    </Ground>
  );
}

/** Styret’s admin in a browser, on brick. 1440 × 900. */
export function AdminShot() {
  const W = 1440;
  const H = 900;
  const scale = 0.94;
  const bw = 1240;
  const bh = 798;
  return (
    <Ground tone='yellow' width={W} height={H}>
      <div
        style={{
          position: 'absolute',
          left: (W - bw * scale) / 2 + 24,
          top: (H - bh * scale) / 2 + 34,
          width: bw * scale,
          height: bh * scale,
          borderRadius: 14,
          background: TONES.yellow.shadow,
          filter: 'blur(26px)'
        }}
      />
      <Scaled width={bw} height={bh} scale={scale} style={{ position: 'absolute', left: (W - bw * scale) / 2, top: (H - bh * scale) / 2 }}>
        <Browser url='styret.kvarter.no/fjellhagen/notices/new' width={bw} height={bh}>
          <AdminScreen />
        </Browser>
      </Scaled>
    </Ground>
  );
}

/** Kvarter’s identity: the mark, the colours and what each one means, the type, the drawings. 1440 × 900. */
export function SystemSheet() {
  const colours: [string, string, string, string][] = [
    ['Brick', K.brick, K.paper, 'From styret'],
    ['Moss', K.moss, K.paper, 'Yours'],
    ['Window yellow', K.yellow, K.ink, 'New, and now'],
    ['Dusk', K.dusk, K.paper, 'Text and night'],
    ['Paper', K.paper, K.ink, 'Everything else']
  ];
  return (
    <div
      style={{
        width: 1440,
        height: 900,
        background: K.paper,
        color: K.ink,
        fontFamily: K.sans,
        display: 'grid',
        gridTemplateColumns: '520px 1fr',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ background: K.brick, color: K.paper, padding: '64px 64px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={label(12, 'rgba(243,236,225,0.72)')}>Mark</div>
        <div style={{ marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26 }}>
          <Mark size={168} body={K.paper} pane={K.brick} />
          <span style={{ ...head(122, 820), letterSpacing: '-0.02em' }}>Kvarter</span>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.45, maxWidth: 360, color: 'rgba(243,236,225,0.88)' }}>
          Four windows in a block, one of them lit. It works at 16 px on a phone and painted on a stairwell door.
        </div>
        <div style={{ position: 'absolute', right: 64, top: 50, display: 'flex', gap: 8 }}>
          {[
            [K.paper, K.brick, K.paper],
            [K.dusk, K.brick, K.paper],
            [K.yellow, K.dusk, K.yellow]
          ].map(([tile, body, pane]) => (
            <span key={tile} style={{ width: 52, height: 52, borderRadius: 12, background: tile, display: 'grid', placeItems: 'center' }}>
              <Mark size={32} body={body} pane={pane} lit={body === K.dusk ? K.yellow : K.yellow} />
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: '64px 64px 56px', display: 'flex', flexDirection: 'column', gap: 44 }}>
        <div>
          <div style={label(12)}>Colour, one meaning each</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 16 }}>
            {colours.map(([name, bg, fg, use]) => (
              <div key={name} style={{ height: 150, borderRadius: 14, background: bg, color: fg, padding: 14, display: 'flex', flexDirection: 'column', boxShadow: bg === K.paper ? `inset 0 0 0 1px ${K.lineStrong}` : 'none' }}>
                <span style={{ fontSize: 14, fontWeight: 650 }}>{name}</span>
                <span style={{ fontSize: 12.5, opacity: 0.78, marginTop: 2 }}>{bg}</span>
                <span style={{ marginTop: 'auto', ...head(22, 760) }}>{use}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
          <div>
            <div style={label(12)}>Type</div>
            <div style={{ ...head(64, 800), marginTop: 16 }}>Water off Tuesday, 09–12</div>
            <div style={{ fontSize: 13, color: K.muted, marginTop: 10 }}>Bricolage Grotesque, 75% width, 800, for what you must not miss</div>
            <div style={{ fontSize: 19, lineHeight: 1.4, marginTop: 18, maxWidth: 440 }}>
              The main valve in the basement is being replaced. Fill a jug on Monday night.
            </div>
            <div style={{ fontSize: 13, color: K.muted, marginTop: 8 }}>The same family at full width, 400, for reading</div>
          </div>
          <div>
            <div style={label(12)}>Drawings, not photos</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16 }}>
              {FAULTS.filter((fault) => fault.kind !== 'other' && fault.kind !== 'laundry').map((fault) => (
                <FaultArt key={fault.kind} kind={fault.kind} size={76} />
              ))}
              <ResourceArt id='laundry' size={76} />
            </div>
            <div style={{ fontSize: 13, color: K.muted, marginTop: 12, lineHeight: 1.4 }}>
              One line weight, five colours, a 40-unit grid. Styret can request new ones.
            </div>
          </div>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={label(12)}>Parts</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr 1fr', gap: 12, marginTop: 16, alignItems: 'start' }}>
            <div style={{ borderRadius: 16, background: K.brick, color: K.paper, padding: '14px 16px' }}>
              <div style={label(10, 'rgba(243,236,225,0.75)')}>From styret</div>
              <div style={{ ...head(24, 780), marginTop: 8 }}>Water off Tuesday, 09–12</div>
              <div style={{ fontSize: 12.5, marginTop: 8, color: 'rgba(243,236,225,0.78)' }}>Read by 47 flats</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ borderRadius: 10, background: K.moss, color: K.paper, padding: '10px 12px', fontSize: 13.5, fontWeight: 650 }}>You · Sat 10–12</div>
              <div style={{ borderRadius: 10, background: K.paperDeep, padding: '10px 12px', fontSize: 13.5, fontWeight: 550 }}>Silje · H0106</div>
              <div style={{ borderRadius: 10, background: K.card, boxShadow: `inset 0 0 0 1px ${K.line}`, padding: '10px 12px', fontSize: 13.5, color: K.muted }}>Free</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ borderRadius: 14, background: K.ink, color: K.paper, height: 44, display: 'grid', placeItems: 'center', fontSize: 14.5, fontWeight: 620 }}>Vote on proposal 4</div>
              <div style={{ borderRadius: 14, background: K.yellow, height: 44, display: 'grid', placeItems: 'center', fontSize: 14.5, fontWeight: 620 }}>41 flats are coming</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['H0204', 'H0101', 'H0302'].map((flat, i) => (
                  <span key={flat} style={{ fontSize: 12, fontWeight: 650, letterSpacing: '0.04em', padding: '4px 7px', borderRadius: 6, background: i === 0 ? K.moss : i === 1 ? K.brick : K.paperDeep, color: i === 2 ? K.ink : K.paper }}>
                    {flat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
