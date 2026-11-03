// Written by `pnpm add-images`. Lists the images in this folder by name.
import { defineImages } from '~/content/media';
import meta from './images.json';

export const images = defineImages(
  meta,
  import.meta.glob<string>('./*.{webp,gif,jpg}', {
    eager: true,
    query: '?url',
    import: 'default'
  })
);
