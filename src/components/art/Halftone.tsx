import { useEffect, useRef } from 'react';

export type HalftoneField = (x: number, y: number, time: number) => { tone: number; color?: string };

/**
 * Draws a scene as a grid of dots on a canvas. `field` returns each cell's
 * tone (0 = no dot, 1 = full dot) and optional colour, for x and y in 0–1.
 */
export function Halftone({
  width,
  height,
  cell = 8,
  field,
  time = 0,
  background = '#fff',
  ink = '#0d0d0d',
  shape = 'circle',
  className,
  style
}: {
  width: number;
  height: number;
  cell?: number;
  field: HalftoneField;
  time?: number;
  background?: string;
  ink?: string;
  shape?: 'circle' | 'square';
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * cell + cell / 2;
        const cy = row * cell + cell / 2;
        const { tone, color } = field(cx / width, cy / height, time);
        if (tone <= 0.02) continue;
        const size = Math.min(1, Math.sqrt(tone)) * cell * 0.56;
        context.fillStyle = color ?? ink;
        context.beginPath();
        if (shape === 'square') context.rect(cx - size, cy - size, size * 2, size * 2);
        else context.arc(cx, cy, size, 0, Math.PI * 2);
        context.fill();
      }
    }
  }, [width, height, cell, field, time, background, ink, shape]);

  return <canvas ref={ref} className={className} style={{ width, height, display: 'block', ...style }} aria-hidden='true' />;
}
