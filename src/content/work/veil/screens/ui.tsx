import type * as React from 'react';
import { StatusBar } from '~/components/frames/Phone';
import { type Bar, HEIGHTS, PRINT, type Print, V, describeBars, groups } from './model';

const R = 10;
const CY = 12;
const half = (y: number) => Math.sqrt(Math.max(0, R * R - (y - CY) ** 2));
/** One horizontal band of the disc, from y1 down to y2, following its edge. */
function band(y1: number, y2: number) {
  const a = half(y1);
  const b = half(y2);
  const f = (n: number) => n.toFixed(3);
  return `M${f(12 - a)} ${y1}H${f(12 + a)}A${R} ${R} 0 0 1 ${f(12 + b)} ${y2}H${f(12 - b)}A${R} ${R} 0 0 1 ${f(12 - a)} ${y1}Z`;
}
const MARK = [`M2 ${CY}A${R} ${R} 0 0 1 22 ${CY}Z`, band(13.5, 15.6), band(17, 18.9), band(20.2, 22)];

/** A disc with its lower half behind a veil of three bars. */
export function Mark({ size = 24, color = V.blue }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' aria-hidden='true' style={{ display: 'block', flex: 'none' }}>
      {MARK.map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
    </svg>
  );
}

export function AppIcon({ size = 64 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.23,
        background: V.blue,
        display: 'grid',
        placeItems: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'
      }}
    >
      <Mark size={size * 0.56} color={V.fog} />
    </div>
  );
}

type IconName =
  | 'send'
  | 'receive'
  | 'scan'
  | 'home'
  | 'activity'
  | 'people'
  | 'shield'
  | 'lock'
  | 'check'
  | 'warn'
  | 'back'
  | 'close'
  | 'down'
  | 'copy'
  | 'share'
  | 'hold'
  | 'search'
  | 'paste'
  | 'right'
  | 'key'
  | 'phone';

const PATHS: Record<IconName, React.ReactNode> = {
  send: <path d='M7 17L17 7M9 7h8v8' />,
  receive: <path d='M17 7L7 17M15 17H7V9' />,
  scan: <path d='M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15M7.5 12h9' />,
  home: <path d='M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z' />,
  activity: <path d='M4 6.5h16M4 12h16M4 17.5h10' />,
  people: (
    <>
      <circle cx='9' cy='8.5' r='3.5' />
      <path d='M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.8c1.6.6 2.7 2.2 3 4.7' />
    </>
  ),
  shield: <path d='M12 3.5l7 2.6v5.4c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6.1z' />,
  lock: (
    <>
      <rect x='5' y='10.5' width='14' height='10' rx='2' />
      <path d='M8 10.5V8a4 4 0 0 1 8 0v2.5' />
    </>
  ),
  check: <path d='M5 12.5l4.5 4.5L19 7.5' />,
  warn: <path d='M12 4l9 16H3zM12 10v4.5M12 17.4v.1' />,
  back: <path d='M14.5 5.5L8 12l6.5 6.5' />,
  close: <path d='M6 6l12 12M18 6L6 18' />,
  down: <path d='M7 10l5 5 5-5' />,
  copy: (
    <>
      <rect x='8.5' y='8.5' width='11' height='11' rx='2' />
      <path d='M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5' />
    </>
  ),
  share: <path d='M12 15V4M8 8l4-4 4 4M5 12.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6.5' />,
  hold: (
    <>
      <circle cx='12' cy='12' r='3.2' />
      <circle cx='12' cy='12' r='7.5' strokeDasharray='2.4 2.6' />
    </>
  ),
  search: (
    <>
      <circle cx='11' cy='11' r='6.5' />
      <path d='M16 16l4 4' />
    </>
  ),
  paste: (
    <>
      <rect x='5.5' y='5' width='13' height='15.5' rx='2' />
      <path d='M9 5V3.8h6V5M9 11h6M9 14.5h4' />
    </>
  ),
  right: <path d='M9.5 5.5L16 12l-6.5 6.5' />,
  key: (
    <>
      <circle cx='8' cy='15' r='4' />
      <path d='M11 12l8.5-8.5M16.5 6.5l2.5 2.5M14 9l2 2' />
    </>
  ),
  phone: (
    <>
      <rect x='7' y='3' width='10' height='18' rx='2.5' />
      <path d='M11 17.8h2' />
    </>
  )
};

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  stroke = 1.7
}: {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      style={{ display: 'block', flex: 'none' }}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Six bars, each with a colour and a height. */
export function Bars({
  bars,
  height = 22,
  width = 7,
  gap = 3,
  radius = 2
}: {
  bars: Bar[];
  height?: number;
  width?: number;
  gap?: number;
  radius?: number;
}) {
  return (
    <span
      role='img'
      aria-label={`Colour fingerprint: ${describeBars(bars)}`}
      style={{ display: 'inline-flex', alignItems: 'flex-end', gap, height, flex: 'none' }}
    >
      {bars.map((bar, index) => (
        <span
          key={index}
          style={{
            width,
            height: Math.round(height * HEIGHTS[bar.height]),
            borderRadius: radius,
            background: PRINT[bar.colour].hex
          }}
        />
      ))}
    </span>
  );
}

/** The three words, set in the serif. */
export function Words({ print, size = 28, color = V.ink, dot = V.faint }: { print: Print; size?: number; color?: string; dot?: string }) {
  return (
    <span style={{ fontFamily: V.serif, fontSize: size, lineHeight: 1.05, letterSpacing: '-0.01em', color }}>
      {print.words.map((word, index) => (
        <span key={word}>
          {index ? <span style={{ color: dot }}>{'\u00A0· '}</span> : null}
          {word}
        </span>
      ))}
    </span>
  );
}

/**
 * An address in groups of four. With `against`, characters that differ from
 * the saved address are marked.
 */
export function Address({
  address,
  against,
  size = 14,
  color = V.ink,
  gap = 0.5,
  mark = V.redInk,
  markBg = V.redTint,
  wrap = true
}: {
  address: string;
  against?: string;
  size?: number;
  color?: string;
  gap?: number;
  mark?: string;
  markBg?: string;
  wrap?: boolean;
}) {
  const parts = groups(address);
  let offset = 0;
  return (
    <span
      style={{
        fontFamily: V.mono,
        fontSize: size,
        lineHeight: 1.55,
        color,
        display: 'inline-flex',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        columnGap: `${gap}em`,
        letterSpacing: '0.01em'
      }}
    >
      {parts.map((part, index) => {
        const start = offset;
        offset += part.length;
        return (
          <span key={index} style={{ whiteSpace: 'nowrap', color: index === 0 ? V.faint : undefined }}>
            {against
              ? [...part].map((char, i) => {
                  const other = against[start + i];
                  const differs = index > 0 && other?.toLowerCase() !== char.toLowerCase();
                  return (
                    <span
                      key={i}
                      style={differs ? { color: mark, background: markBg, borderRadius: 2 } : undefined}
                    >
                      {char}
                    </span>
                  );
                })
              : part}
          </span>
        );
      })}
    </span>
  );
}

export function Avatar({ initials, tint, size = 40 }: { initials: string; tint: string; size?: number }) {
  return (
    <span
      aria-hidden='true'
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: tint,
        color: V.ink,
        display: 'grid',
        placeItems: 'center',
        fontFamily: V.sans,
        fontSize: size * 0.36,
        fontWeight: 600,
        letterSpacing: '0.01em',
        flex: 'none'
      }}
    >
      {initials}
    </span>
  );
}

export function Chip({
  children,
  tone = 'quiet',
  icon
}: {
  children: React.ReactNode;
  tone?: 'blue' | 'red' | 'quiet' | 'solid';
  icon?: IconName;
}) {
  const style = {
    blue: { color: V.blueInk, background: V.blueTint },
    red: { color: V.redInk, background: V.redTint },
    quiet: { color: V.slate, background: 'rgba(20,23,27,0.06)' },
    solid: { color: V.white, background: V.ink }
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 24,
        padding: icon ? '0 9px 0 7px' : '0 9px',
        borderRadius: 12,
        fontFamily: V.sans,
        fontSize: 12.5,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        ...style
      }}
    >
      {icon ? <Icon name={icon} size={14} stroke={2} /> : null}
      {children}
    </span>
  );
}

/**
 * A money figure that is hidden at rest. The hidden version is a fixed-width
 * blur, so it doesn't give away how many digits there are.
 */
export function Amount({
  value,
  reveal = 0,
  size = 17,
  serif,
  align = 'left',
  color = V.ink,
  blur
}: {
  value: string;
  /** 0 hidden, 1 shown. */
  reveal?: number;
  size?: number;
  serif?: boolean;
  align?: 'left' | 'right';
  color?: string;
  blur?: number;
}) {
  const amount = blur ?? Math.max(4, size * 0.3);
  const placeholder = serif ? 'kr 00 000,00' : '0 000,00';
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-grid',
        justifyItems: align === 'right' ? 'end' : 'start',
        fontFamily: serif ? V.serif : V.sans,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: serif ? '-0.02em' : '-0.005em',
        color,
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums'
      }}
    >
      <span
        aria-hidden={reveal < 0.5}
        style={{ gridArea: '1 / 1', opacity: reveal, filter: `blur(${(1 - reveal) * amount}px)` }}
      >
        {value}
      </span>
      <span
        aria-hidden='true'
        style={{
          gridArea: '1 / 1',
          opacity: (1 - reveal) * 0.9,
          filter: `blur(${amount}px)`,
          color
        }}
      >
        {placeholder}
      </span>
    </span>
  );
}

/** A phone screen at 390 × 844 with Veil's background and status bar. */
export function Screen({
  children,
  background = V.fog,
  time = '08:12',
  style
}: {
  children: React.ReactNode;
  background?: string;
  time?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        background,
        color: V.ink,
        fontFamily: V.sans,
        fontSize: 15,
        letterSpacing: '-0.005em',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <StatusBar color={V.ink} time={time} />
      {children}
    </div>
  );
}

const TABS: { name: string; icon: IconName }[] = [
  { name: 'Home', icon: 'home' },
  { name: 'Activity', icon: 'activity' },
  { name: 'People', icon: 'people' },
  { name: 'Privacy', icon: 'shield' }
];

export function TabBar({ active }: { active: string }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        borderTop: `1px solid ${V.line}`,
        background: 'rgba(245,247,249,0.9)',
        padding: '9px 18px 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)'
      }}
    >
      {TABS.map((tab) => (
        <div
          key={tab.name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 500,
            color: tab.name === active ? V.ink : V.faint
          }}
        >
          <Icon name={tab.icon} size={23} stroke={tab.name === active ? 1.9 : 1.6} />
          {tab.name}
        </div>
      ))}
    </div>
  );
}

/** Top row of a pushed screen: back, title, and an optional right item. */
export function NavBar({ title, right, icon = 'back' }: { title: string; right?: React.ReactNode; icon?: IconName }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 40px',
        alignItems: 'center',
        padding: '6px 14px 10px',
        height: 48
      }}
    >
      <span style={{ width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', background: 'rgba(20,23,27,0.05)' }}>
        <Icon name={icon} size={20} />
      </span>
      <span style={{ textAlign: 'center', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</span>
      <span style={{ justifySelf: 'end' }}>{right}</span>
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: V.paper,
        borderRadius: 18,
        boxShadow: `0 0 0 1px ${V.line}, 0 1px 2px rgba(20,23,27,0.04)`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  tone = 'blue',
  style
}: {
  children: React.ReactNode;
  tone?: 'blue' | 'ink' | 'ghost' | 'red';
  style?: React.CSSProperties;
}) {
  const tones = {
    blue: { background: V.blue, color: V.white },
    ink: { background: V.ink, color: V.white },
    ghost: { background: 'transparent', color: V.ink, boxShadow: `inset 0 0 0 1px ${V.lineStrong}` },
    red: { background: 'transparent', color: V.redInk, boxShadow: `inset 0 0 0 1px rgba(199,56,13,0.35)` }
  }[tone];
  return (
    <div
      style={{
        height: 52,
        borderRadius: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        ...tones,
        ...style
      }}
    >
      {children}
    </div>
  );
}

/** Small label above a group. */
export function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 12.5, fontWeight: 500, color: V.slate, letterSpacing: '0.005em', ...style }}>{children}</div>;
}

/** Token discs for the three kinds of money. */
export function Token({ kind, size = 36 }: { kind: 'eur' | 'nok' | 'btc'; size?: number }) {
  const style = {
    eur: { background: V.blue, color: V.white, glyph: '€' },
    nok: { background: V.ink, color: V.fog, glyph: 'kr' },
    btc: { background: V.lilac, color: V.ink, glyph: '₿' }
  }[kind];
  return (
    <span
      aria-hidden='true'
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: style.background,
        color: style.color,
        display: 'grid',
        placeItems: 'center',
        fontFamily: V.serif,
        fontSize: kind === 'nok' ? size * 0.46 : size * 0.56,
        lineHeight: 1,
        flex: 'none',
        paddingBottom: kind === 'nok' ? size * 0.04 : 0
      }}
    >
      {style.glyph}
    </span>
  );
}
