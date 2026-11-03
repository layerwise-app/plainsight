import { Lockup } from './Mark';
import { C, FONT, NOV, NOVEMBER, TITLE_STYLE, filmInfo, longDate } from './model';
import { Still } from './stills';
import { Title } from './Title';

const STATUS: Record<string, 'few' | 'sold'> = { 'The Glass Orchard': 'few', Ferro: 'sold', Kveldssol: 'few' };

const DAYS = ['2024-11-12', '2024-11-13'].map((date) => ({
  label: longDate(date).replace(/^./, (c) => c.toUpperCase()),
  rows: NOVEMBER.filter((slot) => slot.date === date)
}));

const TABS = ['I dag', 'ons 13', 'tor 14', 'fre 15', 'lør 16', 'søn 17', 'man 18'];

function Calendar() {
  // November 2024 starts on a Friday.
  const cells = [...Array(4).fill(0), ...Array.from({ length: 30 }, (_, i) => i + 1)];
  return (
    <div style={{ fontFamily: FONT.mono, fontSize: 11.5 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', opacity: 0.62, paddingBottom: 8 }}>
        {['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 4 }}>
        {cells.map((day, i) => {
          const week = day >= 11 && day <= 17;
          const today = day === 12;
          return (
            <span
              key={i}
              style={{
                height: 26,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 6,
                marginRight: 3,
                background: today ? C.marble : week ? 'rgba(241,238,231,0.14)' : 'transparent',
                color: today ? NOV.colour : undefined,
                opacity: day ? (day < 12 ? 0.5 : 1) : 0
              }}
            >
              {day || ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** marmorkino.no/program, designed at 1240 × 760. */
export function ProgrammePage() {
  return (
    <div style={{ width: 1240, height: 760, display: 'flex', flexDirection: 'column', background: C.marble, color: C.black, fontFamily: FONT.mono }}>
      <header
        style={{
          height: 62,
          flex: 'none',
          display: 'grid',
          gridTemplateColumns: '380px 1fr auto',
          alignItems: 'center',
          padding: '0 28px',
          borderBottom: `1px solid ${C.line}`,
          fontSize: 13
        }}
      >
        <Lockup height={30} />
        <nav style={{ display: 'flex', gap: 30 }}>
          {['Program', 'Serier', 'Barnekino', 'Medlemskap', 'Besøk oss'].map((item, i) => (
            <span key={item} style={{ borderBottom: i === 0 ? `1.5px solid ${C.black}` : undefined, paddingBottom: 3 }}>
              {item}
            </span>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          <span>Søk</span>
          <span>EN</span>
          <span style={{ border: `1px solid ${C.black}`, padding: '7px 12px' }}>Logg inn</span>
        </div>
      </header>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 0 }}>
        <aside style={{ background: NOV.colour, color: NOV.ink, padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>Program</span>
              <span>2024</span>
            </div>
            <div style={{ height: 1, background: 'currentColor', margin: '10px 0 16px' }} />
            <Title text='November' width={324} maxHeight={200} gap={8} unit='px' as='h1' />
            <div style={{ fontSize: 12, marginTop: 14, lineHeight: 1.5 }}>
              41 filmer, {NOVEMBER.length} visninger
              <br />
              Sal 1 og Sal 2, 1.–30. november
            </div>
          </div>
          <Calendar />
          <div style={{ marginTop: 'auto', borderTop: '1px solid currentColor', paddingTop: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Serie</div>
            <div style={{ ...TITLE_STYLE, fontSize: 30, lineHeight: 0.92, marginTop: 8 }}>Ruth Halvorsen, 1961–1979</div>
            <div style={{ fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>
              Seks filmer på 35 mm, tirsdager og søndager. Kopiene er lånt fra Nasjonalbiblioteket.
            </div>
          </div>
        </aside>
        <main style={{ padding: '0 28px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54, borderBottom: `1px solid ${C.line}`, fontSize: 13 }}>
            <div style={{ display: 'flex', gap: 22, height: '100%' }}>
              {TABS.map((tab, i) => (
                <span
                  key={tab}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: i === 0 ? `inset 0 -2px 0 ${C.black}` : undefined,
                    opacity: i === 0 ? 1 : 0.62
                  }}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', border: `1px solid ${C.line}` }}>
              {['Begge saler', 'Sal 1', 'Sal 2'].map((item, i) => (
                <span key={item} style={{ padding: '6px 11px', background: i === 0 ? C.black : undefined, color: i === 0 ? C.marble : undefined, fontSize: 12 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          {DAYS.map((day) => (
            <section key={day.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0 8px', fontSize: 12 }}>
                <span style={{ ...TITLE_STYLE, fontSize: 22, lineHeight: 1 }}>{day.label}</span>
                <span style={{ opacity: 0.62, alignSelf: 'end' }}>{day.rows.length} visninger</span>
              </div>
              {day.rows.map((row) => {
                const film = filmInfo(row.title);
                const status = STATUS[row.title];
                const language = film.language.split(',')[1]?.trim() ?? '';
                return (
                  <div
                    key={row.time + row.title}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '64px 92px 1fr 56px 136px 84px',
                      alignItems: 'center',
                      columnGap: 18,
                      height: 72,
                      borderTop: `1px solid ${C.line}`
                    }}
                  >
                    <span style={{ fontSize: 19, letterSpacing: '-0.02em' }}>{row.time}</span>
                    <div style={{ width: 92, height: 54 }}>
                      <Still kind={film.still} tone={NOV.colour} grain={false} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ ...TITLE_STYLE, fontSize: 25, lineHeight: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {film.title}
                      </div>
                      <div style={{ fontSize: 11.5, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.note ? <span style={{ color: NOV.colour }}>{row.note} · </span> : null}
                        <span style={{ opacity: 0.66 }}>
                          {row.note?.includes(film.director) ? '' : `${film.director}, `}
                          {film.country} {film.year}, {film.runtime} min{film.format ? `, ${film.format}` : ''}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: 12.5 }}>Sal {row.sal}</span>
                    <span style={{ fontSize: 12, color: status === 'few' ? NOV.colour : undefined, opacity: status === 'sold' ? 0.5 : status ? 1 : 0.66 }}>
                      {status === 'few' ? 'Få billetter igjen' : status === 'sold' ? 'Utsolgt' : language}
                    </span>
                    <span
                      style={{
                        justifySelf: 'end',
                        fontSize: 12.5,
                        padding: '8px 14px',
                        border: `1px solid ${status === 'sold' ? C.line : C.black}`,
                        background: status === 'sold' ? 'transparent' : C.black,
                        color: status === 'sold' ? 'rgba(17,17,17,0.5)' : C.marble
                      }}
                    >
                      {status === 'sold' ? 'Venteliste' : 'Kjøp'}
                    </span>
                  </div>
                );
              })}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
