import type * as React from 'react';
import { Grain } from '~/components/art/Grain';
import { type Blob, Frost, PhoneOnGlass, phoneSize, pressAt, revealAt } from './art';
import { HomeScreen } from './Home';
import { HEIGHTS, MARI, POISON, PRINT, V, fingerprint } from './model';
import { Address, AppIcon, Bars, Chip, Icon, Mark, Words } from './ui';

const LILAC = '#BDB2F6';
const PALE_LILAC = '#D3CCF8';

const COVER_BLOBS: Blob[] = [
  { x: 1170, y: 800, w: 860, h: 520, color: '#B2A5F7', blur: 64, drift: [-34, -14], phase: 3.4, rotate: -14, halo: 0.6 },
  { x: 250, y: 120, w: 640, h: 340, color: PALE_LILAC, blur: 60, drift: [22, 14], phase: 4.2, rotate: 10, halo: 0.5 },
  { x: 540, y: 520, w: 900, h: 900, color: V.blue, shape: 'mark', blur: 22, drift: [24, 12], phase: 0, halo: 0.8 },
  { x: 1070, y: 300, w: 300, h: 300, color: V.red, blur: 22, drift: [-18, 16], phase: 1.2, halo: 0.85 }
];

/** Cover: Veil's home screen held against frosted glass, the colour of hidden money behind it. 1440 × 960. */
export function FrostScene({ time = 0 }: { time?: number }) {
  const W = 1440;
  const H = 960;
  const width = 304;
  const size = phoneSize(width);
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden' }}>
      <Frost width={W} height={H} blobs={COVER_BLOBS} time={time}>
        <PhoneOnGlass left={(W - size.w) / 2} top={(H - size.h) / 2} width={width}>
          <HomeScreen reveal={revealAt(time)} press={pressAt(time)} />
        </PhoneOnGlass>
        <Grain opacity={0.07} frequency={0.9} seed={14} blend='multiply' />
      </Frost>
    </div>
  );
}

const TALL_BLOBS: Blob[] = [
  { x: 380, y: 700, w: 940, h: 940, color: V.blue, shape: 'mark', blur: 24, drift: [22, 14], phase: 0, halo: 0.75 },
  { x: 960, y: 360, w: 360, h: 360, color: V.red, blur: 26, drift: [-16, 18], phase: 1.2, halo: 0.8 },
  { x: 930, y: 1220, w: 760, h: 430, color: LILAC, blur: 70, drift: [-30, -14], phase: 3.4, rotate: -16, halo: 0.5 },
  { x: 160, y: 120, w: 520, h: 300, color: PALE_LILAC, blur: 60, drift: [20, 12], phase: 4.2, rotate: 12, halo: 0.4 }
];

/** Portrait cover: closer, with the edge of the frosted pane and clear glass beyond. 1152 × 1440. */
export function EdgeScene({ time = 0 }: { time?: number }) {
  const W = 1152;
  const H = 1440;
  const width = 410;
  const size = phoneSize(width);
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden' }}>
      <Frost width={W} height={H} blobs={TALL_BLOBS} time={time} clearFrom={912}>
        <PhoneOnGlass left={(W - size.w) / 2 - 36} top={(H - size.h) / 2 + 6} width={width} rotate={-3}>
          <HomeScreen reveal={revealAt(time)} press={pressAt(time)} />
        </PhoneOnGlass>
        <Grain opacity={0.07} frequency={0.9} seed={14} blend='multiply' />
      </Frost>
    </div>
  );
}

/** Two or three phones in a row on a quieter frost. 1440 × 960. */
export function PhonesShot({
  screens,
  blobs,
  width = 316,
  gap = 70
}: {
  screens: React.ReactNode[];
  blobs: Blob[];
  width?: number;
  gap?: number;
}) {
  const W = 1440;
  const H = 960;
  const size = phoneSize(width);
  const total = screens.length * size.w + (screens.length - 1) * gap;
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden' }}>
      <Frost width={W} height={H} blobs={blobs} frost={0.32} base='#DDE2E8'>
        {screens.map((screen, index) => {
          const offset = screens.length === 3 ? (index === 1 ? -22 : 22) : index === 0 ? -16 : 16;
          return (
            <PhoneOnGlass key={index} left={(W - total) / 2 + index * (size.w + gap)} top={(H - size.h) / 2 + offset} width={width} shadow={0.85}>
              {screen}
            </PhoneOnGlass>
          );
        })}
      </Frost>
    </div>
  );
}

export const SEND_BLOBS: Blob[] = [
  { x: 720, y: 470, w: 520, h: 520, color: V.blue, blur: 70, halo: 0.6 },
  { x: 1150, y: 300, w: 360, h: 360, color: V.red, blur: 70, halo: 0.6, opacity: 0.85 },
  { x: 260, y: 720, w: 620, h: 380, color: LILAC, blur: 70, rotate: -12, halo: 0.5 },
  { x: 1200, y: 860, w: 600, h: 300, color: PALE_LILAC, blur: 60, halo: 0.4 }
];

export const EVERYDAY_BLOBS: Blob[] = [
  { x: 300, y: 300, w: 520, h: 420, color: LILAC, blur: 70, halo: 0.5 },
  { x: 760, y: 640, w: 640, h: 560, color: V.blue, blur: 80, halo: 0.6 },
  { x: 1180, y: 260, w: 520, h: 360, color: PALE_LILAC, blur: 60, halo: 0.5 },
  { x: 1240, y: 800, w: 260, h: 260, color: V.blue, blur: 60, halo: 0.5, opacity: 0.7 }
];

/** One phone, close, for a pair of images side by side. 1200 × 1500. */
export function SingleShot({ children, blobs }: { children: React.ReactNode; blobs: Blob[] }) {
  const W = 1200;
  const H = 1500;
  const width = 480;
  const size = phoneSize(width);
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden' }}>
      <Frost width={W} height={H} blobs={blobs} frost={0.26} base='#DDE2E8'>
        <PhoneOnGlass left={(W - size.w) / 2} top={(H - size.h) / 2} width={width}>
          {children}
        </PhoneOnGlass>
      </Frost>
    </div>
  );
}

/** Behind the report: soft upright bars, like the week's chart seen through frost. */
export const REPORT_BLOBS: Blob[] = [
  { x: 190, y: 820, w: 170, h: 760, color: LILAC, shape: 'pill', blur: 34, halo: 0.6 },
  { x: 360, y: 900, w: 170, h: 600, color: V.blue, shape: 'pill', blur: 34, halo: 0.6 },
  { x: 850, y: 700, w: 170, h: 900, color: LILAC, shape: 'pill', blur: 34, halo: 0.6 },
  { x: 1020, y: 860, w: 170, h: 640, color: V.blue, shape: 'pill', blur: 34, halo: 0.6 },
  { x: 1010, y: 220, w: 200, h: 200, color: V.red, blur: 34, halo: 0.7 }
];

/** Behind recovery: three discs for three people. */
export const RECOVERY_BLOBS: Blob[] = [
  { x: 600, y: 270, w: 470, h: 470, color: V.blue, blur: 34, halo: 0.7 },
  { x: 1000, y: 1060, w: 470, h: 470, color: V.blue, blur: 34, halo: 0.7 },
  { x: 200, y: 1060, w: 470, h: 470, color: LILAC, blur: 34, halo: 0.6 }
];

/** The two addresses up close: ten characters match, nothing else does. 1440 × 900. */
export function LookalikeDetail() {
  const saved = fingerprint(MARI.address);
  const pasted = fingerprint(POISON);
  const row = (label: React.ReactNode, address: string, print: ReturnType<typeof fingerprint>, against?: string) => (
    <div style={{ padding: '40px 56px 44px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{label}</div>
      <div style={{ marginTop: 22 }}>
        <Address address={address} against={against} size={31} gap={0.42} color={V.ink} wrap={false} />
      </div>
      <div style={{ marginTop: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Words print={print} size={74} />
        <Bars bars={print.bars} height={74} width={26} gap={9} radius={5} />
      </div>
    </div>
  );
  return (
    <div style={{ width: 1440, height: 900, position: 'relative', overflow: 'hidden', fontFamily: V.sans, color: V.ink }}>
      <Frost
        width={1440}
        height={900}
        frost={0.26}
        base='#DDE2E8'
        blobs={[
          { x: 260, y: 220, w: 520, h: 440, color: V.blue, blur: 60, halo: 0.6 },
          { x: 1220, y: 700, w: 520, h: 460, color: V.red, blur: 60, halo: 0.6 },
          { x: 1180, y: 120, w: 520, h: 300, color: LILAC, blur: 60, halo: 0.5 },
          { x: 240, y: 800, w: 560, h: 300, color: PALE_LILAC, blur: 60, halo: 0.5 }
        ]}
      >
        <div
          style={{
            position: 'absolute',
            left: 170,
            top: 115,
            width: 1100,
            borderRadius: 34,
            background: V.paper,
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(20,23,27,0.06), 0 40px 90px rgba(16,20,48,0.22), 0 8px 20px rgba(16,20,48,0.08)'
          }}
        >
          {row(
            <>
              <span style={{ fontSize: 22, color: V.slate }}>Saved for Mari Lunde, 12 March</span>
              <span style={{ transform: 'scale(1.5)', transformOrigin: 'right center' }}>
                <Chip tone='blue' icon='check'>
                  Saved contact
                </Chip>
              </span>
            </>,
            MARI.address,
            saved
          )}
          <div style={{ background: 'rgba(255,79,31,0.07)', borderTop: '1.5px solid rgba(255,79,31,0.18)' }}>
            {row(
              <>
                <span style={{ fontSize: 22, color: V.redInk }}>The address you pasted, from your history</span>
                <span style={{ transform: 'scale(1.5)', transformOrigin: 'right center' }}>
                  <Chip tone='red' icon='warn'>
                    Lookalike
                  </Chip>
                </span>
              </>,
              POISON,
              pasted,
              MARI.address
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '22px 56px',
              borderTop: `1.5px solid ${V.line}`,
              fontSize: 20,
              color: V.slate
            }}
          >
            <span>
              <span style={{ color: V.ink }}>10 of 40 characters match.</span> The words and colours share nothing.
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: V.ink, fontWeight: 500 }}>
              Pay Mari’s saved address
              <span style={{ width: 34, height: 34, borderRadius: 17, background: V.blue, color: V.white, display: 'grid', placeItems: 'center' }}>
                <Icon name='right' size={18} stroke={2.2} />
              </span>
            </span>
          </div>
        </div>
      </Frost>
    </div>
  );
}

/** Part of the identity: mark, type, colour and the fingerprint's parts. 1440 × 900. */
export function SystemSheet() {
  const swatches = [
    ['Fog', V.fog],
    ['Mist', V.mist],
    ['Ink', V.ink],
    ['Slate', V.slate],
    ['Ultramarine', V.blue],
    ['Lilac', V.lilac],
    ['Vermilion', V.red]
  ];
  const example = fingerprint(MARI.address);
  const caption: React.CSSProperties = { fontSize: 13.5, color: V.slate, lineHeight: 1.5 };
  return (
    <div
      style={{
        width: 1440,
        height: 900,
        background: V.fog,
        color: V.ink,
        fontFamily: V.sans,
        padding: '72px 88px 76px',
        display: 'grid',
        gridTemplateColumns: '560px 1fr',
        gridTemplateRows: '1fr 1fr',
        columnGap: 104,
        letterSpacing: '-0.005em',
        position: 'relative'
      }}
    >
      <div style={{ position: 'absolute', left: 88, right: 88, top: 468, height: 1, background: V.lineStrong }} />

      <div style={{ alignSelf: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <AppIcon size={112} />
          <span style={{ fontFamily: V.serif, fontSize: 132, lineHeight: 0.8, letterSpacing: '-0.02em' }}>Veil</span>
        </div>
        <div style={{ ...caption, fontSize: 15, marginTop: 28, maxWidth: 480 }}>
          A disc with its lower half behind three bars: something real, partly hidden. It is the only drawn element in the brand;
          everything else is type and colour.
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26, marginTop: 26 }}>
          {[48, 32, 20, 14].map((size) => (
            <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
              <Mark size={size} color={V.ink} />
              <span style={{ fontFamily: V.mono, fontSize: 11, color: V.faint }}>{size}</span>
            </div>
          ))}
          <span style={{ ...caption, fontSize: 12.5, marginLeft: 6 }}>The bars stay three at every size, down to 14 px.</span>
        </div>
      </div>

      <div style={{ alignSelf: 'start' }}>
        <div style={{ fontFamily: V.serif, fontSize: 104, lineHeight: 0.92, letterSpacing: '-0.02em' }}>kr 88 315,80</div>
        <div style={{ ...caption, marginTop: 14 }}>Instrument Serif · amounts and headings</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 30 }}>
          <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>Hold to show</span>
          <span style={{ fontSize: 30, fontWeight: 400, letterSpacing: '-0.02em', color: V.slate }}>Release to hide</span>
        </div>
        <div style={{ ...caption, marginTop: 10 }}>Instrument Sans · everything you read and tap</div>
        <div style={{ marginTop: 26 }}>
          <Address address={MARI.address} size={18.5} gap={0.4} wrap={false} />
        </div>
        <div style={{ ...caption, marginTop: 8 }}>Fragment Mono · addresses, always in groups of four</div>
      </div>

      <div style={{ alignSelf: 'end' }}>
        <div style={{ ...caption, color: V.ink, fontWeight: 500, marginBottom: 16 }}>Colour</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {swatches.map(([name, color]) => (
            <div key={name}>
              <div style={{ height: 150, borderRadius: 14, background: color, boxShadow: `inset 0 0 0 1px ${V.line}` }} />
              <div style={{ fontSize: 13, marginTop: 10, fontWeight: 500 }}>{name}</div>
              <div style={{ fontFamily: V.mono, fontSize: 11, color: V.slate, marginTop: 3 }}>{color}</div>
            </div>
          ))}
        </div>
        <div style={{ ...caption, marginTop: 18, maxWidth: 520 }}>
          Vermilion has one job: telling you to stop. It never appears in a fingerprint, a chart or a balance.
        </div>
      </div>

      <div style={{ alignSelf: 'end' }}>
        <div style={{ ...caption, color: V.ink, fontWeight: 500, marginBottom: 16 }}>Fingerprint: six bars, each one of eight colours and four heights</div>
        <div style={{ display: 'flex', gap: 34, alignItems: 'flex-end' }}>
          <div style={{ display: 'grid', gap: 22 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 56 }}>
                {PRINT.map((colour) => (
                  <span key={colour.name} style={{ width: 20, height: 56, borderRadius: 4, background: colour.hex }} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: V.faint, marginTop: 8 }}>8 colours</div>
            </div>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 56 }}>
                {HEIGHTS.map((height) => (
                  <span key={height} style={{ width: 20, height: 56 * height, borderRadius: 4, background: V.slate }} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: V.faint, marginTop: 8 }}>4 heights, so it reads in greyscale</div>
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: `1px solid ${V.lineStrong}`, paddingLeft: 34 }}>
            <Bars bars={example.bars} height={72} width={24} gap={8} radius={4} />
            <div style={{ marginTop: 16, whiteSpace: 'nowrap' }}>
              <Words print={example} size={36} />
            </div>
            <div style={{ ...caption, marginTop: 10 }}>
              Mari Lunde’s address, as every Veil phone shows it. Worked out on the phone; nothing is looked up.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
