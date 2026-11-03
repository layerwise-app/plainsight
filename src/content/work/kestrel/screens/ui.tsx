import type * as React from 'react';
import { K } from './model';

export function Mark({ size = 22, color = K.lime }: { size?: number; color?: string }) {
  // A kestrel's swept wing, folded into a K.
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M4 3h3.2v8.1L15.6 3H20l-7.4 7.2L20.5 21h-4.3l-6-8.3-3 2.9V21H4z' fill={color} />
      <path d='M15.6 3H20l-7.4 7.2-1.7-1.6z' fill={color} opacity='0.55' />
    </svg>
  );
}

export function Pill({
  children,
  tone = 'muted'
}: {
  children: React.ReactNode;
  tone?: 'lime' | 'red' | 'amber' | 'muted';
}) {
  const color = { lime: K.lime, red: K.red, amber: K.amber, muted: K.muted }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        padding: '0 8px',
        borderRadius: 5,
        fontSize: 11.5,
        fontWeight: 500,
        letterSpacing: '0.01em',
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 9, background: color }} />
      {children}
    </span>
  );
}

const NAV = ['Agents', 'Guardrails', 'Approvals', 'Activity', 'Reports'];

export function Sidebar({ active }: { active: string }) {
  return (
    <aside
      style={{
        width: 196,
        flex: 'none',
        borderRight: `1px solid ${K.line}`,
        padding: '18px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: K.bg
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '2px 8px 22px' }}>
        <Mark />
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>Kestrel</span>
      </div>
      {NAV.map((item) => (
        <div
          key={item}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 32,
            padding: '0 10px',
            borderRadius: 6,
            fontSize: 13,
            color: item === active ? K.text : K.muted,
            background: item === active ? K.raised : 'transparent'
          }}
        >
          {item}
          {item === 'Approvals' ? (
            <span
              style={{
                fontFamily: K.mono,
                fontSize: 11,
                color: K.limeInk,
                background: K.lime,
                borderRadius: 4,
                padding: '1px 5px'
              }}
            >
              2
            </span>
          ) : null}
        </div>
      ))}
      <div style={{ marginTop: 'auto', padding: '12px 10px 0', borderTop: `1px solid ${K.line}` }}>
        <div style={{ fontSize: 12.5 }}>Nordre Fjord Capital</div>
        <div style={{ fontSize: 11.5, color: K.muted, marginTop: 2 }}>Live Haugen · Risk</div>
      </div>
    </aside>
  );
}

export function Sparkline({
  values,
  width,
  height,
  color = K.lime,
  fill = true
}: {
  values: number[];
  width: number;
  height: number;
  color?: string;
  fill?: boolean;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = (i: number) => (i / (values.length - 1)) * width;
  const y = (v: number) => height - 2 - ((v - min) / (max - min || 1)) * (height - 4);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  return (
    <svg width={width} height={height} aria-hidden='true' style={{ display: 'block', overflow: 'visible' }}>
      {fill ? <path d={`${d}L${width},${height}L0,${height}Z`} fill={color} opacity={0.08} /> : null}
      <path d={d} fill='none' stroke={color} strokeWidth={1.5} strokeLinejoin='round' />
    </svg>
  );
}

/** The equity curve with blocked trades marked under it. */
export function EquityChart({
  curve,
  baseline,
  blockedDays,
  width,
  height,
  progress = 1,
  pulse = 0,
  fluid
}: {
  curve: number[];
  baseline?: number[];
  blockedDays?: number[];
  width: number;
  height: number;
  /** 0–1: how much of the line is drawn. */
  progress?: number;
  /** 0–1: the live point's pulse, for motion. */
  pulse?: number;
  /** Fill the parent's width, keeping the drawing's proportions. */
  fluid?: boolean;
}) {
  const all = [...curve, ...(baseline ?? [])];
  const min = Math.min(...all) - 0.6;
  const max = Math.max(...all) + 0.6;
  const padBottom = 26;
  const x = (i: number) => (i / (curve.length - 1)) * width;
  const y = (v: number) => (height - padBottom) * (1 - (v - min) / (max - min));
  const visible = Math.max(2, Math.round(curve.length * progress));
  const path = (values: number[], count = values.length) =>
    values
      .slice(0, count)
      .map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
      .join('');
  const ticks = [Math.ceil(min), Math.round((min + max) / 2), Math.floor(max)];
  const last = curve[visible - 1];

  return (
    <svg
      width={fluid ? '100%' : width}
      height={fluid ? undefined : height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden='true'
      style={{ display: 'block', overflow: 'visible' }}
    >
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={0} x2={width} y1={y(tick)} y2={y(tick)} stroke={K.line} />
          <text x={width} y={y(tick) - 5} fill={K.faint} fontSize={10.5} textAnchor='end' fontFamily={K.mono}>
            {tick}
          </text>
        </g>
      ))}
      {baseline ? (
        <path d={path(baseline, visible)} fill='none' stroke={K.muted} strokeWidth={1.2} strokeDasharray='3 4' opacity={0.7} />
      ) : null}
      <path d={`${path(curve, visible)}L${x(visible - 1)},${height - padBottom}L0,${height - padBottom}Z`} fill={K.lime} opacity={0.07} />
      <path d={path(curve, visible)} fill='none' stroke={K.lime} strokeWidth={1.8} strokeLinejoin='round' />
      <circle cx={x(visible - 1)} cy={y(last)} r={3.5} fill={K.lime} />
      <circle cx={x(visible - 1)} cy={y(last)} r={6 + pulse * 10} fill={K.lime} opacity={0.26 * (1 - pulse)} />
      {(blockedDays ?? []).map((day, i) => (
        <rect
          key={`${day}-${i}`}
          x={x(day) - 1}
          y={height - 16}
          width={2}
          height={12}
          rx={1}
          fill={K.red}
          opacity={day <= visible ? 0.9 : 0.2}
        />
      ))}
      <line x1={0} x2={width} y1={height - padBottom + 6} y2={height - padBottom + 6} stroke={K.line} />
    </svg>
  );
}

export function Stat({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: string }) {
  return (
    <div style={{ padding: '14px 16px', border: `1px solid ${K.line}`, borderRadius: 8, background: K.panel }}>
      <div style={{ fontSize: 11.5, color: K.muted }}>{label}</div>
      <div style={{ fontFamily: K.mono, fontSize: 22, letterSpacing: '-0.03em', marginTop: 8, color: tone ?? K.text }}>
        {value}
      </div>
      {note ? <div style={{ fontSize: 11.5, color: K.faint, marginTop: 4 }}>{note}</div> : null}
    </div>
  );
}

export function AppFrame({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: K.bg,
        color: K.text,
        fontFamily: K.sans,
        fontSize: 13,
        letterSpacing: '-0.006em'
      }}
    >
      <Sidebar active={active} />
      <main style={{ flex: 1, minWidth: 0, padding: '20px 26px', display: 'flex', flexDirection: 'column' }}>{children}</main>
    </div>
  );
}

export function PageHead({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.025em' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: K.muted, fontSize: 12 }}>{right}</div>
    </div>
  );
}
