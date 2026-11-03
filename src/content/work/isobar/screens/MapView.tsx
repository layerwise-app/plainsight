import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Dot, paintDots } from './Dots';
import { MAP_CELLS, MAP_COLS, MAP_ROWS, type When, cellAnomalies, dotTone } from './map';
import { I, SERIES, STATIONS, type StationId, anomalyColor, fmtC, span, yearIndex } from './model';

const CONTEXT = '#D9D6CB';

/** A cartographic halo, so labels read over the dots. */
export const halo = (c: string) =>
  [`${c} 0 0 4px`, `${c} 0 0 2px`, `${c} 1.5px 0 0`, `${c} -1.5px 0 0`, `${c} 0 1.5px 0`, `${c} 0 -1.5px 0`, `${c} 1px 1px 1px`, `${c} -1px -1px 1px`, `${c} 1px -1px 1px`, `${c} -1px 1px 1px`].join(', ');

function paintMap(context: CanvasRenderingContext2D, width: number, anomalies: Float32Array) {
  const cell = width / MAP_COLS;
  const context_: Dot[] = [];
  const land: Dot[] = [];
  MAP_CELLS.forEach((c, i) => {
    if (c.water) return;
    const x = (c.col + 0.5) * cell;
    const y = (c.row + 0.5) * cell;
    if (!c.inside) {
      context_.push({ x, y, r: cell * 0.17, color: CONTEXT });
      return;
    }
    land.push({ x, y, r: cell * 0.5 * Math.sqrt(dotTone(c)) - 0.3, color: anomalyColor(anomalies[i]) });
  });
  paintDots(context, context_);
  paintDots(context, land, { color: 'rgba(26,30,29,0.2)', width: 0.6 });
}

export const stationValue = (id: StationId, when: When) =>
  typeof when === 'number' ? SERIES[id].anomaly[yearIndex(when)] : span(SERIES[id].anomaly, when[0], when[1]);

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/**
 * Voss as a halftone: one dot per km², coloured by the anomaly, sized by the
 * shade of the terrain. Fills its parent's width. Give `onSelect` to make the
 * stations buttons.
 */
export function MunicipalityMap({
  when,
  selected,
  onSelect,
  stations = STATIONS.map((station) => station.id),
  showValues = true,
  places = true,
  scale = 1
}: {
  when: When;
  selected?: StationId;
  onSelect?: (id: StationId) => void;
  stations?: StationId[];
  showValues?: boolean;
  places?: boolean;
  /** Type size multiplier for labels. */
  scale?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(0);
  const key = typeof when === 'number' ? when : `${when[0]}-${when[1]}`;
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the year, not the array
  const anomalies = useMemo(() => cellAnomalies(when), [key]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const update = () => setSize(canvas.clientWidth);
    update();
    if (!('ResizeObserver' in window)) return;
    const observer = new ResizeObserver(update);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const draw = useCallback(
    (context: CanvasRenderingContext2D, width: number) => paintMap(context, width, anomalies),
    [anomalies]
  );

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || size <= 0) return;
    const height = (size * MAP_ROWS) / MAP_COLS;
    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(size * ratio);
    canvas.height = Math.round(height * ratio);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size, height);
    draw(context, size);
  }, [size, draw]);

  const fs = (n: number) => n * scale;

  return (
    <div className='@container' style={{ position: 'relative', width: '100%', aspectRatio: `${MAP_COLS} / ${MAP_ROWS}` }}>
      <canvas ref={ref} aria-hidden='true' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
      {places ? (
        <div
          aria-hidden='true'
          className='hidden @min-[440px]:block'
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: I.mono, color: I.ink2, textShadow: halo(I.card) }}
        >
          <span style={{ position: 'absolute', left: pct(26.6, MAP_COLS), top: pct(37.3, MAP_ROWS), fontSize: `${1.6 * scale}cqw`, letterSpacing: '0.06em' }}>
            VANGSVATNET
          </span>
          <span
            style={{
              position: 'absolute',
              left: pct(55.4, MAP_COLS),
              top: pct(51.2, MAP_ROWS),
              fontSize: `${1.6 * scale}cqw`,
              letterSpacing: '0.06em',
              transform: 'rotate(74deg)',
              transformOrigin: '0 0'
            }}
          >
            GRANVINSFJORDEN
          </span>
        </div>
      ) : null}
      {STATIONS.filter((station) => stations.includes(station.id)).map((station) => {
        const active = station.id === selected;
        const value = stationValue(station.id, when);
        const left = pct(station.at[0], MAP_COLS);
        const top = pct(station.at[1], MAP_ROWS);
        const flip = station.at[0] > MAP_COLS * 0.7;
        const label = (
          <span
            style={{
              position: 'absolute',
              left: flip ? undefined : fs(12),
              right: flip ? fs(12) : undefined,
              top: fs(-8),
              whiteSpace: 'nowrap',
              textAlign: flip ? 'right' : 'left',
              lineHeight: 1.15,
              textShadow: halo(I.card),
              pointerEvents: 'none'
            }}
          >
            <span style={{ display: 'block', fontFamily: I.sans, fontSize: fs(12), fontWeight: active ? 600 : 500, color: I.ink }}>
              {station.name}
            </span>
            {showValues ? (
              <span style={{ display: 'block', fontFamily: I.mono, fontSize: fs(10.5), color: I.ink, marginTop: 1 }}>
                {fmtC(value)}
              </span>
            ) : null}
          </span>
        );
        const dot = (
          <span
            style={{
              position: 'absolute',
              left: fs(-6),
              top: fs(-6),
              width: fs(12),
              height: fs(12),
              borderRadius: '50%',
              background: active ? I.ink : I.card,
              boxShadow: active ? `0 0 0 ${fs(2)}px ${I.card}, 0 0 0 ${fs(3.2)}px ${I.ink}` : `inset 0 0 0 ${fs(1.5)}px ${I.ink}`
            }}
          >
            {active ? null : (
              <span
                style={{
                  position: 'absolute',
                  inset: fs(3.5),
                  borderRadius: '50%',
                  background: anomalyColor(value)
                }}
              />
            )}
          </span>
        );
        if (!onSelect) {
          return (
            <span key={station.id} style={{ position: 'absolute', left, top, width: 0, height: 0 }}>
              {dot}
              {label}
            </span>
          );
        }
        return (
          <button
            key={station.id}
            type='button'
            onClick={() => onSelect(station.id)}
            aria-pressed={active}
            aria-label={`${station.name}, ${station.elevation} m`}
            className='outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#1A1E1D]'
            style={{
              position: 'absolute',
              left,
              top,
              width: 32,
              height: 32,
              margin: '-16px 0 0 -16px',
              padding: 0,
              border: 0,
              borderRadius: 16,
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            <span style={{ position: 'absolute', left: 16, top: 16 }}>
              {dot}
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** A 10 km bar for the map's corner. */
export function ScaleKm({ mapWidth }: { mapWidth: number }) {
  const w = (10 / MAP_COLS) * mapWidth;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: I.mono, fontSize: 10.5, color: I.ink2 }}>
      <svg width={w} height={6} aria-hidden='true'>
        <path d={`M0.5 0V5.5H${w - 0.5}V0`} fill='none' stroke={I.ink2} strokeWidth={1} />
      </svg>
      10 km
    </div>
  );
}
