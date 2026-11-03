import { I, NORMALS, REGIONAL, SCENARIOS, SERIES, anomalyColor, fmtC, span } from './model';
import { AppFrame, Button, Card, PageHead, Segmented } from './ui';

/** Median and 10–90% range per scenario and horizon, on one °C axis. */
export function ScenarioPlot({ width, height }: { width: number; height: number }) {
  const left = 168;
  const right = 72;
  const top = 34;
  const bottom = 30;
  const max = 7;
  const plotW = width - left - right;
  const x = (v: number) => left + (v / max) * plotW;
  const rows = SCENARIOS.flatMap((scenario) => ([2050, 2100] as const).map((year) => ({ scenario, year })));
  const groupGap = 18;
  const rowH = (height - top - bottom - groupGap * 2) / rows.length;
  const rowY = (i: number) => top + i * rowH + Math.floor(i / 2) * groupGap + rowH / 2;
  const today = span(REGIONAL, 2016, 2025);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden='true' style={{ display: 'block' }}>
      {Array.from({ length: max + 1 }, (_, t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top - 8} y2={height - bottom} stroke={t === 0 ? I.ink : I.line} />
          <text x={x(t)} y={height - 10} textAnchor='middle' fontFamily={I.mono} fontSize={10.5} fill={I.ink2}>
            {t === 0 ? '0' : `+${t}`}
          </text>
        </g>
      ))}
      <text x={x(max)} y={height - 10} dx={14} fontFamily={I.mono} fontSize={10.5} fill={I.ink2}>
        °C
      </text>
      <line x1={x(today)} x2={x(today)} y1={top - 16} y2={height - bottom} stroke={I.ink} strokeWidth={1.5} />
      <text x={x(today) + 6} y={top - 18} fontFamily={I.sans} fontSize={11.5} fill={I.ink}>
        Now, 2016–2025: {fmtC(today)}
      </text>
      {rows.map(({ scenario, year }, i) => {
        const [median, lo, hi] = scenario.temp[year];
        const cy = rowY(i);
        const color = anomalyColor(median);
        return (
          <g key={`${scenario.id}-${year}`}>
            {i % 2 === 0 ? (
              <g>
                <text x={0} y={cy + 4} fontFamily={I.sans} fontSize={13} fontWeight={500} fill={I.ink}>
                  {scenario.name}
                </text>
                <text x={0} y={cy + 4 + rowH} fontFamily={I.mono} fontSize={10.5} fill={I.muted}>
                  {scenario.code}
                </text>
              </g>
            ) : null}
            <text x={left - 14} y={cy + 4} textAnchor='end' fontFamily={I.mono} fontSize={11} fill={I.ink2}>
              {year}
            </text>
            <rect x={x(lo)} y={cy - 5} width={x(hi) - x(lo)} height={10} rx={5} fill={color} opacity={0.32} />
            <circle cx={x(median)} cy={cy} r={6.5} fill={color} stroke={I.card} strokeWidth={2} />
            <text x={x(hi) + 10} y={cy + 4} fontFamily={I.mono} fontSize={12} fill={I.ink}>
              {fmtC(median)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

type Row = { label: string; unit: string; normal: number; now: number; pick: (s: (typeof SCENARIOS)[number], y: 2050 | 2100) => number; digits?: number };

const ROWS: Row[] = [
  {
    label: 'Annual mean temperature',
    unit: '°C on normal',
    normal: 0,
    now: span(SERIES.voss.anomaly, 2016, 2025),
    pick: (s, y) => s.temp[y][0],
    digits: 1
  },
  { label: 'Days with 30 mm+ of rain', unit: 'a year', normal: NORMALS.rain, now: span(SERIES.voss.rain, 2016, 2025), pick: (s, y) => s.rain[y], digits: 1 },
  { label: 'Days with snow on the ground', unit: 'a year', normal: NORMALS.snow, now: span(SERIES.voss.snow, 2016, 2025), pick: (s, y) => s.snow[y] },
  { label: 'Days above 25 °C', unit: 'a year', normal: NORMALS.hot, now: span(SERIES.voss.hot, 2016, 2025), pick: (s, y) => s.hot[y] }
];

function num(row: Row, v: number) {
  if (row.unit.startsWith('°C')) return v === 0 ? '0.0' : fmtC(v, 1, false);
  return v.toFixed(row.digits ?? 0);
}

/** Low, medium and high emissions for 2050 and 2100. 1240 × 760. */
export function ScenariosScreen() {
  const cols = '1.7fr 0.75fr 0.75fr repeat(6, 0.62fr)';
  return (
    <AppFrame active='Scenarios'>
      <PageHead
        title='Scenarios for Voss'
        sub='Change against the 1961–1990 normal · median of 10 downscaled models · bars span the 10th to 90th percentile'
        right={
          <>
            <Segmented items={['2050', '2100', 'Both']} active='Both' />
            <Button primary>Add to report</Button>
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1.62fr 1fr', gap: 14 }}>
        <Card title='Annual mean temperature' aside='°C above the 1961–1990 normal'>
          <ScenarioPlot width={690} height={300} />
        </Card>
        <Card title='What to plan for'>
          <div style={{ fontSize: 19, lineHeight: 1.3, letterSpacing: '-0.02em', textWrap: 'pretty' }}>
            Plan for medium emissions. Check anything meant to last past 2070 against high.
          </div>
          <div style={{ display: 'grid', gap: 12, marginTop: 18, fontSize: 13, lineHeight: 1.45, color: I.ink2 }}>
            <p>
              <span style={{ color: I.ink, fontWeight: 500 }}>Drains and culverts.</span> Under high emissions, days with 30 mm of
              rain double on the normal by 2100. Size new drains with a 40% allowance on design rainfall.
            </p>
            <p>
              <span style={{ color: I.ink, fontWeight: 500 }}>Snow.</span> Below 300 m, three months of snow on the ground becomes
              rare after 2050 in all three scenarios. Keep today’s snow loads above 600 m.
            </p>
            <p>
              <span style={{ color: I.ink, fontWeight: 500 }}>Heat.</span> By 2050 a summer like 2018, with 14 days above 25 °C,
              is an ordinary summer under medium emissions.
            </p>
          </div>
          <div style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${I.line}`, fontSize: 12, color: I.muted, lineHeight: 1.45 }}>
            Guidance for Vestland municipalities, reviewed with five planning offices in May 2025.
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 14, padding: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            padding: '12px 16px 4px',
            fontSize: 12,
            color: I.ink
          }}
        >
          <span />
          <span style={{ textAlign: 'right', color: I.muted }}>1961–1990</span>
          <span style={{ textAlign: 'right', color: I.muted }}>2016–2025</span>
          {SCENARIOS.map((scenario) => (
            <span
              key={scenario.id}
              style={{
                gridColumn: 'span 2',
                textAlign: 'center',
                fontWeight: 500,
                borderBottom: `1px solid ${I.lineStrong}`,
                paddingBottom: 6,
                margin: '0 10px'
              }}
            >
              {scenario.name.replace(' emissions', '')}
            </span>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            padding: '4px 16px 8px',
            fontFamily: I.mono,
            fontSize: 11,
            color: I.muted,
            borderBottom: `1px solid ${I.line}`
          }}
        >
          <span style={{ fontFamily: I.sans, fontSize: 12 }}>At Voss</span>
          <span style={{ textAlign: 'right' }}>normal</span>
          <span style={{ textAlign: 'right' }}>now</span>
          {SCENARIOS.flatMap((scenario) =>
            [2050, 2100].map((year) => (
              <span key={`${scenario.id}${year}`} style={{ textAlign: 'right' }}>
                {year}
              </span>
            ))
          )}
        </div>
        {ROWS.map((row, index) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              alignItems: 'baseline',
              padding: '10px 16px',
              borderBottom: index < ROWS.length - 1 ? `1px solid ${I.line}` : undefined
            }}
          >
            <span>
              {row.label} <span style={{ color: I.muted, fontSize: 12 }}>{row.unit}</span>
            </span>
            <span style={{ fontFamily: I.mono, fontSize: 12.5, textAlign: 'right', color: I.ink2 }}>{num(row, row.normal)}</span>
            <span style={{ fontFamily: I.mono, fontSize: 12.5, textAlign: 'right', color: I.ink2 }}>{num(row, row.now)}</span>
            {SCENARIOS.flatMap((scenario) =>
              ([2050, 2100] as const).map((year) => (
                <span
                  key={`${scenario.id}${year}`}
                  style={{
                    fontFamily: I.mono,
                    fontSize: 12.5,
                    textAlign: 'right',
                    fontWeight: scenario.id === 'medium' ? 600 : 400
                  }}
                >
                  {num(row, row.pick(scenario, year))}
                </span>
              ))
            )}
          </div>
        ))}
      </Card>
    </AppFrame>
  );
}
