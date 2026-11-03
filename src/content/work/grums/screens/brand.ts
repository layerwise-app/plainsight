import type * as React from 'react';
/** Grums's own palette, type and catalogue. */
export const G = {
  espresso: '#2A1911',
  tomato: '#E2432C',
  cream: '#F3EBDC',
  paper: '#FBF6EE',
  kraft: '#C8A273',
  green: '#6E7B4E',
  ink: '#2A1911',
  muted: 'rgba(42,25,17,0.62)',
  faint: 'rgba(42,25,17,0.4)',
  line: 'rgba(42,25,17,0.14)',
  lineStrong: 'rgba(42,25,17,0.28)',
  display: "'Fraunces', Georgia, serif",
  sans: "'Work Sans', system-ui, sans-serif"
};

/** Fraunces with its soft, wonky display cut. */
export const wonk = (opsz = 144, soft = 100, wonky = 1) =>
  `"opsz" ${opsz}, "SOFT" ${soft}, "WONK" ${wonky}`;

export const displayStyle = (weight = 800, opsz = 144, soft = 100): React.CSSProperties => ({
  fontFamily: G.display,
  fontWeight: weight,
  fontVariationSettings: wonk(opsz, soft, 1)
});

export type Roast = 'light' | 'medium' | 'dark' | 'decaf';
export type Size = 250 | 500 | 1000;

export const ROASTS: Record<
  Roast,
  {
    label: string;
    bag: string;
    /** Colour the bag is printed in. */
    print: string;
    swatch: string;
    coffee: string;
    origin: string;
    region: string;
    country: string;
    producer: string;
    variety: string;
    process: string;
    notes: string;
    price: Record<Size, number>;
  }
> = {
  light: {
    label: 'Light',
    bag: G.kraft,
    print: G.espresso,
    swatch: 'Kraft',
    coffee: 'Karindi',
    origin: 'Nyeri, Kenya',
    region: 'Nyeri',
    country: 'Kenya',
    producer: 'Karindi Farmers’ Cooperative',
    variety: 'SL28, SL34',
    process: 'Washed',
    notes: 'Blackcurrant, grapefruit, cane sugar',
    price: { 250: 169, 500: 309, 1000: 569 }
  },
  medium: {
    label: 'Medium',
    bag: G.tomato,
    print: G.cream,
    swatch: 'Tomato',
    coffee: 'La Pradera',
    origin: 'Huila, Colombia',
    region: 'Huila',
    country: 'Colombia',
    producer: 'Finca La Pradera, Ortiz family',
    variety: 'Caturra, Castillo',
    process: 'Washed',
    notes: 'Red apple, panela, milk chocolate',
    price: { 250: 149, 500: 269, 1000: 489 }
  },
  dark: {
    label: 'Dark',
    bag: G.espresso,
    print: G.cream,
    swatch: 'Espresso',
    coffee: 'Três Pedras',
    origin: 'Sul de Minas, Brazil',
    region: 'Sul de Minas',
    country: 'Brazil',
    producer: 'Fazenda Três Pedras',
    variety: 'Yellow Catuaí',
    process: 'Natural',
    notes: 'Cocoa, hazelnut, molasses',
    price: { 250: 139, 500: 249, 1000: 449 }
  },
  decaf: {
    label: 'Decaf',
    bag: G.green,
    print: G.cream,
    swatch: 'Green',
    coffee: 'El Recreo',
    origin: 'Tolima, Colombia',
    region: 'Tolima',
    country: 'Colombia',
    producer: 'Finca El Recreo',
    variety: 'Castillo',
    process: 'Sugarcane decaf',
    notes: 'Toffee, orange, oats',
    price: { 250: 159, 500: 289, 1000: 529 }
  }
};

export const ROAST_ORDER: Roast[] = ['light', 'medium', 'dark', 'decaf'];

export type Method = 'filter' | 'espresso' | 'cafetiere' | 'moka';

export const METHODS: Record<Method, { label: string; grams: number; cup: string; guide: string; roast: Roast }> = {
  filter: { label: 'Filter', grams: 15, cup: 'a 250 ml mug', guide: '15 g to 250 ml, 94°C', roast: 'light' },
  espresso: { label: 'Espresso', grams: 18, cup: 'a double shot', guide: '18 g in, 36 g out, 28 s', roast: 'medium' },
  cafetiere: { label: 'Cafetière', grams: 17, cup: 'a 280 ml cup', guide: '17 g to 280 ml, 4 min', roast: 'medium' },
  moka: { label: 'Moka pot', grams: 14, cup: 'a 3-cup pot', guide: '14 g, 3-cup pot, low heat', roast: 'dark' }
};

export const METHOD_ORDER: Method[] = ['filter', 'espresso', 'cafetiere', 'moka'];

/** A roast date on the fixed Grums calendar, which starts on Monday 4 November 2024. */
export type Day = { iso: string; dd: string; mm: string; day: number; weekday: string; wd: string; month: string; mon: string; year: number };

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Days after Monday 4 November 2024. Uses UTC so every machine agrees. */
export function day(offset: number): Day {
  const date = new Date(Date.UTC(2024, 10, 4 + offset));
  const d = date.getUTCDate();
  const m = date.getUTCMonth();
  const w = date.getUTCDay();
  return {
    iso: date.toISOString().slice(0, 10),
    dd: String(d).padStart(2, '0'),
    mm: String(m + 1).padStart(2, '0'),
    day: d,
    weekday: WEEKDAYS[w],
    wd: WEEKDAYS[w].slice(0, 3),
    month: MONTHS[m],
    mon: MONTHS[m].slice(0, 3),
    year: date.getUTCFullYear()
  };
}

/** “Mon 4 Nov” */
export const short = (d: Day) => `${d.wd} ${d.day} ${d.mon}`;

/** Norwegian kroner, the way Grums prints them: “1 289 kr”, “9,70 kr”. */
export function kr(value: number, decimals = 0) {
  const fixed = value.toFixed(decimals);
  const [whole, part] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${grouped}${part ? `,${part}` : ''} kr`;
}

export const grams = (value: number) => (value >= 1000 && value % 1000 === 0 ? `${value / 1000} kg` : `${value} g`);
