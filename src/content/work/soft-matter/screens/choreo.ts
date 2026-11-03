import { SM } from './palette';
import { type Drop, LOOKS, type SceneFn, type Vec3 } from './SoftScene';

/*
 * Every scene loops in 6 seconds: each movement is a sine whose period
 * divides 6, so the last frame meets the first.
 */
const TAU = Math.PI * 2;
export const wave = (time: number, period: number, phase = 0) => Math.sin((time / period) * TAU + phase);
/** 0 → 1 → 0 over the period, starting at `phase` (radians). */
export const swell = (time: number, period: number, phase = 0) => 0.5 - 0.5 * Math.cos((time / period) * TAU + phase);

/** A drop resting on the floor, pressed into it a little. */
export const rest = (x: number, z: number, r: number, color: string, sink = 0.92, lift = 0): Drop => ({
  p: [x, r * sink + lift, z] as Vec3,
  r,
  color
});

/** Two drops side by side with a given gap between their surfaces (negative overlaps). */
function pair(cx: number, z: number, r1: number, r2: number, gap: number, c1: string, c2: string): [Drop, Drop] {
  const d = r1 + r2 + gap;
  const left = cx - (d * r2) / (r1 + r2);
  return [rest(left, z, r1, c1), rest(left + d, z - 0.14, r2, c2)];
}

/**
 * Cover: a peach drop and a lilac one joined by a neck, pulling apart and
 * joining again, with smaller drops around them. 1440 × 960 and its crops.
 */
export const coverScene: SceneFn = (time) => {
  // Gap between the large drops: a neck at t = 0, apart at t ≈ 1.7, merged deep at t ≈ 4.7.
  const gap = -0.3 + 0.62 * swell(time, 6, 1.36);
  const [peach, lilac] = pair(0.12, 0.05, 0.9, 0.7, gap, SM.peach, SM.lilac);
  const b = wave(time, 6, 0.3);
  return {
    drops: [
      peach,
      lilac,
      rest(1.62 + 0.18 * b, 1.12 - 0.12 * b, 0.27, SM.indigo),
      rest(-1.86, -1.0, 0.46 + 0.01 * wave(time, 3), SM.cream),
      rest(2.42, -1.06, 0.34, SM.peachSoft),
      rest(-1.3, 1.22 + 0.05 * wave(time, 6, 2), 0.15, SM.peachDeep),
      rest(0.98 - 0.12 * b, 1.55, 0.11, SM.lilacDeep)
    ],
    view: { eye: [0.4, 2.9, 12.6], target: [0.12, 0.55, 0], fov: 19.8 }
  };
};

/** The home page hero: the pair sits right of centre, leaving the left for the headline. */
export const heroScene: SceneFn = (time) => {
  const gap = -0.24 + 0.5 * swell(time, 6, 1.36);
  const [peach, lilac] = pair(1.35, 0.0, 0.82, 0.62, gap, SM.peach, SM.lilac);
  return {
    drops: [
      peach,
      lilac,
      rest(2.75, 0.95, 0.24, SM.indigo),
      rest(3.55, -0.9, 0.3, SM.peachSoft),
      rest(0.55, 1.2, 0.12, SM.peachDeep),
      rest(0.2, -1.5, 0.26, SM.cream)
    ],
    view: { eye: [-0.6, 2.7, 11.5], target: [-0.2, 0.62, 0], fov: 20, fit: 1.9 }
  };
};

/** The same hero, recomposed for a phone: the pair centred and closer. */
export const heroTallScene: SceneFn = (time) => {
  const gap = -0.24 + 0.5 * swell(time, 6, 1.36);
  const [peach, lilac] = pair(0, 0.0, 0.82, 0.62, gap, SM.peach, SM.lilac);
  return {
    drops: [peach, lilac, rest(1.05, 1.05, 0.24, SM.indigo), rest(-1.0, -1.0, 0.36, SM.cream), rest(-0.85, 1.2, 0.12, SM.peachDeep)],
    view: { eye: [0.2, 4.2, 12.8], target: [0.1, 0.8, 0.1], fov: 21 }
  };
};

/** Slow Tide: a row of drops along a wall, the crest joining as it passes. */
export const tideScene: SceneFn = (time) => {
  const drops = [];
  for (let i = 0; i < 8; i++) {
    const x = -3.9 + i * 1.12;
    const crest = Math.exp(-((x - 0.6) ** 2) / 2.6);
    const r = 0.3 + 0.42 * crest + 0.04 * wave(time, 6, i * 0.8);
    drops.push(rest(x, -0.1 + 0.18 * Math.sin(i * 1.3), r, i % 3 === 1 ? SM.peach : i % 3 === 2 ? SM.lilacSoft : SM.lilac));
  }
  return { drops, view: { eye: [0.2, 2.2, 11.5], target: [0.1, 0.5, 0], fov: 20, fit: 2.6 }, pool: [0.6, 0] };
};

/** Slow Tide framed for a phone: closer in on the crest. */
export const tideTallScene: SceneFn = (time) => ({
  ...tideScene(time),
  view: { eye: [-8.4, 3.4, 10.6], target: [0.2, 0.5, -0.1], fov: 19 }
});

/** Melt: three glazes slumping into one puddle on the shop floor. */
export const meltScene: SceneFn = (time) => {
  const g = swell(time, 6, 1.36);
  return {
    drops: [
      rest(-0.35, 0.0, 0.78, SM.peach, 0.86),
      rest(0.72 + 0.08 * g, -0.25, 0.52, SM.peachDeep, 0.86),
      rest(-1.22 - 0.05 * g, 0.55, 0.36, SM.cream, 0.88),
      rest(1.45, 0.75, 0.14, SM.peachDeep),
      rest(-0.4, 1.35, 0.1, SM.peach)
    ],
    look: { ...LOOKS.clay, sag: 0.78, blend: 0.46, sss: 0.45 },
    view: { eye: [0.3, 3.6, 9.6], target: [-0.1, 0.4, 0.15], fov: 22 }
  };
};

/** Pressure Garden: a cluster of glass drops of every size. */
export const gardenScene: SceneFn = () => ({
  drops: [
    rest(-0.5, 0.1, 0.7, SM.lilac),
    rest(0.62, -0.15, 0.5, SM.lilacSoft),
    rest(0.1, 0.95, 0.32, SM.peach),
    rest(-1.55, -0.55, 0.36, SM.lilacDeep),
    rest(1.45, 0.75, 0.22, SM.indigo),
    rest(1.65, -0.9, 0.3, SM.peachSoft),
    rest(-1.2, 1.05, 0.16, SM.lilac)
  ],
  view: { eye: [0, 3.4, 10.5], target: [0, 0.4, 0], fov: 22 }
});

/** Thread Count: a collection laid out in rows, one pair reaching for each other. */
export const archiveScene: SceneFn = () => {
  const colors = [SM.cream, SM.lilacSoft, SM.peachSoft, SM.lilac, SM.cream, SM.peach, SM.lilacSoft, SM.cream];
  const drops = colors.map((color, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const reach = i === 1 ? 0.18 : i === 2 ? -0.18 : 0;
    return rest(-1.65 + col * 1.1 + reach, -0.55 + row * 1.15, 0.36, color);
  });
  return { drops, view: { eye: [0, 5.2, 8.6], target: [0, 0.2, 0.05], fov: 26 } };
};

/** One pair, close up, for material swatches. */
export const swatchScene: SceneFn = () => {
  const [a, b] = pair(0.05, 0, 0.62, 0.46, -0.06, SM.peach, SM.lilac);
  return { drops: [a, b, rest(1.05, 0.75, 0.16, SM.indigo)], view: { eye: [0, 2.2, 7.4], target: [0.05, 0.42, 0], fov: 22 } };
};

/** No drops: just the floor and the light, for laying things on. */
export const emptyScene: SceneFn = () => ({ drops: [], view: { eye: [0, 2.6, 12], target: [0, 0.4, 0], fov: 22 } });
