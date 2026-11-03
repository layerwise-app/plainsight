import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useInView, usePageVisible, useReducedMotion } from '~/components/case/demo-context';
import { MunicipalityMap } from './screens/MapView';
import {
  FIRST_YEAR,
  I,
  LAST_YEAR,
  NORMALS_BY,
  PICKABLE,
  SERIES,
  type StationId,
  YEARS,
  anomalyColor,
  describeYear,
  fmtC,
  stationById,
  yearIndex
} from './screens/model';
import { ScaleBar } from './screens/ui';

const FOCUS = 'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1E1D]';
const STEP_MS = 140;

/** Warming stripes that are also the year slider: drag, tap, or focus and use the arrow keys. */
function Scrubber({
  values,
  year,
  onYear,
  label
}: {
  values: number[];
  year: number;
  onYear: (year: number) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const index = yearIndex(year);
  const at = (i: number) => `${(i / values.length) * 100}%`;

  const seek = (clientX: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box || box.width <= 0) return;
    const i = Math.floor(((clientX - box.left) / box.width) * values.length);
    onYear(FIRST_YEAR + Math.max(0, Math.min(values.length - 1, i)));
  };

  return (
    <div>
      <div className='relative' style={{ height: 16, fontFamily: I.mono, fontSize: 10.5, color: I.ink2 }} aria-hidden='true'>
        <span
          style={{
            position: 'absolute',
            left: 0,
            width: at(30),
            top: 3,
            height: 6,
            borderTop: `1px solid ${I.ink2}`,
            borderLeft: `1px solid ${I.ink2}`,
            borderRight: `1px solid ${I.ink2}`
          }}
        />
        <span style={{ position: 'absolute', left: at(15), top: -4, transform: 'translateX(-50%)', background: I.paper, padding: '0 5px', whiteSpace: 'nowrap' }}>
          normal 1961–1990
        </span>
      </div>
      <div
        ref={ref}
        className='relative cursor-ew-resize rounded-[2px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[#1A1E1D]'
        style={{ height: 'clamp(34px, 4.2cqw, 58px)', touchAction: 'pan-y' }}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          seek(event.clientX);
          ref.current?.querySelector('input')?.focus({ preventScroll: true });
        }}
        onPointerMove={(event) => {
          if (dragging.current) seek(event.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <div className='absolute inset-0 flex' aria-hidden='true'>
          {values.map((v, i) => (
            <span key={YEARS[i]} style={{ flex: 1, background: anomalyColor(v), opacity: i === index ? 1 : 0.92 }} />
          ))}
        </div>
        <span
          aria-hidden='true'
          style={{
            position: 'absolute',
            left: `calc(${at(index)} - 2px)`,
            width: `calc(${100 / values.length}% + 4px)`,
            top: -5,
            bottom: -5,
            boxShadow: `inset 0 0 0 2px ${I.ink}, 0 0 0 2px ${I.paper}`,
            borderRadius: 2,
            pointerEvents: 'none'
          }}
        />
        <input
          type='range'
          min={FIRST_YEAR}
          max={LAST_YEAR}
          step={1}
          value={year}
          onChange={(event) => onYear(Number(event.target.value))}
          aria-label='Year'
          aria-valuetext={label}
          className='absolute inset-0 h-full w-full cursor-ew-resize opacity-0'
          style={{ pointerEvents: 'none', margin: 0 }}
        />
      </div>
      <div className='relative' style={{ height: 18, marginTop: 7, fontFamily: I.mono, fontSize: 10.5, color: I.ink2 }} aria-hidden='true'>
        <span style={{ position: 'absolute', left: 0 }}>{FIRST_YEAR}</span>
        <span style={{ position: 'absolute', left: at(29.5), transform: 'translateX(-50%)' }}>1990</span>
        <span style={{ position: 'absolute', right: 0 }}>{LAST_YEAR}</span>
      </div>
    </div>
  );
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
      <rect x='3' y='2' width='3' height='10' rx='1' fill='currentColor' />
      <rect x='8' y='2' width='3' height='10' rx='1' fill='currentColor' />
    </svg>
  ) : (
    <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
      <path d='M4 2.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z' fill='currentColor' />
    </svg>
  );
}

function Fact({ value, unit, label, normal }: { value: string; unit: string; label: string; normal: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: I.mono, fontSize: 'clamp(19px, 1.8cqw, 25px)', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</span>
        <span style={{ fontFamily: I.mono, fontSize: 11.5, color: I.ink2 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 12, color: I.ink2, marginTop: 5, lineHeight: 1.3 }}>{label}</div>
      <div className='hidden @min-[700px]:block' style={{ fontSize: 11.5, color: I.muted, marginTop: 2 }}>
        {normal}
      </div>
    </div>
  );
}

/** Live demo: scrub or play 1961–2025 and watch Voss warm, station by station. */
export default function IsobarDemo() {
  const [year, setYear] = useState(2018);
  const [station, setStation] = useState<StationId>('voss');
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const visible = usePageVisible();
  const reduced = useReducedMotion();
  const groupName = useId();

  useEffect(() => {
    if (!playing || !inView || !visible) return;
    if (reduced) {
      setYear(LAST_YEAR);
      setPlaying(false);
      return;
    }
    const id = window.setInterval(() => setYear((current) => Math.min(LAST_YEAR, current + 1)), STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, inView, visible, reduced]);

  useEffect(() => {
    if (playing && year >= LAST_YEAR) setPlaying(false);
  }, [playing, year]);

  const toggle = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (reduced) {
      setYear(LAST_YEAR);
      return;
    }
    if (year >= LAST_YEAR) setYear(FIRST_YEAR);
    setPlaying(true);
  };

  const scrub = useCallback((next: number) => {
    setPlaying(false);
    setYear(next);
  }, []);

  const info = stationById(station);
  const series = SERIES[station];
  const i = yearIndex(year);
  const value = series.anomaly[i];
  const normals = NORMALS_BY[station];
  const sentence = describeYear(station, year);

  return (
    <div
      ref={rootRef}
      className='@container flex min-h-full w-full flex-col justify-center'
      style={{ background: I.paper, color: I.ink, fontFamily: I.sans, fontSize: 13, letterSpacing: '-0.005em' }}
    >
      <div className='flex flex-col gap-3 p-4 @min-[700px]:gap-[2.2cqw] @min-[700px]:px-[3cqw] @min-[700px]:py-[2.6cqw]'>
        <div className='flex flex-col gap-3 @min-[700px]:flex-row @min-[700px]:items-end @min-[700px]:justify-between'>
          <div>
            <div className='hidden @min-[400px]:block' style={{ fontSize: 12.5, color: I.muted }}>
              Isobar · against the 1961–1990 normal
            </div>
            <div style={{ fontSize: 'clamp(20px, 2cqw, 27px)', fontWeight: 500, letterSpacing: '-0.03em', marginTop: 4, lineHeight: 1.15 }}>
              Voss, one year at a time
            </div>
          </div>
          <fieldset className='m-0 min-w-0 border-0 p-0'>
            <legend className='sr-only'>Station</legend>
            <div className='flex flex-wrap gap-1 rounded-[8px] p-[3px]' style={{ background: 'rgba(26,30,29,0.06)' }}>
              {PICKABLE.map((id) => {
                const s = stationById(id);
                return (
                  <label key={id} className='relative min-w-0 flex-1 cursor-pointer @min-[700px]:flex-none'>
                    <input
                      type='radio'
                      name={groupName}
                      value={id}
                      checked={station === id}
                      onChange={() => setStation(id)}
                      className='peer sr-only'
                    />
                    <span
                      className='flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] px-1 text-[12.5px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1A1E1D] @min-[400px]:px-2.5 @min-[400px]:text-[13px] @min-[700px]:px-3.5'
                      style={{
                        fontWeight: station === id ? 500 : 400,
                        color: station === id ? I.ink : I.ink2,
                        background: station === id ? I.card : 'transparent',
                        boxShadow: station === id ? '0 1px 2px rgba(26,30,29,0.14)' : undefined
                      }}
                    >
                      {s.name}
                      <span className='hidden @min-[1040px]:inline' style={{ fontFamily: I.mono, fontSize: 11, color: I.muted }}>
                        {s.elevation.toLocaleString('en-GB')} m
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className='grid gap-3 @min-[700px]:grid-cols-[minmax(0,43fr)_minmax(0,57fr)] @min-[700px]:items-center @min-[700px]:gap-[3cqw]'>
          <div>
            <div className='mb-2 hidden items-baseline justify-between @min-[360px]:flex' style={{ fontSize: 12, color: I.ink2 }}>
              <span>
                Municipality, <span style={{ fontFamily: I.mono }}>{year}</span>
              </span>
              <span style={{ color: I.muted }}>Each dot is 1 km²</span>
            </div>
            <MunicipalityMap when={year} selected={station} onSelect={setStation} stations={PICKABLE} />
            <div style={{ marginTop: 10 }}>
              <ScaleBar width='min(250px, 100%)' height={7} label='' />
              <div className='hidden @min-[700px]:block' style={{ fontSize: 11.5, color: I.muted, marginTop: 2 }}>
                °C against 1961–1990
              </div>
            </div>
          </div>

          <div className='flex min-w-0 flex-col gap-3 @min-[700px]:gap-[1.9cqw]'>
            <div className='flex items-end gap-5'>
              <div style={{ fontFamily: I.mono, fontSize: 'clamp(36px, 4.4cqw, 62px)', letterSpacing: '-0.05em', lineHeight: 0.9 }}>
                {year}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: I.muted }}>
                  <span style={{ width: 9, height: 9, borderRadius: 5, background: anomalyColor(value), boxShadow: `inset 0 0 0 1px ${I.line}` }} />
                  {info.name}, on the normal
                </div>
                <div style={{ fontFamily: I.mono, fontSize: 'clamp(26px, 3cqw, 42px)', letterSpacing: '-0.05em', lineHeight: 0.95, marginTop: 5 }}>
                  {fmtC(value, 1, false)}
                  <span style={{ fontSize: '0.45em', letterSpacing: 0, marginLeft: 4, color: I.ink2 }}>°C</span>
                </div>
              </div>
            </div>

            <p
              aria-live={playing ? 'off' : 'polite'}
              aria-atomic='true'
              style={{ fontSize: 'clamp(14.5px, 1.42cqw, 20px)', lineHeight: 1.4, letterSpacing: '-0.015em', textWrap: 'pretty', margin: 0, maxWidth: '38em' }}
            >
              {sentence}
            </p>

            <div className='hidden grid-cols-3 gap-3 @min-[330px]:grid @min-[700px]:gap-[1.8cqw]'>
              <Fact value={`${series.hot[i]}`} unit='days' label='above 25 °C' normal={`normal ${Math.round(normals.hot)}`} />
              <Fact value={`${series.rain[i]}`} unit='days' label='with 30 mm+ of rain' normal={`normal ${normals.rain.toFixed(1)}`} />
              <Fact value={`${series.snow[i]}`} unit='days' label='of snow cover' normal={`normal ${Math.round(normals.snow)}`} />
            </div>

            <Scrubber values={series.anomaly} year={year} onYear={scrub} label={`${year}, ${fmtC(value)} at ${info.name}`} />

            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={toggle}
                aria-label={playing ? 'Pause' : year >= LAST_YEAR ? 'Play again from 1961' : `Play from ${year}`}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-full pr-4 pl-3.5 ${FOCUS}`}
                style={{ background: I.ink, color: I.card, border: 0, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >
                <PlayIcon playing={playing} />
                {playing ? 'Pause' : year >= LAST_YEAR ? 'Play from 1961' : 'Play'}
              </button>
              <span className='hidden @min-[330px]:block' style={{ fontSize: 12, color: I.muted, lineHeight: 1.35 }}>
                Drag the stripes, or focus them and use the arrow keys.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
