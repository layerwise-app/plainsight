import type * as React from 'react';
import { cn } from '~/lib/utils';

/** A block with an optional gray caption underneath. */
export function Figure({
  caption,
  aside,
  className,
  children
}: {
  caption?: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={className}>
      {children}
      {caption || aside ? (
        <figcaption className='mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-caption text-muted'>
          {caption ? <span className='max-w-[60ch] text-pretty'>{caption}</span> : <span />}
          {aside}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function blockWidth(inset?: boolean) {
  return cn(inset ? 'md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3' : 'md:col-span-12');
}
