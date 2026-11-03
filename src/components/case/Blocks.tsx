import { Picture } from '~/components/site/Picture';
import type { Block } from '~/content';
import { gridSizes } from '~/lib/sizes';
import { cn } from '~/lib/utils';
import { BeforeAfter } from './BeforeAfter';
import { DemoBlock } from './DemoBlock';
import { Figure } from './Figure';
import { VideoBlock } from './VideoBlock';

/** Renders a case study's content blocks in order. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className='flex flex-col gap-y-[clamp(56px,7vw,128px)] px-page'>
      {blocks.map((block, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: blocks are fixed content that never reorders
        <BlockView key={index} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'demo':
      return <DemoBlock block={block} />;

    case 'image':
      return (
        <div className='grid grid-cols-1 md:grid-cols-12 md:gap-x-gutter'>
          <Figure
            caption={block.caption}
            className={cn(
              block.inset ? 'md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3' : 'md:col-span-12'
            )}
          >
            <Picture
              image={block.image}
              alt={block.alt}
              sizes={block.inset ? gridSizes({ md: 10, lg: 8 }) : gridSizes()}
            />
          </Figure>
        </div>
      );

    case 'pair':
      return (
        <Figure caption={block.caption}>
          <div className='grid grid-cols-1 gap-gutter md:grid-cols-2'>
            {block.images.map((figure) => (
              <Picture
                key={figure.image.src}
                image={figure.image}
                alt={figure.alt}
                sizes={gridSizes({ md: 6 })}
              />
            ))}
          </div>
        </Figure>
      );

    case 'video':
      return <VideoBlock src={block.src} poster={block.poster} alt={block.alt} caption={block.caption} />;

    case 'text':
      return (
        <div className='grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-gutter'>
          {block.heading ? (
            <h2 className='text-caption font-medium md:col-span-3'>{block.heading}</h2>
          ) : null}
          <div className='space-y-[0.9em] text-prose md:col-span-7 md:col-start-5'>
            {block.body.map((paragraph) => (
              <p key={paragraph} className='text-pretty'>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      );

    case 'quote':
      return (
        <figure className='grid grid-cols-1 py-[clamp(16px,3vw,48px)] md:grid-cols-12 md:gap-x-gutter'>
          <blockquote className='text-balance text-statement md:col-span-9 md:col-start-3'>
            <p>“{block.text}”</p>
          </blockquote>
          <figcaption className='mt-6 text-caption md:col-span-9 md:col-start-3'>
            <span className='font-medium'>{block.name}</span>
            <span className='text-muted'>, {block.role}</span>
          </figcaption>
        </figure>
      );

    case 'beforeAfter':
      return <BeforeAfter before={block.before} after={block.after} caption={block.caption} />;

    case 'metrics':
      return (
        <div className='grid grid-cols-1 md:grid-cols-12 md:gap-x-gutter'>
          <dl className='grid grid-cols-2 gap-x-gutter gap-y-10 border-t border-line pt-6 md:col-span-12 md:grid-cols-4'>
            {block.items.map((item) => (
              <div key={item.label} className='flex flex-col-reverse justify-end'>
                <dt className='mt-3 max-w-[26ch] text-caption text-muted'>{item.label}</dt>
                <dd className='text-[clamp(40px,5.6vw,92px)] leading-[0.95] tracking-[-0.045em]'>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
          {block.note ? (
            <p className='mt-6 text-caption text-muted md:col-span-6'>{block.note}</p>
          ) : null}
        </div>
      );
  }
}
