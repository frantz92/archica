import { describe, expect, it } from 'vitest';

import { pluralForm } from './plural';

const pl = { one: 'rok', few: 'lata', many: 'lat', other: 'lat' } as const;

describe('pluralForm', () => {
  it.each([
    [1, 'rok'],
    [2, 'lata'],
    [4, 'lata'],
    [5, 'lat'],
    [12, 'lat'],
    [22, 'lata'],
    [30, 'lat'],
    [32, 'lata'],
  ])('uses the Polish form for %i', (count, expected) => {
    expect(pluralForm('pl', count, pl)).toBe(expected);
  });

  it('uses the English singular only for one', () => {
    const forms = { one: 'year', other: 'years' };
    expect(pluralForm('en', 1, forms)).toBe('year');
    expect(pluralForm('en', 30, forms)).toBe('years');
  });

  it('treats zero and one as singular in French', () => {
    const forms = { one: 'an', other: 'ans' };
    expect(pluralForm('fr', 0, forms)).toBe('an');
    expect(pluralForm('fr', 1, forms)).toBe('an');
    expect(pluralForm('fr', 30, forms)).toBe('ans');
  });

  it('falls back to `other` when the rule has no dedicated form', () => {
    expect(pluralForm('pl', 5, { other: 'x' })).toBe('x');
  });
});
