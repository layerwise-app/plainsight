/**
 * Everything about the studio that shows on the site lives here: who you are,
 * where you are, how to reach you, and how the site looks. Case studies live in
 * `src/content/work/` (see the README).
 */

export type SocialLink = { label: string; href: string };

export type FontFile = {
  /** A file in `public/`, like `/fonts/my-font/my-font.woff2`. */
  src: string;
  /** A single weight (`400`) or a variable range (`'400 900'`). */
  weight: string;
  style: 'normal' | 'italic';
};

export type FontConfig = {
  family: string;
  files: FontFile[];
  /**
   * A system font drawn while the web font loads, scaled to the same width
   * and height so text doesn't jump when the web font arrives.
   */
  fallback: {
    local: string[];
    sizeAdjust: string;
    ascentOverride: string;
    descentOverride: string;
    lineGapOverride: string;
  };
};

export const portfolio = {
  name: 'Halden',
  /** One line under the name in search results and on the About page. */
  role: 'Independent design and engineering studio',
  location: {
    city: 'Oslo',
    country: 'Norway',
    /** IANA time zone for the live clock in the top bar. */
    timeZone: 'Europe/Oslo'
  },

  /** The large sentence at the top of Home. */
  statement:
    'Halden is a studio of four in Oslo. We design software and then build it ourselves, so nothing gets lost between the drawing and the release.',

  /** The large sentences between groups of work on Home, used in order. */
  interludes: [
    'We keep the studio small on purpose. The person who sketches your first screen is the one who reviews the last pull request.',
    'Most clients stay for years. The second project is usually better than the first, and the third is where it gets interesting.'
  ],

  /** About page, first paragraph is the lead. */
  bio: [
    'Halden is an independent studio for product design, identity and front-end engineering, working from a former print shop in Grünerløkka. We take on four or five projects a year, usually for companies whose software handles something people care about: their money, their neighbourhood, the climate data their city is planned on.',
    'Every project is designed and built by the same people. We prototype in code from the second week, test with real data as early as we can get it, and hand over systems that a client team can keep growing without us.'
  ],

  team: [
    { name: 'Ingrid Solberg', role: 'Design director' },
    { name: 'Mats Eide', role: 'Engineering lead' },
    { name: 'Selma Varga', role: 'Product designer' },
    { name: 'Jonas Haugland', role: 'Creative technologist' }
  ],

  services: [
    {
      name: 'Product design',
      detail:
        'Research, flows and interface design for web and mobile products, from first sketch to the design system it ships with.'
    },
    {
      name: 'Design engineering',
      detail:
        'Production front-end in React and TypeScript. We write the components we draw and stay on until they are in your users’ hands.'
    },
    {
      name: 'Identity systems',
      detail:
        'Names, logotypes, type and colour, and the rules that let a small team produce a hundred posters that still look like one brand.'
    },
    {
      name: 'Creative technology',
      detail:
        'WebGL, motion and data visualisation where a static page can’t explain the idea, built to run smoothly on an ordinary laptop.'
    }
  ],

  experience: [
    { years: '2019–', title: 'Halden', detail: 'Founded in Oslo by Ingrid Solberg and Mats Eide.' },
    { years: '2025', title: 'Nordisk Formskole', detail: 'Visiting teachers in the interaction design master’s studio.' },
    { years: '2023', title: 'Interface Days Oslo', detail: 'Talk: “The component is the specification.”' },
    { years: '2021–22', title: 'Ringvei Transit Lab', detail: 'Embedded design and engineering team, two people for eleven months.' },
    { years: '2013–19', title: 'Before Halden', detail: 'Product design and front-end leads at a Nordic payments company and a Copenhagen agency.' }
  ],

  clients: [
    'Kestrel Markets',
    'Veil',
    'Marmor Kino',
    'Soft Matter',
    'Gantry',
    'Isobar Climate',
    'Kvarter',
    'Grums Kaffe',
    'Ringvei Transit',
    'Nordre Fjord Bank',
    'Tidvann Energi',
    'Fabrikken Arkitekter'
  ],

  /** A PDF in `public/`, linked from About. */
  cv: { href: '/halden-studio-cv.pdf', label: 'Studio CV', size: 'PDF, 2 pages' },

  /** Shown on the site: the footer and the Contact page. */
  email: 'hello@halden.example',
  /**
   * Where contact form messages are emailed. Leave empty to only save them in
   * the database. Never shown on the site.
   */
  ownerEmail: '',

  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Are.na', href: 'https://www.are.na/' },
    { label: 'GitHub', href: 'https://github.com/' }
  ] satisfies SocialLink[],

  /** The footer's one line of copy. */
  footerLine: 'Have something that needs both a designer and an engineer?',

  /**
   * Slugs of case studies in the order they appear on Home and Work. Case
   * studies not listed here follow, newest year first.
   */
  workOrder: [
    'kestrel',
    'veil',
    'soft-matter',
    'marmor',
    'isobar',
    'gantry',
    'kvarter',
    'grums'
  ],

  fonts: {
    sans: {
      family: 'Schibsted Grotesk',
      files: [
        {
          src: '/fonts/schibsted-grotesk/schibsted-grotesk-latin-wght-normal.woff2',
          weight: '400 900',
          style: 'normal'
        },
        {
          src: '/fonts/schibsted-grotesk/schibsted-grotesk-latin-wght-italic.woff2',
          weight: '400 900',
          style: 'italic'
        }
      ],
      fallback: {
        local: ['Arial', 'Helvetica Neue', 'Helvetica'],
        sizeAdjust: '104.35%',
        ascentOverride: '93.58%',
        descentOverride: '24.71%',
        lineGapOverride: '0%'
      }
    } satisfies FontConfig
  },

  /**
   * Site colours. All the colour on the site comes from the work, so these
   * stay neutral. Keep `ink` and `muted` at 4.5:1 or more on `background`, and
   * `footerInk` on `footer`.
   */
  colors: {
    background: '#ffffff',
    ink: '#0d0d0d',
    muted: '#6b6b69',
    line: '#e6e6e3',
    tint: '#f3f3f1',
    footer: '#b8b8b4',
    footerInk: '#0d0d0d',
    footerMuted: '#363634'
  }
};

export type Portfolio = typeof portfolio;
