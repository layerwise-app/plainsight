import type * as React from 'react';
import { MunicipalityMap } from './MapView';
import { I, REGIONAL, SCENARIOS, SERIES, STATIONS, anomalyColor, fmtC, span } from './model';
import { SUMMARY } from './Overview';
import { ScenarioPlot } from './Scenarios';
import { Mark, ScaleBar, Stripes } from './ui';

/** A4 at 96 dpi. */
export const A4 = { width: 794, height: 1123 };
const PAGE = '#FDFDFB';
const M = 64;

function Page({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: A4.width,
        height: A4.height,
        background: PAGE,
        color: I.ink,
        fontFamily: I.sans,
        position: 'relative',
        padding: `${M - 8}px ${M}px ${M}px`,
        display: 'flex',
        flexDirection: 'column',
        letterSpacing: '-0.005em'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 12,
          borderBottom: `1px solid ${I.ink}`,
          fontSize: 10.5
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 600, fontSize: 12, letterSpacing: '-0.02em' }}>
          <Mark size={16} />
          Isobar
        </span>
        <span style={{ fontFamily: I.mono, color: I.ink2 }}>Climate summary · Voss · November 2025</span>
      </div>
      {children}
      <div
        style={{
          position: 'absolute',
          left: M,
          right: M,
          bottom: 34,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: I.mono,
          fontSize: 9.5,
          color: I.muted
        }}
      >
        <span>Isobar Climate · 5 stations, 1 km grid, 10 models · isobar.no/voss/report/2025-11</span>
        <span>{number} / 2</span>
      </div>
    </div>
  );
}

const label: React.CSSProperties = { fontSize: 10.5, fontWeight: 500, letterSpacing: '0.02em', color: I.ink2 };
const body: React.CSSProperties = { fontSize: 12.5, lineHeight: 1.55, color: I.ink, textWrap: 'pretty' };

function Figure({ value, unit, text, color }: { value: string; unit: string; text: string; color: string }) {
  return (
    <div style={{ borderTop: `3px solid ${color}`, paddingTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: I.mono, fontSize: 34, letterSpacing: '-0.05em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontFamily: I.mono, fontSize: 13 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11.5, lineHeight: 1.4, color: I.ink2, marginTop: 8 }}>{text}</div>
    </div>
  );
}

/** Page one: what has changed, and what it means. */
export function ReportPageOne() {
  const actions = [
    ['Drains and culverts', 'Size new ones with a 40% allowance on today’s design rainfall. Check the 31 culverts under the E16 and Rv13 first.'],
    ['Flood zones', 'Redraw the 200-year flood line along the Vosso at Bulken and Vangsvatnet with the medium scenario for 2100.'],
    ['Winter roads', 'Plan for fewer snow days and more freeze–thaw days below 300 m. Salt and grit budgets move from snow to ice.'],
    ['Heat', 'Expect 13 days above 25 °C a year by 2050. Care homes and schools need shade and a cooling plan.']
  ];
  return (
    <Page number={1}>
      <div style={{ ...label, marginTop: 30 }}>For the planning and environment committee, 12 November 2025</div>
      <h1 style={{ fontSize: 33, lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 500, margin: '12px 0 0', textWrap: 'balance' }}>
        Voss is 1.5 °C warmer than in 1961–1990. Days of heavy rain come a fifth more often.
      </h1>
      <div style={{ marginTop: 28 }}>
        <Stripes values={REGIONAL} width={666} height={64} highlight={2025} />
      </div>
      <div style={{ fontSize: 10.5, color: I.muted, marginTop: 6 }}>
        Each stripe is one year’s mean temperature for the municipality. Blue is colder than the 1961–1990 normal, red warmer.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, marginTop: 30 }}>
        <Figure
          value={fmtC(SUMMARY.warm, 1, false)}
          unit='°C'
          text='Annual mean temperature, 2016–2025, against 1961–1990'
          color={anomalyColor(SUMMARY.warm)}
        />
        <Figure
          value={`+${SUMMARY.rainChange}`}
          unit='%'
          text={`Days with 30 mm of rain or more: ${SUMMARY.rainNow.toFixed(1)} a year, up from ${SUMMARY.rainThen.toFixed(1)}`}
          color={I.rain}
        />
        <Figure
          value={`−${Math.abs(SUMMARY.snowChange)}`}
          unit='days'
          text={`Snow on the ground: ${Math.round(SUMMARY.snowNow)} days a year, down from ${Math.round(SUMMARY.snowThen)}`}
          color={I.ink2}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginTop: 34 }}>
        <div>
          <div style={label}>What has changed</div>
          <p style={{ ...body, marginTop: 8 }}>
            Eight of the ten warmest years since 1961 came after 2010. The warmest was 2020, at 2.1 °C above the normal.
            The coldest, 1987, would now be rarer than one year in a hundred.
          </p>
          <p style={{ ...body, marginTop: 8 }}>
            Heavy rain has become more common at every station. Of the five wettest days on record at Voss, four came
            after 2005. The mountains have warmed fastest: Hamlagrø, at 1,005 m, by 1.7 °C.
          </p>
        </div>
        <div>
          <div style={label}>What it means for Voss</div>
          <ol style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 9 }}>
            {actions.map(([title, text], index) => (
              <li key={title} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', ...body, fontSize: 12 }}>
                <span style={{ fontFamily: I.mono, fontSize: 11, color: I.muted, paddingTop: 1 }}>{index + 1}</span>
                <span>
                  <span style={{ fontWeight: 600 }}>{title}.</span> {text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div style={{ marginTop: 34 }}>
        <div style={label}>At each station</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8, fontSize: 11.5 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${I.ink}`, color: I.ink2 }}>
              <th style={{ textAlign: 'left', fontWeight: 500, padding: '0 0 6px' }}>Station</th>
              <th style={{ textAlign: 'right', fontWeight: 500, padding: '0 0 6px' }}>Height</th>
              <th style={{ textAlign: 'right', fontWeight: 500, padding: '0 0 6px' }}>Warmer, °C</th>
              <th style={{ textAlign: 'right', fontWeight: 500, padding: '0 0 6px' }}>Heavy-rain days</th>
              <th style={{ textAlign: 'right', fontWeight: 500, padding: '0 0 6px' }}>Snow days</th>
            </tr>
          </thead>
          <tbody style={{ fontFamily: I.mono }}>
            {STATIONS.map((station) => {
              const s = SERIES[station.id];
              return (
                <tr key={station.id} style={{ borderBottom: `1px solid ${I.line}` }}>
                  <td style={{ fontFamily: I.sans, padding: '6px 0' }}>{station.name}</td>
                  <td style={{ textAlign: 'right' }}>{station.elevation.toLocaleString('en-GB')} m</td>
                  <td style={{ textAlign: 'right' }}>{fmtC(span(s.anomaly, 2016, 2025), 1, false)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {span(s.rain, 1961, 1990).toFixed(1)} → {span(s.rain, 2016, 2025).toFixed(1)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {Math.round(span(s.snow, 1961, 1990))} → {Math.round(span(s.snow, 2016, 2025))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ fontSize: 10.5, color: I.muted, marginTop: 6 }}>2016–2025 against 1961–1990. Days are a yearly average.</div>
      </div>
    </Page>
  );
}

/** Page two: the scenarios, the map and how to read them. */
export function ReportPageTwo() {
  return (
    <Page number={2}>
      <div style={{ ...label, marginTop: 30 }}>Three futures</div>
      <h2 style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.03em', fontWeight: 500, margin: '8px 0 0', textWrap: 'balance' }}>
        By 2050 the scenarios differ by less than a degree. By 2100 they differ by three.
      </h2>
      <div style={{ marginTop: 18 }}>
        <ScenarioPlot width={666} height={250} />
      </div>
      <div style={{ fontSize: 10.5, color: I.muted, marginTop: 4 }}>
        Annual mean temperature in °C above the 1961–1990 normal. Dots are the median of 10 models; bars span the 10th to
        90th percentile.
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 22, fontSize: 11.5 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${I.ink}` }}>
            <th style={{ textAlign: 'left', fontWeight: 500, padding: '0 0 6px' }}>At Voss, a year</th>
            {SCENARIOS.map((s) => (
              <th key={s.id} style={{ textAlign: 'right', fontWeight: 500, padding: '0 0 6px' }}>
                {s.name.replace(' emissions', '')}, 2100
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontFamily: I.mono }}>
          {[
            ['Days with 30 mm+ of rain', (s: (typeof SCENARIOS)[number]) => s.rain[2100].toFixed(1)],
            ['Days with snow on the ground', (s: (typeof SCENARIOS)[number]) => String(s.snow[2100])],
            ['Days above 25 °C', (s: (typeof SCENARIOS)[number]) => String(s.hot[2100])]
          ].map(([name, pick]) => (
            <tr key={name as string} style={{ borderBottom: `1px solid ${I.line}` }}>
              <td style={{ fontFamily: I.sans, padding: '7px 0' }}>{name as string}</td>
              {SCENARIOS.map((s) => (
                <td key={s.id} style={{ textAlign: 'right', padding: '7px 0' }}>
                  {(pick as (s: (typeof SCENARIOS)[number]) => string)(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 28, marginTop: 30 }}>
        <div>
          <div style={{ width: 290 }}>
            <MunicipalityMap when={[2016, 2025]} showValues={false} places={false} scale={0.85} stations={['voss', 'granvin', 'myrkdalen', 'hamlagro']} />
          </div>
          <div style={{ marginTop: 8 }}>
            <ScaleBar width={200} height={6} label='°C against 1961–1990, 2016–2025' />
          </div>
        </div>
        <div>
          <div style={label}>How to read this report</div>
          <div style={{ ...body, fontSize: 11.5, marginTop: 8, display: 'grid', gap: 7 }}>
            <p>
              <span style={{ fontWeight: 600 }}>Normal</span> is the average for 1961–1990. Every figure is a difference from it.
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>The map</span> shows 2016–2025 on a 1 km grid. Colour is the temperature
              difference; dot size only shows the shape of the land.
            </p>
            <p>
              <span style={{ fontWeight: 600 }}>Scenarios</span> are the shared pathways SSP1-2.6, SSP2-4.5 and SSP5-8.5,
              downscaled by Isobar and checked against 14 stations in Vestland.
            </p>
            <p style={{ color: I.ink2 }}>Questions: Hilde Brekke, Isobar Climate, hilde@isobar.no</p>
          </div>
        </div>
      </div>
    </Page>
  );
}
