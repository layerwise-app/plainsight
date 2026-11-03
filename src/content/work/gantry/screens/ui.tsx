import type * as React from 'react';
import { G, type Status } from './model';

/** Gantry's mark: a gantry crane's frame with its trolley, on signal orange. */
export function Mark({ size = 22, color = G.orange, ink = '#fff' }: { size?: number; color?: string; ink?: string }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' aria-hidden='true' style={{ display: 'block', flex: 'none' }}>
      <rect width='24' height='24' rx='5.5' fill={color} />
      <path d='M5.5 19V6.5h13V19' fill='none' stroke={ink} strokeWidth='2.4' strokeLinejoin='round' />
      <rect x='10' y='8.6' width='4' height='3.6' rx='0.6' fill={ink} />
      <path d='M12 12.2v3.4' stroke={ink} strokeWidth='1.4' />
    </svg>
  );
}

type IconName =
  | 'table'
  | 'form'
  | 'text'
  | 'stat'
  | 'button'
  | 'input'
  | 'query'
  | 'database'
  | 'page'
  | 'chevron'
  | 'chevronDown'
  | 'plus'
  | 'lock'
  | 'check'
  | 'eye'
  | 'grip'
  | 'play'
  | 'dots'
  | 'arrowUp'
  | 'bolt'
  | 'search'
  | 'x'
  | 'branch'
  | 'user';

/** Small line icons, drawn on a 16 grid. */
export function Icon({ name, size = 16, color = 'currentColor', stroke = 1.3 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<IconName, React.ReactNode> = {
    table: (
      <>
        <rect x='2.5' y='3' width='11' height='10' rx='1.5' {...p} />
        <path d='M2.5 6.5h11M2.5 9.75h11M6.5 6.5V13' {...p} />
      </>
    ),
    form: (
      <>
        <rect x='2.5' y='2.5' width='11' height='3.5' rx='1' {...p} />
        <rect x='2.5' y='7.5' width='11' height='3.5' rx='1' {...p} />
        <path d='M9.5 13.5h4' {...p} />
      </>
    ),
    text: <path d='M3 4V3h10v1M8 3v10M6 13h4' {...p} />,
    stat: <path d='M3 13V8M6.5 13V5M10 13V9.5M13.5 13V3' {...p} />,
    button: (
      <>
        <rect x='2' y='5' width='12' height='6' rx='3' {...p} />
        <path d='M6 8h4' {...p} />
      </>
    ),
    input: (
      <>
        <rect x='2' y='4.5' width='12' height='7' rx='1.5' {...p} />
        <path d='M5 6.5v3' {...p} />
      </>
    ),
    query: (
      <>
        <path d='M5.5 4L2.5 8l3 4M10.5 4l3 4-3 4' {...p} />
      </>
    ),
    database: (
      <>
        <ellipse cx='8' cy='4' rx='5' ry='1.8' {...p} />
        <path d='M3 4v8c0 1 2.2 1.8 5 1.8s5-.8 5-1.8V4M3 8c0 1 2.2 1.8 5 1.8S13 9 13 8' {...p} />
      </>
    ),
    page: (
      <>
        <path d='M4 2.5h5.5L12 5v8.5H4z' {...p} />
        <path d='M9.5 2.5V5H12' {...p} />
      </>
    ),
    chevron: <path d='M6 4l4 4-4 4' {...p} />,
    chevronDown: <path d='M4 6l4 4 4-4' {...p} />,
    plus: <path d='M8 3.5v9M3.5 8h9' {...p} />,
    lock: (
      <>
        <rect x='3.5' y='7' width='9' height='6.5' rx='1.5' {...p} />
        <path d='M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7' {...p} />
      </>
    ),
    check: <path d='M3.5 8.5l3 3 6-7' {...p} />,
    eye: (
      <>
        <path d='M1.8 8s2.3-4.2 6.2-4.2S14.2 8 14.2 8s-2.3 4.2-6.2 4.2S1.8 8 1.8 8z' {...p} />
        <circle cx='8' cy='8' r='1.9' {...p} />
      </>
    ),
    grip: (
      <>
        {[5, 8, 11].map((y) => (
          <g key={y}>
            <circle cx='6' cy={y} r='0.9' fill={color} />
            <circle cx='10' cy={y} r='0.9' fill={color} />
          </g>
        ))}
      </>
    ),
    play: <path d='M5 3.5v9l7.5-4.5z' {...p} />,
    dots: (
      <>
        {[4, 8, 12].map((x) => (
          <circle key={x} cx={x} cy='8' r='1' fill={color} />
        ))}
      </>
    ),
    arrowUp: <path d='M8 13V3.5M4 7.5l4-4 4 4' {...p} />,
    bolt: <path d='M9 2L4 9h4l-1 5 5-7H8z' {...p} />,
    search: (
      <>
        <circle cx='7' cy='7' r='4' {...p} />
        <path d='M10 10l3.5 3.5' {...p} />
      </>
    ),
    x: <path d='M4 4l8 8M12 4l-8 8' {...p} />,
    branch: (
      <>
        <circle cx='4.5' cy='3.5' r='1.5' {...p} />
        <circle cx='4.5' cy='12.5' r='1.5' {...p} />
        <circle cx='11.5' cy='6' r='1.5' {...p} />
        <path d='M4.5 5v6M11.5 7.5c0 2.5-7 1.5-7 3.5' {...p} />
      </>
    ),
    user: (
      <>
        <circle cx='8' cy='5.5' r='2.5' {...p} />
        <path d='M3 13.5c.6-2.6 2.6-4 5-4s4.4 1.4 5 4' {...p} />
      </>
    )
  };
  return (
    <svg width={size} height={size} viewBox='0 0 16 16' aria-hidden='true' style={{ display: 'block', flex: 'none' }}>
      {paths[name]}
    </svg>
  );
}

export function StatusPill({ status, size = 12 }: { status: Status; size?: number }) {
  const tone = {
    pending: { fg: G.text2, bg: G.sunk, dot: 'transparent', ring: G.muted },
    approved: { fg: G.green, bg: G.greenTint, dot: G.green, ring: G.green },
    rejected: { fg: G.red, bg: G.redTint, dot: G.red, ring: G.red }
  }[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: size + 9,
        padding: '0 8px 0 7px',
        borderRadius: 99,
        fontSize: size,
        fontWeight: 500,
        color: tone.fg,
        background: tone.bg,
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 9, background: tone.dot, boxShadow: `inset 0 0 0 1.4px ${tone.ring}` }} />
      {status === 'pending' ? 'Pending' : status === 'approved' ? 'Approved' : 'Rejected'}
    </span>
  );
}

/** A named piece of data: a query, a table, a database. Orange means live data. */
export function Chip({
  children,
  kind = 'query',
  size = 12,
  quiet
}: {
  children: React.ReactNode;
  kind?: 'query' | 'database' | 'table' | 'form' | 'plain';
  size?: number;
  quiet?: boolean;
}) {
  const icon = kind === 'plain' ? null : kind;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: size + 10,
        padding: icon ? '0 7px 0 5px' : '0 7px',
        borderRadius: 5,
        fontFamily: G.mono,
        fontSize: size - 0.5,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        color: quiet ? G.text2 : G.orangeInk,
        background: quiet ? G.sunk : G.orangeTint,
        boxShadow: `inset 0 0 0 1px ${quiet ? G.line : G.orangeLine}`,
        whiteSpace: 'nowrap',
        verticalAlign: 'middle'
      }}
    >
      {icon ? <Icon name={icon} size={size + 1} stroke={1.4} /> : null}
      {children}
    </span>
  );
}

export function Avatar({ name, size = 22, tone = '#d9d4c8' }: { name: string; size?: number; tone?: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: tone,
        color: G.ink,
        display: 'inline-grid',
        placeItems: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        letterSpacing: '0.01em',
        flex: 'none',
        boxShadow: `0 0 0 1.5px ${G.surface}`
      }}
    >
      {initials}
    </span>
  );
}

export function Check({ on, size = 14, color = G.ink }: { on: boolean; size?: number; color?: string }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 3.5,
        flex: 'none',
        display: 'inline-grid',
        placeItems: 'center',
        background: on ? color : G.surface,
        boxShadow: on ? 'none' : `inset 0 0 0 1.2px ${G.lineStrong}`
      }}
    >
      {on ? <Icon name='check' size={size - 2} color='#fff' stroke={1.9} /> : null}
    </span>
  );
}

export function Switch({ on, size = 1 }: { on: boolean; size?: number }) {
  return (
    <span
      style={{
        width: 26 * size,
        height: 15 * size,
        borderRadius: 99,
        background: on ? G.ink : G.lineStrong,
        position: 'relative',
        flex: 'none',
        display: 'inline-block'
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2 * size,
          left: on ? 13 * size : 2 * size,
          width: 11 * size,
          height: 11 * size,
          borderRadius: 99,
          background: '#fff'
        }}
      />
    </span>
  );
}

export function Button({
  children,
  tone = 'plain',
  size = 12.5,
  style
}: {
  children: React.ReactNode;
  tone?: 'plain' | 'primary' | 'ink' | 'danger' | 'ghost';
  size?: number;
  style?: React.CSSProperties;
}) {
  const tones = {
    plain: { color: G.ink, background: G.surface, boxShadow: `inset 0 0 0 1px ${G.lineStrong}, 0 1px 0 rgba(0,0,0,0.03)` },
    primary: { color: '#fff', background: G.orange, boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.12)' },
    ink: { color: '#fff', background: G.ink, boxShadow: 'none' },
    danger: { color: G.red, background: G.surface, boxShadow: `inset 0 0 0 1px ${G.lineStrong}` },
    ghost: { color: G.text2, background: 'transparent', boxShadow: 'none' }
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: size * 2.3,
        padding: `0 ${size * 0.9}px`,
        borderRadius: 6,
        fontSize: size,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        ...tones,
        ...style
      }}
    >
      {children}
    </span>
  );
}

const KEYWORDS = new Set(
  'select from join on where and or order by asc desc as group count sum max min filter interval now update set limit current_date'.split(' ')
);

/** SQL with Gantry's quiet highlighting: keywords in ink, strings green, bindings in orange. */
export function Sql({
  code,
  size = 12.5,
  lineHeight = 1.7,
  numbers,
  highlight = [],
  added = [],
  removed = []
}: {
  code: string;
  size?: number;
  lineHeight?: number;
  numbers?: boolean;
  /** 1-based line numbers to tint orange. */
  highlight?: number[];
  added?: number[];
  removed?: number[];
}) {
  const lines = code.split('\n');
  return (
    <div style={{ fontFamily: G.mono, fontSize: size, lineHeight, color: G.text2, whiteSpace: 'pre' }}>
      {lines.map((line, index) => {
        const n = index + 1;
        const bg = added.includes(n)
          ? G.greenTint
          : removed.includes(n)
            ? G.redTint
            : highlight.includes(n)
              ? G.orangeTint
              : undefined;
        return (
          <div key={index} style={{ display: 'flex', background: bg, margin: '0 -12px', padding: '0 12px' }}>
            {numbers ? (
              <span style={{ width: size * 2.6, flex: 'none', color: G.faint, textAlign: 'right', paddingRight: size * 1.1, userSelect: 'none' }}>
                {added.includes(n) ? '+' : removed.includes(n) ? '−' : n}
              </span>
            ) : null}
            <span>{tokens(line)}</span>
          </div>
        );
      })}
    </div>
  );
}

function tokens(line: string) {
  const parts = line.split(/(\{\{[^}]*\}\}|'[^']*'|\b\d+(?:\.\d+)?\b|\b[a-z_]+\b|--.*$)/g);
  return parts.map((part, index) => {
    if (!part) return null;
    const key = `${index}${part}`;
    if (part.startsWith('{{'))
      return (
        <span key={key} style={{ color: G.orangeInk, background: G.orangeTint, borderRadius: 3, boxShadow: `0 0 0 1px ${G.orangeLine}` }}>
          {part}
        </span>
      );
    if (part.startsWith("'")) return <span key={key} style={{ color: G.green }}>{part}</span>;
    if (part.startsWith('--')) return <span key={key} style={{ color: G.faint }}>{part}</span>;
    if (/^\d/.test(part)) return <span key={key} style={{ color: G.orangeInk }}>{part}</span>;
    if (KEYWORDS.has(part)) return <span key={key} style={{ color: G.ink, fontWeight: 500 }}>{part}</span>;
    return <span key={key}>{part}</span>;
  });
}

/** A thin section heading inside panels. */
export function Label({ children, right, style }: { children: React.ReactNode; right?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: G.muted, fontWeight: 500, ...style }}>
      <span>{children}</span>
      {right}
    </div>
  );
}
