import { NAMED, WEEK, dayFull, firstName, pad } from './model';

export type ResourceId = 'laundry' | 'guest' | 'bike';

export type Resource = {
  id: ResourceId;
  name: string;
  short: string;
  place: string;
  unit: 'hour' | 'slot' | 'night';
  slots: { start: number; end: number }[];
  rules: string[];
};

export const RESOURCES: Resource[] = [
  {
    id: 'laundry',
    name: 'Laundry room 1',
    short: 'Laundry 1',
    place: 'Basement, number 12',
    unit: 'hour',
    slots: Array.from({ length: 15 }, (_, i) => ({ start: 7 + i, end: 8 + i })),
    rules: ['Open 07–22, every day', 'Two hours a day per flat', 'Clean the lint filter when you’re done']
  },
  {
    id: 'guest',
    name: 'Guest flat',
    short: 'Guest flat',
    place: 'Ground floor, number 14',
    unit: 'night',
    slots: [{ start: 15, end: 12 }],
    rules: ['Up to three nights per stay', '350 kr a night, on your common costs', 'Check in from 15:00, out by 12:00']
  },
  {
    id: 'bike',
    name: 'Cargo bike',
    short: 'Cargo bike',
    place: 'Bike shed by the playground',
    unit: 'slot',
    slots: [
      { start: 8, end: 12 },
      { start: 12, end: 16 },
      { start: 16, end: 20 }
    ],
    rules: ['Four-hour slots, 08–20', 'One slot a day per flat', 'The lock code arrives 15 minutes before']
  }
];

export const resourceById = (id: ResourceId) => RESOURCES.find((resource) => resource.id === id) as Resource;

export const key = (day: number, slot: number) => `${day}:${slot}`;

/** Neighbours' bookings for the week, by flat number. */
const runs = (list: [day: number, from: number, to: number, flat: string][]) => {
  const out: Record<string, string> = {};
  for (const [day, from, to, flat] of list) for (let slot = from; slot < to; slot++) out[key(day, slot)] = flat;
  return out;
};

/** Laundry slots are hours from 07: slot 0 is 07–08, slot 11 is 18–19. */
const h = (hour: number) => hour - 7;

export const TAKEN: Record<ResourceId, Record<string, string>> = {
  laundry: runs([
    [0, h(7), h(9), 'H0312'],
    [0, h(9), h(10), 'H0103'],
    [0, h(11), h(13), 'H0407'],
    [0, h(17), h(19), 'H0106'],
    [0, h(19), h(21), 'H0211'],
    [1, h(7), h(9), 'H0402'],
    [1, h(13), h(15), 'H0115'],
    [1, h(16), h(18), 'H0309'],
    [1, h(18), h(20), 'H0208'],
    [1, h(20), h(22), 'H0104'],
    [2, h(8), h(10), 'H0410'],
    [2, h(10), h(11), 'H0301'],
    [2, h(14), h(16), 'H0213'],
    [2, h(16), h(18), 'H0102'],
    [2, h(20), h(21), 'H0405'],
    [3, h(7), h(8), 'H0216'],
    [3, h(9), h(11), 'H0312'],
    [3, h(12), h(14), 'H0109'],
    [3, h(17), h(19), 'H0404'],
    [3, h(19), h(21), 'H0306'],
    [4, h(10), h(12), 'H0106'],
    [4, h(12), h(13), 'H0411'],
    [4, h(15), h(17), 'H0201'],
    [4, h(18), h(20), 'H0110'],
    [5, h(8), h(10), 'H0302'],
    [5, h(12), h(14), 'H0208'],
    [5, h(14), h(16), 'H0414'],
    [5, h(16), h(18), 'H0105'],
    [5, h(19), h(21), 'H0310'],
    [6, h(9), h(11), 'H0407'],
    [6, h(11), h(13), 'H0203'],
    [6, h(13), h(15), 'H0214'],
    [6, h(15), h(17), 'H0116'],
    [6, h(17), h(19), 'H0101']
  ]),
  guest: runs([
    [0, 0, 1, 'H0313'],
    [1, 0, 1, 'H0313'],
    [6, 0, 1, 'H0101']
  ]),
  bike: runs([
    [0, 0, 1, 'H0109'],
    [0, 2, 3, 'H0306'],
    [1, 1, 2, 'H0208'],
    [2, 0, 1, 'H0405'],
    [2, 2, 3, 'H0114'],
    [3, 1, 2, 'H0302'],
    [4, 0, 1, 'H0106'],
    [4, 1, 2, 'H0211'],
    [5, 0, 1, 'H0410'],
    [5, 1, 2, 'H0213'],
    [5, 2, 3, 'H0402'],
    [6, 1, 2, 'H0105']
  ])
};

/** What you have booked when the page opens. */
export const INITIAL_MINE: Record<ResourceId, string[]> = {
  laundry: [key(5, h(10)), key(5, h(11))],
  guest: [],
  bike: []
};

/** It is Monday 27 April, 09:40. */
const NOW = { day: 0, hour: 9.67 };

export type CellKind = 'free' | 'mine' | 'taken' | 'past' | 'closed' | 'limit';
export type Cell = { kind: CellKind; flat?: string; now?: boolean; reason?: string };

const mineOn = (mine: string[], day: number) => mine.filter((k) => Number(k.split(':')[0]) === day).map((k) => Number(k.split(':')[1]));
const nights = (mine: string[]) => mine.map((k) => Number(k.split(':')[0])).sort((a, b) => a - b);

export function cellAt(resource: Resource, day: number, slot: number, mine: string[]): Cell {
  const k = key(day, slot);
  const range = resource.slots[slot];
  if (resource.id === 'laundry' && day === 1 && range.start >= 9 && range.start < 12) return { kind: 'closed', reason: 'water' };
  const flat = TAKEN[resource.id][k];
  const started = day < NOW.day || (day === NOW.day && range.start < NOW.hour && resource.unit !== 'night');
  const running = day === NOW.day && range.start <= NOW.hour && range.end > NOW.hour;
  if (mine.includes(k)) return { kind: 'mine' };
  if (flat) return { kind: started && !running ? 'past' : 'taken', flat, now: running };
  if (started) return { kind: 'past' };
  if (resource.id === 'laundry' && mineOn(mine, day).length >= 2) return { kind: 'limit', reason: 'Two a day' };
  if (resource.id === 'bike' && mineOn(mine, day).length >= 1) return { kind: 'limit', reason: 'One a day' };
  if (resource.id === 'guest' && mine.length) {
    const stay = nights(mine);
    const adjacent = day === stay[0] - 1 || day === stay[stay.length - 1] + 1;
    if (!adjacent) return { kind: 'limit', reason: 'One stay' };
    if (stay.length >= 3) return { kind: 'limit', reason: '3 nights max' };
  }
  return { kind: 'free' };
}

/** “18–20”, or for nights “Wed–Fri”. */
export const span = (resource: Resource, from: number, to: number) =>
  `${pad(resource.slots[from].start)}–${pad(resource.slots[to].end)}`;

/** Contiguous runs of slots, as [from, to] inclusive. */
function groups(slots: number[]) {
  const sorted = [...slots].sort((a, b) => a - b);
  const out: [number, number][] = [];
  for (const slot of sorted) {
    const last = out[out.length - 1];
    if (last && slot === last[1] + 1) last[1] = slot;
    else out.push([slot, slot]);
  }
  return out;
}

const listJoin = (items: string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** “Amira, H0208” or “H0302”. */
export const whoLong = (flat: string) => (NAMED[flat] ? `${firstName(flat)}, ${flat}` : flat);

const checkout = (day: number) => (day + 1 < WEEK.length ? dayFull(day + 1) : 'Monday 4 May');

function stayText(stay: number[]) {
  const count = stay.length;
  return `The guest flat is yours from ${dayFull(stay[0])} to ${checkout(stay[count - 1])}. ${count} night${count > 1 ? 's' : ''}, ${count * 350} kr on your next common costs.`;
}

/** The sentence shown before anyone has pressed anything. */
export function summary(resource: Resource, mine: string[]) {
  if (resource.id === 'guest') return mine.length ? stayText(nights(mine)) : 'No stay booked this week. Pick up to three nights in a row.';
  if (!mine.length) {
    return resource.id === 'bike' ? 'Pick a four-hour slot. One a day per flat, so everyone gets a turn.' : 'Pick a free hour. You can book two a day.';
  }
  const byDay = new Map<number, number[]>();
  for (const k of mine) {
    const [day, slot] = k.split(':').map(Number);
    byDay.set(day, [...(byDay.get(day) ?? []), slot]);
  }
  const parts = [...byDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([day, slots]) => `${dayFull(day)}, ${listJoin(groups(slots).map(([a, b]) => span(resource, a, b)))}`);
  return `${resource.name} is yours on ${listJoin(parts)}.`;
}

export type Outcome = { mine: string[]; message: string; tone: 'booked' | 'cancelled' | 'blocked' | 'info' };

/** Pressing a cell: book it, cancel it, or say why not. */
export function press(resource: Resource, day: number, slot: number, mine: string[]): Outcome {
  const cell = cellAt(resource, day, slot, mine);
  const k = key(day, slot);
  const range = resource.slots[slot];
  const when = resource.unit === 'night' ? `The night of ${dayFull(day)}` : `${pad(range.start)}–${pad(range.end)} on ${dayFull(day)}`;

  switch (cell.kind) {
    case 'closed':
      return { mine, tone: 'info', message: 'The water is off on Tuesday from 09 to 12, so the laundry room is closed. Styret’s notice has the details.' };
    case 'past':
      return { mine, tone: 'info', message: resource.unit === 'hour' ? 'That hour has passed.' : 'That slot has already started.' };
    case 'taken': {
      const theirs = Object.entries(TAKEN[resource.id])
        .filter(([other, flat]) => flat === cell.flat && Number(other.split(':')[0]) === day)
        .map(([other]) => Number(other.split(':')[1]));
      const run = groups(theirs).find(([a, b]) => slot >= a && slot <= b) ?? [slot, slot];
      const what =
        resource.unit === 'night'
          ? `The night of ${dayFull(day)}`
          : `${span(resource, run[0], run[1])} on ${dayFull(day)}`;
      return { mine, tone: 'info', message: `${what} is booked by ${whoLong(cell.flat as string)}.` };
    }
    case 'limit': {
      if (resource.id === 'laundry')
        return { mine, tone: 'blocked', message: `You already have two hours on ${dayFull(day)}. Cancel one to book this.` };
      if (resource.id === 'bike')
        return { mine, tone: 'blocked', message: `You have the cargo bike on ${dayFull(day)} already. One slot a day per flat.` };
      return cell.reason === '3 nights max'
        ? { mine, tone: 'blocked', message: 'Stays are three nights at most, so the next family can have it too.' }
        : { mine, tone: 'blocked', message: 'One stay at a time. Pick a night next to your stay, or cancel it first.' };
    }
    case 'mine': {
      if (resource.id === 'guest') {
        const stay = nights(mine);
        const kept = day === stay[0] ? stay.slice(1) : stay.filter((night) => night < day);
        const next = kept.map((night) => key(night, 0));
        return next.length
          ? { mine: next, tone: 'cancelled', message: `Changed. ${stayText(kept)}` }
          : { mine: next, tone: 'cancelled', message: 'Your stay is cancelled. Nothing to pay.' };
      }
      const next = mine.filter((other) => other !== k);
      const left = groups(mineOn(next, day));
      const still = left.length ? ` You still have ${listJoin(left.map(([a, b]) => span(resource, a, b)))}.` : '';
      return { mine: next, tone: 'cancelled', message: `Cancelled ${when}.${still}` };
    }
    case 'free': {
      const next = [...mine, k];
      if (resource.id === 'guest') return { mine: next, tone: 'booked', message: stayText(nights(next)) };
      const run = groups(mineOn(next, day)).find(([a, b]) => slot >= a && slot <= b) ?? [slot, slot];
      const subject = resource.id === 'bike' ? 'The cargo bike' : resource.name;
      const extra = resource.id === 'bike' ? ' The lock code arrives 15 minutes before.' : '';
      return { mine: next, tone: 'booked', message: `${subject} is yours on ${dayFull(day)}, ${span(resource, run[0], run[1])}.${extra}` };
    }
  }
}

/** Accessible name for a cell. */
export function cellLabel(resource: Resource, day: number, slot: number, cell: Cell) {
  const range = resource.slots[slot];
  const when = resource.unit === 'night' ? `Night of ${dayFull(day)}` : `${dayFull(day)}, ${pad(range.start)}:00 to ${pad(range.end)}:00`;
  const state = {
    free: 'free',
    mine: 'yours, press to cancel',
    taken: `booked by ${cell.flat ? whoLong(cell.flat) : 'a neighbour'}`,
    past: 'past',
    closed: 'closed, water off',
    limit:
      resource.id === 'laundry'
        ? 'free, but you have two hours that day'
        : resource.id === 'bike'
          ? 'free, but you have a slot that day'
          : cell.reason === '3 nights max'
            ? 'free, but stays are three nights at most'
            : 'free, but not next to your stay'
  }[cell.kind];
  return `${when}, ${state}`;
}

export function freeCount(resource: Resource, mine: string[]) {
  let count = 0;
  for (let day = 0; day < 7; day++)
    for (let slot = 0; slot < resource.slots.length; slot++) {
      const kind = cellAt(resource, day, slot, mine).kind;
      if (kind === 'free' || kind === 'limit') count++;
    }
  return count;
}
