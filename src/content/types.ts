import type { ComponentType } from 'react';

/** One image written by `pnpm add-images`, with every size it was saved at. */
export type ImageAsset = {
  /** The middle size, used when the browser ignores `srcSet`. */
  src: string;
  /** `url 800w, url 1600w, url 2880w`; empty for GIFs. */
  srcSet: string;
  width: number;
  height: number;
  /** A tiny blurred copy, shown while the image loads. */
  blur: string;
  /** 1200×630 JPG for link previews; only written for images named `cover`. */
  share?: string;
  animated?: boolean;
};

export type Figure = { image: ImageAsset; alt: string };

/** A live React component on the case study page. */
export type DemoBlock = {
  type: 'demo';
  /** `() => import('./my-project/demo')`; the file's default export is mounted. */
  load: () => Promise<{ default: ComponentType }>;
  /** Shown while the demo loads and if it can't run. Same size as the demo. */
  still: ImageAsset;
  alt: string;
  /** Width / height of the demo frame on screens wider than 768px. */
  aspect?: number;
  /** Width / height on phones. */
  aspectMobile?: number;
  caption?: string;
  /** A short instruction shown next to the caption, like “Drag the slider”. */
  hint?: string;
  /** Background behind the demo frame. */
  background?: string;
};

export type Block =
  | DemoBlock
  | { type: 'image'; image: ImageAsset; alt: string; caption?: string; inset?: boolean }
  | { type: 'pair'; images: [Figure, Figure]; caption?: string }
  | {
      type: 'video';
      /** An `.mp4` beside the case study, imported: `import clip from './x/clip.mp4'`. */
      src: string;
      poster: ImageAsset;
      alt: string;
      caption?: string;
    }
  | { type: 'text'; heading?: string; body: string[] }
  | { type: 'quote'; text: string; name: string; role: string }
  | { type: 'beforeAfter'; before: Figure; after: Figure; caption?: string }
  | { type: 'metrics'; items: { value: string; label: string }[]; note?: string };

export type CaseStudy = {
  /** Name shown in captions and as the page title. */
  name: string;
  /** One line, shown under the name everywhere. */
  description: string;
  /** Shown in gray under captions, like `['Product design', 'Engineering']`. */
  disciplines: string[];
  client: string;
  year: number;
  /** What the studio did. */
  role: string[];
  team: string[];
  /** One or two sentences for search results and link previews. */
  summary: string;
  problem: string[];
  decisions: { title: string; body: string }[];
  outcome: string[];
  /** Landscape cover (3:2 or wider). Its `share` file is the link preview. */
  cover: ImageAsset;
  coverAlt: string;
  /** Optional portrait crop (4:5) used where Home lays the piece out tall. */
  coverTall?: ImageAsset;
  /** Optional short loops that replace the cover on hover. */
  motion?: { src: string; tall?: string };
  blocks: Block[];
};

/** A case study with the slug taken from its file name. */
export type Project = CaseStudy & { slug: string };
