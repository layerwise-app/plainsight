import { seeded } from '~/components/art/random';

/** Isobar's own palette and type. */
export const I = {
  paper: '#F3F2EC',
  card: '#FBFAF6',
  sand: '#E9E4D6',
  ink: '#1A1E1D',
  ink2: '#4A504D',
  muted: '#7A7F7A',
  faint: '#A9ABA4',
  line: 'rgba(26,30,29,0.10)',
  lineStrong: 'rgba(26,30,29,0.20)',
  cold: '#2C5C9E',
  hot: '#BF3B26',
  rain: '#1E7F86',
  rainSoft: '#CFE3E2',
  sans: "'Spline Sans', system-ui, sans-serif",
  mono: "'Spline Sans Mono', ui-monospace, monospace"
};

/* ------------------------------------------------------------------ colour */

const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const toByte = (c: number) => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
};

type Lab = [number, number, number];

function hexToOklab(hex: string): Lab {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = toLinear(n >> 16);
  const g = toLinear((n >> 8) & 255);
  const b = toLinear(n & 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
}

function oklabToHex([L, a, b]: Lab): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = toByte(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = toByte(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = toByte(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

const NEUTRAL = hexToOklab(I.sand);
const COLD = hexToOklab(I.cold);
const HOT = hexToOklab(I.hot);
/**
 * Both poles end at the same lightness (the mean of the two brand colours),
 * so +1 °C and −1 °C are equally far from sand. Each arm moves in straight
 * steps of OKLab lightness and chroma.
 */
const END_L = (COLD[0] + HOT[0]) / 2;

/** The anomaly scale's reach, in °C either side of the normal. */
export const DOMAIN = 2.5;

function diverge(t: number): string {
  const v = Math.max(-1, Math.min(1, t));
  const pole = v < 0 ? COLD : HOT;
  const k = Math.abs(v);
  return oklabToHex([
    NEUTRAL[0] + (END_L - NEUTRAL[0]) * k,
    NEUTRAL[1] + (pole[1] - NEUTRAL[1]) * k,
    NEUTRAL[2] + (pole[2] - NEUTRAL[2]) * k
  ]);
}

const LUT = Array.from({ length: 201 }, (_, i) => diverge(i / 100 - 1));

/** Colour for a temperature anomaly in °C against the 1961–1990 normal. */
export function anomalyColor(value: number): string {
  const t = Math.max(-1, Math.min(1, value / DOMAIN));
  return LUT[Math.round((t + 1) * 100)];
}

const INKED = new Map<number, string>();
/**
 * The anomaly colour with some ink mixed in, for dots in the prints: shadows
 * take a little ink, and colours near the normal take more, so a neutral dot
 * prints as warm grey instead of vanishing into the paper.
 */
export function inked(value: number, key: number): string {
  const v = Math.max(-1, Math.min(1, value / DOMAIN));
  const t = Math.round((v + 1) * 100);
  const k = Math.round(Math.max(0, Math.min(1, key + 0.2 * (1 - Math.abs(v)) ** 2)) * 20);
  const id = t * 32 + k;
  let color = INKED.get(id);
  if (!color) {
    color = mix(LUT[t], '#1A1E1D', k / 20);
    INKED.set(id, color);
  }
  return color;
}

/** Ink that reads on top of `anomalyColor(value)`. */
export const inkOn = (value: number) => (Math.abs(value) > DOMAIN * 0.62 ? '#FBFAF6' : I.ink);

/** A rain-teal ramp for magnitudes (heavy-rain days), from paper to teal. */
export function rainColor(t: number): string {
  const k = Math.max(0, Math.min(1, t));
  const from = hexToOklab('#E4EDEA');
  const to = hexToOklab(I.rain);
  return oklabToHex([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k]);
}

export function mix(a: string, b: string, t: number): string {
  const x = hexToOklab(a);
  const y = hexToOklab(b);
  return oklabToHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}

/* ------------------------------------------------------------------ format */

const MINUS = '−';
/** `+1.9 °C`, `−0.4 °C`, `0.0 °C`. */
export const fmtC = (value: number, digits = 1, unit = true) => {
  const rounded = Number(value.toFixed(digits));
  const sign = rounded > 0 ? '+' : rounded < 0 ? MINUS : '';
  return `${sign}${Math.abs(rounded).toFixed(digits)}${unit ? ' °C' : ''}`;
};
export const fmtSigned = (value: number, suffix = '') =>
  `${value > 0 ? '+' : value < 0 ? MINUS : ''}${Math.abs(value)}${suffix}`;
export const fmtInt = (value: number) => value.toLocaleString('en-GB');

/* ------------------------------------------------------------------ data */

export const FIRST_YEAR = 1961;
export const LAST_YEAR = 2025;
export const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);
const NORMAL_END = 1990;

/** Voss, annual mean temperature, °C against an uncentred base. Centred below. */
const REGIONAL_RAW = [
  0.4, -0.6, -0.4, 0.0, -0.7, -1.1, 0.3, -0.4, -0.2, -0.3, // 1961–1970
  0.2, 0.3, 0.0, 0.6, 0.5, -0.2, -0.4, -0.5, -0.9, -0.6, // 1971–1980
  -0.4, 0.3, 0.4, 0.3, -1.1, -0.5, -1.2, 0.1, 1.1, 1.3, // 1981–1990
  0.4, 1.0, 0.1, 0.2, 0.3, -0.1, 0.9, 0.4, 0.7, 1.1, // 1991–2000
  0.4, 1.0, 0.9, 0.9, 1.1, 1.5, 1.0, 1.0, 0.7, -0.8, // 2001–2010
  1.4, 0.3, 0.6, 2.0, 1.1, 1.2, 1.0, 1.7, 1.1, 2.1, // 2011–2020
  0.9, 1.6, 1.0, 1.3, 1.8 // 2021–2025
];

/** Extra summer heat on top of the annual anomaly, for days above 25 °C. */
const SUMMERS: Record<number, number> = {
  1969: 1.2, 1972: 0.8, 1975: 1.6, 1976: 1.1, 1983: 1.3, 1994: 0.8, 1997: 1.8, 2002: 1.2, 2003: 0.7,
  2006: 1.4, 2010: 0.5, 2013: 0.9, 2014: 1.5, 2018: 2.9, 2019: 0.9, 2021: 1.0, 2022: 1.2, 2025: 1.5
};

export type StationId = 'voss' | 'granvin' | 'myrkdalen' | 'hamlagro' | 'stalheim';

export type Station = {
  id: StationId;
  name: string;
  /** Metres above sea level. */
  elevation: number;
  /** Position on the municipality map, in km from the top left. */
  at: [number, number];
  /** How strongly the station follows the regional signal. */
  gain: number;
  hotBase: number;
  rainBase: number;
  snowBase: number;
  since: number;
};

export const STATIONS: Station[] = [
  { id: 'voss', name: 'Voss', elevation: 56, at: [37.2, 34.6], gain: 1, hotBase: 5.2, rainBase: 5.8, snowBase: 112, since: 1895 },
  { id: 'granvin', name: 'Granvin', elevation: 22, at: [50.6, 50.2], gain: 0.9, hotBase: 6.1, rainBase: 8.4, snowBase: 71, since: 1923 },
  { id: 'myrkdalen', name: 'Myrkdalen', elevation: 612, at: [29.4, 12.6], gain: 1.1, hotBase: 1.6, rainBase: 9.6, snowBase: 176, since: 1957 },
  { id: 'hamlagro', name: 'Hamlagrø', elevation: 1005, at: [11.8, 41.4], gain: 1.18, hotBase: 0.2, rainBase: 11.2, snowBase: 214, since: 1958 },
  { id: 'stalheim', name: 'Stalheim', elevation: 371, at: [56.4, 22.6], gain: 1.04, hotBase: 2.8, rainBase: 7.1, snowBase: 138, since: 1961 }
];

/** The four stations the demo lets you pick. */
export const PICKABLE: StationId[] = ['voss', 'granvin', 'myrkdalen', 'hamlagro'];

export const stationById = (id: StationId) => STATIONS.find((station) => station.id === id) ?? STATIONS[0];

const centre = (values: number[]) => {
  const normal = values.slice(0, NORMAL_END - FIRST_YEAR + 1);
  const mean = normal.reduce((sum, v) => sum + v, 0) / normal.length;
  return values.map((v) => Math.round((v - mean) * 10) / 10);
};

/** Municipality mean, °C against 1961–1990. */
export const REGIONAL = centre(REGIONAL_RAW);

export type Series = {
  /** Annual mean temperature, °C against the 1961–1990 normal. */
  anomaly: number[];
  /** Days at or above 25 °C. */
  hot: number[];
  /** Days with 30 mm of rain or more. */
  rain: number[];
  /** Days with snow on the ground. */
  snow: number[];
};

function buildSeries(station: Station, index: number): Series {
  const random = seeded(4100 + index * 31);
  const noise = () => random() + random() + random() - 1.5;
  const anomaly = centre(REGIONAL_RAW.map((v) => v * station.gain + noise() * 0.16));
  const hot: number[] = [];
  const rain: number[] = [];
  const snow: number[] = [];
  YEARS.forEach((year, i) => {
    const summer = anomaly[i] * 0.5 + (SUMMERS[year] ?? 0) - 0.3;
    const h = station.hotBase * Math.max(0.1, 1 + 0.55 * summer) + noise() * 1.4 * Math.min(1, station.hotBase / 3);
    hot.push(Math.max(0, Math.round(h)));
    const trend = 1 + 0.0056 * (year - 1975);
    rain.push(Math.max(0, Math.round(station.rainBase * trend + noise() * 2.4)));
    const s = station.snowBase - 11 * anomaly[i] - 0.18 * (year - 1975) + noise() * 9;
    snow.push(Math.max(0, Math.min(365, Math.round(s))));
  });
  return { anomaly, hot, rain, snow };
}

export const SERIES: Record<StationId, Series> = Object.fromEntries(
  STATIONS.map((station, index) => [station.id, buildSeries(station, index)])
) as Record<StationId, Series>;

// The figures quoted in the council report and the case study.
{
  const i2018 = 2018 - FIRST_YEAR;
  SERIES.voss.anomaly[i2018] = 1.9;
  SERIES.voss.hot[i2018] = 14;
}

export const yearIndex = (year: number) => Math.max(0, Math.min(YEARS.length - 1, year - FIRST_YEAR));

export const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

/** Mean over a span of years, inclusive. */
export const span = (values: number[], from: number, to: number) => mean(values.slice(yearIndex(from), yearIndex(to) + 1));

/** Rank of a year's value among all years, 1 = warmest. */
export function warmRank(values: number[], year: number) {
  const value = values[yearIndex(year)];
  return values.filter((v) => v > value).length + 1;
}

/** Whether another year shares this year's value. */
export const isTied = (values: number[], year: number) =>
  values.filter((v) => v === values[yearIndex(year)]).length > 1;

export const ordinal = (n: number) => {
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
  return `${n}${s}`;
};

/** Centred running mean, for trend lines. */
export function running(values: number[], window = 11) {
  const half = Math.floor(window / 2);
  return values.map((_, i) => {
    const from = Math.max(0, i - half);
    const to = Math.min(values.length, i + half + 1);
    return mean(values.slice(from, to));
  });
}

/** Smooth regional anomaly at a fractional year, for the covers. */
const SMOOTH = running(REGIONAL, 15);
export function smoothAnomaly(year: number) {
  const x = Math.max(0, Math.min(YEARS.length - 1, year - FIRST_YEAR));
  const i = Math.floor(x);
  const f = x - i;
  return SMOOTH[i] * (1 - f) + (SMOOTH[Math.min(YEARS.length - 1, i + 1)] ?? SMOOTH[i]) * f;
}

/* ------------------------------------------------------------------ scenarios */

export type Scenario = {
  id: 'low' | 'medium' | 'high';
  name: string;
  code: string;
  note: string;
  /** °C against 1961–1990: median, 10th and 90th percentile of model runs. */
  temp: Record<2050 | 2100, [number, number, number]>;
  rain: Record<2050 | 2100, number>;
  snow: Record<2050 | 2100, number>;
  hot: Record<2050 | 2100, number>;
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'low',
    name: 'Low emissions',
    code: 'SSP1-2.6',
    note: 'Emissions fall steeply from 2030.',
    temp: { 2050: [2.0, 1.4, 2.6], 2100: [2.2, 1.3, 3.0] },
    rain: { 2050: 8.4, 2100: 8.7 },
    snow: { 2050: 81, 2100: 77 },
    hot: { 2050: 10, 2100: 11 }
  },
  {
    id: 'medium',
    name: 'Medium emissions',
    code: 'SSP2-4.5',
    note: 'Roughly today’s policies.',
    temp: { 2050: [2.4, 1.7, 3.1], 2100: [3.3, 2.4, 4.3] },
    rain: { 2050: 8.9, 2100: 10.1 },
    snow: { 2050: 72, 2100: 54 },
    hot: { 2050: 13, 2100: 19 }
  },
  {
    id: 'high',
    name: 'High emissions',
    code: 'SSP5-8.5',
    note: 'Emissions keep rising to 2080.',
    temp: { 2050: [2.9, 2.1, 3.7], 2100: [5.1, 3.9, 6.4] },
    rain: { 2050: 9.6, 2100: 12.4 },
    snow: { 2050: 63, 2100: 26 },
    hot: { 2050: 16, 2100: 34 }
  }
];

/** 1961–1990 normals at Voss, for the scenario tables. */
export const NORMALS = {
  rain: span(SERIES.voss.rain, 1961, 1990),
  snow: span(SERIES.voss.snow, 1961, 1990),
  hot: span(SERIES.voss.hot, 1961, 1990)
};

/** 1961–1990 normals at every station. */
export const NORMALS_BY = Object.fromEntries(
  STATIONS.map((station) => {
    const s = SERIES[station.id];
    return [station.id, { rain: span(s.rain, 1961, 1990), snow: span(s.snow, 1961, 1990), hot: span(s.hot, 1961, 1990) }];
  })
) as Record<StationId, { rain: number; snow: number; hot: number }>;

/** One year at one station, in a sentence a council can read aloud. */
export function describeYear(id: StationId, year: number) {
  const s = SERIES[id];
  const i = yearIndex(year);
  const v = s.anomaly[i];
  const name = stationById(id).name;
  const temp =
    Math.abs(v) < 0.05
      ? 'was within 0.1 °C of the 1961–\u20601990 normal'
      : `was ${Math.abs(v).toFixed(1)} °C ${v > 0 ? 'warmer' : 'colder'} than the 1961–\u20601990 normal`;
  const hot = s.hot[i];
  const days = hot === 0 ? 'no days' : hot === 1 ? '1 day' : `${hot} days`;
  const warm = warmRank(s.anomaly, year);
  const cold = s.anomaly.filter((other) => other < v).length + 1;
  const joint = isTied(s.anomaly, year) ? 'joint ' : '';
  let rank = '';
  if (warm === 1 && !joint) rank = ` The warmest of the ${YEARS.length} years.`;
  else if (warm <= 10) rank = ` The ${joint}${ordinal(warm)} warmest of ${YEARS.length}.`;
  else if (cold === 1 && !joint) rank = ` The coldest of the ${YEARS.length} years.`;
  else if (cold <= 10) rank = ` The ${joint}${ordinal(cold)} coldest of ${YEARS.length}.`;
  return `In ${year}, ${name} ${temp}; the summer had ${days} above 25 °C.${rank}`;
}
