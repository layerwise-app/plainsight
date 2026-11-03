import { Grain } from '~/components/art/Grain';
import { loop } from '~/components/art/random';
import { Sunlight } from '~/components/art/Sunlight';
import { Browser } from '~/components/frames/Browser';
import { Display } from '~/components/frames/Display';
import { Phone } from '~/components/frames/Phone';
import { Scaled } from '~/components/frames/Scaled';
import type * as React from 'react';
import { K } from './model';
import { Overview } from './Overview';

const PLASTER = 'linear-gradient(176deg, #dccfbb 0%, #e8dcc9 48%, #e1d4c0 100%)';

function Plaster({ children, width, height }: { children: React.ReactNode; width: number; height: number }) {
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: PLASTER }}>
      <Grain opacity={0.22} frequency={0.72} />
      <Grain opacity={0.1} frequency={0.012} seed={21} />
      {children}
    </div>
  );
}

/** Cover: the agents overview on a screen, hung on a sunlit plaster wall. 1440 × 960. */
export function WallScene({ time = 0 }: { time?: number }) {
  const W = 1440;
  const H = 960;
  const dw = 880;
  const dh = Math.round((dw * 760) / 1240);
  const x = 236;
  const y = 176;
  return (
    <Plaster width={W} height={H}>
      <div
        style={{
          position: 'absolute',
          left: x + 40,
          top: y + 54,
          width: dw + 10,
          height: dh + 10,
          background: 'rgba(66,44,24,0.42)',
          filter: 'blur(28px)'
        }}
      />
      <Display width={dw} height={dh} bezel={9} style={{ position: 'absolute', left: x, top: y }}>
        <Scaled width={1240} height={760} scale={dw / 1240}>
          <Overview pulse={loop(time, 2)} />
        </Scaled>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(118deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 38%)'
          }}
        />
      </Display>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }} aria-hidden='true'>
        <path
          d={`M${x + dw * 0.62} ${y + dh + 18} C ${x + dw * 0.62} ${y + dh + 140}, ${x + dw * 0.7} ${H - 120}, ${x + dw * 0.69} ${H + 10}`}
          fill='none'
          stroke='#1a1a1a'
          strokeWidth={5}
          strokeLinecap='round'
        />
      </svg>
      <Sunlight
        width={W}
        height={H}
        time={time}
        origin={[-0.02, -0.16]}
        pane={[0.19, 0.5]}
        columns={3}
        rows={2}
        bars={22}
        shear={0.62}
        shadow={0.4}
        leaves={60}
        leafCenter={[0.63, 0.16]}
      />
    </Plaster>
  );
}

/** A product screen in a browser on warm paper, with a little of the same light. */
export function Shot({
  children,
  url = 'app.kestrel.no/agents',
  time = 0
}: {
  children: React.ReactNode;
  url?: string;
  time?: number;
}) {
  const W = 1440;
  const H = 900;
  const scale = 0.94;
  return (
    <Plaster width={W} height={H}>
      <div
        style={{
          position: 'absolute',
          left: (W - 1240 * scale) / 2 + 24,
          top: (H - 798 * scale) / 2 + 34,
          width: 1240 * scale,
          height: 798 * scale,
          borderRadius: 14,
          background: 'rgba(66,44,24,0.36)',
          filter: 'blur(26px)'
        }}
      />
      <Scaled
        width={1240}
        height={798}
        scale={scale}
        style={{ position: 'absolute', left: (W - 1240 * scale) / 2, top: (H - 798 * scale) / 2 }}
      >
        <Browser url={url} width={1240} height={798} theme='dark'>
          {children}
        </Browser>
      </Scaled>
      <Sunlight
        width={W}
        height={H}
        time={time}
        origin={[0.52, -0.2]}
        pane={[0.15, 0.62]}
        columns={2}
        rows={1}
        bars={26}
        shear={0.5}
        shadow={0.16}
        leaves={0}
        seed={5}
      />
    </Plaster>
  );
}

/** Three phones in a row on warm paper. 1440 × 960. */
export function PhonesShot({ screens }: { screens: React.ReactNode[] }) {
  const W = 1440;
  const H = 960;
  const width = 318;
  const gap = 84;
  const total = screens.length * width * (412 / 390) + (screens.length - 1) * gap;
  return (
    <Plaster width={W} height={H}>
      {screens.map((screen, index) => {
        const left = (W - total) / 2 + index * (width * (412 / 390) + gap);
        const top = (H - width * (866 / 390)) / 2 + (index === 1 ? -18 : 18);
        return (
          <div key={index}>
            <div
              style={{
                position: 'absolute',
                left: left + 26,
                top: top + 34,
                width: width * (412 / 390),
                height: width * (866 / 390),
                borderRadius: 60,
                background: 'rgba(66,44,24,0.38)',
                filter: 'blur(22px)'
              }}
            />
            <Phone width={width} style={{ position: 'absolute', left, top }}>
              {screen}
            </Phone>
          </div>
        );
      })}
    </Plaster>
  );
}

/** The interface kit: colour, type and the parts guardrails are made of. 1440 × 900. */
export function SystemSheet() {
  const swatches = [
    ['Night', K.bg],
    ['Panel', K.panel],
    ['Raised', K.raised],
    ['Acting', K.lime],
    ['Asking', K.amber],
    ['Stopped', K.red]
  ];
  return (
    <div
      style={{
        width: 1440,
        height: 900,
        background: K.bg,
        color: K.text,
        fontFamily: K.sans,
        padding: '72px 88px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '56px 88px',
        letterSpacing: '-0.01em'
      }}
    >
      <div>
        <div style={{ fontSize: 13, color: K.muted }}>Colour</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 18 }}>
          {swatches.map(([name, color]) => (
            <div key={name}>
              <div style={{ height: 96, borderRadius: 8, background: color, boxShadow: `inset 0 0 0 1px ${K.line}` }} />
              <div style={{ fontSize: 13, marginTop: 10 }}>{name}</div>
              <div style={{ fontFamily: K.mono, fontSize: 12, color: K.muted, marginTop: 2 }}>{color}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13, color: K.muted, marginTop: 30, lineHeight: 1.5, maxWidth: 520 }}>
          Lime only ever means an agent is acting right now. Amber means it is waiting for a person. Nothing else on
          screen is allowed to use them.
        </div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: K.muted }}>Type</div>
        <div style={{ fontSize: 56, letterSpacing: '-0.045em', lineHeight: 1, marginTop: 18 }}>
          Agents act.
          <br />
          People decide.
        </div>
        <div style={{ fontSize: 13, color: K.muted, marginTop: 14 }}>Geist, 400 and 500</div>
        <div style={{ fontFamily: K.mono, fontSize: 40, letterSpacing: '-0.04em', marginTop: 28, color: K.lime }}>
          +0.62% 412.8M
        </div>
        <div style={{ fontSize: 13, color: K.muted, marginTop: 10 }}>Geist Mono for every number that moves</div>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={{ fontSize: 13, color: K.muted }}>A guardrail, at rest, being edited, and as a draft</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 18 }}>
          {[
            ['rest', 'Never let one position grow past', '8.0%', false],
            ['edit', 'Never let one position grow past', '6.5%', true],
            ['draft', 'Stop trading for the day after losing', '2.0%', false]
          ].map(([key, text, value, active]) => (
            <div
              key={String(key)}
              style={{
                border: `1px solid ${key === 'draft' ? 'rgba(239,181,74,0.5)' : K.line}`,
                borderRadius: 8,
                padding: '18px 18px',
                background: K.panel,
                fontSize: 17,
                lineHeight: 1.55
              }}
            >
              {text}{' '}
              <span
                style={{
                  fontFamily: K.mono,
                  fontSize: 16,
                  padding: '1px 7px 2px',
                  borderRadius: 5,
                  color: active ? K.limeInk : K.lime,
                  background: active ? K.lime : 'rgba(205,244,100,0.1)',
                  boxShadow: `inset 0 0 0 1px ${active ? K.lime : 'rgba(205,244,100,0.28)'}`
                }}
              >
                {value}
              </span>{' '}
              of the fund.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
