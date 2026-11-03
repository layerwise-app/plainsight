import type * as React from 'react';

type PhoneProps = {
  /** Screen width in CSS pixels; the screen is drawn at 390 × 844 and scaled. */
  width?: number;
  /** Body colour of the frame. */
  finish?: 'graphite' | 'silver' | 'sand';
  className?: string;
  style?: React.CSSProperties;
  /** The app screen, laid out at 390 × 844. */
  children: React.ReactNode;
};

const FINISH = {
  graphite: { body: '#1c1c1e', edge: '#3a3a3d', highlight: 'rgba(255,255,255,0.18)' },
  silver: { body: '#d8d8d6', edge: '#f4f4f2', highlight: 'rgba(255,255,255,0.7)' },
  sand: { body: '#cbbfae', edge: '#e9e0d2', highlight: 'rgba(255,255,255,0.55)' }
};

export const PHONE_SCREEN = { width: 390, height: 844 };

/** A phone drawn in CSS around a 390 × 844 screen. */
export function Phone({ width = 390, finish = 'graphite', className, style, children }: PhoneProps) {
  const scale = width / PHONE_SCREEN.width;
  const tone = FINISH[finish];
  const bezel = 11;
  const outer = { width: PHONE_SCREEN.width + bezel * 2, height: PHONE_SCREEN.height + bezel * 2 };
  return (
    <div
      className={className}
      style={{ width: outer.width * scale, height: outer.height * scale, position: 'relative', ...style }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: outer.width,
          height: outer.height,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          borderRadius: 64,
          background: `linear-gradient(145deg, ${tone.edge}, ${tone.body} 18%, ${tone.body} 82%, ${tone.edge})`,
          boxShadow: `inset 0 0 0 1.5px ${tone.highlight}, inset 0 0 0 4px ${tone.body}`
        }}
      >
        {/* Side buttons */}
        <span style={{ position: 'absolute', left: -3, top: 180, width: 3, height: 34, borderRadius: 2, background: tone.body }} />
        <span style={{ position: 'absolute', left: -3, top: 236, width: 3, height: 62, borderRadius: 2, background: tone.body }} />
        <span style={{ position: 'absolute', left: -3, top: 310, width: 3, height: 62, borderRadius: 2, background: tone.body }} />
        <span style={{ position: 'absolute', right: -3, top: 262, width: 3, height: 96, borderRadius: 2, background: tone.body }} />
        <div
          style={{
            position: 'absolute',
            left: bezel,
            top: bezel,
            width: PHONE_SCREEN.width,
            height: PHONE_SCREEN.height,
            borderRadius: 54,
            overflow: 'hidden',
            background: '#000',
            isolation: 'isolate'
          }}
        >
          {children}
          {/* Camera island */}
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: 11,
              width: 122,
              height: 36,
              marginLeft: -61,
              borderRadius: 20,
              background: '#050505',
              zIndex: 10
            }}
          />
          {/* Glass sheen */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 11,
              background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Time, signal, Wi-Fi and battery, for the top of a phone screen. */
export function StatusBar({ color = '#000', time = '9:41' }: { color?: string; time?: string }) {
  return (
    <div
      style={{
        height: 54,
        padding: '18px 30px 0 44px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        color,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        position: 'relative',
        zIndex: 5
      }}
    >
      <span>{time}</span>
      <svg width='74' height='14' viewBox='0 0 74 14' fill={color} aria-hidden='true'>
        <rect x='0' y='9' width='3' height='4.5' rx='1' />
        <rect x='5' y='6.5' width='3' height='7' rx='1' />
        <rect x='10' y='4' width='3' height='9.5' rx='1' />
        <rect x='15' y='1.5' width='3' height='12' rx='1' />
        <path d='M31 3.6a10 10 0 0 1 12.8 0l-1.3 1.4a8 8 0 0 0-10.2 0zM33.4 6.3a6.4 6.4 0 0 1 8 0l-1.3 1.4a4.5 4.5 0 0 0-5.4 0zM35.8 9a2.6 2.6 0 0 1 3.2 0l-1.6 1.7z' />
        <rect x='49' y='1.5' width='22' height='11' rx='3.2' fill='none' stroke={color} strokeOpacity='0.4' />
        <rect x='51' y='3.5' width='16' height='7' rx='1.6' />
        <rect x='72.2' y='5' width='1.6' height='4' rx='0.8' fillOpacity='0.4' />
      </svg>
    </div>
  );
}
