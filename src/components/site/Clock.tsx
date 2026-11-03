import { useEffect, useState } from 'react';
import { formatClock } from '~/lib/clock';
import { cn } from '~/lib/utils';
import { portfolio } from '~/portfolio.config';

/** The studio's local time, ticking once a second. */
export function Clock({ className }: { className?: string }) {
  const { city, timeZone } = portfolio.location;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(Date.now());
      timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  const time = formatClock(now, timeZone);

  return (
    <p className={cn('whitespace-nowrap', className)}>
      <span className='text-muted'>{city}</span>{' '}
      <span className='sr-only'>local time </span>
      <time className='digits' suppressHydrationWarning>
        {time.split('').map((char, index) =>
          // Digits sit in fixed boxes so the clock never shifts; colons don't.
          /\d/.test(char) ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: each position is a fixed slot in HH:MM:SS
            <span key={index} className='digit' suppressHydrationWarning>
              {char}
            </span>
          ) : (
            char
          )
        )}
      </time>
    </p>
  );
}
