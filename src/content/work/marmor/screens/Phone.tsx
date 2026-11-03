import type * as React from 'react';
import { seeded } from '~/components/art/random';
import { StatusBar } from '~/components/frames/Phone';
import { VeinMark } from './Mark';
import { C, FILMS, FONT, NOV, shortDate } from './model';
import { Still } from './stills';
import { Title } from './Title';

const film = FILMS.kveldssol;

const screen: React.CSSProperties = {
  width: 390,
  height: 844,
  background: C.marble,
  color: C.black,
  fontFamily: FONT.mono,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};

function Back({ label, right }: { label: string; right?: React.ReactNode }) {
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontSize: 13 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width='9' height='15' viewBox='0 0 9 15' aria-hidden='true'>
          <path d='M7.5 1.5 L1.5 7.5 L7.5 13.5' fill='none' stroke='currentColor' strokeWidth='1.6' />
        </svg>
        {label}
      </span>
      {right}
    </div>
  );
}

/** The film page with this week's screenings. 390 × 844. */
export function FilmScreen() {
  return (
    <div style={screen}>
      <div style={{ background: NOV.colour, color: NOV.ink }}>
        <StatusBar color={NOV.ink} time='16:42' />
        <Back label='Program' right={<VeinMark size={24} color={NOV.ink} hair={false} />} />
        <div style={{ height: 232 }}>
          <Still kind={film.still} tone={NOV.colour} />
        </div>
        <div style={{ padding: '22px 20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 14 }}>
            <span>Premiere fre 15.11</span>
            <span>07/41</span>
          </div>
          <Title text={film.title} width={350} maxHeight={120} gap={6} unit='px' as='h1' />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 10, columnGap: 14, marginTop: 20, fontSize: 12, lineHeight: 1.3 }}>
            {[
              ['Regi', film.director],
              ['Land, år', `${film.country} ${film.year}`],
              ['Lengde', `${film.runtime} min`],
              ['Tale, tekst', film.language]
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ opacity: 0.62 }}>{label}</div>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ fontSize: 12, opacity: 0.62, marginBottom: 10 }}>Velg visning</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {film.screenings.map((s, i) => (
            <div
              key={s.date}
              style={{
                padding: '10px 12px',
                border: `1px solid ${i === 0 ? C.black : C.line}`,
                background: i === 0 ? C.black : 'transparent',
                color: i === 0 ? C.marble : C.black,
                fontSize: 13,
                lineHeight: 1.35
              }}
            >
              <div>{shortDate(s.date)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.time}</span>
                <span style={{ opacity: 0.7 }}>Sal {s.sal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 'auto', padding: '0 20px 34px' }}>
        <div style={{ height: 54, background: C.black, color: C.marble, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontSize: 14 }}>
          <span>Velg seter</span>
          <span>fre 15.11 18:30</span>
        </div>
      </div>
    </div>
  );
}

const ROWS = [12, 14, 14, 16, 16, 16, 16, 18, 18, 18, 18, 16, 16, 14];
const SELECTED = new Set(['7-8', '7-9']);

/** Sal 1's seats: taken, free and the two chosen. Same every time. */
export function seats() {
  const random = seeded(1511);
  return ROWS.map((count, r) =>
    Array.from({ length: count }, (_, i) => {
      const id = `${r + 1}-${i + 1}`;
      const centre = Math.abs(i - (count - 1) / 2) / count;
      const taken = !SELECTED.has(id) && random() < 0.78 - centre * 0.7 - (r < 2 ? 0.4 : 0) + (r > 4 && r < 10 ? 0.12 : 0);
      return { id, row: r + 1, seat: i + 1, taken, selected: SELECTED.has(id) };
    })
  );
}

/** Picking two seats in Sal 1. 390 × 844. */
export function SeatScreen() {
  const map = seats();
  const size = 14;
  const gap = 3.5;
  const free = map.flat().filter((s) => !s.taken).length;
  return (
    <div style={screen}>
      <StatusBar color={C.black} time='16:43' />
      <Back label='Kveldssol' right={<span>fre 15.11 18:30</span>} />
      <div style={{ padding: '10px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: FONT.title, fontWeight: 800, fontStretch: '62.5%', fontSize: 34, textTransform: 'uppercase', lineHeight: 1 }}>Sal 1</span>
        <span style={{ fontSize: 12, opacity: 0.62 }}>{free} av 226 seter ledige</span>
      </div>
      <div style={{ margin: '22px 20px 0', position: 'relative' }}>
        <svg width='350' height='36' viewBox='0 0 350 36' aria-hidden='true' style={{ display: 'block' }}>
          <path d='M14 30 Q175 2 336 30' fill='none' stroke={C.black} strokeWidth='2' />
          <text x='175' y='34' textAnchor='middle' fontSize='10.5' fontFamily={FONT.mono} fill={C.muted}>
            Lerret
          </text>
        </svg>
      </div>
      <div style={{ padding: '18px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
        {map.map((row, r) => {
          const half = Math.ceil(row.length / 2);
          return (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap }}>
              <span style={{ width: 16, fontSize: 9.5, opacity: 0.5, textAlign: 'right', marginRight: 4 }}>{r + 1}</span>
              {row.map((s, i) => (
                <span
                  key={s.id}
                  style={{
                    width: size,
                    height: size - 2,
                    marginLeft: i === half ? 12 : 0,
                    borderRadius: '3px 3px 1px 1px',
                    background: s.selected ? NOV.colour : s.taken ? 'rgba(17,17,17,0.82)' : 'transparent',
                    boxShadow: s.taken || s.selected ? undefined : `inset 0 0 0 1.2px rgba(17,17,17,0.42)`,
                    display: 'grid',
                    placeItems: 'center',
                    color: NOV.ink,
                    fontSize: 7.5
                  }}
                >
                  {s.selected ? s.seat : ''}
                </span>
              ))}
              <span style={{ width: 16, fontSize: 9.5, opacity: 0.5, marginLeft: 4 }}>{r + 1}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 18, fontSize: 11 }}>
        {[
          ['Ledig', 'transparent', true],
          ['Opptatt', 'rgba(17,17,17,0.82)', false],
          ['Valgt', NOV.colour, false]
        ].map(([label, fill, outline]) => (
          <span key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 10, borderRadius: '3px 3px 1px 1px', background: String(fill), boxShadow: outline ? 'inset 0 0 0 1.2px rgba(17,17,17,0.42)' : undefined }} />
            {label}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 'auto', borderTop: `1px solid ${C.line}`, padding: '16px 20px 34px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>2 billetter</span>
          <span>280 kr</span>
        </div>
        <div style={{ fontSize: 12, opacity: 0.62, marginTop: 4 }}>Rad 7, sete 8 og 9. Midt i salen.</div>
        <div style={{ height: 54, marginTop: 14, background: C.black, color: C.marble, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontSize: 14 }}>
          <span>Til betaling</span>
          <svg width='16' height='12' viewBox='0 0 16 12' aria-hidden='true'>
            <path d='M1 6 H14 M9 1 L14 6 L9 11' fill='none' stroke='currentColor' strokeWidth='1.5' />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** A small square code for the door, deterministic. */
function DoorCode({ size, color, background }: { size: number; color: string; background: string }) {
  const n = 25;
  const random = seeded(1830);
  const cell = size / n;
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    const ring = (ox: number, oy: number) => {
      const dx = x - ox;
      const dy = y - oy;
      return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
    };
    for (const [ox, oy] of [
      [0, 0],
      [n - 7, 0],
      [0, n - 7]
    ]) {
      if (inBox(ox, oy)) return ring(ox, oy) ? 1 : 0;
    }
    return -1;
  };
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const f = finder(x, y);
      const on = f === -1 ? random() < 0.48 : f === 1;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.2} height={cell + 0.2} />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden='true' style={{ display: 'block', background }}>
      <g fill={color}>{cells}</g>
    </svg>
  );
}

/** The ticket, in the month's colour, ready for the door. 390 × 844. */
export function TicketScreen() {
  return (
    <div style={{ ...screen, background: NOV.colour, color: NOV.ink }}>
      <StatusBar color={NOV.ink} time='16:45' />
      <Back label='Billetter' right={<span>1 av 2</span>} />
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span>Marmor Kino</span>
          <span>24-11-0742</span>
        </div>
        <div style={{ height: 1, background: 'currentColor', margin: '10px 0 18px' }} />
        <Title text={film.title} width={350} maxHeight={120} gap={6} unit='px' />
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', rowGap: 16, columnGap: 12, marginTop: 24 }}>
          {[
            ['Dato', 'fre 15.11'],
            ['Tid', '18:30'],
            ['Sal', '1'],
            ['Rad', '7'],
            ['Sete', '8'],
            ['Pris', '140 kr']
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 12, opacity: 0.66 }}>{label}</div>
              <div style={{ fontSize: 23, letterSpacing: '-0.03em', marginTop: 2, whiteSpace: 'nowrap' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: '30px 20px 0', padding: 18, background: C.marble, display: 'flex', gap: 18, alignItems: 'center' }}>
        <DoorCode size={136} color={C.black} background={C.marble} />
        <div style={{ color: C.black, fontSize: 12, lineHeight: 1.45 }}>
          Vis koden i døra.
          <br />
          Dørene åpner 18:00.
          <br />
          <span style={{ opacity: 0.6 }}>Inngang fra Olav Kyrres gate.</span>
        </div>
      </div>
      <div style={{ margin: '10px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
        {['Legg i kalender', 'Send billett 2'].map((action) => (
          <span key={action} style={{ height: 46, border: `1px solid ${NOV.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {action}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 18 }}>
        <span style={{ width: 6, height: 6, borderRadius: 6, background: NOV.ink }} />
        <span style={{ width: 6, height: 6, borderRadius: 6, background: NOV.ink, opacity: 0.4 }} />
      </div>
      <div style={{ marginTop: 'auto', padding: '0 20px 38px', display: 'flex', justifyContent: 'space-between', alignItems: 'end', fontSize: 12 }}>
        <span>
          Ingeborg Raa er til stede
          <br />
          og svarer på spørsmål etterpå.
        </span>
        <VeinMark size={34} color={NOV.ink} />
      </div>
    </div>
  );
}
