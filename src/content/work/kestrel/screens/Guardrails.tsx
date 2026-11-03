import { useId } from 'react';
import { type Limits, type Trade, DEFAULT_LIMITS, K, fmtPct, replay } from './model';
import { RULES, RuleRow, Token } from './rules';
import { AppFrame, EquityChart, PageHead, Pill } from './ui';

const RANGES: Record<keyof Limits, { min: number; max: number; step: number; label: string }> = {
  maxPosition: { min: 2, max: 14, step: 0.5, label: 'Largest position, percent of fund' },
  maxDailyLoss: { min: 0.5, max: 5, step: 0.5, label: 'Daily loss that stops trading, percent' },
  startHour: { min: 7, max: 12, step: 1, label: 'First trading hour' },
  endHour: { min: 14, max: 20, step: 1, label: 'Last trading hour' }
};

/** Steppable value inside a sentence. Arrow keys and the buttons both work. */
function Stepper({
  name,
  text,
  limits,
  onChange
}: {
  name: keyof Limits;
  text: string;
  limits: Limits;
  onChange: (next: Limits) => void;
}) {
  const range = RANGES[name];
  const value = limits[name];
  const set = (next: number) => {
    const clamped = Math.min(range.max, Math.max(range.min, Math.round(next / range.step) * range.step));
    const updated = { ...limits, [name]: clamped };
    if (name === 'startHour' && clamped >= updated.endHour) return;
    if (name === 'endHour' && clamped <= updated.startHour) return;
    onChange(updated);
  };
  const button = (label: string, delta: number, glyph: string) => (
    <button
      type='button'
      aria-label={`${label} ${range.label.toLowerCase()}`}
      onClick={() => set(value + delta)}
      disabled={delta < 0 ? value <= range.min : value >= range.max}
      className='disabled:opacity-30'
      style={{
        width: 22,
        height: 22,
        borderRadius: 5,
        border: 0,
        color: K.lime,
        background: 'rgba(205,244,100,0.08)',
        fontFamily: K.mono,
        fontSize: 14,
        lineHeight: '22px',
        verticalAlign: '1px'
      }}
    >
      {glyph}
    </button>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
      {button('Lower', -range.step, '−')}
      <span
        role='spinbutton'
        tabIndex={0}
        aria-label={range.label}
        aria-valuemin={range.min}
        aria-valuemax={range.max}
        aria-valuenow={value}
        aria-valuetext={text}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
            event.preventDefault();
            set(value + range.step);
          } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
            event.preventDefault();
            set(value - range.step);
          } else if (event.key === 'Home') set(range.min);
          else if (event.key === 'End') set(range.max);
        }}
                style={{ borderRadius: 5, outlineColor: K.lime }}
      >
        <Token active>{text}</Token>
      </span>
      {button('Raise', range.step, '+')}
    </span>
  );
}

/**
 * The guardrail editor: sentences on the left, the last 90 days replayed under
 * those limits on the right. Interactive when `onChange` is given.
 */
export function GuardrailsPanel({
  limits,
  onChange,
  chartWidth = 470,
  chartHeight = 250,
  fluid,
  showStopped
}: {
  limits: Limits;
  onChange?: (next: Limits) => void;
  chartWidth?: number;
  chartHeight?: number;
  /** Scale the chart to its column instead of drawing it at a fixed size. */
  fluid?: boolean;
  /** List the most recent trades the limits would have stopped. */
  showStopped?: boolean;
}) {
  const run = replay(limits);
  const base = replay(DEFAULT_LIMITS);
  const changed = JSON.stringify(limits) !== JSON.stringify(DEFAULT_LIMITS);
  const titleId = useId();
  const value = (name: keyof Limits, text: string) =>
    onChange ? <Stepper name={name} text={text} limits={limits} onChange={onChange} /> : <Token>{text}</Token>;

  return (
    <div className='@container'>
    <div className='grid gap-3 @min-[760px]:grid-cols-[1.08fr_1fr]' aria-labelledby={titleId} role='group'>
      <section
        style={{ border: `1px solid ${K.line}`, borderRadius: 8, background: K.panel, overflow: 'hidden', alignSelf: 'start' }}
      >
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div id={titleId} style={{ fontWeight: 500 }}>
            Momentum · Nordics
          </div>
          {changed ? <Pill tone='amber'>Draft, not live</Pill> : <Pill tone='lime'>Live since 2 Mar</Pill>}
        </div>
        {RULES.map((rule) => (
          <RuleRow key={rule.id} id={rule.id}>
            {rule.render(value, limits)}
          </RuleRow>
        ))}
        <div
          style={{
            borderTop: `1px solid ${K.line}`,
            padding: '12px 16px',
            fontSize: 12,
            color: K.muted,
            lineHeight: 1.5
          }}
        >
          Signed off by compliance on 28 Feb. Changes go live after a second person approves them.
        </div>
        {showStopped ? (
          <div className='@max-[600px]:hidden'>
            <Stopped trades={run.blocked} limits={limits} />
          </div>
        ) : null}
      </section>

      <section
        aria-live='polite'
        className='@container'
        style={{ border: `1px solid ${K.line}`, borderRadius: 8, background: K.panel, padding: 16, minWidth: 0, alignSelf: 'start' }}
      >
        <div style={{ fontSize: 12, color: K.muted }}>The last 90 days, replayed with these limits</div>
        <div className='mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3 @min-[400px]:grid-cols-4'>
          <Figure label='Trades stopped' value={`${run.blocked.length}`} note={`of ${run.total}`} tone={K.red} />
          <Figure
            label='Return'
            value={fmtPct(run.returnPct)}
            note={changed ? `was ${fmtPct(base.returnPct)}` : `${fmtPct(run.baselineReturnPct)} without`}
            tone={K.lime}
          />
          <Figure
            label='Worst day'
            value={fmtPct(run.worstDay)}
            note={changed ? `was ${fmtPct(base.worstDay)}` : `${fmtPct(run.baselineWorstDay)} without`}
          />
          <Figure label='Days halted' value={`${run.haltedDays}`} note='by rule 1.2' />
        </div>
        <div style={{ marginTop: 14 }}>
          <EquityChart
            curve={run.curve}
            baseline={run.baseline}
            blockedDays={run.blocked.map((trade) => trade.day)}
            width={chartWidth}
            height={chartHeight}
            fluid={fluid}
          />
        </div>
      </section>
    </div>
    </div>
  );
}

function reason(trade: { size: number; hour: number }, limits: Limits) {
  if (trade.size > limits.maxPosition) return `${trade.size.toFixed(1)}% position`;
  if (trade.hour < limits.startHour || trade.hour >= limits.endHour) return `order at ${String(trade.hour).padStart(2, '0')}:00`;
  return 'day already halted';
}

function Stopped({ trades, limits }: { trades: Trade[]; limits: Limits }) {
  const recent = [...trades].sort((a, b) => b.day - a.day).slice(0, 5);
  return (
    <div style={{ borderTop: `1px solid ${K.line}`, padding: '12px 16px 6px' }}>
      <div style={{ fontSize: 12, color: K.muted, marginBottom: 6 }}>Most recent trades these limits stop</div>
      {recent.map((trade, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '64px 64px 1fr auto',
            gap: 8,
            padding: '7px 0',
            fontSize: 12.5,
            borderTop: index ? `1px solid ${K.line}` : undefined
          }}
        >
          <span style={{ fontFamily: K.mono, color: K.faint }}>day {trade.day + 1}</span>
          <span style={{ fontFamily: K.mono }}>{trade.ticker}</span>
          <span style={{ color: K.muted }}>{reason(trade, limits)}</span>
          <span style={{ fontFamily: K.mono, color: trade.pnl < 0 ? K.lime : K.red }}>
            {trade.pnl < 0 ? 'saved ' : 'missed '}
            {Math.abs(trade.pnl).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function Figure({ label, value, note, tone }: { label: string; value: string; note: string; tone?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: K.muted }}>{label}</div>
      <div style={{ fontFamily: K.mono, fontSize: 21, letterSpacing: '-0.03em', marginTop: 6, color: tone ?? K.text }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: K.faint, marginTop: 2 }}>{note}</div>
    </div>
  );
}

/** The guardrails page with an edit in progress, designed at 1240 × 760. */
export function GuardrailsScreen() {
  return (
    <AppFrame active='Guardrails'>
      <PageHead
        title='Guardrails'
        right={
          <>
            <span>3 rules · edited by Live Haugen</span>
            <span
              style={{
                fontSize: 12.5,
                color: K.limeInk,
                background: K.lime,
                borderRadius: 6,
                padding: '6px 11px',
                fontWeight: 500
              }}
            >
              Ask for approval
            </span>
          </>
        }
      />
      <GuardrailsPanel limits={{ maxPosition: 6, maxDailyLoss: 2, startHour: 9, endHour: 17 }} fluid showStopped chartHeight={300} />
    </AppFrame>
  );
}
