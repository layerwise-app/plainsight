import type * as React from 'react';

/** Lays a screen out at its design size and shows it scaled. */
export function Scaled({
  width,
  height,
  scale,
  className,
  style,
  children
}: {
  width: number;
  height: number;
  scale: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className={className} style={{ width: width * scale, height: height * scale, position: 'relative', ...style }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0', position: 'absolute', inset: 0 }}>
        {children}
      </div>
    </div>
  );
}
