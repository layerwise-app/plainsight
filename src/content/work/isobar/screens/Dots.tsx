import { useEffect, useRef } from 'react';

export type Dot = {
  x: number;
  y: number;
  /** Radius in px. */
  r: number;
  color: string;
  /** Horizontal stretch, for dots on water. */
  stretch?: number;
};

/**
 * Fills dots grouped by colour: one path per colour keeps big fields fast.
 * `rim` adds a hairline round each dot, so pale dots still read on paper.
 */
export function paintDots(context: CanvasRenderingContext2D, dots: Dot[], rim?: { color: string; width: number }) {
  const paths = new Map<string, Path2D>();
  for (const dot of dots) {
    if (dot.r <= 0.25) continue;
    let path = paths.get(dot.color);
    if (!path) {
      path = new Path2D();
      paths.set(dot.color, path);
    }
    path.moveTo(dot.x + dot.r * (dot.stretch ?? 1), dot.y);
    if (dot.stretch && dot.stretch !== 1) path.ellipse(dot.x, dot.y, dot.r * dot.stretch, dot.r / Math.sqrt(dot.stretch), 0, 0, Math.PI * 2);
    else path.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
  }
  for (const [color, path] of paths) {
    context.fillStyle = color;
    context.fill(path);
    if (rim) {
      context.strokeStyle = rim.color;
      context.lineWidth = rim.width;
      context.stroke(path);
    }
  }
}

/**
 * A canvas that redraws only when `draw` changes. Memoise `draw` on the data
 * it shows, so a still and a live demo render the same thing.
 */
export function DotCanvas({
  width,
  height,
  draw,
  className,
  style
}: {
  width: number;
  height: number;
  draw: (context: CanvasRenderingContext2D, width: number, height: number) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    const w = Math.round(width * ratio);
    const h = Math.round(height * ratio);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    draw(context, width, height);
  }, [width, height, draw]);
  return <canvas ref={ref} aria-hidden='true' className={className} style={{ width, height, display: 'block', ...style }} />;
}
