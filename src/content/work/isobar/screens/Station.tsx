import { AnomalyBars, RainBars } from './charts';
import { I, NORMALS, SERIES, YEARS, fmtC, ordinal, span, warmRank, yearIndex } from './model';
import { AppFrame, Button, Card, PageHead, Segmented, Stat } from './ui';

const WETTEST = [
  { date: '28 Oct 2014', mm: 81, note: 'Vosso over its banks at Bulken' },
  { date: '14 Sep 2024', mm: 72, note: 'E16 closed at Skjervet for 9 hours' },
  { date: '6 Dec 2015', mm: 66, note: 'Slips on the Granvin road' },
  { date: '3 Aug 2022', mm: 58, note: '41 mm of it in three hours' },
  { date: '15 Nov 1983', mm: 57, note: '' }
];

/** One station: temperature and heavy rain since 1961. 1240 × 760. */
export function StationScreen() {
  const voss = SERIES.voss;
  const last = voss.anomaly[voss.anomaly.length - 1];
  const warmest = Math.max(...voss.anomaly);
  const warmestYear = YEARS[voss.anomaly.indexOf(warmest)];
  const i2018 = yearIndex(2018);
  return (
    <AppFrame active='Stations'>
      <PageHead
        title={
          <span>
            Voss <span style={{ color: I.muted, fontWeight: 400 }}>56 m</span>
          </span>
        }
        sub='Station 51530 at Bømoen · measuring since 1895 · 1961–2025 shown'
        right={
          <>
            <Segmented items={['Year', 'Summer', 'Winter']} active='Year' />
            <Button>Compare stations</Button>
            <Button primary>Add to report</Button>
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, padding: '0 2px 14px' }}>
        <Stat label='2025 so far' value={fmtC(last, 1, false)} unit='°C' note={`${ordinal(warmRank(voss.anomaly, 2025))} warmest of 65 years`} />
        <Stat label='Warmest year' value={fmtC(warmest, 1, false)} unit='°C' note={`${warmestYear}. Eight of the ten warmest came after 2010`} />
        <Stat
          label='Days above 25 °C'
          value={`${span(voss.hot, 2016, 2025).toFixed(1)}`}
          unit='a year'
          note={`2016–2025. The normal is ${Math.round(NORMALS.hot)}`}
        />
        <Stat
          label='Days with 30 mm+ of rain'
          value={`${span(voss.rain, 2016, 2025).toFixed(1)}`}
          unit='a year'
          note={`2016–2025. The normal is ${NORMALS.rain.toFixed(1)}`}
        />
      </div>

      <Card title='Annual mean temperature against the 1961–1990 normal' aside='Hover a year for its detail'>
        <AnomalyBars
          values={voss.anomaly}
          width={1158}
          height={212}
          notes={[
            { year: 1987, text: 'Coldest, −1.1' },
            { year: 2020, text: 'Warmest', dy: -2 }
          ]}
          hover={{
            year: 2018,
            lines: [
              '2018',
              `${fmtC(voss.anomaly[i2018])} on the normal`,
              `${voss.hot[i2018]} days above 25 °C`,
              `${voss.rain[i2018]} days with 30 mm+`
            ]
          }}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: 14, marginTop: 14, flex: 1, minHeight: 0 }}>
        <Card title='Days with 30 mm of rain or more' aside='Counted per calendar year'>
          <RainBars values={voss.rain} width={656} height={146} normal={NORMALS.rain} max={15} />
        </Card>
        <Card title='Wettest days since 1961' aside='24-hour totals'>
          {WETTEST.map((day, index) => (
            <div
              key={day.date}
              style={{
                display: 'grid',
                gridTemplateColumns: '92px 52px 1fr',
                alignItems: 'baseline',
                gap: 8,
                padding: '6px 0',
                borderTop: index ? `1px solid ${I.line}` : undefined
              }}
            >
              <span style={{ fontFamily: I.mono, fontSize: 11.5, color: I.ink2 }}>{day.date}</span>
              <span style={{ fontFamily: I.mono, fontSize: 12.5, color: I.ink, textAlign: 'right' }}>{day.mm} mm</span>
              <span style={{ fontSize: 12, color: I.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {day.note}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </AppFrame>
  );
}
