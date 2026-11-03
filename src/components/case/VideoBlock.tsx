import { useEffect, useRef, useState } from 'react';
import { Picture } from '~/components/site/Picture';
import { gridSizes } from '~/lib/sizes';
import type { ImageAsset } from '~/content';
import { prefersReducedMotion } from '~/lib/utils';
import { Figure } from './Figure';

/**
 * A muted loop that plays only while on screen. Visitors who reduce motion see
 * the poster and can start it themselves.
 */
export function VideoBlock({
  src,
  poster,
  alt,
  caption
}: {
  src: string;
  poster: ImageAsset;
  alt: string;
  caption?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [wanted, setWanted] = useState(true);
  const wantedRef = useRef(wanted);
  wantedRef.current = wanted;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      setWanted(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && wantedRef.current) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setWanted(true);
      video.play().catch(() => {});
    } else {
      setWanted(false);
      video.pause();
    }
  };

  return (
    <Figure
      caption={caption}
      aside={
        <button type='button' onClick={toggle} className='link text-ink'>
          {playing ? 'Pause' : 'Play'}
          <span className='sr-only'> video: {alt}</span>
        </button>
      }
    >
      <div className='relative overflow-hidden bg-tint' style={{ aspectRatio: `${poster.width} / ${poster.height}` }}>
        <Picture image={poster} alt='' sizes={gridSizes()} className='absolute inset-0 h-full object-cover' />
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          preload='metadata'
          aria-label={alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className='absolute inset-0 h-full w-full object-cover'
        />
      </div>
    </Figure>
  );
}
