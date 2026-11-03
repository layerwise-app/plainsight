import { useId } from 'react';
import { seeded } from './random';

/** Cast concrete: mottled grey, fine pores, formwork seams and tie holes. */
export function Concrete({
  width,
  height,
  tone = '#b9b6b0',
  panel = [0, 0],
  ties = true,
  seed = 11
}: {
  width: number;
  height: number;
  tone?: string;
  /** Formwork panel size in px; [0, 0] for none. */
  panel?: [number, number];
  ties?: boolean;
  seed?: number;
}) {
  const id = useId().replaceAll(':', '');
  const random = seeded(seed);
  const seamsX = panel[0] ? Array.from({ length: Math.ceil(width / panel[0]) }, (_, i) => (i + 1) * panel[0]) : [];
  const seamsY = panel[1] ? Array.from({ length: Math.ceil(height / panel[1]) }, (_, i) => (i + 1) * panel[1]) : [];
  const holes =
    ties && panel[0] && panel[1]
      ? seamsX.flatMap((x) =>
          seamsY.map((y) => ({ x: x - panel[0] / 2 + (random() - 0.5) * 4, y: y - panel[1] / 2 + (random() - 0.5) * 4 }))
        )
      : [];

  return (
    <svg aria-hidden='true' width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <filter id={`mottle${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.004 0.006' numOctaves={4} seed={seed} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.1' />
        </filter>
        <filter id={`pores${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves={2} seed={seed + 1} />
          <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 4.6' />
        </filter>
      </defs>
      <rect width={width} height={height} fill={tone} />
      <rect width={width} height={height} filter={`url(#mottle${id})`} opacity={0.22} />
      <rect width={width} height={height} filter={`url(#pores${id})`} opacity={0.3} />
      {seamsX.map((x) => (
        <line key={`x${x}`} x1={x} x2={x} y1={0} y2={height} stroke='rgba(40,36,30,0.22)' strokeWidth={1.2} />
      ))}
      {seamsY.map((y) => (
        <line key={`y${y}`} x1={0} x2={width} y1={y} y2={y} stroke='rgba(40,36,30,0.18)' strokeWidth={1.2} />
      ))}
      {holes.map((hole) => (
        <g key={`${hole.x}-${hole.y}`}>
          <circle cx={hole.x} cy={hole.y} r={5.5} fill='rgba(60,56,50,0.35)' />
          <circle cx={hole.x - 0.8} cy={hole.y - 0.8} r={3.6} fill='rgba(30,28,25,0.45)' />
        </g>
      ))}
    </svg>
  );
}
