import { useId } from 'react';

/** Fine film or plaster grain laid over a scene. */
export function Grain({
  opacity = 0.18,
  frequency = 0.9,
  seed = 3,
  blend = 'multiply',
  className
}: {
  opacity?: number;
  frequency?: number;
  seed?: number;
  blend?: React.CSSProperties['mixBlendMode'];
  className?: string;
}) {
  const id = useId().replaceAll(':', '');
  return (
    <svg
      aria-hidden='true'
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: blend, pointerEvents: 'none' }}
    >
      <filter id={`g${id}`} x='0' y='0' width='100%' height='100%'>
        <feTurbulence type='fractalNoise' baseFrequency={frequency} numOctaves={3} seed={seed} stitchTiles='stitch' />
        <feColorMatrix type='saturate' values='0' />
        <feComponentTransfer>
          <feFuncA type='linear' slope='1.2' />
        </feComponentTransfer>
      </filter>
      <rect width='100%' height='100%' filter={`url(#g${id})`} />
    </svg>
  );
}
