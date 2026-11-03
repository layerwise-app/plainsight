import type * as React from 'react';

/** Kvarter's own palette and type. One family, Bricolage Grotesque, in two widths. */
export const K = {
  brick: '#C24E2C',
  brickDeep: '#9E3B1F',
  brickSoft: '#F1D9CC',
  paper: '#F3ECE1',
  card: '#FBF8F2',
  paperDeep: '#E7DDCC',
  dusk: '#1E2944',
  duskSoft: '#2C3858',
  yellow: '#FFC857',
  yellowSoft: '#FFEDC2',
  moss: '#3E6B4E',
  mossSoft: '#DCE6D9',
  ink: '#1E2944',
  muted: '#676C7B',
  faint: '#9E9EA2',
  line: 'rgba(30,41,68,0.11)',
  lineStrong: 'rgba(30,41,68,0.2)',
  sans: "'Bricolage Grotesque', system-ui, sans-serif"
};

/** Condensed heavy headings: Bricolage at 75% width. */
export const head = (size: number, weight = 760, stretch = 75): React.CSSProperties => ({
  fontFamily: K.sans,
  fontSize: size,
  fontWeight: weight,
  fontStretch: `${stretch}%`,
  lineHeight: 0.96,
  letterSpacing: size > 30 ? '-0.018em' : '-0.008em'
});

/** Small caps-like labels: condensed, semibold, spaced. */
export const label = (size = 11.5, color = K.muted): React.CSSProperties => ({
  fontFamily: K.sans,
  fontSize: size,
  fontWeight: 600,
  fontStretch: '82%',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color
});

export const CO_OP = {
  name: 'Fjellhagen',
  full: 'Fjellhagen borettslag',
  flats: 64,
  built: 1962,
  address: 'Fjellhagen 12, Oslo'
};

/** The resident whose phone we are looking at. */
export const ME = { flat: 'H0204', name: 'Ida Berg', first: 'Ida' };

/**
 * Residents who chose to show their name. Everyone else appears by flat
 * number only, which is the default.
 */
export const NAMED: Record<string, string> = {
  H0101: 'Tone Bakke',
  H0106: 'Silje Aas',
  H0208: 'Amira Haddad',
  H0214: 'Hanne Sæther',
  H0303: 'Kristian Moe',
  H0312: 'Bjørn Tveit',
  H0410: 'Per Ivar Lunde'
};

export const firstName = (flat: string) => NAMED[flat]?.split(' ')[0];

/** “Silje · H0106”, or just “H0302”. */
export const who = (flat: string) => (NAMED[flat] ? `${firstName(flat)} · ${flat}` : flat);

const AVATAR = [K.brick, K.moss, K.dusk, '#B07A2A', '#6A4C7A', '#2F6F78'];
export const avatarColor = (flat: string) =>
  AVATAR[[...flat].reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR.length];

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

/** The week the booking demo shows: Monday 27 April to Sunday 3 May 2026. */
export const WEEK = [
  { short: 'Mon', name: 'Monday', date: 27, month: 'April' },
  { short: 'Tue', name: 'Tuesday', date: 28, month: 'April' },
  { short: 'Wed', name: 'Wednesday', date: 29, month: 'April' },
  { short: 'Thu', name: 'Thursday', date: 30, month: 'April' },
  { short: 'Fri', name: 'Friday', date: 1, month: 'May' },
  { short: 'Sat', name: 'Saturday', date: 2, month: 'May' },
  { short: 'Sun', name: 'Sunday', date: 3, month: 'May' }
] as const;

export const dayFull = (day: number) => `${WEEK[day].name} ${WEEK[day].date} ${WEEK[day].month}`;

export const pad = (hour: number) => String(hour).padStart(2, '0');
