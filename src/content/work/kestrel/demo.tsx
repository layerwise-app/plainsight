import { useState } from 'react';
import { GuardrailsPanel } from './screens/Guardrails';
import { DEFAULT_LIMITS, K } from './screens/model';

/** Live demo: edit Kestrel's guardrails and watch 90 days of trades replay. */
export default function KestrelDemo() {
  const [limits, setLimits] = useState(DEFAULT_LIMITS);
  const changed = JSON.stringify(limits) !== JSON.stringify(DEFAULT_LIMITS);
  return (
    <div
      className='flex min-h-full w-full flex-col gap-4 p-4 md:gap-5 md:p-8'
      style={{ background: K.bg, color: K.text, fontFamily: K.sans, fontSize: 13, letterSpacing: '-0.006em' }}
    >
      <div className='flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1'>
        <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.025em' }}>Guardrails</div>
        <button
          type='button'
          onClick={() => setLimits(DEFAULT_LIMITS)}
          disabled={!changed}
          style={{ fontSize: 12.5, color: changed ? K.text : K.faint, background: 'none', border: 0, padding: 0 }}
          className='underline decoration-1 underline-offset-4 disabled:no-underline'
        >
          Reset to live limits
        </button>
      </div>
      <GuardrailsPanel limits={limits} onChange={setLimits} fluid showStopped />
    </div>
  );
}
