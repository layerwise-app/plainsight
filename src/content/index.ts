import { portfolio } from '~/portfolio.config';
import type { CaseStudy, Project } from './types';

export type { Block, CaseStudy, ImageAsset, Project } from './types';

/** Every `src/content/work/<slug>.ts` file. Files starting with `_` are skipped. */
const modules = import.meta.glob<{ default: CaseStudy }>('./work/*.ts', {
  eager: true
});

export function slugFromPath(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.ts$/, '');
}

/** Listed slugs first, in `workOrder` order; the rest by year, newest first. */
export function sortProjects(list: Project[], order: readonly string[]): Project[] {
  const rank = (slug: string) => {
    const index = order.indexOf(slug);
    return index === -1 ? Number.POSITIVE_INFINITY : index;
  };
  return [...list].sort(
    (a, b) =>
      rank(a.slug) - rank(b.slug) ||
      b.year - a.year ||
      a.name.localeCompare(b.name)
  );
}

export const projects: Project[] = sortProjects(
  Object.entries(modules)
    .filter(([path]) => !slugFromPath(path).startsWith('_'))
    .map(([path, module]) => ({ ...module.default, slug: slugFromPath(path) })),
  portfolio.workOrder
);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The project after this one, wrapping around to the first. */
export function getNextProject(slug: string): Project | undefined {
  if (projects.length < 2) return undefined;
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export type WallRow =
  | { kind: 'pair'; items: [Project, Project]; flip: boolean }
  | { kind: 'full'; item: Project }
  | { kind: 'triple'; items: [Project, Project, Project] }
  | { kind: 'statement'; text: string };

/**
 * Lays projects out for Home in a repeating rhythm: a pair, one full-width
 * piece, three unequal columns, then a statement before the next group.
 * Leftovers that can't fill a row become a pair or a single full-width piece.
 */
export function layoutWall(list: Project[], statements: readonly string[]): WallRow[] {
  const rows: WallRow[] = [];
  let index = 0;
  let group = 0;
  const take = (count: number) => {
    const items = list.slice(index, index + count);
    index += count;
    return items;
  };

  while (index < list.length) {
    if (group > 0) {
      const text = statements[(group - 1) % Math.max(statements.length, 1)];
      if (text) rows.push({ kind: 'statement', text });
    }
    const flip = group % 2 === 1;
    for (const slot of ['pair', 'full', 'triple'] as const) {
      const left = list.length - index;
      if (left <= 0) break;
      if (slot === 'pair') {
        if (left >= 2) rows.push({ kind: 'pair', items: take(2) as [Project, Project], flip });
        else rows.push({ kind: 'full', item: take(1)[0] });
      } else if (slot === 'full') {
        rows.push({ kind: 'full', item: take(1)[0] });
      } else if (left >= 3) {
        rows.push({ kind: 'triple', items: take(3) as [Project, Project, Project] });
      } else if (left === 2) {
        rows.push({ kind: 'pair', items: take(2) as [Project, Project], flip: !flip });
      } else {
        rows.push({ kind: 'full', item: take(1)[0] });
      }
    }
    group++;
  }
  return rows;
}
