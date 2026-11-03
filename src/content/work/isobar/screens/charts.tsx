import { FIRST_YEAR, I, LAST_YEAR, YEARS, anomalyColor, fmtC, running } from './model';

const AXIS = { fontFamily: I.mono, fontSize: 10.5, fill: I.ink2 } as const;

type Note = { year: number; text: string; dy?: number; anchor?: 'start' | 'end' | 'middle' };

/**
 * Annual anomaly as bars either side of the normal, each in its own colour,
 * with an 11-year mean drawn through them in ink.
 */
export function AnomalyBars({
  values,
  width,
  height,
  min = -2,
  max = 2.5,
  notes = [],
  hover,
  meanLabel = true
}: {
  values: number[];
  width: number;
  height: number;
  min?: number;
  max?: number;
  notes?: Note[];
  /** A year to show the hover state on. */
  hover?: { year: number; lines: string[] };
  meanLabel?: boolean;
}) {
  const left = 34;
  const right = 92;
  const top = 18;
  const bottom = 24;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const n = values.length;
  const step = plotW / n;
  const bar = Math.max(1, step - 2);
  const y = (v: number) => top + ((max - v) / (max - min)) * plotH;
  const x = (i: number) => left + i * step;
  const mean = running(values, 11);
  const line = mean.map((v, i) => `${i ? 'L' : 'M'}${(x(i) + step / 2).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const ticks = [];
  for (let t = Math.ceil(min); t <= Math.floor(max); t++) ticks.push(t);
  const normalEnd = x(1990 - FIRST_YEAR + 1);
  const hi = hover ? hover.year - FIRST_YEAR : -1;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden='true' style={{ display: 'block', overflow: 'visible' }}>
      <rect x={left} y={top} width={normalEnd - left} height={plotH} fill='rgba(26,30,29,0.035)' />
      <text x={left + 6} y={top + 13} {...AXIS} fill={I.muted}>
        1961–1990 normal
      </text>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={left + plotW} y1={y(t)} y2={y(t)} stroke={t === 0 ? I.ink : I.line} strokeWidth={t === 0 ? 1 : 1} />
          <text x={left - 8} y={y(t) + 3.5} textAnchor='end' {...AXIS}>
            {t === 0 ? '0' : fmtC(t, 0, false)}
          </text>
        </g>
      ))}
      <text x={left - 8} y={top - 6} textAnchor='end' {...AXIS} fill={I.muted}>
        °C
      </text>
      {values.map((v, i) => {
        const y0 = y(0);
        const y1 = y(v);
        return (
          <rect
            key={YEARS[i]}
            x={x(i) + (step - bar) / 2}
            y={Math.min(y0, y1)}
            width={bar}
            height={Math.max(1, Math.abs(y1 - y0))}
            rx={Math.min(2, bar / 2)}
            fill={anomalyColor(v)}
            opacity={hi >= 0 && hi !== i ? 0.78 : 1}
          />
        );
      })}
      <path d={line} fill='none' stroke={I.ink} strokeWidth={2} strokeLinejoin='round' strokeLinecap='round' />
      {meanLabel ? (
        <g>
          <circle cx={x(n - 1) + step / 2} cy={y(mean[n - 1])} r={3.5} fill={I.ink} />
          <text x={x(n - 1) + step / 2 + 10} y={y(mean[n - 1]) - 2} {...AXIS} fill={I.ink}>
            {fmtC(mean[n - 1])}
          </text>
          <text x={x(n - 1) + step / 2 + 10} y={y(mean[n - 1]) + 11} fontFamily={I.sans} fontSize={11} fill={I.muted}>
            11-year mean
          </text>
        </g>
      ) : null}
      {notes.map((note) => {
        const i = note.year - FIRST_YEAR;
        const v = values[i];
        const ny = v >= 0 ? y(v) - 8 + (note.dy ?? 0) : y(v) + 16 + (note.dy ?? 0);
        return (
          <text key={note.year} x={x(i) + step / 2} y={ny} textAnchor={note.anchor ?? 'middle'} fontFamily={I.sans} fontSize={11} fill={I.ink2}>
            {note.text}
          </text>
        );
      })}
      {[FIRST_YEAR, 1970, 1980, 1990, 2000, 2010, 2020, LAST_YEAR].map((year) => (
        <text key={year} x={x(year - FIRST_YEAR) + step / 2} y={height - 6} textAnchor='middle' {...AXIS}>
          {year}
        </text>
      ))}
      {hover ? (
        <g>
          <line x1={x(hi) + step / 2} x2={x(hi) + step / 2} y1={top} y2={top + plotH} stroke={I.ink} strokeWidth={1} />
          <g transform={`translate(${x(hi) + step / 2 - 186}, ${top + 4})`}>
            <rect width={176} height={18 + hover.lines.length * 16} rx={5} fill={I.ink} />
            {hover.lines.map((text, k) => (
              <text
                key={text}
                x={11}
                y={20 + k * 16}
                fontFamily={k === 0 ? I.sans : I.mono}
                fontSize={k === 0 ? 12 : 11}
                fontWeight={k === 0 ? 500 : 400}
                fill={k === 0 ? I.card : 'rgba(251,250,246,0.78)'}
              >
                {text}
              </text>
            ))}
          </g>
        </g>
      ) : null}
    </svg>
  );
}

/** Days of heavy rain per year as teal bars, with its 11-year mean and the old normal. */
export function RainBars({
  values,
  width,
  height,
  normal,
  max = 16
}: {
  values: number[];
  width: number;
  height: number;
  normal: number;
  max?: number;
}) {
  const left = 30;
  const right = 76;
  const top = 12;
  const bottom = 24;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const n = values.length;
  const step = plotW / n;
  const bar = Math.max(1, step - 2);
  const y = (v: number) => top + ((max - v) / max) * plotH;
  const x = (i: number) => left + i * step;
  const mean = running(values, 11);
  const line = mean.map((v, i) => `${i ? 'L' : 'M'}${(x(i) + step / 2).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const ticks = [0, 5, 10, 15].filter((t) => t <= max);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden='true' style={{ display: 'block', overflow: 'visible' }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={left + plotW} y1={y(t)} y2={y(t)} stroke={t === 0 ? I.ink : I.line} />
          <text x={left - 8} y={y(t) + 3.5} textAnchor='end' {...AXIS}>
            {t}
          </text>
        </g>
      ))}
      {values.map((v, i) => (
        <rect
          key={YEARS[i]}
          x={x(i) + (step - bar) / 2}
          y={y(v)}
          width={bar}
          height={Math.max(0, y(0) - y(v))}
          rx={Math.min(2, bar / 2)}
          fill={I.rain}
          opacity={0.78}
        />
      ))}
      <line x1={left} x2={x(1990 - FIRST_YEAR + 1)} y1={y(normal)} y2={y(normal)} stroke={I.ink} strokeWidth={1.2} />
      <text
        x={left + 4}
        y={y(normal) - 6}
        fontFamily={I.sans}
        fontSize={11}
        fill={I.ink}
        stroke={I.card}
        strokeWidth={3.5}
        strokeLinejoin='round'
        paintOrder='stroke'
      >
        1961–1990 mean, {normal.toFixed(1)} days
      </text>
      <path d={line} fill='none' stroke={I.ink} strokeWidth={2} strokeLinejoin='round' strokeLinecap='round' />
      <circle cx={x(n - 1) + step / 2} cy={y(mean[n - 1])} r={3.5} fill={I.ink} />
      <text x={x(n - 1) + step / 2 + 10} y={y(mean[n - 1]) - 2} {...AXIS} fill={I.ink}>
        {mean[n - 1].toFixed(1)} days
      </text>
      <text x={x(n - 1) + step / 2 + 10} y={y(mean[n - 1]) + 11} fontFamily={I.sans} fontSize={11} fill={I.muted}>
        11-year mean
      </text>
      {[FIRST_YEAR, 1980, 2000, 2020].map((year) => (
        <text key={year} x={x(year - FIRST_YEAR) + step / 2} y={height - 6} textAnchor='middle' {...AXIS}>
          {year}
        </text>
      ))}
    </svg>
  );
}
