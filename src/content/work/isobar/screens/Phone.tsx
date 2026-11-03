import type * as React from 'react';
import { StatusBar } from '~/components/frames/Phone';
import { I, SERIES, span } from './model';
import { Mark } from './ui';

const screen: React.CSSProperties = {
  width: 390,
  height: 844,
  background: I.paper,
  color: I.ink,
  fontFamily: I.sans,
  letterSpacing: '-0.01em',
  display: 'flex',
  flexDirection: 'column'
};

/** Forecast rain per hour at Granvin, 06:00 Thursday to 06:00 Friday, mm. */
const HOURLY = [0.4, 0.6, 1.1, 1.8, 2.4, 3.0, 3.6, 4.8, 5.9, 6.8, 6.2, 4.9, 3.8, 2.9, 2.2, 1.6, 1.1, 0.8, 0.6, 0.4, 0.3, 0.2, 0.2, 0.1];
const CUMULATIVE = HOURLY.reduce<number[]>((acc, v) => {
  acc.push((acc[acc.length - 1] ?? 0) + v);
  return acc;
}, [0]);
const TOTAL = Math.round(CUMULATIVE[CUMULATIVE.length - 1]);

function RainChart({ width = 346, height = 186 }: { width?: number; height?: number }) {
  const left = 26;
  const right = 8;
  const top = 10;
  const bottom = 22;
  const max = 80;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const x = (h: number) => left + (h / 24) * plotW;
  const y = (v: number) => top + (1 - v / max) * plotH;
  const path = (k: number) => CUMULATIVE.map((v, h) => `${h ? 'L' : 'M'}${x(h).toFixed(1)},${y(v * k).toFixed(1)}`).join('');
  const band = `${path(1.32)}${CUMULATIVE.map((_, i) => {
    const h = CUMULATIVE.length - 1 - i;
    return `L${x(h).toFixed(1)},${y(CUMULATIVE[h] * 0.7).toFixed(1)}`;
  }).join('')}Z`;
  const cross = CUMULATIVE.findIndex((v) => v >= 30);
  return (
    <svg width={width} height={height} aria-hidden='true' style={{ display: 'block', overflow: 'visible' }}>
      {[0, 20, 40, 60, 80].map((t) => (
        <g key={t}>
          <line x1={left} x2={width - right} y1={y(t)} y2={y(t)} stroke={t === 0 ? I.ink : I.line} />
          <text x={left - 6} y={y(t) + 3.5} textAnchor='end' fontFamily={I.mono} fontSize={10} fill={I.ink2}>
            {t}
          </text>
        </g>
      ))}
      <path d={band} fill={I.rain} opacity={0.16} />
      <path d={`${path(1)}L${x(24)},${y(0)}L${x(0)},${y(0)}Z`} fill={I.rain} opacity={0.14} />
      <path d={path(1)} fill='none' stroke={I.rain} strokeWidth={2.2} strokeLinejoin='round' />
      <line x1={left} x2={width - right} y1={y(30)} y2={y(30)} stroke={I.ink} strokeWidth={1.2} />
      <text x={left + 4} y={y(30) - 6} fontFamily={I.sans} fontSize={11} fill={I.ink}>
        30 mm, a heavy-rain day
      </text>
      <circle cx={x(cross)} cy={y(CUMULATIVE[cross])} r={4} fill={I.ink} stroke={I.paper} strokeWidth={2} />
      <text x={x(cross) + 8} y={y(CUMULATIVE[cross]) + 14} fontFamily={I.mono} fontSize={10.5} fill={I.ink}>
        15:00
      </text>
      <text x={x(24) - 2} y={y(CUMULATIVE[24]) - 8} textAnchor='end' fontFamily={I.mono} fontSize={11} fill={I.ink}>
        {TOTAL} mm
      </text>
      {['06', '12', '18', '00', '06'].map((label, i) => (
        <text key={`${label}${i}`} x={x(i * 6)} y={height - 6} textAnchor='middle' fontFamily={I.mono} fontSize={10} fill={I.ink2}>
          {label}
        </text>
      ))}
    </svg>
  );
}

function Header({ title, step }: { title: string; step?: string }) {
  return (
    <div style={{ padding: '6px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500 }}>
        <svg width='18' height='18' viewBox='0 0 18 18' aria-hidden='true'>
          <path d='M11 3.5L5.5 9l5.5 5.5' fill='none' stroke={I.ink} strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        {title}
      </span>
      {step ? <span style={{ fontFamily: I.mono, fontSize: 12, color: I.muted }}>{step}</span> : null}
    </div>
  );
}

/** The alert, opened from the lock screen. 390 × 844. */
export function AlertScreen() {
  const now = span(SERIES.granvin.rain, 2016, 2025);
  const then = span(SERIES.granvin.rain, 1961, 1990);
  return (
    <div style={screen}>
      <StatusBar color={I.ink} time='05:43' />
      <Header title='Alerts' step='On call until 08:00 Fri' />
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 500, color: I.rain }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: I.rain }} />
          Heavy rain · Granvin
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.035em', marginTop: 10, textWrap: 'balance' }}>
          {TOTAL} mm in the 24 hours from 06:00. Past 30 mm by about 15:00.
        </div>
      </div>
      <div style={{ margin: '20px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: I.muted, marginBottom: 8 }}>
          <span>Rain so far, mm</span>
          <span>Shaded: 8 in 10 forecast runs</span>
        </div>
        <RainChart />
      </div>
      <div style={{ margin: '18px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          ['Heaviest', '13:00–17:00', 'up to 7 mm an hour'],
          ['At Granvin', `${now.toFixed(1)} a year`, `days like this; ${then.toFixed(1)} in 1961–1990`]
        ].map(([k, v, n]) => (
          <div key={k} style={{ padding: '12px 13px', borderRadius: 12, background: I.card, boxShadow: `inset 0 0 0 1px ${I.line}` }}>
            <div style={{ fontSize: 11.5, color: I.muted }}>{k}</div>
            <div style={{ fontFamily: I.mono, fontSize: 16, marginTop: 5, letterSpacing: '-0.03em' }}>{v}</div>
            <div style={{ fontSize: 11.5, color: I.ink2, marginTop: 3, lineHeight: 1.3 }}>{n}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 22px 0', fontSize: 13.5, lineHeight: 1.45, color: I.ink2 }}>
        Four sites on your list drain into Granvinsfjorden. Check them before 13:00.
      </div>
      <div style={{ marginTop: 'auto', padding: '0 22px 38px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10 }}>
        <div style={{ height: 52, borderRadius: 14, boxShadow: `inset 0 0 0 1px ${I.lineStrong}`, display: 'grid', placeItems: 'center', fontSize: 15.5 }}>
          Hand over
        </div>
        <div
          style={{ height: 52, borderRadius: 14, background: I.ink, color: I.card, display: 'grid', placeItems: 'center', fontSize: 15.5, fontWeight: 500 }}
        >
          See the four sites
        </div>
      </div>
    </div>
  );
}

const SITES = [
  { name: 'Culvert K-114, Skjervet', note: 'Cleared 12 Sep', state: 'Checked 06:31' },
  { name: 'Culvert K-120, Nedre Granvin', note: 'Blocked twice in 2024', state: '' },
  { name: 'Storm drain at Granvin quay', note: 'Tide high at 14:52', state: '' },
  { name: 'Slope on Fv572 at Folkedal', note: 'Slip in Dec 2015', state: '' }
];

/** The engineer's checklist for the day. 390 × 844. */
export function SitesScreen() {
  return (
    <div style={screen}>
      <StatusBar color={I.ink} time='06:34' />
      <Header title='Heavy rain · Granvin' step='1 of 4' />
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.035em' }}>Check before 13:00</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
          {SITES.map((site) => (
            <span key={site.name} style={{ flex: 1, height: 4, borderRadius: 2, background: site.state ? I.rain : 'rgba(26,30,29,0.1)' }} />
          ))}
        </div>
      </div>
      <div style={{ margin: '22px 22px 0', borderRadius: 14, background: I.card, boxShadow: `inset 0 0 0 1px ${I.line}`, overflow: 'hidden' }}>
        {SITES.map((site, index) => (
          <div
            key={site.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr auto',
              alignItems: 'center',
              gap: 10,
              padding: '15px 14px',
              borderTop: index ? `1px solid ${I.line}` : undefined
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                display: 'grid',
                placeItems: 'center',
                background: site.state ? I.rain : 'transparent',
                boxShadow: site.state ? undefined : `inset 0 0 0 1.5px ${I.lineStrong}`
              }}
            >
              {site.state ? (
                <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
                  <path d='M2.5 6.2l2.3 2.3L9.5 3.5' fill='none' stroke='#fff' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              ) : null}
            </span>
            <span>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>{site.name}</span>
              <span style={{ display: 'block', fontSize: 12.5, color: I.muted, marginTop: 3 }}>{site.state || site.note}</span>
            </span>
            <svg width='8' height='14' viewBox='0 0 8 14' aria-hidden='true'>
              <path d='M1.5 1.5L6.5 7l-5 5.5' fill='none' stroke={I.faint} strokeWidth='1.6' />
            </svg>
          </div>
        ))}
      </div>
      <div style={{ margin: '18px 22px 0', padding: 14, borderRadius: 14, background: 'rgba(30,127,134,0.08)', fontSize: 13.5, lineHeight: 1.45 }}>
        <span style={{ fontWeight: 500 }}>K-114 is clear.</span> Photo and note saved to the culvert’s log. Ola Tveit at the
        depot can take K-120 if you hand it over.
      </div>
      <div style={{ marginTop: 'auto', padding: '0 22px 38px' }}>
        <div style={{ height: 52, borderRadius: 14, background: I.ink, color: I.card, display: 'grid', placeItems: 'center', fontSize: 15.5, fontWeight: 500 }}>
          Next: K-120, 4 km
        </div>
      </div>
    </div>
  );
}

/** The lock screen notification. 390 × 844. */
export function RainLockScreen() {
  return (
    <div
      style={{
        ...screen,
        color: '#fff',
        background: 'radial-gradient(120% 80% at 50% 0%, #2a5f63 0%, #143437 55%, #0b1d1f 100%)'
      }}
    >
      <svg aria-hidden='true' width={390} height={844} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id='lock-rain' width={7} height={12} patternUnits='userSpaceOnUse' patternTransform='rotate(12)'>
            <rect x={3} y={0} width={1} height={6} rx={0.5} fill='rgba(255,255,255,0.08)' />
          </pattern>
        </defs>
        <rect width={390} height={844} fill='url(#lock-rain)' />
      </svg>
      <StatusBar color='#fff' time='' />
      <div style={{ position: 'relative', textAlign: 'center', marginTop: 46, color: 'rgba(255,255,255,0.78)', fontSize: 18, fontWeight: 500 }}>
        Thursday 16 October
      </div>
      <div style={{ position: 'relative', textAlign: 'center', fontSize: 96, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1, marginTop: 4, color: 'rgba(255,255,255,0.94)' }}>
        05:42
      </div>
      <div
        style={{
          position: 'relative',
          margin: 'auto 12px 120px',
          padding: 14,
          borderRadius: 24,
          background: 'rgba(32,52,54,0.62)',
          backdropFilter: 'blur(18px)',
          display: 'grid',
          gridTemplateColumns: '38px 1fr',
          gap: 12
        }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 9, background: I.paper, display: 'grid', placeItems: 'center' }}>
          <Mark size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 600 }}>
            Isobar <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 13 }}>now</span>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.35, marginTop: 2 }}>
            Heavy rain at Granvin: {TOTAL} mm by 06:00 Friday, past 30 mm by about 15:00. Four sites on your list.
          </div>
        </div>
      </div>
    </div>
  );
}
