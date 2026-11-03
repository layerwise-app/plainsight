import { useId, useState } from 'react';
import { Picture } from '~/components/site/Picture';
import { gridSizes } from '~/lib/sizes';
import type { Figure as FigureData } from '~/content/types';
import { Figure } from './Figure';

/** Two images on top of each other; a slider (mouse, touch or arrow keys) moves the divide. */
export function BeforeAfter({
  before,
  after,
  caption
}: {
  before: FigureData;
  after: FigureData;
  caption?: string;
}) {
  const [split, setSplit] = useState(50);
  const id = useId();
  const ratio = `${after.image.width} / ${after.image.height}`;

  return (
    <Figure caption={caption}>
      <div className='relative select-none overflow-hidden bg-tint' style={{ aspectRatio: ratio }}>
        <Picture image={after.image} alt={after.alt} sizes={gridSizes()} className='absolute inset-0 h-full object-cover' />
        <div className='absolute inset-0' style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <Picture image={before.image} alt={before.alt} sizes={gridSizes()} className='absolute inset-0 h-full object-cover' />
        </div>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-y-0 w-px bg-white mix-blend-difference'
          style={{ left: `${split}%` }}
        />
        <span aria-hidden='true' className='pointer-events-none absolute top-3 left-3 bg-white px-2 py-1 text-ui text-ink'>
          Before
        </span>
        <span aria-hidden='true' className='pointer-events-none absolute top-3 right-3 bg-white px-2 py-1 text-ui text-ink'>
          After
        </span>
        <label htmlFor={id} className='sr-only'>
          Move the divide between before and after
        </label>
        <input
          id={id}
          type='range'
          min={0}
          max={100}
          step={1}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          aria-valuetext={`${split}% before`}
          className='peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/90 outline-offset-2 peer-focus-visible:outline-2 peer-focus-visible:outline-white'
          style={{ left: `${split}%` }}
        >
          <svg viewBox='0 0 36 36' className='size-full text-ink' aria-hidden='true'>
            <path d='M15 13l-5 5 5 5M21 13l5 5-5 5' fill='none' stroke='currentColor' strokeWidth='1.5' />
          </svg>
        </div>
      </div>
    </Figure>
  );
}
