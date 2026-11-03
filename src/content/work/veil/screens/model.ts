import { seeded } from '~/components/art/random';

/** Veil's own palette and type. */
export const V = {
  fog: '#E8EBEE',
  mist: '#D5DBE1',
  paper: '#F5F7F9',
  white: '#FFFFFF',
  ink: '#14171B',
  slate: '#5E6873',
  faint: '#8D96A0',
  line: 'rgba(20,23,27,0.08)',
  lineStrong: 'rgba(20,23,27,0.15)',
  blue: '#2B3BD6',
  blueInk: '#2230B8',
  blueTint: '#E1E4FA',
  red: '#FF4F1F',
  redInk: '#C7380D',
  redTint: '#FFE6DD',
  lilac: '#C9C2F4',
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'Instrument Sans', system-ui, sans-serif",
  mono: "'Fragment Mono', ui-monospace, monospace"
};

/** The eight fingerprint colours. Vermilion and the brand blue are never used. */
export const PRINT = [
  { name: 'teal', hex: '#12897B' },
  { name: 'ochre', hex: '#E6A525' },
  { name: 'violet', hex: '#7B4FD0' },
  { name: 'sky', hex: '#62A8EE' },
  { name: 'rose', hex: '#E78BAE' },
  { name: 'navy', hex: '#1E2F7A' },
  { name: 'moss', hex: '#7FA43A' },
  { name: 'graphite', hex: '#2B3038' }
];

/** Four bar heights, so the fingerprint still reads without colour. */
export const HEIGHTS = [0.4, 0.6, 0.8, 1];
const HEIGHT_NAMES = ['low', 'mid', 'high', 'full'];

const WORDS =
  'acorn alder amber anchor apple arrow aspen badge basil beacon birch bison blossom bramble breeze bridge cabin candle canyon cedar cherry cinder cliff clover cobalt comet copper coral cotton crane crystal daisy dawn delta dune eagle ember falcon fern ferry fjord flint forest fossil garnet ginger glacier granite harbour harvest hazel heron honey iris island ivory jasper juniper kettle kite lagoon lake lantern lemon lichen linen lotus maple marble meadow meteor mint moss moth nectar needle nutmeg oak ocean olive onyx orbit orchard otter oyster paddle pebble pepper pine planet plum prism puffin quartz quill raven reed ridge river robin rowan saffron salmon sapphire shell silver slate sorrel sparrow spruce stone storm summit swan thistle thunder tide timber topaz tulip tundra velvet violet walnut willow winter wren yarrow'.split(
    ' '
  );

export type Bar = { colour: number; height: number };
export type Print = { words: [string, string, string]; bars: Bar[] };

/**
 * Three words and six bars, worked out from the address on the phone. Case is
 * ignored, as it is by the network. Near-identical addresses share nothing.
 */
export function fingerprint(address: string): Print {
  const clean = address.trim().toLowerCase();
  let hash = 0x811c9dc5;
  for (let i = 0; i < clean.length; i++) {
    hash ^= clean.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const random = seeded(hash >>> 0);
  const words: string[] = [];
  while (words.length < 3) {
    const word = WORDS[Math.floor(random() * WORDS.length)];
    if (!words.includes(word)) words.push(word);
  }
  const bars = Array.from({ length: 6 }, () => ({
    colour: Math.floor(random() * PRINT.length),
    height: Math.floor(random() * HEIGHTS.length)
  }));
  return { words: words as Print['words'], bars };
}

/** “teal low, ochre full, …” for screen readers. */
export function describeBars(bars: Bar[]) {
  return bars.map((bar) => `${PRINT[bar.colour].name} ${HEIGHT_NAMES[bar.height]}`).join(', ');
}

export type Contact = {
  name: string;
  initials: string;
  address: string;
  saved: string;
  /** Avatar tint. */
  tint: string;
  last?: string;
};

export const MARI: Contact = {
  name: 'Mari Lunde',
  initials: 'ML',
  address: '0x7a3F9cAe2Ebc735b0B6Cf1120FA5b9fc64E84b2d',
  saved: '12 March',
  tint: '#C9C2F4',
  last: 'Paid 28 Oct · €42,00'
};

export const CONTACTS: Contact[] = [
  MARI,
  {
    name: 'Henrik Aas',
    initials: 'HA',
    address: '0xA536e7a4690900d67D394B0fc8855cFC1da768F2',
    saved: '4 June',
    tint: '#CFE3D9',
    last: 'Paid 19 Oct · kr 650,00'
  },
  {
    name: 'Sunniva Dahl',
    initials: 'SD',
    address: '0x45c7aCbff6e0F7f111e3168a1573b7705C152B63',
    saved: '28 August',
    tint: '#F6D9C9',
    last: 'Paid 2 Oct · €18,50'
  },
  {
    name: 'Jon Kvale',
    initials: 'JK',
    address: '0x77C5Bc1D872C361EEc77279830AF095F0E8bE2Cb',
    saved: '9 January',
    tint: '#D6E2F4',
    last: 'Paid 14 Sep · kr 1 200,00'
  }
];

/** Sent Eline 0,00 EUR at 23:14 last night so it would sit in her history. */
export const POISON = '0x7a3F9c67467e57C5951E8D73871ae2564A6e4b2d';
/** A new address from a QR code on a market stall. */
export const FRESH = '0x5CA1b4Eb48d9f814824C15c614Fb1c915606ECD8';
/** Eline's own new receive address. */
export const RECEIVE = '0xf23Fc906EC875a4504Dd8A1888A08F25dE0Cd09d';

export const short = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

/** Splits an address into groups of four after the 0x, which is how Veil prints them. */
export function groups(address: string) {
  const body = address.slice(2);
  const out = ['0x'];
  for (let i = 0; i < body.length; i += 4) out.push(body.slice(i, i + 4));
  return out;
}

export type Check =
  | { kind: 'empty' }
  | { kind: 'partial'; length: number }
  | { kind: 'invalid'; reason: string }
  | { kind: 'match'; contact: Contact; print: Print }
  | { kind: 'lookalike'; contact: Contact; print: Print; prefix: number; suffix: number; differ: number }
  | { kind: 'new'; print: Print };

/** Compares an address with every saved contact. Runs on the phone; nothing is looked up. */
export function checkAddress(input: string, contacts: Contact[] = CONTACTS): Check {
  const value = input.replace(/\s+/g, '');
  if (!value) return { kind: 'empty' };
  if (!/^0x/i.test(value)) {
    if (/^0?$/.test(value) || value === '0') return { kind: 'partial', length: value.length };
    return { kind: 'invalid', reason: 'Euro and krone addresses start with 0x.' };
  }
  const body = value.slice(2);
  if (/[^0-9a-f]/i.test(body)) {
    const bad = body.match(/[^0-9a-f]/i)?.[0];
    return { kind: 'invalid', reason: `“${bad}” can’t be in an address. They only use 0–9 and a–f.` };
  }
  if (body.length < 40) return { kind: 'partial', length: value.length };
  if (body.length > 40) return { kind: 'invalid', reason: `That’s ${value.length} characters. An address has 42.` };

  const print = fingerprint(value);
  const lower = value.toLowerCase();
  const exact = contacts.find((contact) => contact.address.toLowerCase() === lower);
  if (exact) return { kind: 'match', contact: exact, print };

  let best: { contact: Contact; prefix: number; suffix: number } | undefined;
  for (const contact of contacts) {
    const saved = contact.address.toLowerCase().slice(2);
    const other = lower.slice(2);
    let prefix = 0;
    while (prefix < 40 && saved[prefix] === other[prefix]) prefix++;
    let suffix = 0;
    while (suffix < 40 && saved[39 - suffix] === other[39 - suffix]) suffix++;
    // Wallets show four characters at each end, so that's what attackers copy.
    if (prefix >= 3 && suffix >= 3 && prefix + suffix >= 7 && (!best || prefix + suffix > best.prefix + best.suffix)) {
      best = { contact, prefix, suffix };
    }
  }
  if (best) {
    const saved = best.contact.address.toLowerCase();
    let differ = 0;
    for (let i = 2; i < 42; i++) if (saved[i] !== lower[i]) differ++;
    return { kind: 'lookalike', ...best, print, differ };
  }
  return { kind: 'new', print };
}

/** Balances, in Norwegian formatting. */
export const BALANCE = {
  total: 'kr 88 315,80',
  eur: '€ 2 418,60',
  eurInNok: 'kr 28 297,62',
  nok: 'kr 14 902,00',
  btc: '0,041 20 BTC',
  btcInNok: 'kr 45 116,18'
};
