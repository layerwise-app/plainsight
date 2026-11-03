import type * as React from 'react';
import { Grain } from '~/components/art/Grain';
import { Sunlight } from '~/components/art/Sunlight';
import { Browser } from '~/components/frames/Browser';
import { Phone } from '~/components/frames/Phone';
import { Scaled } from '~/components/frames/Scaled';
import { FilmScreen, SeatScreen, TicketScreen } from './Phone';
import { Billboard, Poster, posterFilm } from './Poster';
import { ProgrammePage } from './Web';
import { CastConcrete, LowSun, PasteStack, PasteUp, Pavement } from './surfaces';

const MONTH_FILMS = ['kveldssol', 'longlight', 'mediodia'] as const;

/** The shadow of a street lamp behind the camera: its post, arm and lantern on the wall, and its line across the pavement. */
const lamp = (x: number, top: number, ground: number, bottom: number) => [
  { d: `M${x} ${top} L${x + 15} ${top} L${x + 15} ${ground} L${x} ${ground} Z`, blur: 2.6 },
  { d: `M${x} ${top + 8} q 36 -44 120 -38 l 0 10 q -72 -6 -112 38 z`, blur: 2.6 },
  { d: `M${x + 98} ${top - 40} l 46 0 l 9 28 l -64 0 z`, blur: 3.4 },
  { d: `M${x} ${ground} L${x + 15} ${ground} L${x - 150} ${bottom} L${x - 172} ${bottom} Z`, blur: 2.2 }
];

/** The wall showing through wet paper: formwork seams and tie holes under the poster. */
function Telegraph({ width, height, seams, ties }: { width: number; height: number; seams: { x: number[]; y: number[] }; ties: [number, number][] }) {
  return (
    <svg aria-hidden='true' width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <radialGradient id='dimple'>
          <stop offset='0' stopColor='#000' stopOpacity='0.16' />
          <stop offset='0.55' stopColor='#000' stopOpacity='0.05' />
          <stop offset='1' stopColor='#000' stopOpacity='0' />
        </radialGradient>
      </defs>
      <g style={{ mixBlendMode: 'multiply' }}>
        {seams.x.map((x) => (
          <rect key={`x${x}`} x={x - 1} y={0} width={2} height={height} fill='#000' opacity={0.07} />
        ))}
        {seams.y.map((y) => (
          <rect key={`y${y}`} x={0} y={y - 1} width={width} height={2} fill='#000' opacity={0.06} />
        ))}
        {ties.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={12} fill='url(#dimple)' />
        ))}
      </g>
      {ties.map(([x, y]) => (
        <circle key={`h${x}-${y}`} cx={x - 3} cy={y - 3} r={7} fill='#fff' opacity={0.06} />
      ))}
    </svg>
  );
}

/** Cover: a 6 × 3 m paste-up on a cast concrete wall in late sun. 1440 × 960. */
export function CoverScene({ time = 0 }: { time?: number }) {
  const W = 1440;
  const H = 960;
  const ground = 848;
  const bw = 1040;
  const bh = 520;
  const bx = (W - bw) / 2;
  const by = 188;
  const posters = MONTH_FILMS.map((id, index) => (
    <div key={id} style={{ position: 'absolute', inset: 0 }}>
      <Billboard film={posterFilm(id)} width={bw} />
      <PasteUp width={bw} height={bh} sheets={[4, 2]} seed={index + 3} wrinkles={9} />
    </div>
  ));
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: '#a9a59d' }}>
      <CastConcrete width={W} height={ground} panel={[416, 208]} offset={[96, 40]} seed={23} />
      <div style={{ position: 'absolute', left: bx, top: by, width: bw, height: bh, boxShadow: '0 1px 2px rgba(30,26,20,0.35)' }}>
        <PasteStack width={bw} height={bh} posters={posters} time={time} />
        <Telegraph
          width={bw}
          height={bh}
          seams={{ x: [512 - bx, 928 - bx], y: [248 - by, 456 - by, 664 - by] }}
          ties={[304, 720, 1136].flatMap((x) => [352, 560].map((y) => [x - bx, y - by] as [number, number]))}
        />
      </div>
      <Pavement width={W} top={ground} height={H - ground} horizon={430} />
      <LowSun
        width={W}
        height={H}
        shade={[
          [1046, -40],
          [1500, -40],
          [1500, 1000],
          [1404, 1000]
        ]}
        extra={lamp(92, 156, ground, H + 10)}
      />
    </div>
  );
}

/** Portrait cover: one poster on the face of a concrete column. 1152 × 1440. */
export function TallScene({ time = 0 }: { time?: number }) {
  const W = 1152;
  const H = 1440;
  const ground = 1300;
  const cw = 720;
  const cx = (W - cw) / 2;
  const pw = 600;
  const ph = (pw * 100) / 70;
  const px = (W - pw) / 2;
  const py = 236;
  const posters = MONTH_FILMS.map((id, index) => (
    <div key={id} style={{ position: 'absolute', inset: 0 }}>
      <Poster film={posterFilm(id)} width={pw} />
      <PasteUp width={pw} height={ph} sheets={[2, 2]} seed={index + 11} wrinkles={7} />
    </div>
  ));
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: '#8f8b84' }}>
      <CastConcrete width={W} height={ground} tone='#96928a' panel={[300, 150]} offset={[40, 60]} seed={31} streaks={4} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(40,38,44,0.28)' }} />
      <div style={{ position: 'absolute', left: cx, top: 0, width: cw, height: ground, overflow: 'hidden' }}>
        <CastConcrete width={cw} height={ground} tone='#aca89f' panel={[360, 180]} offset={[0, 120]} seed={7} streaks={5} />
      </div>
      <svg aria-hidden='true' width={W} height={H} style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}>
        <defs>
          <linearGradient id='col-shadow' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0' stopColor='#26252c' stopOpacity='0.55' />
            <stop offset='1' stopColor='#26252c' stopOpacity='0.4' />
          </linearGradient>
        </defs>
        <path d={`M${cx + cw} 0 L${cx + cw + 150} 0 L${cx + cw + 150} ${ground} L${cx + cw} ${ground} Z`} fill='url(#col-shadow)' />
      </svg>
      <div style={{ position: 'absolute', left: cx, top: 0, width: 2, height: ground, background: 'rgba(255,246,230,0.4)' }} />
      <div style={{ position: 'absolute', left: cx + cw - 3, top: 0, width: 3, height: ground, background: 'rgba(20,18,16,0.3)' }} />
      <div style={{ position: 'absolute', left: px, top: py, width: pw, height: ph, boxShadow: '0 1px 2px rgba(30,26,20,0.35)' }}>
        <PasteStack width={pw} height={ph} posters={posters} time={time} />
      </div>
      <Pavement width={W} top={ground} height={H - ground} horizon={560} />
      <LowSun
        width={W}
        height={H}
        shade={[
          [cx + cw - 90, -40],
          [W + 40, -40],
          [W + 40, H + 40],
          [cx + cw + 150, H + 40]
        ]}
        opacity={0.36}
        extra={[{ d: `M-40 -40 L${cx - 40} -40 L${cx - 150} ${H + 40} L-40 ${H + 40} Z`, opacity: 0.2, blur: 18 }]}
      />
    </div>
  );
}

/** Soft window light on a warm grey studio wall, for flat presentations. */
function Studio({ width, height, children, tone = '#d9d4ca', time = 0 }: { width: number; height: number; children: React.ReactNode; tone?: string; time?: number }) {
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: tone }}>
      <Grain opacity={0.16} frequency={0.75} />
      <Grain opacity={0.08} frequency={0.012} seed={21} />
      {children}
      <Sunlight
        width={width}
        height={height}
        time={time}
        origin={[0.5, -0.24]}
        pane={[0.17, 0.7]}
        columns={2}
        rows={1}
        bars={24}
        shear={0.52}
        shadow={0.16}
        leaves={0}
        seed={5}
      />
    </div>
  );
}

function Shadowed({ left, top, width, height, children }: { left: number; top: number; width: number; height: number; children: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', left, top, width, height }}>
      <div style={{ position: 'absolute', inset: '16px -6px -20px 12px', background: 'rgba(52,40,26,0.34)', filter: 'blur(16px)' }} />
      <div style={{ position: 'relative', width, height }}>{children}</div>
    </div>
  );
}

/** Three November posters side by side. 1440 × 960. */
export function SeriesScene() {
  const pw = 384;
  const ph = (pw * 100) / 70;
  const gap = 44;
  const left = (1440 - pw * 3 - gap * 2) / 2;
  const top = (960 - ph) / 2 - 6;
  return (
    <Studio width={1440} height={960}>
      {(['glass', 'ferro', 'tbilisi'] as const).map((id, i) => (
        <Shadowed key={id} left={left + i * (pw + gap)} top={top} width={pw} height={ph}>
          <Poster film={posterFilm(id)} width={pw} />
          <Grain opacity={0.12} frequency={0.9} seed={i + 2} />
        </Shadowed>
      ))}
    </Studio>
  );
}

/** The programme page in a browser. 1440 × 900. */
export function WebShot() {
  const scale = 0.94;
  const bw = 1240;
  const bh = 798;
  return (
    <Studio width={1440} height={900}>
      <Shadowed left={(1440 - bw * scale) / 2} top={(900 - bh * scale) / 2} width={bw * scale} height={bh * scale}>
        <Scaled width={bw} height={bh} scale={scale}>
          <Browser url='marmorkino.no/program' width={bw} height={bh}>
            <ProgrammePage />
          </Browser>
        </Scaled>
      </Shadowed>
    </Studio>
  );
}

/** Three phone screens in a row. 1440 × 960. */
export function PhonesShot() {
  const width = 318;
  const gap = 84;
  const outer = width * (412 / 390);
  const total = outer * 3 + gap * 2;
  const screens = [<FilmScreen key='a' />, <SeatScreen key='b' />, <TicketScreen key='c' />];
  return (
    <Studio width={1440} height={960} tone='#dcd7cd'>
      {screens.map((screen, i) => {
        const left = (1440 - total) / 2 + i * (outer + gap);
        const top = (960 - width * (866 / 390)) / 2 + (i === 1 ? -18 : 18);
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                left: left + 26,
                top: top + 34,
                width: outer,
                height: width * (866 / 390),
                borderRadius: 60,
                background: 'rgba(52,40,26,0.36)',
                filter: 'blur(22px)'
              }}
            />
            <Phone width={width} style={{ position: 'absolute', left, top }}>
              {screen}
            </Phone>
          </div>
        );
      })}
    </Studio>
  );
}

export function Frame({ children, width, height, background }: { children: React.ReactNode; width: number; height: number; background: string }) {
  return <div style={{ width, height, position: 'relative', overflow: 'hidden', background }}>{children}</div>;
}
