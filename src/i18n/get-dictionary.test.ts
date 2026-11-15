import { describe, expect, it } from 'vitest';

import { locales } from './config';
import { en } from './dictionaries/en';
import { fr } from './dictionaries/fr';
import { pl } from './dictionaries/pl';
import { getDictionary } from './get-dictionary';

describe('getDictionary', () => {
  it('returns the dictionary of the requested locale', () => {
    expect(getDictionary('pl')).toBe(pl);
    expect(getDictionary('en')).toBe(en);
    expect(getDictionary('fr')).toBe(fr);
  });

  it('has an entry for every supported locale', () => {
    for (const locale of locales) expect(getDictionary(locale)).toBeDefined();
  });
});
