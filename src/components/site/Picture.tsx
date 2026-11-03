import type { ImageAsset } from '~/content';
import { cn } from '~/lib/utils';

type PictureProps = {
  image: ImageAsset;
  alt: string;
  /** How wide the image shows, for the browser to pick a file: `(min-width: 768px) 50vw, 100vw`. */
  sizes: string;
  /** Load at once and early: only for the first image on a page. */
  priority?: boolean;
  className?: string;
};

/**
 * A responsive image with its blurred placeholder underneath. Give the parent
 * a fixed aspect ratio, or let the image's own width and height set it.
 */
export function Picture({ image, alt, sizes, priority, className }: PictureProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet || undefined}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding='async'
      className={cn('h-auto w-full bg-cover bg-center', className)}
      style={{ backgroundImage: `url("${image.blur}")` }}
    />
  );
}
