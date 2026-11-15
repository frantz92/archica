import { describe, expect, it } from 'vitest';

import { site } from '@/content/site';

import { getYearsOfPractice } from './years';

describe('getYearsOfPractice', () => {
  it('is the current year minus the founding year', () => {
    expect(getYearsOfPractice(new Date('2026-11-15T12:00:00Z'))).toBe(2026 - site.foundedYear);
  });

  it('grows by one on every new year', () => {
    const before = getYearsOfPractice(new Date('2030-12-31T12:00:00Z'));
    const after = getYearsOfPractice(new Date('2031-01-01T12:00:00Z'));
    expect(after - before).toBe(1);
  });

  it('defaults to the current date', () => {
    expect(getYearsOfPractice()).toBe(new Date().getFullYear() - site.foundedYear);
  });
});
