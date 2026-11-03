import { I, inked, mix, smoothAnomaly } from './model';
import { clamp01, fbm, gradientNoise, ridged, smoothstep } from './noise';
import type { Dot } from './Dots';

/**
 * The covers: a west-coast fjord drawn as a halftone print. Dot size is the
 * light and shade of the land; dot colour is the temperature anomaly, warm in
 * the valleys and cold on the peaks.
 */

type Layer = {
  x0: number;
  x1: number;
  top: (x: number) => number;
  shore: (x: number) => number;
  /** Metres of mountain per px of height above the shore. */
  metres: number;
  /** Darkness of the layer, 0–1: far layers are paler. */
  depth: number;
};

export type SceneSpec = {
  width: number;
  height: number;
  horizon: number;
  cell: number;
  layers: Layer[];
  ripple: [number, number];
  /** How far below the bottom the water stays fully printed, as a share of height. */
  waterFade: [number, number];
};

const gauss = (u: number, centre: number, width: number) => Math.exp(-(((u - centre) / width) ** 2));

const profileNoise = gradientNoise(7);
const texNoise = gradientNoise(8);
const cloudNoise = gradientNoise(9);
const waterNoise = gradientNoise(10);

/** A crest line: ridged noise along x, 0 to about 1. */
const crest = (x: number, seed: number, scale: number) => ridged(profileNoise, x / scale, seed, 4);

export function wideSpec(width = 1440, height = 960): SceneSpec {
  const W = width;
  const H = height;
  const horizon = Math.round(H * 0.6);
  return {
    width: W,
    height: H,
    horizon,
    cell: 7,
    ripple: [W * 0.56, horizon],
    waterFade: [0.84, 1.0],
    layers: [
      {
        // The far massif, snow on top: Lønahorgi and its neighbours.
        x0: 0,
        x1: W,
        top: (x) => {
          const u = x / W;
          const body = 0.06 + 0.25 * gauss(u, 0.56, 0.12) ** 0.8 + 0.08 * gauss(u, 0.4, 0.06) + 0.07 * gauss(u, 0.7, 0.07);
          return horizon - H * (body + 0.06 * crest(x, 1.3, 58) * (0.4 + body * 2));
        },
        shore: () => horizon,
        metres: 4.6,
        depth: 0.62
      },
      {
        // Mid ridge, left, running down to the water.
        x0: 0,
        x1: W * 0.6,
        top: (x) => {
          const u = x / W;
          return horizon - H * (0.33 * (1 - smoothstep(0.02, 0.58, u)) ** 1.3 + 0.012 + 0.035 * crest(x, 4.1, 40) * (1 - u));
        },
        shore: (x) => horizon + 3 + 3 * Math.sin(x / 90),
        metres: 3.2,
        depth: 0.8
      },
      {
        // Mid ridge, right, climbing to a shoulder at the edge.
        x0: W * 0.5,
        x1: W,
        top: (x) => {
          const u = x / W;
          return horizon - H * (0.25 * smoothstep(0.54, 1.04, u) ** 1.2 + 0.01 + 0.04 * crest(x, 7.7, 44) * smoothstep(0.55, 0.8, u));
        },
        shore: (x) => horizon + 5 + 3 * Math.sin(x / 70),
        metres: 5.6,
        depth: 0.86
      },
      {
        // The near wall on the left, a cliff straight into the fjord.
        x0: 0,
        x1: W * 0.37,
        top: (x) => {
          const u = Math.min(1, x / (W * 0.37));
          return H * (0.0 + 0.78 * u ** 2.1) - H * 0.05 * crest(x, 9.4, 30) * (0.5 + u);
        },
        shore: (x) => {
          const u = Math.min(1, x / (W * 0.37));
          return H * (0.7 + 0.26 * (1 - u) ** 1.5) + 14 * fbm(texNoise, x / 90, 3.3, 3);
        },
        metres: 1.45,
        depth: 1
      }
    ]
  };
}

export function tallSpec(width = 1152, height = 1440): SceneSpec {
  const W = width;
  const H = height;
  const horizon = Math.round(H * 0.66);
  return {
    width: W,
    height: H,
    horizon,
    cell: 7,
    ripple: [W * 0.32, horizon],
    waterFade: [0.84, 0.99],
    layers: [
      {
        // A distant ridge across the fjord.
        x0: 0,
        x1: W,
        top: (x) => {
          const u = x / W;
          return horizon - H * (0.035 + 0.085 * gauss(u, 0.1, 0.16) + 0.03 * crest(x, 2.2, 50));
        },
        shore: () => horizon,
        metres: 5.4,
        depth: 0.62
      },
      {
        // The mountain itself, peak right of centre.
        x0: W * 0.2,
        x1: W,
        top: (x) => {
          const u = x / W;
          const left = smoothstep(0.2, 0.64, u) ** 1.7;
          const right = 1 - 0.42 * smoothstep(0.66, 1.1, u) + 0.06 * gauss(u, 0.86, 0.05);
          const profile = u < 0.64 ? left : right;
          return horizon - H * (0.38 * profile + 0.008) - H * 0.035 * crest(x, 5.3, 34) * (0.3 + profile);
        },
        shore: (x) => horizon + 4 + H * 0.05 * smoothstep(0.45, 1, x / W),
        metres: 2.5,
        depth: 0.96
      }
    ]
  };
}

type StaticDot = {
  x: number;
  y: number;
  /** Radius at full tone. */
  r: number;
  /** Anomaly offset from the regional value, °C; NaN for sky. */
  local: number;
  /** Share of ink mixed into the colour in shadow, like a key plate. */
  key?: number;
  color?: string;
  stretch?: number;
  distance: number;
};

export type Landscape = {
  spec: SceneSpec;
  dots: StaticDot[];
  /** Anomaly offset at a point on the land, °C. */
  probe: (x: number, y: number) => number;
  maxDistance: number;
};

function tables(spec: SceneSpec) {
  return spec.layers.map((layer) => {
    const top = new Float32Array(spec.width + 1);
    const shore = new Float32Array(spec.width + 1);
    for (let x = 0; x <= spec.width; x++) {
      top[x] = layer.top(x);
      shore[x] = layer.shore(x);
    }
    return { layer, top, shore };
  });
}

/** Valleys sit warm, peaks cold: +1.5 °C at the shore to about −2.2 °C at 1,400 m. */
const localAnomaly = (elevation: number, x: number, y: number) =>
  1.5 - (2.65 * elevation) / 1000 + 0.3 * fbm(texNoise, x / 110, y / 110, 3);

export function buildLandscape(spec: SceneSpec): Landscape {
  const { width: W, height: H, horizon, cell } = spec;
  const layers = tables(spec);
  const at = (table: Float32Array, x: number) => table[Math.max(0, Math.min(W, Math.round(x)))];

  /** Front-most layer covering a point, or -1. */
  const landAt = (x: number, y: number) => {
    for (let i = layers.length - 1; i >= 0; i--) {
      const { layer, top, shore } = layers[i];
      if (x < layer.x0 || x > layer.x1) continue;
      if (y >= at(top, x) && y <= at(shore, x)) return i;
    }
    return -1;
  };

  const elevationAt = (i: number, x: number, y: number) => Math.max(0, (at(layers[i].shore, x) - y) * layers[i].layer.metres);

  /** How dark the print is at a point on the land, 0–1, and how much of that is shadow. */
  const landTone = (i: number, x: number, y: number) => {
    const { layer, top } = layers[i];
    const e = elevationAt(i, x, y);
    // Facets lit from the left: the slope of a ridged pattern across x.
    const f = (px: number) => ridged(texNoise, px / 58 + y / 260, y / 150, 4);
    const facet = clamp01(0.5 + (f(x + 4) - f(x - 4)) * 2.6);
    const gully = fbm(texNoise, x / 22, y / 110, 3);
    // Strata: dark forest low down, grey rock above, snow on the tops.
    const forest = 1 - smoothstep(260, 520, e + 90 * gully);
    const snowline = 1020 + 280 * fbm(texNoise, x / 48, y / 22, 3) + 220 * gully;
    const snow = smoothstep(snowline - 40, snowline + 60, e);
    let tone = 0.5 + 0.34 * facet + 0.12 * gully;
    tone = tone * (1 - forest) + (0.84 + 0.12 * facet) * forest;
    tone = tone * (1 - snow) + (0.08 + 0.3 * facet * clamp01(gully + 0.4)) * snow;
    // A lit rim along the crest, mist on the water at the foot, then haze with distance.
    tone *= 0.55 + 0.45 * smoothstep(0, 12, y - at(top, x));
    if (layer.depth < 0.95) tone *= 1 - 0.55 * smoothstep(-70, 0, y - at(layers[i].shore, x)) * (0.75 + 0.25 * gully);
    tone *= layer.depth;
    return { tone: clamp01(tone), shade: clamp01(facet * (1 - snow) * 0.7 + forest * 0.4) * layer.depth };
  };

  const skyAt = (x: number, y: number) => {
    const v = clamp01(y / horizon);
    const cloud = Math.max(0, fbm(cloudNoise, x / 300, y / 40, 4) + 0.02) * smoothstep(0.25, 0.6, v) * (1 - smoothstep(0.78, 0.98, v));
    const tone = (0.012 + 0.16 * (1 - smoothstep(0, 0.62, v)) ** 1.8 + 0.34 * cloud) * smoothstep(0, 0.1, y / H);
    const color = mix(I.cold, I.sand, 0.25 + 0.75 * smoothstep(0, 0.9, v));
    return { tone: clamp01(tone), color };
  };

  const [cx, cy] = spec.ripple;
  const distanceOf = (x: number, y: number) => Math.hypot(x - cx, (y - cy) * 1.25);
  const maxDistance = Math.max(
    distanceOf(0, 0),
    distanceOf(W, 0),
    distanceOf(0, H),
    distanceOf(W, H)
  );

  const dots: StaticDot[] = [];
  const rowStep = cell * 0.866;
  for (let row = 0, y = rowStep / 2; y < H + cell; row++, y += rowStep) {
    const offset = row % 2 ? cell / 2 : 0;
    for (let x = offset; x < W + cell; x += cell) {
      const distance = distanceOf(x, y);
      const land = landAt(x, y);
      if (land >= 0) {
        const { tone, shade } = landTone(land, x, y);
        dots.push({ x, y, r: Math.sqrt(tone) * cell * 0.58, local: localAnomaly(elevationAt(land, x, y), x, y), key: shade * 0.2, distance });
        continue;
      }
      if (y < horizon) {
        const sky = skyAt(x, y);
        dots.push({ x, y, r: Math.sqrt(sky.tone) * cell * 0.5, local: Number.NaN, color: sky.color, distance });
        continue;
      }
      // Water: the reflection of whatever stands behind it, broken by ripples.
      const wobble = 7 * fbm(waterNoise, x / 60, y / 5, 3) * smoothstep(horizon, H, y);
      const rx = x + wobble;
      let reflected = -1;
      let ry = 0;
      for (let i = layers.length - 1; i >= 0; i--) {
        const { layer, top, shore } = layers[i];
        if (rx < layer.x0 || rx > layer.x1) continue;
        const s = at(shore, rx);
        if (y <= s) continue;
        const mirror = 2 * s - y;
        if (mirror >= at(top, rx)) {
          reflected = i;
          ry = mirror;
          break;
        }
      }
      const ripple = 0.7 + 0.42 * fbm(waterNoise, x / 140, y / 7, 3) + 0.12 * Math.sin(y / 3.1);
      const fade = 1 - smoothstep(spec.waterFade[0] * H, spec.waterFade[1] * H, y);
      const glint = 1 - 0.55 * gauss(y, horizon + 10, 9);
      if (reflected >= 0) {
        const { tone, shade } = landTone(reflected, rx, ry);
        dots.push({
          x,
          y,
          r: Math.sqrt(clamp01(tone * 0.7 * ripple * fade * glint)) * cell * 0.52,
          local: localAnomaly(elevationAt(reflected, rx, ry), rx, ry),
          key: shade * 0.18,
          stretch: 1.6,
          distance
        });
      } else {
        const sky = skyAt(rx, 2 * horizon - y);
        dots.push({
          x,
          y,
          r: Math.sqrt(clamp01(sky.tone * 0.9 * ripple * fade)) * cell * 0.5,
          local: Number.NaN,
          color: sky.color,
          stretch: 1.6,
          distance
        });
      }
    }
  }

  const probe = (x: number, y: number) => {
    const land = landAt(x, y);
    return land >= 0 ? localAnomaly(elevationAt(land, x, y), x, y) : 0;
  };

  return { spec, dots, probe, maxDistance };
}

/** Where the loop is: the year the land shows, and the ripple that brings it back. */
export type Moment = { year: number; ripple: number };

export const LOOP = 6;
const RUN = 4.9;

/** Years run 1961 → 2025, then a ripple from the fjord head returns them to 1961. */
export function moment(time: number): Moment {
  const t = ((time % LOOP) + LOOP) % LOOP;
  if (t < RUN) {
    const k = t / RUN;
    const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
    return { year: 1961 + 64 * eased, ripple: 0 };
  }
  return { year: 2025, ripple: (t - RUN) / (LOOP - RUN) };
}

/** The dots for one moment. */
export function frame(scene: Landscape, { year, ripple }: Moment): Dot[] {
  const now = smoothAnomaly(year);
  const start = smoothAnomaly(1961);
  const front = ripple * scene.maxDistance * 1.08;
  const band = 70;
  return scene.dots.map((dot) => {
    let swell = 1;
    let anomaly = now;
    if (ripple > 0) {
      const back = clamp01((dot.distance - front + band) / (2 * band));
      anomaly = start + (now - start) * smoothstep(0, 1, back);
      swell = 1 + 0.5 * Math.exp(-(((dot.distance - front) / 34) ** 2)) * Math.sin(Math.PI * ripple);
    }
    return {
      x: dot.x,
      y: dot.y,
      r: dot.r * swell,
      color: dot.color ?? inked(anomaly + dot.local, dot.key ?? 0),
      stretch: dot.stretch
    };
  });
}

/** The anomaly shown at a point for a moment, matching `frame`. */
export function valueAt(scene: Landscape, x: number, y: number, { year, ripple }: Moment) {
  const now = smoothAnomaly(year);
  if (ripple <= 0) return now + scene.probe(x, y);
  const [cx, cy] = scene.spec.ripple;
  const distance = Math.hypot(x - cx, (y - cy) * 1.25);
  const front = ripple * scene.maxDistance * 1.08;
  const back = clamp01((distance - front + 70) / 140);
  const start = smoothAnomaly(1961);
  return start + (now - start) * smoothstep(0, 1, back) + scene.probe(x, y);
}
