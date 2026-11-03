import type * as React from 'react';
import { useId } from 'react';
import { Grain } from '~/components/art/Grain';
import { VeinMark } from './Mark';
import { C, DEC, FILMS, FONT, NOV, NOVEMBER, TITLE_STYLE, longDate } from './model';
import { Ticket, posterFilm } from './Poster';
import { Still } from './stills';
import { Marble } from './surfaces';
import { Title } from './Title';

const film = FILMS.kveldssol;

function Page({ children, width, height, side }: { children: React.ReactNode; width: number; height: number; side: 'left' | 'right' }) {
  return (
    <div style={{ width, height, position: 'relative', background: '#F3F0E9', overflow: 'hidden', flex: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, padding: '30px 32px 26px', display: 'flex', flexDirection: 'column' }}>{children}</div>
      {/* The fold: the paper curves down into the spine. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 70,
          [side === 'left' ? 'right' : 'left']: 0,
          background: `linear-gradient(${side === 'left' ? 'to left' : 'to right'}, rgba(40,32,22,0.22), rgba(40,32,22,0.06) 40%, rgba(40,32,22,0))`
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${side === 'left' ? '100deg' : '260deg'}, rgba(255,255,255,0) 60%, rgba(255,255,255,0.18) 88%, rgba(255,255,255,0) 100%)`
        }}
      />
    </div>
  );
}

function Week() {
  const days = new Map<string, typeof NOVEMBER>();
  for (const slot of NOVEMBER) {
    if (slot.date >= '2024-11-11' && slot.date <= '2024-11-17') days.set(slot.date, [...(days.get(slot.date) ?? []), slot]);
  }
  return (
    <div style={{ columnCount: 2, columnGap: 22, fontFamily: FONT.mono, fontSize: 9.2, lineHeight: 1.42 }}>
      {[...days].map(([date, slots]) => (
        <div key={date} style={{ breakInside: 'avoid', marginBottom: 14 }}>
          <div style={{ ...TITLE_STYLE, fontSize: 19, lineHeight: 0.9, color: NOV.colour, marginBottom: 5 }}>{longDate(date).replace(/\.? ?november/, '')}</div>
          {slots.map((slot) => (
            <div key={slot.time + slot.sal} style={{ display: 'grid', gridTemplateColumns: '36px 14px 1fr', borderTop: `0.5px solid ${C.line}`, padding: '2px 0' }}>
              <span>{slot.time}</span>
              <span>{slot.sal}</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {slot.title}
                {slot.note ? <span style={{ color: NOV.colour }}> · {slot.note.replace('Ruth Halvorsen, 1961–1979', 'Halvorsen')}</span> : null}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The November programme booklet open at week 46. 1440 × 960. */
export function BookletScene() {
  const pw = 500;
  const ph = 710;
  return (
    <div style={{ width: 1440, height: 960, position: 'relative', overflow: 'hidden' }}>
      <Marble width={1440} height={960} seed={12} angle={-22} scale={1.4} tone='#E8E3DA' />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(90% 80% at 40% 35%, rgba(255,250,240,0.25), rgba(40,32,22,0.2))' }} />
      <div
        style={{
          position: 'absolute',
          left: (1440 - pw * 2) / 2,
          top: (960 - ph) / 2,
          width: pw * 2,
          height: ph,
          transform: 'rotate(-1.6deg)'
        }}
      >
        <div style={{ position: 'absolute', inset: '14px -6px -16px 18px', background: 'rgba(48,38,26,0.38)', filter: 'blur(18px)' }} />
        <div style={{ position: 'relative', display: 'flex' }}>
          <Page width={pw} height={ph} side='left'>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 9.5 }}>
              <span>Marmor Kino</span>
              <span>Program november 2024</span>
            </div>
            <div style={{ height: 1, background: C.black, margin: '7px 0 16px' }} />
            <div style={{ color: NOV.colour }}>
              <Title text='Uke 46' width={pw - 64} maxHeight={140} gap={6} unit='px' />
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 9.5, margin: '12px 0 18px', display: 'flex', justifyContent: 'space-between' }}>
              <span>11.–17. november</span>
              <span>Sal 1, 226 seter · Sal 2, 58 seter</span>
            </div>
            <Week />
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 9.5 }}>
              <span>14</span>
              <span>Billetter på marmorkino.no og i kassen fra 16:00</span>
            </div>
          </Page>
          <Page width={pw} height={ph} side='right'>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 9.5 }}>
              <span>Premiere fre 15.11</span>
              <span>07/41</span>
            </div>
            <div style={{ height: 1, background: C.black, margin: '7px 0 16px' }} />
            <Title text={film.title} width={pw - 64} maxHeight={140} gap={6} unit='px' />
            <div style={{ height: 218, marginTop: 16, flex: 'none' }}>
              <Still kind='sun' tone={NOV.colour} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, fontFamily: FONT.mono, fontSize: 8.6, lineHeight: 1.3, marginTop: 12 }}>
              {[
                ['Regi', film.director],
                ['Land, år', `${film.country} ${film.year}`],
                ['Lengde', `${film.runtime} min`],
                ['Tale, tekst', film.language]
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ color: C.muted }}>{label}</div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                columnCount: 2,
                columnGap: 18,
                fontFamily: FONT.text,
                fontSize: 10.4,
                lineHeight: 1.42,
                marginTop: 16,
                textWrap: 'pretty'
              }}
            >
              <p style={{ margin: 0 }}>
                Ingeborg Raas andre spillefilm er skutt på Fedje over én sommer, fra de lyse nettene i juni til de første mørke kveldene i
                august. En pensjonert fergemann lærer barnebarnet sitt å lese været fra kjøkkenvinduet. Lite skjer, og alt endrer seg.
              </p>
              <p style={{ margin: '0.6em 0 0' }}>
                Raa filmet på 16 mm med et team på seks. Lyden er tatt opp på øya, og musikken er skrevet av Arvid Skog for to fioliner og
                trekkspill.
              </p>
              <p style={{ margin: '0.6em 0 0' }}>
                Filmen hadde verdenspremiere i Göteborg i januar. Vi viser den fire ganger i november, med engelsk tekst.
              </p>
            </div>
            <div style={{ marginTop: 'auto', background: NOV.colour, color: NOV.ink, padding: '10px 12px', fontFamily: FONT.mono, fontSize: 9.5, lineHeight: 1.45, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
              <span>
                Førpremiere for medlemmer ons 13.11 20:00
                <br />
                Premiere fre 15.11 18:30, Ingeborg Raa er til stede
              </span>
              <VeinMark size={26} color={NOV.ink} />
            </div>
            <div style={{ marginTop: 10, textAlign: 'right', fontFamily: FONT.mono, fontSize: 9.5 }}>15</div>
          </Page>
        </div>
        <div style={{ position: 'absolute', left: pw - 1, top: 0, bottom: 0, width: 2, background: 'rgba(40,32,22,0.25)' }} />
        {[0.26, 0.74].map((t) => (
          <div key={t} style={{ position: 'absolute', left: pw - 1.5, top: ph * t - 14, width: 3, height: 28, borderRadius: 1, background: 'linear-gradient(90deg, #8e8a82, #d9d6d0, #8e8a82)' }} />
        ))}
        <Grain opacity={0.14} frequency={0.9} seed={14} />
      </div>
    </div>
  );
}

/** Marble cladding in slabs with fine joints. */
function Cladding({ width, height, slab, seed = 40, tone = '#ECE7DE' }: { width: number; height: number; slab: [number, number]; seed?: number; tone?: string }) {
  const slabs: { x: number; y: number; i: number }[] = [];
  let i = 0;
  for (let y = 0; y < height; y += slab[1]) for (let x = 0; x < width; x += slab[0]) slabs.push({ x, y, i: i++ });
  return (
    <>
      {slabs.map((s) => (
        <div key={s.i} style={{ position: 'absolute', left: s.x, top: s.y, width: slab[0], height: slab[1], overflow: 'hidden' }}>
          <Marble
            width={slab[0]}
            height={slab[1]}
            seed={seed + s.i * 3}
            angle={-38 + (s.i % 2) * 76}
            scale={1.15}
            tone={tone}
            strength={0.85 + (s.i % 3) * 0.1}
          />
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(80,70,58,0.22), inset 1px 1px 0 1.5px rgba(255,255,255,0.35)' }} />
        </div>
      ))}
    </>
  );
}

/** A black enamel sign with marble lettering. */
function Plate({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', inset: '14px -10px -22px 12px', background: 'rgba(40,32,24,0.42)', filter: 'blur(14px)' }} />
      <div
        style={{
          position: 'relative',
          width,
          height,
          background: 'linear-gradient(160deg, #1d1d1c, #111 40%, #0b0b0b)',
          color: C.marble,
          padding: 30,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)'
        }}
      >
        {children}
        {[
          [12, 12],
          [width - 18, 12],
          [12, height - 18],
          [width - 18, height - 18]
        ].map(([x, y]) => (
          <span key={`${x}-${y}`} style={{ position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 6, background: 'radial-gradient(circle at 35% 35%, #e8d6a8, #8f7440)' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 35%)' }} />
      </div>
    </div>
  );
}

function Arrow({ size, rotate = 0, color }: { size: number; rotate?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox='0 0 100 100' aria-hidden='true' style={{ display: 'block', transform: `rotate(${rotate}deg)` }}>
      <path d='M8 50 H86 M56 18 L88 50 L56 82' fill='none' stroke={color} strokeWidth='11' strokeLinecap='square' />
    </svg>
  );
}

/** Wayfinding on the foyer's marble. 1200 × 1500. */
export function SignageScene() {
  return (
    <div style={{ width: 1200, height: 1500, position: 'relative', overflow: 'hidden', background: '#e9e4db' }}>
      <Cladding width={1200} height={1500} slab={[600, 500]} seed={51} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(255,248,232,0.3), rgba(255,248,232,0) 30%, rgba(30,24,18,0.16))' }} />
      <div style={{ position: 'absolute', left: 300, top: 270 }}>
        <Plate width={600} height={560}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 17 }}>
            <span>Sal 1</span>
            <span>Rad 1–14</span>
          </div>
          <div style={{ height: 1.5, background: C.marble, margin: '14px 0 30px' }} />
          <Title text='Sal 1' width={540} maxHeight={300} gap={10} unit='px' />
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 17, lineHeight: 1.5 }}>
              226 seter
              <br />
              Dørene åpner 30 min før
            </div>
            <Arrow size={130} color={C.marble} />
          </div>
        </Plate>
      </div>
      <div style={{ position: 'absolute', left: 300, top: 900 }}>
        <Plate width={600} height={250}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', height: '100%' }}>
            <div>
              <Title text='Sal 2' width={240} maxHeight={150} gap={6} unit='px' />
              <div style={{ fontFamily: FONT.mono, fontSize: 17, lineHeight: 1.5, marginTop: 18 }}>58 seter, en etasje ned</div>
            </div>
            <Arrow size={110} rotate={90} color={C.marble} />
          </div>
        </Plate>
      </div>
      <div style={{ position: 'absolute', left: 300, top: 1212, width: 600, display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 17, color: C.black }}>
        <span>Garderobe</span>
        <span>Toaletter</span>
        <span>Kafé</span>
        <span>Heis</span>
      </div>
      <Grain opacity={0.1} frequency={0.8} seed={2} />
    </div>
  );
}

/** The canvas tote with the M printed across it, and two tickets. 1200 × 1500. */
export function ToteScene() {
  const id = useId().replaceAll(':', '');
  const canvas = '#E4DAC5';
  const strap = (d: string) => (
    <g key={d}>
      <path d={d} fill='none' stroke='#b9ad94' strokeWidth='46' />
      <path d={d} fill='none' stroke='#8d8270' strokeWidth='37' strokeDasharray='5 4' />
      <path d={d} fill='none' stroke='#d9cfb8' strokeWidth='34' />
      <path d={d} fill='none' stroke='#e3dac6' strokeWidth='18' opacity='0.7' />
    </g>
  );
  return (
    <div style={{ width: 1200, height: 1500, position: 'relative', overflow: 'hidden', background: '#1e1d1b' }}>
      <svg aria-hidden='true' width='1200' height='1500' style={{ position: 'absolute', inset: 0 }}>
        <filter id={`lino${id}`} x='0' y='0' width='100%' height='100%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.012 0.02' numOctaves={3} seed={3} />
          <feColorMatrix type='matrix' values='0 0 0 0 0.42  0 0 0 0 0.4  0 0 0 0 0.36  1.4 0 0 0 -0.55' />
        </filter>
        <rect width='1200' height='1500' filter={`url(#lino${id})`} opacity={0.18} />
      </svg>
      <Grain opacity={0.22} frequency={0.9} seed={12} blend='screen' />
      <div style={{ position: 'absolute', left: 190, top: 300, width: 820, height: 980, transform: 'rotate(-3deg)' }}>
        <svg aria-hidden='true' width='820' height='360' viewBox='0 0 820 360' style={{ position: 'absolute', left: 0, top: -300, overflow: 'visible' }}>
          <g opacity='0.55' transform='translate(16 22)' style={{ filter: 'blur(9px)' }}>
            <path d='M200 360 C 200 150, 330 70, 340 -20' fill='none' stroke='#000' strokeWidth='46' />
            <path d='M620 360 C 620 150, 490 70, 480 -20' fill='none' stroke='#000' strokeWidth='46' />
          </g>
          {strap('M200 360 C 200 150, 330 70, 340 -20')}
          {strap('M620 360 C 620 150, 490 70, 480 -20')}
        </svg>
        <div style={{ position: 'absolute', inset: '26px -22px -36px 28px', background: 'rgba(0,0,0,0.6)', filter: 'blur(28px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: canvas, overflow: 'hidden' }}>
          <svg aria-hidden='true' width='820' height='980' style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <filter id={`weave${id}`} x='0' y='0' width='100%' height='100%'>
                <feTurbulence type='turbulence' baseFrequency='0.9 0.06' numOctaves={2} seed={4} />
                <feColorMatrix type='matrix' values='0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.42 0' />
              </filter>
              <filter id={`weft${id}`} x='0' y='0' width='100%' height='100%'>
                <feTurbulence type='turbulence' baseFrequency='0.06 0.9' numOctaves={2} seed={8} />
                <feColorMatrix type='matrix' values='0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.42 0' />
              </filter>
              <filter id={`fold${id}`} x='-20%' y='-20%' width='140%' height='140%'>
                <feGaussianBlur stdDeviation='22' />
              </filter>
            </defs>
            <rect width='820' height='980' filter={`url(#weave${id})`} />
            <rect width='820' height='980' filter={`url(#weft${id})`} />
            <g filter={`url(#fold${id})`}>
              <path d='M60 980 C 180 700, 240 520, 230 300' fill='none' stroke='#000' strokeWidth='34' opacity='0.08' />
              <path d='M90 980 C 210 700, 270 520, 260 300' fill='none' stroke='#fff' strokeWidth='30' opacity='0.14' />
              <path d='M820 640 C 700 700, 620 820, 590 980' fill='none' stroke='#000' strokeWidth='40' opacity='0.07' />
              <path d='M120 70 C 300 110, 520 110, 700 70' fill='none' stroke='#000' strokeWidth='30' opacity='0.08' />
            </g>
            <rect x='0' y='0' width='820' height='54' fill='#000' opacity='0.05' />
            <line x1='0' x2='820' y1='54' y2='54' stroke='#a3957b' strokeWidth='1.5' />
            <line x1='10' x2='810' y1='44' y2='44' stroke='#9b8e75' strokeWidth='1.4' strokeDasharray='6 5' />
            {[178, 598].map((x) => (
              <g key={x} stroke='#9b8e75' strokeWidth='1.4' fill='none' strokeDasharray='5 4'>
                <rect x={x} y='6' width='44' height='38' />
                <path d={`M${x} 6 L${x + 44} 44 M${x + 44} 6 L${x} 44`} />
              </g>
            ))}
            <rect x='14' y='70' width='792' height='896' fill='none' stroke='#a89a80' strokeWidth='1.4' strokeDasharray='7 5' />
          </svg>
          <div style={{ position: 'absolute', left: 120, top: 170, opacity: 0.9, mixBlendMode: 'multiply' }}>
            <VeinMark size={580} color='#1a1918' />
          </div>
          <div style={{ position: 'absolute', left: 120, right: 120, bottom: 120, display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: 22, color: '#1a1918', opacity: 0.88, mixBlendMode: 'multiply' }}>
            <span>Marmor Kino</span>
            <span>Bergen, siden 1938</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 42%, rgba(0,0,0,0.14) 100%)' }} />
          <Grain opacity={0.18} frequency={0.75} seed={7} />
        </div>
      </div>
      {[
        { film: posterFilm('kveldssol'), left: 470, top: 1060, rotate: 7, seat: 'Rad 7, sete 8' },
        { film: { ...posterFilm('longlight'), month: DEC }, left: 590, top: 1222, rotate: -4, seat: 'Rad 4, sete 11' }
      ].map((ticket) => (
        <div key={ticket.seat} style={{ position: 'absolute', left: ticket.left, top: ticket.top, transform: `rotate(${ticket.rotate}deg)` }}>
          <div style={{ position: 'absolute', inset: '10px -8px -14px 10px', background: 'rgba(0,0,0,0.5)', filter: 'blur(10px)' }} />
          <Ticket film={ticket.film} width={500} seat={ticket.seat} serial={ticket.seat === 'Rad 7, sete 8' ? '24-11-0742' : '24-12-0311'} />
          <div style={{ position: 'absolute', inset: 0 }}>
            <Grain opacity={0.14} frequency={0.9} seed={ticket.left} />
          </div>
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(85% 70% at 42% 38%, rgba(255,240,215,0.1), rgba(0,0,0,0.38))' }} />
    </div>
  );
}

/** The poster cases on the marble facade. Same size before and after. 1440 × 960. */
export function FacadeScene({ posters }: { posters: [React.ReactNode, React.ReactNode] }) {
  const cw = 452;
  const ch = Math.round(((cw - 36) * 100) / 70) + 36;
  const gap = 96;
  const left = (1440 - cw * 2 - gap) / 2;
  const top = 112;
  return (
    <div style={{ width: 1440, height: 960, position: 'relative', overflow: 'hidden', background: '#e9e4db' }}>
      <Cladding width={1440} height={880} slab={[480, 440]} seed={61} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 880, bottom: 0, background: 'linear-gradient(#2b2a28, #1a1918)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 880, height: 3, background: 'rgba(255,255,255,0.2)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(255,246,228,0.25), rgba(255,246,228,0) 35%, rgba(30,24,18,0.14))' }} />
      {posters.map((poster, i) => (
        <div key={i} style={{ position: 'absolute', left: left + i * (cw + gap), top, width: cw, height: ch }}>
          <div style={{ position: 'absolute', inset: '18px -12px -26px 14px', background: 'rgba(40,30,20,0.4)', filter: 'blur(18px)' }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(150deg, #4a4036, #2a241e 45%, #1c1813)',
              boxShadow: 'inset 0 1px 0 rgba(255,240,210,0.25), inset 0 -1px 0 rgba(0,0,0,0.5)'
            }}
          />
          <div style={{ position: 'absolute', inset: 18, overflow: 'hidden', background: '#111' }}>
            {poster}
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 32%, rgba(255,255,255,0) 33%, rgba(255,255,255,0) 64%, rgba(255,255,255,0.07) 65%, rgba(255,255,255,0) 82%)' }} />
          </div>
        </div>
      ))}
      <div style={{ position: 'absolute', left, width: cw, top: top + ch + 22, fontFamily: FONT.mono, fontSize: 13, color: C.black, display: 'flex', justifyContent: 'space-between' }}>
        <span>Denne måneden</span>
        <span>Olav Kyrres gate 12</span>
      </div>
      <div style={{ position: 'absolute', left: left + cw + gap, width: cw, top: top + ch + 22, fontFamily: FONT.mono, fontSize: 13, color: C.black, display: 'flex', justifyContent: 'space-between' }}>
        <span>Premiere</span>
        <span>Sal 1</span>
      </div>
      <Grain opacity={0.1} frequency={0.8} seed={5} />
    </div>
  );
}
