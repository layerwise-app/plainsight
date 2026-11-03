import type * as React from 'react';
import { useId, useState } from 'react';
import { fitTitle, METRICS } from './screens/fit';
import { C, FILMS, FONT, MONTHS, type Screening, TITLE_STYLE, month } from './screens/model';
import { Billboard, type PosterFilm, Poster, Ticket } from './screens/Poster';
import { Still } from './screens/stills';

const EXAMPLES = [FILMS.kveldssol, FILMS.longlight, FILMS.mediodia];

type Draft = {
  title: string;
  director: string;
  country: string;
  year: string;
  runtime: string;
  language: string;
  screenings: Screening[];
  monthId: string;
};

const fromFilm = (film: (typeof EXAMPLES)[number]): Draft => ({
  title: film.title,
  director: film.director,
  country: film.country,
  year: String(film.year),
  runtime: String(film.runtime),
  language: film.language,
  screenings: film.screenings.map((s) => ({ ...s })),
  monthId: film.month
});

const same = (a: Draft, b: Draft) => JSON.stringify(a) === JSON.stringify(b);

const field =
  'block h-9 w-full min-w-0 rounded-none border border-[rgba(17,17,17,0.28)] bg-[#FBFAF6] px-2 text-[12.5px] text-[#111] outline-offset-1 focus-visible:outline-2 focus-visible:outline-[#111]';
const labelText = 'mb-1.5 block text-[11px] text-[rgba(17,17,17,0.6)]';

function nextDay(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return '2024-11-20';
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return next.toISOString().slice(0, 10);
}

function Field({ label, aside, children, className }: { label: string; aside?: string; children: (id: string) => React.ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <div className='flex items-baseline justify-between gap-2'>
        <label htmlFor={id} className={labelText}>
          {label}
        </label>
        {aside ? <span className='mb-1.5 text-[11px] text-[rgba(17,17,17,0.6)]'>{aside}</span> : null}
      </div>
      {children(id)}
    </div>
  );
}

/** The film's row in the website programme. */
function Listing({ film }: { film: PosterFilm }) {
  const first = film.screenings.find((s) => s.date);
  return (
    <div
      className='grid h-[60px] grid-cols-[3.2rem_4rem_minmax(0,1fr)_auto] items-center gap-3 px-3'
      style={{ boxShadow: `inset 0 1px 0 ${C.line}, inset 0 -1px 0 ${C.line}` }}
    >
      <span className='text-[15px] tracking-[-0.02em]'>{first?.time || '––:––'}</span>
      <span className='block h-10'>
        <Still kind={film.still} tone={film.month.colour} grain={false} />
      </span>
      <span className='min-w-0'>
        <span className='block truncate' style={{ ...TITLE_STYLE, fontSize: 20, lineHeight: 0.9 }}>
          {film.title.replaceAll('/', ' ') || 'Uten tittel'}
        </span>
        <span className='mt-1 block truncate text-[10.5px] text-[rgba(17,17,17,0.62)]'>
          {[film.director, [film.country, film.year || ''].join(' ').trim(), film.runtime ? `${film.runtime} min` : ''].filter(Boolean).join(', ')}
        </span>
      </span>
      <span className='bg-[#111] px-2.5 py-1.5 text-[11.5px] text-[#F1EEE7]'>Kjøp</span>
    </div>
  );
}

/** Live demo: the poster maker Marmor Kino's front-of-house staff use for forty films a month. */
export default function MarmorDemo() {
  const [draft, setDraft] = useState<Draft>(() => fromFilm(EXAMPLES[0]));
  const [still, setStill] = useState(EXAMPLES[0].still);
  const [extra, setExtra] = useState<{ tag?: string; number?: number; total?: number }>({ tag: EXAMPLES[0].tag, number: 7, total: 41 });
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setScreening = (index: number, patch: Partial<Screening>) =>
    setDraft((d) => ({ ...d, screenings: d.screenings.map((s, i) => (i === index ? { ...s, ...patch } : s)) }));
  const m = month(draft.monthId);
  const film: PosterFilm = {
    title: draft.title,
    director: draft.director,
    country: draft.country,
    year: Number(draft.year) || 0,
    runtime: Number(draft.runtime) || 0,
    language: draft.language,
    still,
    screenings: draft.screenings,
    month: m,
    ...extra
  };
  const fit = fitTitle(draft.title, { width: 100 - 4.2 * 2, maxHeight: 56, gap: 1.7 });
  const readout = fit.lines.map((line) => `${line.text} ${Math.round(line.size * METRICS.cap * 7)} mm`).join(', ');
  const pick = (index: number) => {
    const example = EXAMPLES[index];
    setDraft(fromFilm(example));
    setStill(example.still);
    setExtra({ tag: example.tag, number: example.number, total: example.total });
  };

  return (
    <div className='@container min-h-full w-full' style={{ background: C.marble, color: C.black, fontFamily: FONT.mono }}>
      <div className='grid gap-6 p-4 @min-[700px]:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] @min-[700px]:gap-7 @min-[700px]:p-7'>
        <form
          className='flex min-w-0 flex-col gap-3.5'
          onSubmit={(event) => event.preventDefault()}
          aria-label='Film details for the poster'
        >
          <div className='flex items-end justify-between gap-3'>
            <h3 className='whitespace-nowrap' style={{ ...TITLE_STYLE, fontSize: 30, lineHeight: 0.86, margin: 0 }}>
              Poster maker
            </h3>
            <span className='whitespace-nowrap text-[11px] text-[rgba(17,17,17,0.6)]'>Front of house</span>
          </div>
          <div role='group' aria-label='Examples' className='grid grid-cols-3 gap-1.5'>
            {EXAMPLES.map((example, index) => {
              const active = same(draft, fromFilm(example));
              const colour = month(example.month);
              return (
                <button
                  key={example.id}
                  type='button'
                  aria-pressed={active}
                  onClick={() => pick(index)}
                  className='flex h-9 min-w-0 items-center gap-2 border px-2 text-left text-[12px] outline-offset-1 focus-visible:outline-2 focus-visible:outline-[#111]'
                  style={{
                    borderColor: active ? C.black : 'rgba(17,17,17,0.28)',
                    background: active ? C.black : 'transparent',
                    color: active ? C.marble : C.black
                  }}
                >
                  <span aria-hidden='true' className='size-2.5 flex-none' style={{ background: colour.colour, boxShadow: `0 0 0 1px ${active ? C.marble : 'transparent'}` }} />
                  <span className='truncate'>{example.title}</span>
                </button>
              );
            })}
          </div>
          <Field label='Title' aside='Type / to break a line'>
            {(id) => (
              <input id={id} className={field} value={draft.title} maxLength={60} autoComplete='off' spellCheck={false} onChange={(e) => set('title', e.target.value)} />
            )}
          </Field>
          <div className='grid grid-cols-[1.3fr_1fr] gap-2'>
            <Field label='Director'>
              {(id) => <input id={id} className={field} value={draft.director} maxLength={40} autoComplete='off' onChange={(e) => set('director', e.target.value)} />}
            </Field>
            <Field label='Country'>
              {(id) => <input id={id} className={field} value={draft.country} maxLength={30} autoComplete='off' onChange={(e) => set('country', e.target.value)} />}
            </Field>
          </div>
          <div className='grid grid-cols-[0.8fr_0.8fr_1.6fr] gap-2'>
            <Field label='Year'>
              {(id) => (
                <input
                  id={id}
                  className={field}
                  value={draft.year}
                  inputMode='numeric'
                  maxLength={4}
                  onChange={(e) => set('year', e.target.value.replace(/\D/g, ''))}
                />
              )}
            </Field>
            <Field label='Minutes'>
              {(id) => (
                <input
                  id={id}
                  className={field}
                  value={draft.runtime}
                  inputMode='numeric'
                  maxLength={3}
                  onChange={(e) => set('runtime', e.target.value.replace(/\D/g, ''))}
                />
              )}
            </Field>
            <Field label='Language, subtitles'>
              {(id) => <input id={id} className={field} value={draft.language} maxLength={48} autoComplete='off' onChange={(e) => set('language', e.target.value)} />}
            </Field>
          </div>
          <fieldset className='min-w-0'>
            <legend className={labelText}>Screenings, up to four</legend>
            <div className='flex flex-col gap-1.5'>
              {draft.screenings.map((s, index) => (
                <div key={index} className='grid grid-cols-[minmax(0,1fr)_6rem] gap-1.5 @min-[400px]:grid-cols-[minmax(0,1fr)_6rem_4.9rem_2.25rem]'>
                  <input
                    type='date'
                    aria-label={`Screening ${index + 1}, date`}
                    className={field}
                    value={s.date}
                    min='2024-09-01'
                    max='2025-08-31'
                    onChange={(e) => setScreening(index, { date: e.target.value })}
                  />
                  <input
                    type='time'
                    aria-label={`Screening ${index + 1}, time`}
                    className={field}
                    value={s.time}
                    step={300}
                    onChange={(e) => setScreening(index, { time: e.target.value })}
                  />
                  <select
                    aria-label={`Screening ${index + 1}, screen`}
                    className={field}
                    value={s.sal}
                    onChange={(e) => setScreening(index, { sal: Number(e.target.value) as 1 | 2 })}
                  >
                    <option value={1}>Sal 1</option>
                    <option value={2}>Sal 2</option>
                  </select>
                  <button
                    type='button'
                    aria-label={`Remove screening ${index + 1}`}
                    onClick={() => set('screenings', draft.screenings.filter((_, i) => i !== index))}
                    className='grid h-9 place-items-center border border-[rgba(17,17,17,0.28)] outline-offset-1 hover:bg-[rgba(17,17,17,0.06)] focus-visible:outline-2 focus-visible:outline-[#111]'
                  >
                    <svg width='10' height='10' viewBox='0 0 10 10' aria-hidden='true'>
                      <path d='M1 1 L9 9 M9 1 L1 9' stroke='currentColor' strokeWidth='1.4' />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type='button'
              disabled={draft.screenings.length >= 4}
              onClick={() => {
                const last = draft.screenings[draft.screenings.length - 1];
                set('screenings', [...draft.screenings, { date: last ? nextDay(last.date) : `${draft.monthId}-15`, time: last?.time ?? '19:00', sal: 1 }]);
              }}
              className='mt-1.5 h-8 text-[12px] underline decoration-1 underline-offset-4 outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#111] disabled:text-[rgba(17,17,17,0.4)] disabled:no-underline'
            >
              Add a screening
            </button>
          </fieldset>
          <fieldset className='min-w-0'>
            <legend className={labelText}>Programme month</legend>
            <div className='grid grid-cols-12 gap-1'>
              {MONTHS.map((option) => (
                <label key={option.id} className='relative block cursor-pointer'>
                  <input
                    type='radio'
                    name='marmor-month'
                    value={option.id}
                    checked={draft.monthId === option.id}
                    onChange={() => set('monthId', option.id)}
                    className='peer sr-only'
                  />
                  <span className='sr-only'>
                    {option.en} {option.year}
                  </span>
                  <span
                    aria-hidden='true'
                    className='block aspect-square w-full outline-offset-2 peer-focus-visible:outline-2 peer-focus-visible:outline-[#111]'
                    style={{
                      background: option.colour,
                      boxShadow: draft.monthId === option.id ? `0 0 0 2px ${C.marble}, 0 0 0 3.5px ${C.black}` : 'inset 0 0 0 1px rgba(17,17,17,0.12)'
                    }}
                  />
                </label>
              ))}
            </div>
            <div className='mt-2.5 flex justify-between text-[11px] text-[rgba(17,17,17,0.6)]'>
              <span>
                {m.en} {m.year}, {m.label.toLowerCase()} {m.colour}
              </span>
              <span>{m.ink === C.black ? 'Black type' : 'Marble type'}</span>
            </div>
          </fieldset>
        </form>

        <div className='@container min-w-0'>
          <div className='grid gap-5 @min-[620px]:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] @min-[620px]:gap-6'>
            <figure className='m-0 min-w-0'>
              <div className='mx-auto max-w-[480px] @min-[620px]:max-w-none'>
                <Poster film={film} refine />
              </div>
              <figcaption className='mt-2 flex justify-between gap-3 text-[11px] text-[rgba(17,17,17,0.6)]'>
                <span>Poster, 70 × 100 cm</span>
                <span aria-live='polite' className='truncate text-right'>
                  {readout}
                </span>
              </figcaption>
            </figure>
            <div className='flex min-w-0 flex-col gap-5'>
              <figure className='m-0'>
                <Billboard film={film} refine />
                <figcaption className='mt-2 text-[11px] text-[rgba(17,17,17,0.6)]'>Billboard, 6 × 3 m, Nøstegaten</figcaption>
              </figure>
              <figure className='m-0'>
                <div style={{ boxShadow: `0 0 0 1px ${C.line}` }}>
                  <Ticket film={film} refine />
                </div>
                <figcaption className='mt-2 text-[11px] text-[rgba(17,17,17,0.6)]'>Ticket, 140 × 54 mm</figcaption>
              </figure>
              <figure className='m-0'>
                <Listing film={film} />
                <figcaption className='mt-2 text-[11px] text-[rgba(17,17,17,0.6)]'>Programme, marmorkino.no</figcaption>
              </figure>
              <p className='m-0 mt-auto max-w-[44ch] text-[11.5px] leading-[1.5] text-[rgba(17,17,17,0.72)]'>
                Each line of the title is sized to the width it has, so the same film fills a poster, a billboard and a ticket. Print files
                export at full size with 3 mm bleed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
