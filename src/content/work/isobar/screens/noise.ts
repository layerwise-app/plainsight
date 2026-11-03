import { seeded } from '~/components/art/random';

export type Noise2 = (x: number, y: number) => number;

/** Seeded 2D gradient noise, roughly −0.7 to 0.7. */
export function gradientNoise(seed: number): Noise2 {
  const random = seeded(seed);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const gx = new Float32Array(16);
  const gy = new Float32Array(16);
  for (let i = 0; i < 16; i++) {
    gx[i] = Math.cos((i / 16) * Math.PI * 2);
    gy[i] = Math.sin((i / 16) * Math.PI * 2);
  }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const X = xi & 255;
    const Y = yi & 255;
    const dot = (h: number, dx: number, dy: number) => gx[h & 15] * dx + gy[h & 15] * dy;
    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];
    const u = fade(xf);
    const v = fade(yf);
    const x1 = dot(aa, xf, yf) + u * (dot(ba, xf - 1, yf) - dot(aa, xf, yf));
    const x2 = dot(ab, xf, yf - 1) + u * (dot(bb, xf - 1, yf - 1) - dot(ab, xf, yf - 1));
    return x1 + v * (x2 - x1);
  };
}

/** Fractal sum of `noise`, about −0.6 to 0.6. */
export function fbm(noise: Noise2, x: number, y: number, octaves = 5) {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += noise(x * f, y * f) * amp;
    f *= 2.03;
    amp *= 0.5;
  }
  return sum * 1.6;
}

/** Ridged fractal noise, 0 to about 1: sharp crests, soft hollows. */
export function ridged(noise: Noise2, x: number, y: number, octaves = 5) {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  let weight = 1;
  for (let i = 0; i < octaves; i++) {
    let n = 1 - Math.abs(noise(x * f, y * f) * 1.4);
    n = n * n * weight;
    weight = Math.min(1, n * 1.6);
    sum += n * amp;
    f *= 2.07;
    amp *= 0.5;
  }
  return sum;
}

export const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
