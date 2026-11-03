import { useId, useState } from 'react';
import { BagArt } from './Bag';
import { G, METHOD_ORDER, METHODS, type Method, ROAST_ORDER, ROASTS, type Roast, displayStyle, grams, kr, short } from './brand';
import { type Answers, DEFAULT_ANSWERS, bagText, every, fitText, plan, schedule } from './plan';

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2432C]';
const peerFocus = 'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#E2432C]';

/** Brewer drawings for the method cards, 32 × 32. */
export function MethodIcon({ method, color = G.espresso }: { method: Method; color?: string }) {
  const stroke = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <svg width='32' height='32' viewBox='0 0 32 32' aria-hidden='true'>
      {method === 'filter' ? (
        <g {...stroke}>
          <path d='M7 7h18l-6 9h-6z' />
          <path d='M5 7h22' />
          <path d='M10 19h12v6.5a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3z' />
          <path d='M22 21h1.6a2 2 0 0 1 0 4H22' />
        </g>
      ) : method === 'espresso' ? (
        <g {...stroke}>
          <path d='M9 13h13v5a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5z' />
          <path d='M22 15h1.8a2.2 2.2 0 0 1 0 4.4H21.5' />
          <path d='M5.5 26h21' />
          <path d='M13 6c-1 1.4 1 2.6 0 4M17.5 6c-1 1.4 1 2.6 0 4' />
        </g>
      ) : method === 'cafetiere' ? (
        <g {...stroke}>
          <rect x='9' y='9' width='12' height='18' rx='1.5' />
          <path d='M15 3.5v8.5M12 3.5h6M10.5 12h9' />
          <path d='M21 12h2.5a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H21' />
          <path d='M9 28h12' />
        </g>
      ) : (
        <g {...stroke}>
          <path d='M10 4h11l-1.5 10h-8z' />
          <path d='M11.5 14h8l2.5 13H9z' />
          <path d='M21 6h3l-2.2 6' />
          <path d='M9.5 14h12' />
          <path d='M15.5 1.8v2.2' />
        </g>
      )}
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: G.muted }}>{children}</div>
  );
}

function Legend({ children, hint, as = 'div' }: { children: React.ReactNode; hint?: string; as?: 'div' | 'legend' }) {
  const Tag = as;
  return (
    <Tag className='mb-2.5 flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 p-0'>
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{children}</span>
      {hint ? <span style={{ fontSize: 12.5, color: G.muted }}>{hint}</span> : null}
    </Tag>
  );
}

/** Cups a day: − and + buttons around a real number input. */
function CupStepper({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const set = (next: number) => {
    setDraft(null);
    onChange(Math.min(8, Math.max(1, Math.round(next))));
  };
  const button = (label: string, delta: number, glyph: string) => (
    <button
      type='button'
      aria-label={label}
      aria-controls={id}
      onClick={() => set(value + delta)}
      disabled={delta < 0 ? value <= 1 : value >= 8}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color] hover:bg-[#2A1911] hover:text-[#F3EBDC] disabled:pointer-events-none disabled:opacity-30 ${focus}`}
      style={{ borderColor: G.lineStrong, fontSize: 22, lineHeight: 1 }}
    >
      <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
        <path d={glyph === '+' ? 'M7 1v12M1 7h12' : 'M1 7h12'} stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' />
      </svg>
    </button>
  );
  return (
    <div>
      <Legend hint='A mug, a double shot or one moka pot is a cup.'>
        <label htmlFor={id}>Cups a day, each</label>
      </Legend>
      <div className='flex items-center gap-2.5'>
        {button('One cup fewer', -1, '−')}
        <input
          id={id}
          type='number'
          inputMode='numeric'
          min={1}
          max={8}
          step={1}
          value={draft ?? String(value)}
          onChange={(event) => {
            const text = event.target.value;
            const parsed = Number.parseInt(text, 10);
            if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 8) set(parsed);
            else setDraft(text);
          }}
          onBlur={() => setDraft(null)}
          className={`h-11 w-16 rounded-[10px] border bg-[#FBF6EE] text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${focus}`}
          style={{ ...displayStyle(800, 72), fontSize: 24, borderColor: G.lineStrong, color: G.espresso }}
        />
        {button('One cup more', 1, '+')}
        <span style={{ fontSize: 14, color: G.muted, marginLeft: 4 }}>
          {value === 1 ? 'cup' : 'cups'} a day
        </span>
      </div>
    </div>
  );
}

function People({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  const name = useId();
  return (
    <fieldset className='m-0 min-w-0 border-0 p-0'>
      <Legend as='legend' hint='Only the coffee drinkers.'>How many of you drink it?</Legend>
      <div className='flex flex-wrap gap-2'>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className='relative cursor-pointer'>
            <input type='radio' name={name} value={n} checked={value === n} onChange={() => onChange(n)} className='peer sr-only' />
            <span
              className={`grid h-11 w-11 place-items-center rounded-full border transition-[background-color,border-color,color] hover:border-[#2A1911] peer-checked:border-[#2A1911] peer-checked:bg-[#2A1911] peer-checked:text-[#F3EBDC] ${peerFocus}`}
              style={{ ...displayStyle(700, 48), fontSize: 18, borderColor: G.lineStrong }}
            >
              {n}
              <span className='sr-only'>{n === 1 ? ' person' : ' people'}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Methods({ value, onChange }: { value: Method; onChange: (next: Method) => void }) {
  const name = useId();
  return (
    <fieldset className='@container m-0 min-w-0 border-0 p-0'>
      <Legend as='legend'>How do you brew?</Legend>
      <div className='grid grid-cols-2 gap-2 @min-[460px]:grid-cols-4'>
        {METHOD_ORDER.map((m) => {
          const method = METHODS[m];
          const checked = value === m;
          return (
            <label key={m} className='relative cursor-pointer'>
              <input type='radio' name={name} value={m} checked={checked} onChange={() => onChange(m)} className='peer sr-only' />
              <span
                className={`flex h-full flex-col gap-2 rounded-[12px] border p-3 transition-[background-color,border-color,color] hover:border-[#2A1911] peer-checked:border-[#2A1911] peer-checked:bg-[#2A1911] peer-checked:text-[#F3EBDC] ${peerFocus}`}
                style={{ borderColor: G.lineStrong, background: checked ? undefined : G.paper }}
              >
                <MethodIcon method={m} color={checked ? G.cream : G.espresso} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{method.label}</span>
                <span style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.35 }}>
                  {method.grams} g for {method.cup}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Roasts({ value, onChange, method }: { value: Roast; onChange: (next: Roast) => void; method: Method }) {
  const name = useId();
  const pick = METHODS[method].roast;
  return (
    <fieldset className='@container m-0 min-w-0 border-0 p-0'>
      <Legend as='legend' hint={`For ${METHODS[method].label.toLowerCase()}, we’d pick ${ROASTS[pick].label.toLowerCase()}.`}>Which roast?</Legend>
      <div className='grid grid-cols-2 gap-2 @min-[460px]:grid-cols-4'>
        {ROAST_ORDER.map((r) => {
          const roast = ROASTS[r];
          return (
            <label key={r} className='relative cursor-pointer'>
              <input type='radio' name={name} value={r} checked={value === r} onChange={() => onChange(r)} className='peer sr-only' />
              <span
                className={`flex h-full items-center gap-2.5 rounded-[12px] border p-2.5 transition-[background-color,border-color,color] hover:border-[#2A1911] peer-checked:border-[#2A1911] peer-checked:shadow-[inset_0_0_0_1px_#2A1911] ${peerFocus}`}
                style={{ borderColor: G.lineStrong, background: G.paper }}
              >
                <span
                  aria-hidden='true'
                  style={{ width: 22, height: 30, borderRadius: 4, background: roast.bag, flex: 'none', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}
                />
                <span className='min-w-0'>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>{roast.label}</span>
                  <span style={{ display: 'block', fontSize: 12, color: G.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {roast.coffee}
                  </span>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ borderTop: `1px solid ${G.line}`, paddingTop: 10 }}>
      <div style={{ fontSize: 12, color: G.muted }}>{label}</div>
      <div style={{ ...displayStyle(800, 72), fontSize: 22, letterSpacing: '-0.01em', marginTop: 3 }}>{value}</div>
      {note ? <div style={{ fontSize: 11.5, color: G.muted, marginTop: 1 }}>{note}</div> : null}
    </div>
  );
}

/** The roast date as it appears on the label, small. */
export function DateChip({ dd, mon, muted }: { dd: string; mon: string; muted?: boolean }) {
  return (
    <span
      aria-hidden='true'
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 3,
        color: muted ? G.faint : G.tomato,
        ...displayStyle(900, 144),
        fontSize: 'clamp(24px, 7cqi, 30px)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
        width: 'clamp(64px, 17cqi, 76px)',
        flex: 'none'
      }}
    >
      {dd}
      <span style={{ fontSize: 12, letterSpacing: '0.02em' }}>{mon.toUpperCase()}</span>
    </span>
  );
}

/**
 * The subscription builder. Four answers in, a bag size, a rhythm and a
 * price out, with the next three roast days.
 */
export function Builder({ initial = DEFAULT_ANSWERS }: { initial?: Answers }) {
  const [answers, setAnswers] = useState(initial);
  const [skipped, setSkipped] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const titleId = useId();
  const resultId = useId();
  const p = plan(answers);
  const roast = ROASTS[answers.roast];
  const dates = schedule(p.weeks, 3);
  const update = (next: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...next }));
    setSkipped([]);
    setStarted(false);
  };
  const toggleSkip = (index: number) =>
    setSkipped((list) => (list.includes(index) ? list.filter((i) => i !== index) : [...list, index]));
  const summary = `${bagText(p)} of ${roast.coffee} ${every(p.weeks)}. ${kr(p.perCup, 2)} a cup, about ${kr(p.perMonth)} a month.`;

  return (
    <div className='@container min-h-full w-full' style={{ background: G.cream, color: G.espresso, fontFamily: G.sans }}>
      <div className='grid gap-6 p-5 @min-[728px]:grid-cols-[minmax(0,1fr)_minmax(0,1.06fr)] @min-[728px]:gap-8 @min-[728px]:p-8 @min-[1100px]:gap-12 @min-[1100px]:p-11'>
        <form aria-labelledby={titleId} onSubmit={(event) => event.preventDefault()} className='flex flex-col gap-6'>
          <div>
            <Eyebrow>Grums subscription</Eyebrow>
            <h2 id={titleId} className='mt-2 text-[30px] leading-[1.02] @min-[420px]:text-[34px] @min-[1100px]:text-[44px]' style={{ ...displayStyle(800, 144), letterSpacing: '-0.025em' }}>
              Tell us how you drink it.
            </h2>
            <p className='mt-2.5 max-w-[44ch]' style={{ fontSize: 14.5, lineHeight: 1.5, color: G.muted }}>
              We work out the bag, how often it comes and what each cup costs. Change any answer and the plan changes with it.
            </p>
          </div>
          <CupStepper value={answers.cups} onChange={(cups) => update({ cups })} />
          <People value={answers.people} onChange={(people) => update({ people })} />
          <Methods value={answers.method} onChange={(method) => update({ method })} />
          <Roasts value={answers.roast} onChange={(r) => update({ roast: r })} method={answers.method} />
        </form>

        <section
          aria-labelledby={resultId}
          className='@container flex flex-col rounded-[18px] p-5 @min-[728px]:p-6'
          style={{ background: G.paper, boxShadow: `0 0 0 1px ${G.line}, 0 18px 40px -28px rgba(42,25,17,0.45)` }}
        >
          <h3 id={resultId} className='sr-only'>
            Your plan
          </h3>
          <p className='sr-only' aria-live='polite' aria-atomic='true'>
            {summary}
          </p>
          <div className='grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4'>
            <div className='min-w-0'>
              <Eyebrow>We’d send</Eyebrow>
              <div className='mt-1.5 text-[46px] leading-[0.95] @min-[480px]:text-[60px]' style={{ ...displayStyle(900, 144), letterSpacing: '-0.035em' }}>
                {bagText(p)}
              </div>
              <div className='mt-1 text-[22px] @min-[480px]:text-[26px]' style={{ ...displayStyle(500, 72), fontStyle: 'italic', letterSpacing: '-0.015em' }}>
                {every(p.weeks)}
              </div>
              <div style={{ fontSize: 13.5, marginTop: 12, lineHeight: 1.45 }}>
                <strong style={{ fontWeight: 600 }}>{roast.coffee}</strong>, {roast.origin}
                <br />
                <span style={{ color: G.muted }}>{roast.notes}</span>
              </div>
            </div>
            <div className='hidden @min-[360px]:block' style={{ marginRight: -6 }}>
              <BagArt roast={answers.roast} size={p.size} count={p.count} method={answers.method} height={190} />
            </div>
          </div>

          <div className='mt-5 grid grid-cols-2 gap-x-4 gap-y-3 @min-[520px]:grid-cols-4'>
            <Fact label='You drink' value={`${grams(p.perWeek)}`} note='a week' />
            <Fact label={METHODS[answers.method].label} value={`${p.gramsPerCup} g`} note='a cup' />
            <Fact label='Each cup' value={kr(p.perCup, 2)} note={`${kr(p.price)} a delivery`} />
            <Fact label='A month' value={kr(Math.round(p.perMonth))} note='delivery included' />
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.5, color: G.muted, marginTop: 14 }}>
            {fitText(p)}
            {p.count > 1 ? ` We send it as ${p.count} bags, so the rest stay sealed until you need them.` : ''}
          </p>
          {p.perWeek > 2500 ? (
            <p style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>That is café-sized. Our wholesale prices start at 3 kg a week.</p>
          ) : null}

          <div className='mt-4'>
            <Eyebrow>Your next three</Eyebrow>
            <ol className='mt-2'>
              {dates.map((d) => {
                const off = skipped.includes(d.index);
                return (
                  <li
                    key={d.index}
                    className='flex items-center gap-2.5 py-2.5 @min-[520px]:gap-3'
                    style={{ borderTop: `1px solid ${G.line}` }}
                  >
                    <DateChip dd={d.roast.dd} mon={d.roast.mon} muted={off} />
                    <div className='min-w-0 flex-1 text-[12.5px] @min-[520px]:text-[13px]' style={{ lineHeight: 1.4 }}>
                      {off ? (
                        <>
                          <div style={{ fontWeight: 600, color: G.muted }}>Skipped</div>
                          <div style={{ color: G.muted }}>
                            <span className='@min-[520px]:hidden'>Nothing roasted for you.</span>
                            <span className='hidden @min-[520px]:inline'>
                              Nothing roasted for you on {d.roast.weekday} {d.roast.day} {d.roast.month}.
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontWeight: 600 }}>
                            Roasted <span className='@min-[520px]:hidden'>{d.roast.weekday}</span>
                            <span className='hidden @min-[520px]:inline'>
                              {d.roast.weekday} {d.roast.day} {d.roast.month}
                            </span>
                          </div>
                          <div style={{ color: G.muted }}>
                            <span className='@min-[520px]:hidden'>Arrives {short(d.arrives)}</span>
                            <span className='hidden @min-[520px]:inline'>
                              In your letterbox {d.arrives.weekday} {d.arrives.day} {d.arrives.month}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      type='button'
                      aria-pressed={off}
                      aria-label={`${off ? 'Undo skip for' : 'Skip'} the delivery roasted ${d.roast.weekday} ${d.roast.day} ${d.roast.month}`}
                      onClick={() => toggleSkip(d.index)}
                      className={`h-9 shrink-0 rounded-full border px-2.5 @min-[520px]:px-3.5 transition-[background-color,border-color,color] hover:bg-[#2A1911] hover:text-[#F3EBDC] ${focus}`}
                      style={{ fontSize: 13, fontWeight: 600, borderColor: G.lineStrong }}
                    >
                      {off ? 'Undo' : 'Skip'}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className='mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4' style={{ borderTop: `1px solid ${G.line}` }}>
            <button
              type='button'
              onClick={() => setStarted(true)}
              className={`h-12 w-full rounded-full px-6 transition-[filter] hover:brightness-95 @min-[520px]:w-auto ${focus}`}
              style={{ background: G.tomato, color: '#fff8ef', fontSize: 15, fontWeight: 600 }}
            >
              <span className='@min-[520px]:hidden'>Start for {kr(p.price)}</span>
              <span className='hidden @min-[520px]:inline'>
                Start with {bagText(p)} for {kr(p.price)}
              </span>
            </button>
            <span role='status' style={{ fontSize: 12.5, color: G.muted, lineHeight: 1.4 }}>
              {started ? 'This is a sample of the Grums shop, so nothing was ordered.' : 'No commitment. Skip, nudge or stop by text.'}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
