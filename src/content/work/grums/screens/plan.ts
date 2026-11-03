import { type Day, type Method, type Roast, type Size, METHODS, ROASTS, day } from './brand';

export type Answers = { cups: number; people: number; method: Method; roast: Roast };

export const DEFAULT_ANSWERS: Answers = { cups: 2, people: 2, method: 'cafetiere', roast: 'medium' };

export type Plan = {
  size: Size;
  count: number;
  /** Weeks between deliveries. */
  weeks: number;
  /** Grams the household drinks in a week. */
  perWeek: number;
  gramsPerCup: number;
  /** How many days one delivery lasts at that rate. */
  lasts: number;
  /** How many days one opened bag lasts. */
  bagDays: number;
  price: number;
  perCup: number;
  perMonth: number;
  cupsPerDelivery: number;
};

const SIZES: Size[] = [250, 500, 1000];

/**
 * Picks the bag size, number of bags and weeks between deliveries that keep
 * the cupboard closest to empty when the next one lands. Running short is
 * worse than a few spare days, and an opened bag should be finished inside
 * three weeks.
 */
export function plan(answers: Answers): Plan {
  const gramsPerCup = METHODS[answers.method].grams;
  const perWeek = answers.cups * answers.people * gramsPerCup * 7;
  let best: { score: number; size: Size; count: number; weeks: number } | null = null;
  for (const size of SIZES) {
    for (let count = 1; count <= 6; count++) {
      for (let weeks = 1; weeks <= 4; weeks++) {
        const ratio = (size * count) / weeks / perWeek;
        const bagDays = size / (perWeek / 7);
        let score = (ratio < 1 ? 14 : 6) * Math.abs(Math.log(ratio));
        score += (count - 1) * 0.5;
        if (weeks === 1) score += 0.35;
        if (weeks >= 3) score += 0.15 * (weeks - 2);
        if (bagDays > 16) score += (bagDays - 16) * 0.08;
        if (bagDays > 24) score += 4;
        if (!best || score < best.score) best = { score, size, count, weeks };
      }
    }
  }
  const { size, count, weeks } = best as NonNullable<typeof best>;
  const price = ROASTS[answers.roast].price[size] * count;
  const lasts = (size * count) / (perWeek / 7);
  return {
    size,
    count,
    weeks,
    perWeek,
    gramsPerCup,
    lasts,
    bagDays: size / (perWeek / 7),
    price,
    perCup: (price / (size * count)) * gramsPerCup,
    perMonth: (price * 52) / 12 / weeks,
    cupsPerDelivery: Math.floor((size * count) / gramsPerCup)
  };
}

export type Delivery = { roast: Day; arrives: Day; index: number };

/** Grums roasts on Mondays; Posten puts the box in the letterbox on Wednesday. */
export function schedule(weeks: number, count = 3): Delivery[] {
  return Array.from({ length: count }, (_, index) => ({
    roast: day(index * weeks * 7),
    arrives: day(index * weeks * 7 + 2),
    index
  }));
}

/** “every week”, “every 2 weeks” */
export const every = (weeks: number) => (weeks === 1 ? 'every week' : `every ${weeks} weeks`);

/** “500 g”, “2 × 1 kg” */
export function bagText(p: Pick<Plan, 'size' | 'count'>) {
  const size = p.size === 1000 ? '1 kg' : `${p.size} g`;
  return p.count > 1 ? `${p.count} × ${size}` : size;
}

/** One sentence on how the delivery fits the drinking. */
export function fitText(p: Plan) {
  const lasts = Math.round(p.lasts);
  const gap = p.weeks * 7;
  if (Math.abs(lasts - gap) <= 1) return `Each delivery lasts about ${lasts} days, and the next one lands on day ${gap}.`;
  if (lasts > gap) return `Each delivery lasts about ${lasts} days. The next lands on day ${gap}, so you keep a little spare.`;
  return `Each delivery lasts about ${lasts} days and the next lands on day ${gap}. Nudge it sooner by text when you need to.`;
}
