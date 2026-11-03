import { seeded } from '~/components/art/random';

/** Kestrel's own palette and type. */
export const K = {
  bg: '#0c110f',
  panel: '#121815',
  raised: '#18201c',
  line: 'rgba(226,236,230,0.08)',
  lineStrong: 'rgba(226,236,230,0.16)',
  text: '#e4ece7',
  muted: '#86938c',
  faint: '#56625b',
  lime: '#cdf464',
  limeInk: '#16200a',
  red: '#ff6a4d',
  amber: '#efb54a',
  sans: "'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace"
};

export type Trade = {
  day: number;
  /** Share of the fund the position would reach, in %. */
  size: number;
  /** Hour of the day (CET) the order was placed. */
  hour: number;
  /** Return of the trade in % of the fund. */
  pnl: number;
  ticker: string;
};

export type Limits = { maxPosition: number; maxDailyLoss: number; startHour: number; endHour: number };

export const DEFAULT_LIMITS: Limits = { maxPosition: 8, maxDailyLoss: 2.5, startHour: 9, endHour: 17 };

const TICKERS = ['EQNR', 'NHY', 'DNB', 'MOWI', 'TEL', 'ORK', 'YAR', 'KOG', 'AKRBP', 'SALM', 'NOD', 'TOM'];

/** 90 days of trades for the "Momentum · Nordics" agent. Same every time. */
export const TRADES: Trade[] = (() => {
  const random = seeded(2026);
  const badDays = new Set([23, 51, 77]);
  const list: Trade[] = [];
  for (let day = 0; day < 90; day++) {
    const bad = badDays.has(day);
    const count = bad ? 4 + Math.floor(random() * 2) : 1 + Math.floor(random() * 4);
    for (let i = 0; i < count; i++) {
      const size = Math.round((1.5 + random() ** 6 * 10) * 10) / 10;
      const offHours = random() < 0.035;
      const hour = offHours ? (random() < 0.5 ? 8 : 17 + Math.floor(random() * 2)) : 9 + Math.floor(random() * 8);
      // Larger positions and off-hours orders carry fatter tails.
      const risk = 0.34 + (size > 8 ? 1.1 : 0) + (offHours ? 0.7 : 0);
      const pnl = bad
        ? -(0.45 + random() * 0.4) * (size > 8 ? 1.8 : 1)
        : (random() - 0.3) * risk + (random() < 0.035 ? -1.6 * risk : 0);
      list.push({
        day,
        size,
        hour,
        pnl: Math.round(pnl * 100) / 100,
        ticker: TICKERS[Math.floor(random() * TICKERS.length)]
      });
    }
  }
  return list;
})();

export type Replay = {
  curve: number[];
  baseline: number[];
  blocked: Trade[];
  allowed: number;
  total: number;
  returnPct: number;
  baselineReturnPct: number;
  worstDay: number;
  baselineWorstDay: number;
  haltedDays: number;
};

/** Replays the trades under the given limits. */
export function replay(limits: Limits): Replay {
  const curve = [100];
  const baseline = [100];
  const blocked: Trade[] = [];
  let worstDay = 0;
  let baselineWorstDay = 0;
  let haltedDays = 0;
  for (let day = 0; day < 90; day++) {
    const trades = TRADES.filter((trade) => trade.day === day);
    let dayPnl = 0;
    let basePnl = 0;
    let halted = false;
    for (const trade of trades) {
      basePnl += trade.pnl;
      const outside = trade.hour < limits.startHour || trade.hour >= limits.endHour;
      if (halted || trade.size > limits.maxPosition || outside) {
        blocked.push(trade);
        continue;
      }
      dayPnl += trade.pnl;
      if (dayPnl <= -limits.maxDailyLoss) halted = true;
    }
    if (halted) haltedDays++;
    worstDay = Math.min(worstDay, dayPnl);
    baselineWorstDay = Math.min(baselineWorstDay, basePnl);
    curve.push(curve[curve.length - 1] * (1 + dayPnl / 100));
    baseline.push(baseline[baseline.length - 1] * (1 + basePnl / 100));
  }
  return {
    curve,
    baseline,
    blocked,
    allowed: TRADES.length - blocked.length,
    total: TRADES.length,
    returnPct: curve[90] - 100,
    baselineReturnPct: baseline[90] - 100,
    worstDay,
    baselineWorstDay,
    haltedDays
  };
}

export const fmtPct = (value: number, digits = 1) =>
  `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(digits)}%`;

export const AGENTS = [
  { name: 'Momentum · Nordics', status: 'Trading', pnl: 0.84, exposure: 0.71, headroom: '1.4% to limit', last: 'Bought 1,200 EQNR', rule: '2.1', spark: 1 },
  { name: 'Mean reversion · G10 FX', status: 'Trading', pnl: 0.21, exposure: 0.44, headroom: '3.1% to limit', last: 'Sold 2.0M EURNOK', rule: '1.3', spark: 2 },
  { name: 'Earnings drift · US', status: 'Waiting', pnl: 0, exposure: 0.12, headroom: 'Opens 15:30', last: 'Outside trading hours', rule: '3.1', spark: 3 },
  { name: 'Pairs · Energy', status: 'Needs approval', pnl: -0.17, exposure: 0.63, headroom: 'Soft limit reached', last: 'Wants 9.2% in AKRBP', rule: '2.2', spark: 4 },
  { name: 'Overnight carry', status: 'Paused', pnl: -0.05, exposure: 0.08, headroom: 'Paused 13:40', last: 'Paused by Live Haugen', rule: '—', spark: 5 }
] as const;

/** A small deterministic series for sparklines. */
export function series(seed: number, length = 48, drift = 0.04) {
  const random = seeded(seed * 97);
  const values = [0];
  for (let i = 1; i < length; i++) values.push(values[i - 1] + (random() - 0.5 + drift) * 1.2);
  return values;
}
