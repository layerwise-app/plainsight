import type * as React from 'react';
import { DOMAIN, I, anomalyColor, fmtC } from './model';
import { AppFrame, Card } from './ui';

/* Colour-vision simulation (Machado, Oliveira and Fernandes 2009, full severity). */
const CVD = {
  Deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  Protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  Tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039]
} as const;

const toLin = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const toSrgb = (c: number) => {
  const v = Math.max(0, Math.min(1, c));
  return Math.round((v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055) * 255);
};

function simulate(hex: string, m: readonly number[]) {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = toLin(n >> 16);
  const g = toLin((n >> 8) & 255);
  const b = toLin(n & 255);
  const out = [m[0] * r + m[1] * g + m[2] * b, m[3] * r + m[4] * g + m[5] * b, m[6] * r + m[7] * g + m[8] * b].map(toSrgb);
  return `rgb(${out.join(',')})`;
}

function lightness(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = toLin(n >> 16);
  const g = toLin((n >> 8) & 255);
  const b = toLin(n & 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}

const STATION_ROWS = [
  ['Voss', 1895, '0.2%'],
  ['Granvin', 1923, '1.1%'],
  ['Myrkdalen', 1957, '0.6%'],
  ['Hamlagrø', 1958, '2.4%'],
  ['Stalheim', 1961, '0.9%']
];

const STEPS = Array.from({ length: 41 }, (_, i) => -DOMAIN + (i * DOMAIN) / 20);

function Strip({ label, map }: { label: string; map?: (hex: string) => string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: I.ink2 }}>{label}</span>
      <div style={{ display: 'flex', height: 14 }}>
        {STEPS.map((v) => (
          <span key={v} style={{ flex: 1, background: map ? map(anomalyColor(v)) : anomalyColor(v) }} />
        ))}
      </div>
    </div>
  );
}

/** OKLab lightness across the scale: a symmetric V means the arms are balanced. */
function LightnessProfile({ width, height }: { width: number; height: number }) {
  const left = 96 + 10;
  const plotW = width - left;
  const top = 6;
  const bottom = 18;
  const plotH = height - top - bottom;
  const x = (v: number) => left + ((v + DOMAIN) / (2 * DOMAIN)) * plotW;
  const y = (l: number) => top + (1 - (l - 0.45) / 0.5) * plotH;
  const d = STEPS.map((v, i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)},${y(lightness(anomalyColor(v))).toFixed(1)}`).join('');
  return (
    <svg width={width} height={height} aria-hidden='true' style={{ display: 'block', overflow: 'visible' }}>
      <text x={0} y={top + 10} fontFamily={I.sans} fontSize={12} fill={I.ink2}>
        Lightness
      </text>
      <text x={0} y={top + 26} fontFamily={I.mono} fontSize={10} fill={I.muted}>
        OKLab L
      </text>
      {[0.5, 0.7, 0.9].map((l) => (
        <g key={l}>
          <line x1={left} x2={width} y1={y(l)} y2={y(l)} stroke={I.line} />
          <text x={left - 6} y={y(l) + 3.5} textAnchor='end' fontFamily={I.mono} fontSize={10} fill={I.ink2}>
            {l.toFixed(1)}
          </text>
        </g>
      ))}
      <path d={d} fill='none' stroke={I.ink} strokeWidth={2} strokeLinejoin='round' />
      {[-2, -1, 0, 1, 2].map((v) => (
        <text key={v} x={x(v)} y={height - 4} textAnchor='middle' fontFamily={I.mono} fontSize={10} fill={I.ink2}>
          {v === 0 ? '0' : fmtC(v, 0, false)}
        </text>
      ))}
    </svg>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', padding: '13px 0', borderTop: `1px solid ${I.line}` }}>
      <span style={{ fontFamily: I.mono, fontSize: 11.5, color: I.muted, paddingTop: 2 }}>{n}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: I.ink2, marginTop: 4, textWrap: 'pretty' }}>{children}</div>
      </div>
    </div>
  );
}

function SampleDot({ r, color, label }: { r: number; color: string; label: string }) {
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
      <svg width={44} height={44} aria-hidden='true'>
        {[0, 1, 2].flatMap((row) =>
          [0, 1, 2].map((col) => (
            <circle key={`${row}${col}`} cx={8 + col * 14} cy={8 + row * 14} r={r} fill={color} />
          ))
        )}
      </svg>
      <span style={{ fontSize: 11.5, color: I.ink2, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

/** How the numbers are made and how to read them. 1240 × 760. */
export function MethodScreen() {
  const swatches = [
    ['Paper', I.paper],
    ['Ink', I.ink],
    ['Colder', anomalyColor(-DOMAIN)],
    ['Normal', I.sand],
    ['Warmer', anomalyColor(DOMAIN)],
    ['Rain', I.rain]
  ];
  return (
    <AppFrame active='Method'>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.12fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.03em' }}>How Isobar makes its numbers</div>
          <div style={{ fontSize: 13, color: I.muted, marginTop: 6, marginBottom: 14 }}>Method version 3.2 · updated 4 September 2025</div>
          <Section n='01' title='Against 1961–1990, on purpose'>
            Every figure is a difference from the 1961–1990 average at the same place. A newer normal would hide thirty years
            of warming from the people planning for the next thirty.
          </Section>
          <Section n='02' title='A 1 km grid'>
            Ten regional climate models, corrected against 14 stations in Vestland, then brought down to 1 km using height
            above sea level and distance to the fjord.
          </Section>
          <Section n='03' title='Five stations in Voss'>
            Each with daily records back to 1961 or earlier. Gaps shorter than ten days are filled from neighbours and marked
            in the export.
          </Section>
          <Section n='04' title='Three scenarios'>
            Low, medium and high emissions: SSP1-2.6, SSP2-4.5 and SSP5-8.5. We show the median of the ten models and the
            range from the 10th to the 90th percentile.
          </Section>
          <Section n='05' title='What it can’t tell you'>
            When the next storm comes. A modelled day is not a forecast. Use Isobar for what to build, and the forecast for
            what to do this week.
          </Section>
          <Section n='06' title='Same report, same numbers'>
            Every export carries the method version and the date of its data. Open an old report and you get the figures the
            council saw, not today’s.
          </Section>
        </div>

        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <Card title='The colour scale' aside='°C against 1961–1990'>
            <div style={{ display: 'grid', gap: 7 }}>
              <Strip label='As drawn' />
              {Object.entries(CVD).map(([name, matrix]) => (
                <Strip key={name} label={name} map={(hex) => simulate(hex, matrix)} />
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <LightnessProfile width={592} height={96} />
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: I.ink2, marginTop: 12, textWrap: 'pretty' }}>
              Blue to sand to red, built in OKLab. Both arms lose lightness at the same rate, so 1 °C colder and 1 °C warmer are
              equally loud. The scale stops at ±2.5 °C; anything beyond takes the end colour and its number.
            </div>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 14 }}>
            <Card title='Reading the map'>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                <SampleDot r={2.6} color={anomalyColor(1.4)} label='Lit slope' />
                <SampleDot r={4.4} color={anomalyColor(1.4)} label='Shaded slope' />
                <SampleDot r={4.4} color={anomalyColor(-1.2)} label='Colder' />
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.45, color: I.ink2, marginTop: 12 }}>
                One dot per km². Colour is temperature. Size only shows the land. Blank paper is water.
              </div>
            </Card>
            <Card title='Palette'>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {swatches.map(([name, color]) => (
                  <div key={name}>
                    <div style={{ height: 28, borderRadius: 4, background: color, boxShadow: `inset 0 0 0 1px ${I.line}` }} />
                    <div style={{ fontSize: 11.5, marginTop: 5 }}>{name}</div>
                    <div style={{ fontFamily: I.mono, fontSize: 10, color: I.muted }}>{color.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card title='Station records' aside='Share of days filled from neighbours'>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {STATION_ROWS.map(([name, since, gap]) => (
                <div key={name}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{name}</div>
                  <div style={{ fontFamily: I.mono, fontSize: 11, color: I.ink2, marginTop: 3 }}>since {since}</div>
                  <div style={{ fontFamily: I.mono, fontSize: 11, color: I.muted, marginTop: 1 }}>{gap}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
