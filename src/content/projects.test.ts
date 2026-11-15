import { describe, expect, it } from 'vitest';

import { dictionaries } from '@/i18n/test-utils';

import { images } from './images';
import { projects } from './projects';

describe('projects', () => {
  it('has four projects in slots A to D', () => {
    expect(projects.map((project) => project.slot)).toEqual(['A', 'B', 'C', 'D']);
  });

  it('has unique ids and slugs', () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
  });

  it('uses URL-safe slugs', () => {
    for (const project of projects) expect(project.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('references an existing image for every project', () => {
    for (const project of projects) expect(images[project.image]).toBeDefined();
  });

  it('has translated copy for every project in every language', () => {
    for (const dictionary of dictionaries) {
      for (const project of projects) {
        const text = dictionary.portfolio.projects[project.id];
        expect(text.title).not.toBe('');
        expect(text.category).not.toBe('');
        expect(text.imageAlt).toContain(text.title);
      }
    }
  });

  it('leaves years empty because none were supplied', () => {
    for (const project of projects) expect(project.year).toBeUndefined();
  });
});
