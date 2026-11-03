import { Link } from '@tanstack/react-router';
import { useRef } from 'react';
import type { Project } from '~/content';
import { coverScale, gridSizes } from '~/lib/sizes';
import { canHover, prefersReducedMotion } from '~/lib/utils';
import { Picture } from './Picture';
import { useReveal } from './useReveal';

type WorkPieceProps = {
  project: Project;
  /** Width / height of the frame on wide screens. */
  aspect: number;
  /** Width / height on phones; defaults to `aspect`. */
  aspectMobile?: number;
  /** Columns of 12 it spans from 768px; below that it is the page width. */
  columns: number;
  priority?: boolean;
  className?: string;
  headingLevel?: 'h2' | 'h3';
};

/**
 * A cover with its caption. On devices that can hover, the still gives way to
 * the project's short motion loop; keyboard focus does the same.
 */
export function WorkPiece({
  project,
  aspect,
  aspectMobile = aspect,
  columns,
  priority,
  className,
  headingLevel: Heading = 'h3'
}: WorkPieceProps) {
  const revealRef = useReveal<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tall = aspect < 1.2;
  const image = tall && project.coverTall ? project.coverTall : project.cover;
  const imageAspect = image.width / image.height;
  const sizes = gridSizes({
    md: columns,
    crop: { base: coverScale(imageAspect, aspectMobile), md: coverScale(imageAspect, aspect) }
  });
  const clip = project.motion && (tall ? (project.motion.tall ?? project.motion.src) : project.motion.src);

  const play = (fromKeyboard = false) => {
    const video = videoRef.current;
    if (!video || !clip || prefersReducedMotion() || (!fromKeyboard && !canHover())) return;
    if (!video.getAttribute('src')) video.src = clip;
    video.currentTime = 0;
    video.play().catch(() => {});
  };
  const stop = () => {
    frameRef.current?.removeAttribute('data-playing');
    videoRef.current?.pause();
  };

  return (
    <article ref={revealRef} className={className}>
      <Link
        to='/work/$slug'
        params={{ slug: project.slug }}
        className='group block focus-visible:outline-offset-4'
        onPointerEnter={(event) => event.pointerType === 'mouse' && play()}
        onPointerLeave={stop}
        onFocus={(event) => event.currentTarget.matches(':focus-visible') && play(true)}
        onBlur={stop}
      >
        <div
          ref={frameRef}
          className='relative overflow-hidden bg-tint [aspect-ratio:var(--a-m)] md:[aspect-ratio:var(--a)]'
          style={{ '--a': aspect, '--a-m': aspectMobile } as React.CSSProperties}
        >
          <Picture
            image={image}
            alt={project.coverAlt}
            sizes={sizes}
            priority={priority}
            className='absolute inset-0 h-full object-cover'
          />
          {clip ? (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload='none'
              aria-hidden='true'
              tabIndex={-1}
              onPlaying={() => frameRef.current?.setAttribute('data-playing', '')}
              className='pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out [[data-playing]>&]:opacity-100'
            />
          ) : null}
        </div>
        <div className='mt-3 text-caption md:mt-3.5'>
          <Heading className='font-medium'>{project.name}</Heading>
          <p className='text-pretty'>{project.description}</p>
          <p className='mt-1.5 text-muted'>{project.disciplines.join(', ')}</p>
        </div>
      </Link>
    </article>
  );
}
