import type * as React from 'react';
import { StatusBar } from '~/components/frames/Phone';
import { K, avatarColor, head, initials } from './model';

/** Kvarter's mark: a block of four windows, one of them lit. */
export function Mark({ size = 28, lit = K.yellow, body = K.brick, pane = K.paper }: { size?: number; lit?: string; body?: string; pane?: string }) {
  return (
    <svg width={size} height={size} viewBox='0 0 32 32' aria-hidden='true' style={{ display: 'block', flex: 'none' }}>
      <rect x='1' y='1' width='30' height='30' rx='7' fill={body} />
      <rect x='7' y='7' width='8' height='8' rx='1.6' fill={pane} />
      <rect x='17' y='7' width='8' height='8' rx='1.6' fill={lit} />
      <rect x='7' y='17' width='8' height='8' rx='1.6' fill={pane} />
      <rect x='17' y='17' width='8' height='8' rx='1.6' fill={pane} />
    </svg>
  );
}

export function Wordmark({ size = 24, color = K.ink, mark = true }: { size?: number; color?: string; mark?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.32, color }}>
      {mark ? <Mark size={size * 1.08} /> : null}
      <span style={{ ...head(size * 1.12, 800, 75), letterSpacing: '-0.01em', lineHeight: 1 }}>Kvarter</span>
    </span>
  );
}

type IconName =
  | 'home'
  | 'book'
  | 'report'
  | 'people'
  | 'me'
  | 'bell'
  | 'chevron'
  | 'back'
  | 'check'
  | 'drop'
  | 'clock'
  | 'pin'
  | 'lock'
  | 'eye'
  | 'plus'
  | 'vote'
  | 'search'
  | 'print'
  | 'megaphone';

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d='M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z' />,
  book: (
    <>
      <rect x='4' y='5.5' width='16' height='14.5' rx='2.5' />
      <path d='M4 10h16M8.5 3.5v4M15.5 3.5v4' />
    </>
  ),
  report: (
    <>
      <path d='M14.6 5.2a4.2 4.2 0 0 0-5.3 5.3L4.6 15.2a1.9 1.9 0 0 0 2.7 2.7L12 13.2a4.2 4.2 0 0 0 5.3-5.3l-2.6 2.6-2.3-.4-.4-2.3z' />
    </>
  ),
  people: (
    <>
      <circle cx='9' cy='8.5' r='3.2' />
      <path d='M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5' />
      <path d='M15.5 5.6a3 3 0 0 1 0 5.8M17.2 14.3c1.7.6 2.9 2.2 3.3 4.7' />
    </>
  ),
  me: (
    <>
      <circle cx='12' cy='12' r='8.5' />
      <circle cx='12' cy='10' r='3' />
      <path d='M6.4 18.2c1.2-2 3.2-3.1 5.6-3.1s4.4 1.1 5.6 3.1' />
    </>
  ),
  bell: (
    <>
      <path d='M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z' />
      <path d='M10 20.5a2.2 2.2 0 0 0 4 0' />
    </>
  ),
  chevron: <path d='m9.5 6 6 6-6 6' />,
  back: <path d='M14.5 6 8.5 12l6 6' />,
  check: <path d='m5.5 12.5 4 4 9-9.5' />,
  drop: <path d='M12 3.8s-5.8 6.4-5.8 10.4a5.8 5.8 0 0 0 11.6 0C17.8 10.2 12 3.8 12 3.8z' />,
  clock: (
    <>
      <circle cx='12' cy='12' r='8.5' />
      <path d='M12 7.5V12l3 2' />
    </>
  ),
  pin: (
    <>
      <path d='M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z' />
      <circle cx='12' cy='10' r='2.3' />
    </>
  ),
  lock: (
    <>
      <rect x='5' y='10.5' width='14' height='10' rx='2.2' />
      <path d='M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5' />
    </>
  ),
  eye: (
    <>
      <path d='M2.8 12s3.4-6 9.2-6 9.2 6 9.2 6-3.4 6-9.2 6-9.2-6-9.2-6z' />
      <circle cx='12' cy='12' r='2.8' />
    </>
  ),
  plus: <path d='M12 5v14M5 12h14' />,
  vote: (
    <>
      <path d='M4.5 13.5h15V20h-15z' />
      <path d='m8.5 10 2.5 2.5 5-6' />
    </>
  ),
  search: (
    <>
      <circle cx='10.5' cy='10.5' r='6' />
      <path d='m15 15 5 5' />
    </>
  ),
  print: (
    <>
      <path d='M7 9V4h10v5' />
      <rect x='4' y='9' width='16' height='8' rx='2' />
      <path d='M7.5 14.5h9V20h-9z' />
    </>
  ),
  megaphone: (
    <>
      <path d='M4 10v4h3l8 4.5v-13L7 10z' />
      <path d='M18 9.5a3.5 3.5 0 0 1 0 5M8 14l1 5h2.5l-1-4.4' />
    </>
  )
};

export function Icon({ name, size = 20, color = 'currentColor', stroke = 1.8, fill = 'none' }: { name: IconName; size?: number; color?: string; stroke?: number; fill?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      aria-hidden='true'
      fill={fill}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ display: 'block', flex: 'none' }}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Initials on colour for residents who show their name; a flat glyph for everyone else. */
export function Avatar({ flat, name, size = 34, color }: { flat: string; name?: string; size?: number; color?: string }) {
  if (!name) {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.3,
          flex: 'none',
          background: K.paperDeep,
          color: K.muted,
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox='0 0 16 16' aria-hidden='true'>
          <rect x='2' y='2' width='5' height='5' rx='1' fill={K.muted} opacity='0.55' />
          <rect x='9' y='2' width='5' height='5' rx='1' fill={K.muted} opacity='0.55' />
          <rect x='2' y='9' width='5' height='5' rx='1' fill={K.muted} opacity='0.55' />
          <rect x='9' y='9' width='5' height='5' rx='1' fill={K.muted} />
        </svg>
      </span>
    );
  }
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        flex: 'none',
        background: color ?? avatarColor(flat),
        color: K.paper,
        display: 'grid',
        placeItems: 'center',
        fontFamily: K.sans,
        fontSize: size * 0.38,
        fontWeight: 650,
        fontStretch: '85%',
        letterSpacing: '0.01em'
      }}
    >
      {initials(name)}
    </span>
  );
}

/** A flat number set as a small tag: H0204. */
export function FlatTag({ flat, tone = 'plain' }: { flat: string; tone?: 'plain' | 'mine' | 'board' }) {
  const colors = {
    plain: { color: K.ink, background: K.paperDeep },
    mine: { color: K.paper, background: K.moss },
    board: { color: K.paper, background: K.brick }
  }[tone];
  return (
    <span
      style={{
        ...colors,
        fontFamily: K.sans,
        fontSize: 11.5,
        fontWeight: 600,
        fontStretch: '85%',
        letterSpacing: '0.04em',
        padding: '2px 6px 2px',
        borderRadius: 5,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap'
      }}
    >
      {flat}
    </span>
  );
}

const TABS: { name: IconName; label: string }[] = [
  { name: 'home', label: 'Home' },
  { name: 'book', label: 'Book' },
  { name: 'report', label: 'Report' },
  { name: 'people', label: 'Neighbours' },
  { name: 'me', label: 'You' }
];

export function TabBar({ active }: { active: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 86,
        background: K.card,
        borderTop: `1px solid ${K.line}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        padding: '9px 8px 0'
      }}
    >
      {TABS.map((tab) => {
        const on = tab.label === active;
        return (
          <div
            key={tab.label}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: on ? K.ink : K.faint }}
          >
            <span style={{ position: 'relative' }}>
              <Icon name={tab.name} size={24} stroke={on ? 2.1 : 1.7} fill={on ? K.yellow : 'none'} />
            </span>
            <span style={{ fontSize: 11, fontWeight: on ? 650 : 500, fontStretch: '88%', letterSpacing: '0.01em' }}>{tab.label}</span>
          </div>
        );
      })}
      <span
        style={{ position: 'absolute', left: '50%', bottom: 8, width: 134, height: 5, marginLeft: -67, borderRadius: 3, background: K.ink }}
      />
    </div>
  );
}

/** A 390 × 844 phone screen in Kvarter's paper. */
export function Screen({
  children,
  tab,
  time = '21:12',
  background = K.paper,
  dark,
  status
}: {
  children: React.ReactNode;
  tab?: string;
  time?: string;
  background?: string;
  dark?: boolean;
  /** Status bar colour, when the top of the screen differs from the rest. */
  status?: string;
}) {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        position: 'relative',
        overflow: 'hidden',
        background,
        color: dark ? K.paper : K.ink,
        fontFamily: K.sans,
        fontSize: 15,
        letterSpacing: '-0.005em',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <StatusBar color={status ?? (dark ? K.paper : K.ink)} time={time} />
      {children}
      {tab ? <TabBar active={tab} /> : null}
    </div>
  );
}

/** Back arrow, title and an optional action, for screens below the tabs. */
export function NavBar({ title, action, dark }: { title?: string; action?: React.ReactNode; dark?: boolean }) {
  return (
    <div
      style={{
        height: 48,
        padding: '0 18px 0 12px',
        display: 'grid',
        gridTemplateColumns: '44px 1fr 44px',
        alignItems: 'center',
        color: dark ? K.paper : K.ink
      }}
    >
      <span style={{ width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center' }}>
        <Icon name='back' size={24} stroke={2} />
      </span>
      <span style={{ textAlign: 'center', fontSize: 15, fontWeight: 600, fontStretch: '88%' }}>{title}</span>
      <span style={{ justifySelf: 'end' }}>{action}</span>
    </div>
  );
}

export function Button({
  children,
  tone = 'ink',
  style
}: {
  children: React.ReactNode;
  tone?: 'ink' | 'brick' | 'moss' | 'ghost' | 'yellow';
  style?: React.CSSProperties;
}) {
  const colors = {
    ink: { background: K.ink, color: K.paper },
    brick: { background: K.brick, color: K.paper },
    moss: { background: K.moss, color: K.paper },
    yellow: { background: K.yellow, color: K.ink },
    ghost: { background: 'transparent', color: K.ink, boxShadow: `inset 0 0 0 1.5px ${K.lineStrong}` }
  }[tone];
  return (
    <div
      style={{
        height: 54,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontSize: 16.5,
        fontWeight: 620,
        fontStretch: '90%',
        letterSpacing: '0',
        ...colors,
        ...style
      }}
    >
      {children}
    </div>
  );
}

/** Thin progress made of segments, one per flat or per vote. */
export function Segments({ total, filled, color = K.moss, height = 8, gap = 2 }: { total: number; filled: number; color?: string; height?: number; gap?: number }) {
  return (
    <div style={{ display: 'flex', gap, height }}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          style={{ flex: 1, borderRadius: 1.5, background: index < filled ? color : 'rgba(30,41,68,0.1)' }}
        />
      ))}
    </div>
  );
}
