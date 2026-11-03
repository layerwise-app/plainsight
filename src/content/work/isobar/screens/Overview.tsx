import { MunicipalityMap, ScaleKm } from './MapView';
import { I, REGIONAL, SERIES, STATIONS, anomalyColor, fmtC, mean, span } from './model';
import { AppFrame, Button, Card, MiniStripes, PageHead, ScaleBar, Segmented, Stat, Stripes } from './ui';

const all = (pick: (id: (typeof STATIONS)[number]['id']) => number) => mean(STATIONS.map((station) => pick(station.id)));

export const SUMMARY = (() => {
  const warm = span(REGIONAL, 2016, 2025);
  const rainNow = all((id) => span(SERIES[id].rain, 2016, 2025));
  const rainThen = all((id) => span(SERIES[id].rain, 1961, 1990));
  const snowNow = all((id) => span(SERIES[id].snow, 2016, 2025));
  const snowThen = all((id) => span(SERIES[id].snow, 1961, 1990));
  return {
    warm,
    rainNow,
    rainThen,
    rainChange: Math.round((rainNow / rainThen - 1) * 100),
    snowNow,
    snowThen,
    snowChange: Math.round(snowNow - snowThen)
  };
})();

function DownloadIcon() {
  return (
    <svg width='13' height='13' viewBox='0 0 13 13' aria-hidden='true'>
      <path d='M6.5 1.5v7M3.5 5.8l3 3 3-3M2 11.5h9' fill='none' stroke='currentColor' strokeWidth='1.4' />
    </svg>
  );
}

/** The municipality overview, designed at 1240 × 760. */
export function Overview() {
  const mapWidth = 540;
  return (
    <AppFrame active='Overview'>
      <PageHead
        title='How Voss has changed since 1961'
        sub='Against the 1961–1990 normal · 5 stations and a 1 km grid · data to 31 October 2025'
        right={
          <>
            <Segmented items={['Temperature', 'Heavy rain', 'Snow']} active='Temperature' />
            <Button primary>
              <DownloadIcon />
              Council report
            </Button>
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: `${mapWidth + 32}px 1fr`, gap: 14, flex: 1, minHeight: 0 }}>
        <Card title='Annual mean temperature, 2016–2025' aside='Each dot is 1 km²'>
          <div style={{ width: mapWidth }}>
            <MunicipalityMap when={[2016, 2025]} selected='voss' />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12 }}>
            <ScaleBar width={250} />
            <div style={{ paddingTop: 2 }}>
              <ScaleKm mapWidth={mapWidth} />
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
              <Stat
                label='Warmer'
                value={fmtC(SUMMARY.warm, 1, false)}
                unit='°C'
                note='2016–2025, against 1961–1990'
                swatch={anomalyColor(SUMMARY.warm)}
              />
              <Stat
                label='Days with 30 mm+ of rain'
                value={`+${SUMMARY.rainChange}`}
                unit='%'
                note={`${SUMMARY.rainNow.toFixed(1)} a year, was ${SUMMARY.rainThen.toFixed(1)}`}
                swatch={I.rain}
              />
              <Stat
                label='Snow on the ground'
                value={`−${Math.abs(SUMMARY.snowChange)}`}
                unit='days'
                note={`${Math.round(SUMMARY.snowNow)} a year, was ${Math.round(SUMMARY.snowThen)}`}
                swatch={I.ink2}
              />
            </div>
          </Card>

          <Card title='Every year since 1961' aside='Municipality mean, one stripe per year'>
            <Stripes values={REGIONAL} width={574} height={56} highlight={2025} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: I.ink2 }}>
              <span>
                Warmest <span style={{ fontFamily: I.mono }}>2020</span>, <span style={{ fontFamily: I.mono }}>{fmtC(Math.max(...REGIONAL))}</span>
              </span>
              <span>
                Coldest <span style={{ fontFamily: I.mono }}>1987</span>, <span style={{ fontFamily: I.mono }}>{fmtC(Math.min(...REGIONAL))}</span>
              </span>
              <span>
                This year so far <span style={{ fontFamily: I.mono }}>{fmtC(REGIONAL[REGIONAL.length - 1])}</span>
              </span>
            </div>
          </Card>

          <Card style={{ padding: 0, flex: 1 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.6fr 0.8fr 130px 0.9fr',
                gap: 14,
                padding: '12px 16px 10px',
                fontSize: 11.5,
                color: I.muted,
                borderBottom: `1px solid ${I.line}`
              }}
            >
              <span>Station</span>
              <span style={{ textAlign: 'right' }}>Height</span>
              <span style={{ textAlign: 'right' }}>2016–2025</span>
              <span>1961–2025</span>
              <span style={{ textAlign: 'right' }}>Heavy rain, days/yr</span>
            </div>
            {STATIONS.map((station, index) => {
              const series = SERIES[station.id];
              const recent = span(series.anomaly, 2016, 2025);
              const rainNow = span(series.rain, 2016, 2025);
              const rainThen = span(series.rain, 1961, 1990);
              return (
                <div
                  key={station.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.6fr 0.8fr 130px 0.9fr',
                    gap: 14,
                    alignItems: 'center',
                    padding: '9px 16px',
                    borderBottom: index < STATIONS.length - 1 ? `1px solid ${I.line}` : undefined,
                    background: station.id === 'voss' ? 'rgba(26,30,29,0.035)' : undefined
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{station.name}</span>
                  <span style={{ fontFamily: I.mono, fontSize: 12, textAlign: 'right', color: I.ink2 }}>
                    {station.elevation.toLocaleString('en-GB')} m
                  </span>
                  <span style={{ fontFamily: I.mono, fontSize: 12.5, textAlign: 'right' }}>{fmtC(recent)}</span>
                  <MiniStripes values={series.anomaly} width={130} height={16} />
                  <span style={{ fontFamily: I.mono, fontSize: 12.5, textAlign: 'right' }}>
                    {rainNow.toFixed(1)}
                    <span style={{ color: I.muted }}> / {rainThen.toFixed(1)}</span>
                  </span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
