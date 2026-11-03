import type * as React from 'react';

type BrowserProps = {
  url: string;
  /** Width of the window in CSS pixels. */
  width: number;
  height: number;
  theme?: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** A plain browser window drawn in CSS around a web app screen. */
export function Browser({ url, width, height, theme = 'light', className, style, children }: BrowserProps) {
  const dark = theme === 'dark';
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: 12,
        overflow: 'hidden',
        background: dark ? '#1b1c1e' : '#f6f6f4',
        boxShadow: dark
          ? '0 0 0 1px rgba(255,255,255,0.08), 0 1px 0 rgba(255,255,255,0.06) inset'
          : '0 0 0 1px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      <div
        style={{
          height: 38,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 14px',
          borderBottom: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)'
        }}
      >
        {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
          <span
            key={color}
            style={{ width: 11, height: 11, borderRadius: 99, background: dark ? '#3a3b3e' : color, opacity: dark ? 1 : 0.9 }}
          />
        ))}
        <div
          style={{
            margin: '0 auto',
            width: Math.min(420, width * 0.42),
            height: 24,
            borderRadius: 7,
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 12,
            lineHeight: '24px',
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}
        >
          {url}
        </div>
        <span style={{ width: 49 }} />
      </div>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}
