import type * as React from 'react';
import { VeinMark } from './Mark';
import { C, FILMS, type Film, FONT, type Month, NOVEMBER, type Screening, month, shortDate } from './model';
import { Still } from './stills';
import { Title } from './Title';

export type PosterFilm = Pick<Film, 'title' | 'director' | 'country' | 'year' | 'runtime' | 'language' | 'still' | 'screenings'> & {
  month: Month;
  number?: number;
  total?: number;
  tag?: string;
  format?: string;
};

export const posterFilm = (id: keyof typeof FILMS): PosterFilm => {
  const film = FILMS[id];
  return { ...film, month: month(film.month) };
};

const cq = (n: number) => `${n}cqw`;
const pad = (n: number) => String(n).padStart(2, '0');
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Rule({ top = 0, weight = 0.18 }: { top?: number; weight?: number }) {
  return <div style={{ height: cq(weight), background: 'currentColor', marginTop: cq(top), flex: 'none' }} />;
}

function Meta({ film, size, columns = 4, gap }: { film: PosterFilm; size: number; columns?: number; gap: number }) {
  const rows: [string, string][] = [
    ['Regi', film.director || '–'],
    ['Land, år', [film.country, film.year].filter(Boolean).join(' ') || '–'],
    ['Lengde', film.runtime ? `${film.runtime} min${film.format ? `, ${film.format}` : ''}` : '–'],
    ['Tale, tekst', film.language || '–']
  ];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap: cq(gap),
        rowGap: cq(size * 0.9),
        fontFamily: FONT.mono,
        fontSize: cq(size),
        lineHeight: 1.28,
        flex: 'none'
      }}
    >
      {rows.map(([label, value]) => (
        <div key={label} style={{ minWidth: 0 }}>
          <div style={{ opacity: 0.62 }}>{label}</div>
          <div style={{ overflowWrap: 'anywhere' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function Screenings({ list, size, columns = 4, gap }: { list: Screening[]; size: number; columns?: number; gap: number }) {
  const shown = list.filter((s) => s.date).slice(0, columns);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap: cq(gap),
        fontFamily: FONT.mono,
        fontSize: cq(size),
        lineHeight: 1.2,
        flex: 'none'
      }}
    >
      {shown.map((s, i) => (
        <div key={i} style={{ whiteSpace: 'nowrap' }}>
          <div>{shortDate(s.date)}</div>
          <div>
            {s.time || '––:––'} Sal {s.sal}
          </div>
        </div>
      ))}
      {shown.length === 0 ? <div style={{ opacity: 0.62 }}>Visninger kommer</div> : null}
    </div>
  );
}

/** A 70 × 100 cm film poster. Every size is a share of the poster's width. */
export function Poster({
  film,
  width = '100%',
  refine,
  style,
  className
}: {
  film: PosterFilm;
  width?: number | string;
  refine?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const m = film.month;
  const margin = 4.2;
  const gap = 1.8;
  return (
    <div
      className={className}
      style={{
        width,
        aspectRatio: '70 / 100',
        containerType: 'inline-size',
        position: 'relative',
        overflow: 'hidden',
        background: m.colour,
        color: m.ink,
        flex: 'none',
        ...style
      }}
    >
      <div style={{ position: 'absolute', inset: 0, padding: cq(margin), display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            columnGap: cq(gap),
            fontFamily: FONT.mono,
            fontSize: cq(1.75),
            lineHeight: 1.2,
            flex: 'none'
          }}
        >
          <span>Marmor Kino</span>
          <span style={{ whiteSpace: 'nowrap' }}>{film.tag ?? ''}</span>
          <span>
            {capital(m.name)} {m.year}
          </span>
          <span style={{ textAlign: 'right' }}>{film.number ? `${pad(film.number)}/${film.total ?? 40}` : ''}</span>
        </div>
        <Rule top={1.3} />
        <div style={{ marginTop: cq(3), flex: 'none' }}>
          <Title text={film.title} width={100 - margin * 2} maxHeight={56} gap={1.7} refine={refine} />
        </div>
        <div style={{ flex: 1, minHeight: cq(20), marginTop: cq(3.4), position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <Still kind={film.still} tone={m.colour} />
          </div>
        </div>
        <div style={{ marginTop: cq(3) }}>
          <Meta film={film} size={1.75} gap={gap} />
        </div>
        <Rule top={2.6} />
        <div style={{ marginTop: cq(1.8) }}>
          <Screenings list={film.screenings} size={2.5} gap={gap} />
        </div>
        <div
          style={{
            marginTop: cq(3.6),
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            columnGap: cq(gap),
            alignItems: 'end',
            fontFamily: FONT.mono,
            fontSize: cq(1.75),
            lineHeight: 1.2,
            flex: 'none'
          }}
        >
          <VeinMark size={cq(6.4)} color={m.ink} />
          <span>
            Olav Kyrres gate 12
            <br />
            5014 Bergen
          </span>
          <span>
            Billetter
            <br />
            fra 140 kr
          </span>
          <span style={{ textAlign: 'right' }}>marmorkino.no</span>
        </div>
      </div>
    </div>
  );
}

/** The same film on a 6 × 3 m billboard. */
export function Billboard({
  film,
  width = '100%',
  refine,
  style
}: {
  film: PosterFilm;
  width?: number | string;
  refine?: boolean;
  style?: React.CSSProperties;
}) {
  const m = film.month;
  const margin = 2.4;
  const gap = 1.3;
  const mono = 0.98;
  return (
    <div
      style={{
        width,
        aspectRatio: '2 / 1',
        containerType: 'inline-size',
        position: 'relative',
        overflow: 'hidden',
        background: m.colour,
        color: m.ink,
        flex: 'none',
        ...style
      }}
    >
      <div style={{ position: 'absolute', inset: 0, padding: cq(margin), display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            columnGap: cq(gap),
            fontFamily: FONT.mono,
            fontSize: cq(mono),
            lineHeight: 1.2,
            flex: 'none'
          }}
        >
          <span>Marmor Kino</span>
          <span>{film.tag ?? ''}</span>
          <span>
            {capital(m.name)} {m.year}
          </span>
          <span style={{ textAlign: 'right' }}>marmorkino.no</span>
        </div>
        <Rule top={0.8} weight={0.1} />
        <div style={{ marginTop: cq(1.6), flex: 'none' }}>
          <Title text={film.title} width={100 - margin * 2} maxHeight={19.5} gap={1} maxLines={2} refine={refine} />
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            marginTop: cq(2),
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            columnGap: cq(gap)
          }}
        >
          <div style={{ gridColumn: 'span 2', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Still kind={film.still} tone={m.colour} />
            </div>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Meta film={film} size={mono} columns={2} gap={gap} />
            <Rule top={1.4} weight={0.1} />
            <div style={{ marginTop: cq(1) }}>
              <Screenings list={film.screenings} size={1.45} columns={2} gap={gap} />
            </div>
            <div style={{ marginTop: cq(0.9) }}>
              <Screenings list={film.screenings.slice(2)} size={1.45} columns={2} gap={gap} />
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
              <span style={{ fontFamily: FONT.mono, fontSize: cq(mono), lineHeight: 1.2 }}>
                Olav Kyrres gate 12, Bergen
              </span>
              <VeinMark size={cq(3.6)} color={m.ink} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A printed ticket on 140 × 54 mm card, with the stub in the month's colour. */
export function Ticket({
  film,
  seat = 'Rad 7, sete 8',
  price = '140 kr',
  width = '100%',
  refine,
  serial = '24-11-0742',
  style
}: {
  film: PosterFilm;
  seat?: string;
  price?: string;
  width?: number | string;
  refine?: boolean;
  serial?: string;
  style?: React.CSSProperties;
}) {
  const m = film.month;
  const s = film.screenings.find((x) => x.date) ?? { date: '', time: '', sal: 1 };
  const [row, place] = seat.split(',').map((part) => part.replace(/\D/g, ''));
  return (
    <div
      style={{
        width,
        aspectRatio: '140 / 54',
        containerType: 'inline-size',
        position: 'relative',
        overflow: 'hidden',
        background: C.marble,
        color: C.black,
        display: 'flex',
        flex: 'none',
        ...style
      }}
    >
      <div style={{ flex: 1, minWidth: 0, padding: cq(3.2), display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT.mono, fontSize: cq(1.9), lineHeight: 1.2 }}>
          <span>Marmor Kino</span>
          <span>{serial}</span>
        </div>
        <div style={{ marginTop: cq(2.4) }}>
          <Title text={film.title} width={100 * 0.78 - 6.4} maxHeight={15} gap={1} maxLines={2} refine={refine} />
        </div>
        <div
          style={{
            marginTop: 'auto',
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.8fr 0.6fr 0.55fr 0.65fr',
            columnGap: cq(1.4),
            fontFamily: FONT.mono,
            fontSize: cq(1.9),
            lineHeight: 1.25
          }}
        >
          {[
            ['Dato', shortDate(s.date)],
            ['Tid', s.time],
            ['Sal', String(s.sal)],
            ['Rad', row],
            ['Sete', place]
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ color: C.muted }}>{label}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          width: '22%',
          flex: 'none',
          background: m.colour,
          color: m.ink,
          padding: cq(2.6),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: FONT.mono,
          fontSize: cq(1.9),
          lineHeight: 1.25,
          position: 'relative'
        }}
      >
        <span style={{ whiteSpace: 'pre-line' }}>{`Sal ${s.sal}\n${seat.replace(', s', '\nS')}`}</span>
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <span>{price}</span>
          <VeinMark size={cq(5)} color={m.ink} />
        </span>
        <svg
          aria-hidden='true'
          style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: cq(0.5), overflow: 'visible' }}
        >
          <line x1='0' x2='0' y1='0' y2='100%' stroke={C.marble} strokeWidth='2' strokeDasharray='1 5' />
        </svg>
      </div>
    </div>
  );
}

/** The month's running order on one 70 × 100 cm poster: every screening, in mono. */
export function ProgrammePoster({ monthId = '2024-11', width = '100%', style }: { monthId?: string; width?: number | string; style?: React.CSSProperties }) {
  const m = month(monthId);
  const margin = 4.2;
  const days = new Map<string, typeof NOVEMBER>();
  for (const slot of NOVEMBER) days.set(slot.date, [...(days.get(slot.date) ?? []), slot]);
  return (
    <div
      style={{
        width,
        aspectRatio: '70 / 100',
        containerType: 'inline-size',
        position: 'relative',
        overflow: 'hidden',
        background: C.marble,
        color: C.black,
        flex: 'none',
        ...style
      }}
    >
      <div style={{ position: 'absolute', inset: 0, padding: cq(margin), display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            columnGap: cq(1.8),
            fontFamily: FONT.mono,
            fontSize: cq(1.75),
            lineHeight: 1.2
          }}
        >
          <span>Marmor Kino</span>
          <span>Program</span>
          <span>
            {capital(m.name)} {m.year}
          </span>
          <span style={{ textAlign: 'right' }}>41 filmer</span>
        </div>
        <Rule top={1.3} />
        <div style={{ marginTop: cq(3), color: m.colour }}>
          <Title text={m.name} width={100 - margin * 2} maxHeight={40} gap={1.7} />
        </div>
        <div
          style={{
            marginTop: cq(3.6),
            columnCount: 4,
            columnGap: cq(1.8),
            columnFill: 'auto',
            flex: 1,
            minHeight: 0,
            fontFamily: FONT.mono,
            fontSize: cq(1.08),
            lineHeight: 1.36
          }}
        >
          {[...days].map(([date, slots]) => (
            <div key={date} style={{ breakInside: 'avoid', marginBottom: cq(0.9) }}>
              <div style={{ color: m.colour }}>{shortDate(date)}</div>
              {slots.map((slot) => (
                <div key={slot.time + slot.sal} style={{ display: 'grid', gridTemplateColumns: '3.8em 1.6em 1fr', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <span>{slot.time}</span>
                  <span>{slot.sal}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{slot.title}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Rule top={1.6} />
        <div
          style={{
            marginTop: cq(2.2),
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            columnGap: cq(1.8),
            alignItems: 'end',
            fontFamily: FONT.mono,
            fontSize: cq(1.75),
            lineHeight: 1.2
          }}
        >
          <VeinMark size={cq(6.4)} color={C.black} />
          <span>
            Olav Kyrres gate 12
            <br />
            5014 Bergen
          </span>
          <span>
            Sal 1: 226 seter
            <br />
            Sal 2: 58 seter
          </span>
          <span style={{ textAlign: 'right' }}>marmorkino.no</span>
        </div>
      </div>
    </div>
  );
}
