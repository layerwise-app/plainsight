import type * as React from 'react';
import { seeded } from '~/components/art/random';

/** Marmor Kino's palette and type. */
export const C = {
  marble: '#F1EEE7',
  stone: '#E3DED4',
  black: '#111111',
  graphite: '#2A2826',
  vein: '#8A8378',
  line: 'rgba(17,17,17,0.16)',
  muted: 'rgba(17,17,17,0.58)'
};

export const FONT = {
  title: "'Archivo', 'Arial Narrow', sans-serif",
  text: "'Archivo', system-ui, sans-serif",
  mono: "'Fragment Mono', ui-monospace, monospace"
};

/** The condensed title setting used everywhere: Archivo 800 at 62.5% width. */
export const TITLE_STYLE: React.CSSProperties = {
  fontFamily: FONT.title,
  fontWeight: 800,
  fontStretch: '62.5%',
  textTransform: 'uppercase',
  fontKerning: 'normal',
  fontSynthesis: 'none'
};

export type Month = {
  /** `2024-11` */
  id: string;
  /** Norwegian name, lower case: `november`. */
  name: string;
  en: string;
  year: number;
  colour: string;
  /** Black or marble, whichever reads better on the colour. */
  ink: string;
  /** A short name for the colour, used on the system sheet. */
  label: string;
};

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export const inkFor = (colour: string) => (contrast(colour, C.black) >= contrast(colour, C.marble) ? C.black : C.marble);

const SEASON: [string, string, string, string, string][] = [
  ['2024-09', 'september', 'September', '#2F4C82', 'Fjord'],
  ['2024-10', 'oktober', 'October', '#C2541F', 'Rust'],
  ['2024-11', 'november', 'November', '#7A1F1A', 'Oxblood'],
  ['2024-12', 'desember', 'December', '#1F4B3F', 'Spruce'],
  ['2025-01', 'januar', 'January', '#F2C230', 'Signal'],
  ['2025-02', 'februar', 'February', '#A9C3D6', 'Ice'],
  ['2025-03', 'mars', 'March', '#4A2F6E', 'Heather'],
  ['2025-04', 'april', 'April', '#E79AA0', 'Rhubarb'],
  ['2025-05', 'mai', 'May', '#5F8C3A', 'Birch'],
  ['2025-06', 'juni', 'June', '#2C8DB3', 'Sound'],
  ['2025-07', 'juli', 'July', '#D9432B', 'Tomato'],
  ['2025-08', 'august', 'August', '#B98A2E', 'Ochre']
];

/** The 2024–25 season: one colour a month. */
export const MONTHS: Month[] = SEASON.map(([id, name, en, colour, label]) => ({
  id,
  name,
  en,
  year: Number(id.slice(0, 4)),
  colour,
  ink: inkFor(colour),
  label
}));

export const month = (id: string) => MONTHS.find((m) => m.id === id) ?? MONTHS[2];
export const NOV = month('2024-11');
export const DEC = month('2024-12');
export const JAN = month('2025-01');

export type StillKind = 'sun' | 'orchard' | 'ferro' | 'city' | 'water' | 'forest' | 'noon' | 'window' | 'wharf' | 'fox';

export type Screening = { date: string; time: string; sal: 1 | 2 };

export type Film = {
  id: string;
  title: string;
  director: string;
  country: string;
  year: number;
  runtime: number;
  language: string;
  rating: string;
  still: StillKind;
  month: string;
  /** Its number in the month's programme, out of `total`. */
  number: number;
  total: number;
  tag?: string;
  format?: string;
  screenings: Screening[];
};

export const FILMS: Record<string, Film> = {
  kveldssol: {
    id: 'kveldssol',
    title: 'Kveldssol',
    director: 'Ingeborg Raa',
    country: 'Norge',
    year: 2024,
    runtime: 104,
    language: 'Norsk tale, engelsk tekst',
    rating: '9 år',
    still: 'sun',
    month: '2024-11',
    number: 7,
    total: 41,
    tag: 'Premiere',
    screenings: [
      { date: '2024-11-15', time: '18:30', sal: 1 },
      { date: '2024-11-16', time: '21:00', sal: 1 },
      { date: '2024-11-17', time: '16:00', sal: 2 },
      { date: '2024-11-19', time: '19:00', sal: 1 }
    ]
  },
  glass: {
    id: 'glass',
    title: 'The Glass Orchard',
    director: 'Tomasz Wierzba',
    country: 'Polen',
    year: 2023,
    runtime: 118,
    language: 'Polsk tale, norsk tekst',
    rating: '12 år',
    still: 'orchard',
    month: '2024-11',
    number: 12,
    total: 41,
    screenings: [
      { date: '2024-11-12', time: '19:30', sal: 1 },
      { date: '2024-11-14', time: '17:00', sal: 2 },
      { date: '2024-11-23', time: '18:00', sal: 1 },
      { date: '2024-11-27', time: '20:15', sal: 1 }
    ]
  },
  ferro: {
    id: 'ferro',
    title: 'Ferro',
    director: 'Lucía Benavente',
    country: 'Argentina',
    year: 2024,
    runtime: 89,
    language: 'Spansk tale, norsk tekst',
    rating: '15 år',
    still: 'ferro',
    month: '2024-11',
    number: 15,
    total: 41,
    screenings: [
      { date: '2024-11-12', time: '21:00', sal: 2 },
      { date: '2024-11-16', time: '23:15', sal: 2 },
      { date: '2024-11-22', time: '21:30', sal: 1 },
      { date: '2024-11-28', time: '19:00', sal: 2 }
    ]
  },
  tbilisi: {
    id: 'tbilisi',
    title: 'A Winter in Tbilisi',
    director: 'Nino Abashidze',
    country: 'Georgia',
    year: 2023,
    runtime: 97,
    language: 'Georgisk tale, norsk tekst',
    rating: '12 år',
    still: 'city',
    month: '2024-11',
    number: 21,
    total: 41,
    screenings: [
      { date: '2024-11-12', time: '17:00', sal: 1 },
      { date: '2024-11-13', time: '20:45', sal: 2 },
      { date: '2024-11-20', time: '18:30', sal: 1 },
      { date: '2024-11-30', time: '15:00', sal: 1 }
    ]
  },
  ondine: {
    id: 'ondine',
    title: 'Ondine Sleeps',
    director: 'Claire Moreau-Diallo',
    country: 'Frankrike',
    year: 2024,
    runtime: 92,
    language: 'Fransk tale, norsk tekst',
    rating: '15 år',
    still: 'water',
    month: '2024-11',
    number: 9,
    total: 41,
    screenings: [
      { date: '2024-11-12', time: '21:45', sal: 1 },
      { date: '2024-11-18', time: '19:00', sal: 2 }
    ]
  },
  hvitnatt: {
    id: 'hvitnatt',
    title: 'Hvit natt',
    director: 'Ruth Halvorsen',
    country: 'Norge',
    year: 1964,
    runtime: 88,
    language: 'Norsk tale',
    rating: 'Tillatt for alle',
    still: 'window',
    month: '2024-11',
    number: 3,
    total: 41,
    tag: 'Ruth Halvorsen, 1961–1979',
    format: '35 mm',
    screenings: [
      { date: '2024-11-12', time: '18:15', sal: 2 },
      { date: '2024-11-24', time: '14:00', sal: 2 }
    ]
  },
  bryggen: {
    id: 'bryggen',
    title: 'Bryggen',
    director: 'Ruth Halvorsen',
    country: 'Norge',
    year: 1971,
    runtime: 95,
    language: 'Norsk tale',
    rating: '12 år',
    still: 'wharf',
    month: '2024-11',
    number: 4,
    total: 41,
    tag: 'Ruth Halvorsen, 1961–1979',
    format: '35 mm',
    screenings: [{ date: '2024-11-13', time: '18:00', sal: 2 }]
  },
  reven: {
    id: 'reven',
    title: 'Reven som telte stjerner',
    director: 'Hana Novotná',
    country: 'Tsjekkia',
    year: 2022,
    runtime: 72,
    language: 'Norsk tale',
    rating: 'Tillatt for alle',
    still: 'fox',
    month: '2024-11',
    number: 30,
    total: 41,
    tag: 'Barnekino',
    screenings: [{ date: '2024-11-16', time: '12:00', sal: 1 }]
  },
  longlight: {
    id: 'longlight',
    title: 'Long Light',
    director: 'Hanne Vik',
    country: 'Norge, Island',
    year: 2024,
    runtime: 121,
    language: 'Norsk og islandsk tale, engelsk tekst',
    rating: '12 år',
    still: 'forest',
    month: '2024-12',
    number: 5,
    total: 38,
    tag: 'Premiere',
    screenings: [
      { date: '2024-12-06', time: '18:30', sal: 1 },
      { date: '2024-12-07', time: '20:45', sal: 1 },
      { date: '2024-12-08', time: '15:00', sal: 2 },
      { date: '2024-12-11', time: '19:15', sal: 1 }
    ]
  },
  mediodia: {
    id: 'mediodia',
    title: 'Mediodía',
    director: 'Ana Ruiz Calvo',
    country: 'Spania',
    year: 2024,
    runtime: 99,
    language: 'Spansk tale, norsk tekst',
    rating: '12 år',
    still: 'noon',
    month: '2025-01',
    number: 2,
    total: 40,
    screenings: [
      { date: '2025-01-10', time: '19:00', sal: 1 },
      { date: '2025-01-11', time: '17:00', sal: 1 },
      { date: '2025-01-12', time: '20:30', sal: 2 },
      { date: '2025-01-16', time: '18:00', sal: 1 }
    ]
  }
};

const DAYS = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];
const DAYS_LONG = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
const MONTH_NAMES = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];

function parts(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return { y, m, d, weekday: new Date(Date.UTC(y || 2024, (m || 1) - 1, d || 1)).getUTCDay() };
}

/** `fre 15.11` */
export function shortDate(date: string) {
  const { m, d, weekday } = parts(date);
  if (!m || !d) return '';
  return `${DAYS[weekday]} ${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}`;
}

/** `fredag 15. november` */
export function longDate(date: string) {
  const { m, d, weekday } = parts(date);
  return `${DAYS_LONG[weekday]} ${d}. ${MONTH_NAMES[m - 1]}`;
}

export const weekday = (date: string) => DAYS[parts(date).weekday];

/** Every film in November 2024, for the month poster and the booklet. */
export const NOVEMBER_TITLES: [string, string, string, number, number][] = [
  ['Lanternen', 'Ruth Halvorsen', 'Norge', 1961, 84],
  ['Hvit natt', 'Ruth Halvorsen', 'Norge', 1964, 88],
  ['Søstrene', 'Ruth Halvorsen', 'Norge', 1968, 102],
  ['Bryggen', 'Ruth Halvorsen', 'Norge', 1971, 95],
  ['Kald kyst', 'Ruth Halvorsen', 'Norge', 1975, 91],
  ['Etter regnet', 'Ruth Halvorsen', 'Norge', 1979, 109],
  ['Kveldssol', 'Ingeborg Raa', 'Norge', 2024, 104],
  ['Paper Moons', 'Eszter Halász', 'Ungarn', 2024, 101],
  ['Ondine Sleeps', 'Claire Moreau-Diallo', 'Frankrike', 2024, 92],
  ['The Quiet Hours', 'Rhian Pryce', 'Storbritannia', 2023, 94],
  ['Salt and Iron', 'Baek Joon-ho', 'Sør-Korea', 2024, 126],
  ['The Glass Orchard', 'Tomasz Wierzba', 'Polen', 2023, 118],
  ['Copper Sky', 'Marisol Ortega', 'Mexico', 2024, 108],
  ['Hijos del viento', 'Tomás Ibarra', 'Chile', 2023, 115],
  ['Ferro', 'Lucía Benavente', 'Argentina', 2024, 89],
  ['Mira', 'Leyla Karimi', 'Iran', 2024, 87],
  ['Night Bus to Kraków', 'Piotr Zawada', 'Polen', 2024, 99],
  ['Atlas of Small Things', 'Jun Takeda', 'Japan', 2023, 112],
  ['Hotel Meridian', 'Sofia Lindgren', 'Sverige', 2024, 103],
  ['Tidevann', 'Ola Brekke', 'Norge', 2024, 81],
  ['A Winter in Tbilisi', 'Nino Abashidze', 'Georgia', 2023, 97],
  ['Under the Linden', 'Klara Vogt', 'Tyskland', 2023, 119],
  ['Seven Bridges', 'Aino Mäkelä', 'Finland', 2024, 96],
  ['The Cartographer’s Son', 'Darius Aziz', 'Danmark', 2024, 110],
  ['Ilha', 'Beatriz Couto', 'Portugal', 2023, 93],
  ['Moth Season', 'Grace Okafor', 'Nigeria', 2024, 102],
  ['The Long Table', 'Vittoria Sala', 'Italia', 2024, 128],
  ['Blue Hour Radio', 'Sam Whitlock', 'USA', 2024, 91],
  ['Margins', 'Elif Durmaz', 'Tyrkia', 2023, 106],
  ['Reven som telte stjerner', 'Hana Novotná', 'Tsjekkia', 2022, 72],
  ['Ulla og havet', 'Mette Friis', 'Danmark', 2023, 68],
  ['Marrow', 'Ida Krogh', 'Danmark', 2024, 98],
  ['Orangery', 'Anouk de Wit', 'Nederland', 2024, 90],
  ['Lowlands', 'Pieter Claes', 'Belgia', 2024, 105],
  ['Northbound', 'Ellen Rask', 'Norge', 2023, 86],
  ['A Year of Rain', 'Nguyen Mai', 'Vietnam', 2024, 117],
  ['The Tenant Upstairs', 'Ana Lukić', 'Serbia', 2024, 94],
  ['Fjellets datter', 'Harald Mo', 'Norge', 1926, 74],
  ['Kortfilm: Vestland', 'Ni regissører', 'Norge', 2024, 80],
  ['Quiet Engines', 'Tove Brandt', 'Sverige', 2024, 100],
  ['Saltvann', 'Kristin Lie', 'Norge', 2024, 95]
];

export type Slot = { date: string; time: string; sal: 1 | 2; title: string; note?: string };

/** A deterministic month of screenings, with the named films where the case study shows them. */
export function novemberProgramme(): Slot[] {
  const random = seeded(1938);
  const fixed: Slot[] = Object.values(FILMS)
    .filter((film) => film.month === '2024-11')
    .flatMap((film) => film.screenings.map((s) => ({ ...s, title: film.title, note: film.tag })));
  fixed.push({ date: '2024-11-13', time: '20:00', sal: 1, title: 'Kveldssol', note: 'Førpremiere for medlemmer' });
  const slots: Slot[] = [...fixed];
  for (let day = 1; day <= 30; day++) {
    const date = `2024-11-${String(day).padStart(2, '0')}`;
    const wd = parts(date).weekday;
    const times: [string, 1 | 2][] = [
      ['17:30', 1],
      ['18:15', 2],
      ['20:00', 1],
      ['20:45', 2]
    ];
    if (wd === 5 || wd === 6) times.push(['22:30', 1]);
    if (wd === 6 || wd === 0) times.unshift(['14:00', 1]);
    for (const [time, sal] of times) {
      const taken = fixed.some((slot) => slot.date === date && slot.sal === sal && Math.abs(toMinutes(slot.time) - toMinutes(time)) < 100);
      if (taken) continue;
      const pick = NOVEMBER_TITLES[Math.floor(random() * NOVEMBER_TITLES.length)];
      slots.push({ date, time, sal, title: pick[0] });
    }
  }
  return slots.sort((a, b) => a.date.localeCompare(b.date) || toMinutes(a.time) - toMinutes(b.time));
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** November 2024, every screening. */
export const NOVEMBER = novemberProgramme();

const KINDS: StillKind[] = ['sun', 'orchard', 'ferro', 'city', 'water', 'forest', 'noon', 'window', 'wharf'];

/** What the programme knows about a title, named film or not. */
export function filmInfo(title: string) {
  const named = Object.values(FILMS).find((film) => film.title === title);
  if (named) return named;
  const entry = NOVEMBER_TITLES.find(([name]) => name === title) ?? NOVEMBER_TITLES[0];
  const hash = [...title].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    title,
    director: entry[1],
    country: entry[2],
    year: entry[3],
    runtime: entry[4],
    language: '',
    still: KINDS[hash % KINDS.length],
    format: entry[3] < 1990 ? '35 mm' : undefined
  };
}
