import { describe, expect, it } from 'vitest';
import {
  getNextProject,
  getProject,
  layoutWall,
  type Project,
  projects,
  slugFromPath,
  sortProjects
} from '~/content';
import { portfolio } from '~/portfolio.config';

const fake = (slug: string, year = 2025) => ({ slug, year, name: slug }) as Project;

describe('sortProjects', () => {
  it('puts listed slugs first, then the newest', () => {
    const list = [fake('a', 2021), fake('b', 2024), fake('c', 2026), fake('d', 2020)];
    expect(sortProjects(list, ['d', 'a']).map((p) => p.slug)).toEqual(['d', 'a', 'c', 'b']);
  });
});

describe('slugFromPath', () => {
  it('uses the file name', () => {
    expect(slugFromPath('./work/soft-matter.ts')).toBe('soft-matter');
  });
});

describe('layoutWall', () => {
  it('repeats pair, full, three, then a statement', () => {
    const list = 'abcdefghijklmno'.split('').map((slug) => fake(slug));
    const kinds = layoutWall(list, ['one', 'two']).map((row) => row.kind);
    expect(kinds).toEqual([
      'pair', 'full', 'triple', 'statement',
      'pair', 'full', 'triple', 'statement',
      'pair', 'full'
    ]);
  });

  it('flips every other pair', () => {
    const list = 'abcdefghijklmno'.split('').map((slug) => fake(slug));
    const pairs = layoutWall(list, ['x']).filter((row) => row.kind === 'pair');
    expect(pairs.map((row) => row.kind === 'pair' && row.flip)).toEqual([false, true, false]);
  });

  it('places every project exactly once', () => {
    for (let n = 0; n <= 13; n++) {
      const list = Array.from({ length: n }, (_, i) => fake(`p${i}`));
      const placed = layoutWall(list, ['s']).flatMap((row) =>
        row.kind === 'statement' ? [] : row.kind === 'full' ? [row.item] : row.items
      );
      expect(placed.map((p) => p.slug)).toEqual(list.map((p) => p.slug));
    }
  });

  it('never ends on a statement', () => {
    const list = Array.from({ length: 6 }, (_, i) => fake(`p${i}`));
    expect(layoutWall(list, ['s']).at(-1)?.kind).not.toBe('statement');
  });
});

// The projects that ship with the template. Tests about them skip once they're replaced.
const SAMPLES = ['kestrel', 'veil', 'soft-matter', 'marmor', 'isobar', 'gantry', 'kvarter', 'grums'];
const samples = projects.filter((p) => SAMPLES.includes(p.slug));

describe('the work', () => {
  it('follows workOrder', () => {
    const listed = portfolio.workOrder.filter((slug) => projects.some((p) => p.slug === slug));
    expect(projects.map((p) => p.slug).slice(0, listed.length)).toEqual(listed);
  });

  it('wraps the next project around', () => {
    const last = projects.at(-1);
    expect(last && getNextProject(last.slug)?.slug).toBe(projects[0]?.slug);
    expect(getProject('does-not-exist')).toBeUndefined();
  });

  it('gives every project a cover with a share image and alt text', () => {
    for (const project of projects) {
      expect(project.cover.share, project.slug).toBeTruthy();
      expect(project.coverAlt.length, project.slug).toBeGreaterThan(10);
    }
  });

  it('shows five or more images for each sample project', () => {
    for (const project of samples) {
      const images = new Set<string>([project.cover.src]);
      for (const block of project.blocks) {
        if (block.type === 'image') images.add(block.image.src);
        if (block.type === 'pair') for (const f of block.images) images.add(f.image.src);
        if (block.type === 'beforeAfter') images.add(block.before.image.src).add(block.after.image.src);
        if (block.type === 'demo') images.add(block.still.src);
        if (block.type === 'video') images.add(block.poster.src);
      }
      expect(images.size, project.slug).toBeGreaterThanOrEqual(5);
    }
  });

  it('writes a one-line description for every project', () => {
    for (const project of projects) {
      expect(project.description.length, project.slug).toBeLessThanOrEqual(80);
      expect(project.description, project.slug).not.toMatch(/lorem|ipsum/i);
    }
  });
});
