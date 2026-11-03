import type * as React from 'react';

/** A thin-bezel display or framed screen, for hanging an interface on a wall. */
export function Display({
  width,
  height,
  bezel = 10,
  color = '#0e0e0f',
  className,
  style,
  children
}: {
  /** Size of the screen inside the bezel. */
  width: number;
  height: number;
  bezel?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        width: width + bezel * 2,
        height: height + bezel * 2,
        padding: bezel,
        borderRadius: bezel * 0.9,
        background: color,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        ...style
      }}
    >
      <div style={{ width, height, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>{children}</div>
    </div>
  );
}
