/** A small seeded random generator, so drawn scenes look the same every render. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 0 → 1 → 0 over a loop, for motion that ends where it began. */
export const loop = (time: number, duration: number, phase = 0) =>
  0.5 - 0.5 * Math.cos(((time / duration) * 2 + phase) * Math.PI);
