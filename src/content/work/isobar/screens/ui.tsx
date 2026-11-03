import type * as React from 'react';
import { DOMAIN, FIRST_YEAR, I, LAST_YEAR, YEARS, anomalyColor, fmtC } from './model';

/** Isobar's mark: three closed isobars around a low. */
export function Mark({ size = 22, color = I.ink }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' aria-hidden='true'>
      <path
        d='M12.2 2.2c5.1-.1 9.6 3.6 9.6 9.2 0 5.7-4.3 10.4-9.9 10.4-5.4 0-9.7-4-9.7-9.6C2.2 6.4 6.6 2.3 12.2 2.2z'
        fill='none'
        stroke={color}
        strokeWidth='1.5'
      />
      <path
        d='M12.4 6.1c3.2 0 5.6 2.4 5.5 5.5-.1 3.4-2.7 6.2-6 6.1-3.2-.1-5.6-2.6-5.5-5.7.1-3.2 2.7-5.9 6-5.9z'
        fill='none'
        stroke={color}
        strokeWidth='1.5'
      />
      <circle cx='12.1' cy='11.9' r='2.3' fill={I.hot} />
    </svg>
  );
}

export function Wordmark({ size = 15 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Mark size={size + 7} />
      <span style={{ fontFamily: I.sans, fontSize: size, fontWeight: 600, letterSpacing: '-0.03em' }}>Isobar</span>
    </span>
  );
}

const TABS = ['Overview', 'Stations', 'Scenarios', 'Reports'];

/** The app's top bar and page, designed at 1240 × 760. */
export function AppFrame({
  active,
  children,
  pad = true
}: {
  active: string;
  children: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: I.paper,
        color: I.ink,
        fontFamily: I.sans,
        fontSize: 13,
        letterSpacing: '-0.005em'
      }}
    >
      <header
        style={{
          height: 52,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          padding: '0 24px',
          borderBottom: `1px solid ${I.line}`
        }}
      >
        <Wordmark />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 30,
            padding: '0 10px',
            borderRadius: 6,
            boxShadow: `inset 0 0 0 1px ${I.lineStrong}`,
            fontSize: 13,
            fontWeight: 500
          }}
        >
          Voss
          <span style={{ color: I.muted, fontWeight: 400 }}>Vestland</span>
          <svg width='10' height='10' viewBox='0 0 10 10' aria-hidden='true'>
            <path d='M2 3.5l3 3 3-3' fill='none' stroke={I.muted} strokeWidth='1.3' />
          </svg>
        </span>
        <nav style={{ display: 'flex', gap: 22, height: '100%' }}>
          {TABS.map((tab) => (
            <span
              key={tab}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                color: tab === active ? I.ink : I.muted,
                fontWeight: tab === active ? 500 : 400,
                boxShadow: tab === active ? `inset 0 -2px 0 ${I.ink}` : undefined
              }}
            >
              {tab}
            </span>
          ))}
        </nav>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18, color: I.muted }}>
          <span style={{ color: active === 'Method' ? I.ink : I.muted }}>Method</span>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: I.sand,
              color: I.ink,
              display: 'grid',
              placeItems: 'center',
              fontSize: 11,
              fontWeight: 600
            }}
          >
            SV
          </span>
        </span>
      </header>
      <main style={{ flex: 1, minHeight: 0, padding: pad ? '20px 24px 22px' : 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}

export function PageHead({ title, sub, right }: { title: React.ReactNode; sub?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, gap: 24 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{title}</div>
        {sub ? <div style={{ color: I.muted, marginTop: 6, fontSize: 13 }}>{sub}</div> : null}
      </div>
      {right ? <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div> : null}
    </div>
  );
}

export function Card({
  children,
  style,
  title,
  aside
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: I.card,
        borderRadius: 6,
        boxShadow: `inset 0 0 0 1px ${I.line}`,
        padding: 16,
        minWidth: 0,
        ...style
      }}
    >
      {title ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{title}</div>
          {aside ? <div style={{ fontSize: 12, color: I.muted }}>{aside}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Button({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 32,
        padding: '0 13px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        background: primary ? I.ink : 'transparent',
        color: primary ? I.card : I.ink,
        boxShadow: primary ? undefined : `inset 0 0 0 1px ${I.lineStrong}`,
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </span>
  );
}

export function Segmented({ items, active }: { items: string[]; active: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: 3,
        gap: 2,
        borderRadius: 7,
        background: 'rgba(26,30,29,0.05)'
      }}
    >
      {items.map((item) => (
        <span
          key={item}
          style={{
            height: 26,
            padding: '0 11px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 5,
            fontSize: 12.5,
            fontWeight: item === active ? 500 : 400,
            color: item === active ? I.ink : I.muted,
            background: item === active ? I.card : 'transparent',
            boxShadow: item === active ? '0 1px 2px rgba(26,30,29,0.12)' : undefined
          }}
        >
          {item}
        </span>
      ))}
    </span>
  );
}

/** A headline number with its unit and what it is measured against. */
export function Stat({
  label,
  value,
  unit,
  note,
  swatch
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  swatch?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 12, color: I.muted, display: 'flex', alignItems: 'center', gap: 7 }}>
        {swatch ? <span style={{ width: 8, height: 8, borderRadius: 4, background: swatch }} /> : null}
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 6 }}>
        <span style={{ fontFamily: I.mono, fontSize: 28, letterSpacing: '-0.045em', lineHeight: 1 }}>{value}</span>
        {unit ? <span style={{ fontFamily: I.mono, fontSize: 13, color: I.ink2 }}>{unit}</span> : null}
      </div>
      {note ? <div style={{ fontSize: 12, color: I.muted, marginTop: 6, lineHeight: 1.35 }}>{note}</div> : null}
    </div>
  );
}

/** The diverging key: −2.5 to +2.5 °C, sand at the normal. */
export function ScaleBar({
  width = 260,
  height = 8,
  ticks = [-2, -1, 0, 1, 2],
  label = '°C against 1961–1990',
  marker
}: {
  width?: number | string;
  height?: number;
  ticks?: number[];
  label?: string;
  /** A value to point at on the scale. */
  marker?: number;
}) {
  const steps = 20;
  const at = (v: number) => `${((v + DOMAIN) / (2 * DOMAIN)) * 100}%`;
  return (
    <div style={{ width, fontFamily: I.mono, fontSize: 10.5, color: I.ink2 }}>
      <div style={{ position: 'relative', display: 'flex', height, borderRadius: 1, overflow: 'visible' }}>
        {Array.from({ length: steps }, (_, i) => {
          const v = -DOMAIN + (2 * DOMAIN * (i + 0.5)) / steps;
          return <span key={v} style={{ flex: 1, background: anomalyColor(v) }} />;
        })}
        <span style={{ position: 'absolute', left: '50%', top: -3, bottom: -3, width: 1, background: I.ink }} />
        {marker !== undefined ? (
          <span
            style={{
              position: 'absolute',
              left: at(Math.max(-DOMAIN, Math.min(DOMAIN, marker))),
              top: -5,
              bottom: -5,
              width: 3,
              marginLeft: -1.5,
              borderRadius: 2,
              background: I.ink,
              boxShadow: `0 0 0 1.5px ${I.card}`
            }}
          />
        ) : null}
      </div>
      <div style={{ position: 'relative', height: 14, marginTop: 5 }}>
        {ticks.map((tick) => (
          <span
            key={tick}
            style={{ position: 'absolute', left: at(tick), transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
          >
            {tick === 0 ? '0' : fmtC(tick, 0, false)}
          </span>
        ))}
      </div>
      {label ? <div style={{ fontFamily: I.sans, fontSize: 11.5, color: I.muted, marginTop: 2 }}>{label}</div> : null}
    </div>
  );
}

/**
 * Warming stripes: one stripe per year, coloured by its anomaly. Optional
 * highlight for one year and a bracket over the 1961–1990 normal.
 */
export function Stripes({
  values,
  width,
  height,
  highlight,
  axis = true,
  normal = true,
  gap = 0
}: {
  values: number[];
  width: number;
  height: number;
  highlight?: number;
  axis?: boolean;
  normal?: boolean;
  gap?: number;
}) {
  const n = values.length;
  const w = width / n;
  const top = normal ? 16 : 0;
  const total = height + top + (axis ? 18 : 0);
  const x = (year: number) => (year - FIRST_YEAR) * w;
  return (
    <svg width={width} height={total} viewBox={`0 0 ${width} ${total}`} aria-hidden='true' style={{ display: 'block', overflow: 'visible' }}>
      {normal ? (
        <g>
          <path d={`M${x(1961) + 0.5} ${top - 4}V${top - 9}H${x(1991) - 0.5}V${top - 4}`} fill='none' stroke={I.ink2} strokeWidth={0.8} />
          <text x={x(1976)} y={top - 12} textAnchor='middle' fontFamily={I.mono} fontSize={10} fill={I.ink2}>
            normal 1961–1990
          </text>
        </g>
      ) : null}
      {values.map((v, i) => (
        <rect key={YEARS[i]} x={i * w} y={top} width={Math.max(0.5, w - gap + 0.35)} height={height} fill={anomalyColor(v)} />
      ))}
      {highlight !== undefined ? (
        <rect
          x={x(highlight) - 1}
          y={top - 3}
          width={w + 2}
          height={height + 6}
          fill='none'
          stroke={I.ink}
          strokeWidth={1.5}
        />
      ) : null}
      {axis ? (
        <g fontFamily={I.mono} fontSize={10.5} fill={I.ink2}>
          {[FIRST_YEAR, 1990, LAST_YEAR].map((year) => (
            <text
              key={year}
              x={year === FIRST_YEAR ? 0 : year === LAST_YEAR ? width : x(year) + w / 2}
              y={top + height + 14}
              textAnchor={year === FIRST_YEAR ? 'start' : year === LAST_YEAR ? 'end' : 'middle'}
            >
              {year}
            </text>
          ))}
        </g>
      ) : null}
    </svg>
  );
}

/** Tiny stripes for a table row. */
export function MiniStripes({ values, width = 120, height = 14 }: { values: number[]; width?: number; height?: number }) {
  return <Stripes values={values} width={width} height={height} axis={false} normal={false} />;
}

export function Divider() {
  return <div style={{ height: 1, background: I.line, margin: '14px 0' }} />;
}
