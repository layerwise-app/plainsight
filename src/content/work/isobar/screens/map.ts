import { REGIONAL, SERIES, STATIONS, mean, yearIndex } from './model';
import { type Noise2, clamp01, fbm, gradientNoise, ridged, smoothstep } from './noise';

/**
 * Voss municipality on Isobar's 1 km grid. The terrain is drawn from noise and
 * carved along the real valleys (Vangsvatnet, Skjervet to Granvin, Myrkdalen,
 * Stalheim, Hamlagrø), so the map reads as the place without being a survey.
 */
export const MAP_COLS = 72;
export const MAP_ROWS = 64;

type Valley = { points: [number, number][]; floor: number[]; width: number };

const VALLEYS: Valley[] = [
  // Vossevangen: the lake basin, west to east.
  { points: [[8, 41], [15, 39.6], [22, 37], [30, 35.3], [38, 34.8], [45, 36.6], [52, 41]], floor: [560, 260, 70, 46, 52, 120, 210], width: 1.7 },
  // Skjervet down to Granvin, then Granvinsfjorden to Hardanger.
  { points: [[44, 36], [46.6, 41.5], [49.4, 46.5], [50.8, 50.5], [51.6, 54.5], [52.8, 59], [54.4, 65]], floor: [110, 190, 40, -30, -70, -110, -140], width: 1.25 },
  // North through Vossestrand to Myrkdalen.
  { points: [[36.5, 34.5], [34.6, 28], [32.2, 21], [30, 13], [28.6, 5]], floor: [60, 190, 360, 600, 820], width: 1.45 },
  // North-east along the E16 to Stalheim.
  { points: [[45, 36.4], [51, 30], [56.5, 23], [60.5, 18.4], [66, 12]], floor: [120, 230, 330, 360, 300], width: 1.15 },
  // West up to Hamlagrø.
  { points: [[22, 37], [17.6, 39.4], [13, 41.2], [7, 43.4]], floor: [130, 620, 980, 1020], width: 1.05 }
];

type Lake = { x: number; y: number; rx: number; ry: number; angle: number; name?: string };

export const LAKES: Lake[] = [
  { x: 31.2, y: 35.4, rx: 5.6, ry: 0.95, angle: -5, name: 'Vangsvatnet' },
  { x: 31.4, y: 17.6, rx: 1.5, ry: 0.42, angle: 72 },
  { x: 14.6, y: 40.6, rx: 2.5, ry: 0.55, angle: -18 },
  { x: 48.4, y: 44.8, rx: 1.7, ry: 0.42, angle: 62 },
  { x: 56.2, y: 23.4, rx: 1.2, ry: 0.36, angle: -48 }
];

function distanceToValley(x: number, y: number, valley: Valley) {
  let best = Number.POSITIVE_INFINITY;
  let floor = 0;
  for (let i = 0; i < valley.points.length - 1; i++) {
    const [ax, ay] = valley.points[i];
    const [bx, by] = valley.points[i + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const t = clamp01(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy));
    const px = ax + dx * t - x;
    const py = ay + dy * t - y;
    const d = Math.hypot(px, py);
    if (d < best) {
      best = d;
      floor = valley.floor[i] + (valley.floor[i + 1] - valley.floor[i]) * t;
    }
  }
  return { distance: best, floor };
}

const terrainNoise: Noise2 = gradientNoise(61);
const detailNoise: Noise2 = gradientNoise(62);
const edgeNoise: Noise2 = gradientNoise(63);

/** Metres above sea level at a point in km. */
export function heightAt(x: number, y: number) {
  let h = 820 + 420 * fbm(terrainNoise, x / 15, y / 15, 5) + 360 * (ridged(detailNoise, x / 7.5 + 3, y / 7.5 + 7, 4) - 0.45);
  for (const valley of VALLEYS) {
    const { distance, floor } = distanceToValley(x, y, valley);
    const wall = floor + 1150 * (1 - Math.exp(-((distance / valley.width) ** 2) / 4.2));
    h = Math.min(h, wall);
  }
  return h;
}

function inLake(x: number, y: number) {
  for (const lake of LAKES) {
    const a = (lake.angle * Math.PI) / 180;
    const dx = x - lake.x;
    const dy = y - lake.y;
    const u = (dx * Math.cos(a) + dy * Math.sin(a)) / lake.rx;
    const v = (-dx * Math.sin(a) + dy * Math.cos(a)) / lake.ry;
    const wobble = 1 + 0.18 * fbm(edgeNoise, x * 0.6, y * 0.6, 2);
    if (u * u + v * v < wobble) return true;
  }
  return false;
}

/** The municipality's edge: 1 inside, falling to 0 at the boundary. */
export function insideness(x: number, y: number) {
  const dx = (x - 34.5) / 28;
  const dy = (y - 32) / 26;
  const angle = Math.atan2(dy, dx);
  const r = Math.hypot(dx, dy);
  const edge = 1 + 0.2 * fbm(edgeNoise, Math.cos(angle) * 2.4 + 4, Math.sin(angle) * 2.4 + 4, 4) + 0.025 * fbm(edgeNoise, x / 2, y / 2, 2);
  return edge - r;
}

export type MapCell = {
  col: number;
  row: number;
  /** Centre in km. */
  x: number;
  y: number;
  elevation: number;
  water: boolean;
  inside: boolean;
  /** 0 lit to 1 in shadow, from a north-west light. */
  shadow: number;
  /** Inverse-distance weights for each station. */
  weights: number[];
  gain: number;
  texture: number;
};

export const gainAt = (elevation: number) => 0.8 + 0.4 * (Math.max(0, elevation) / 1000);

/** Every cell of the grid, computed once. */
export const MAP_CELLS: MapCell[] = (() => {
  const cells: MapCell[] = [];
  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
      const x = col + 0.5;
      const y = row + 0.5;
      const elevation = heightAt(x, y);
      const dzdx = (heightAt(x + 0.5, y) - heightAt(x - 0.5, y)) / 1000;
      const dzdy = (heightAt(x, y + 0.5) - heightAt(x, y - 0.5)) / 1000;
      // Light from the north-west, a little above the horizon.
      const nx = -dzdx * 2.6;
      const ny = -dzdy * 2.6;
      const nz = 1;
      const length = Math.hypot(nx, ny, nz);
      const lit = (nx * -0.6 + ny * -0.6 + nz * 0.53) / length;
      const shadow = clamp01(1 - (lit + 0.15) / 1.05);
      const water = elevation < 0 || inLake(x, y);
      const raw = STATIONS.map((station) => 1 / ((station.at[0] - x) ** 2 + (station.at[1] - y) ** 2 + 6));
      const total = raw.reduce((sum, w) => sum + w, 0);
      cells.push({
        col,
        row,
        x,
        y,
        elevation,
        water,
        inside: insideness(x, y) > 0,
        shadow,
        weights: raw.map((w) => w / total),
        gain: gainAt(elevation),
        texture: fbm(edgeNoise, x / 3, y / 3, 3) * 0.12
      });
    }
  }
  return cells;
})();

export type When = number | [number, number];

const valueAt = (values: number[], when: When) =>
  typeof when === 'number' ? values[yearIndex(when)] : mean(values.slice(yearIndex(when[0]), yearIndex(when[1]) + 1));

/** Each cell's anomaly in °C against 1961–1990, for one year or a span of years. */
export function cellAnomalies(when: When): Float32Array {
  const regional = valueAt(REGIONAL, when);
  const residuals = STATIONS.map(
    (station) => valueAt(SERIES[station.id].anomaly, when) - regional * gainAt(station.elevation)
  );
  const out = new Float32Array(MAP_CELLS.length);
  MAP_CELLS.forEach((cell, i) => {
    let r = 0;
    for (let s = 0; s < residuals.length; s++) r += cell.weights[s] * residuals[s];
    out[i] = regional * cell.gain + r + cell.texture;
  });
  return out;
}

/** Share of a cell's dot that is filled, from the terrain shading. */
export const dotTone = (cell: MapCell) => 0.2 + 0.8 * smoothstep(0.12, 0.62, cell.shadow);
