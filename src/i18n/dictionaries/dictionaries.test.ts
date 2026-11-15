import { describe, expect, it } from 'vitest';

import { site } from '@/content/site';

import { en } from './en';
import { fr } from './fr';
import { pl } from './pl';

const dictionaries = { pl, en, fr } as const;

/** Flattens a dictionary into `path -> value` for structural and content checks. */
function flatten(value: unknown, path = ''): Map<string, unknown> {
  const result = new Map<string, unknown>();
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      for (const [key, nested] of flatten(item, `${path}[${index}]`)) result.set(key, nested);
    });
  } else if (value !== null && typeof value === 'object') {
    for (const [name, nested] of Object.entries(value)) {
      for (const [key, deep] of flatten(nested, path ? `${path}.${name}` : name))
        result.set(key, deep);
    }
  } else {
    result.set(path, value);
  }
  return result;
}

const strings = (dictionary: object): [string, string][] =>
  [...flatten(dictionary)].filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  );

describe('dictionaries', () => {
  const reference = [...flatten(pl).keys()].sort();

  it.each(['en', 'fr'] as const)('%s has exactly the keys of the Polish reference', (locale) => {
    expect([...flatten(dictionaries[locale]).keys()].sort()).toEqual(reference);
  });

  it.each(['pl', 'en', 'fr'] as const)('%s has no empty strings', (locale) => {
    for (const [path, value] of strings(dictionaries[locale])) {
      expect(value.trim(), path).not.toBe('');
    }
  });

  it.each(['pl', 'en', 'fr'] as const)('%s has no leftovers from the template', (locale) => {
    for (const [path, value] of strings(dictionaries[locale])) {
      expect(value, path).not.toMatch(/Warszawa|Birchwood|9:00|17:00|Fraunces|Lorem/i);
    }
  });

  it.each(['pl', 'en', 'fr'] as const)(
    '%s never hardcodes contact details or the NIP',
    (locale) => {
      for (const [path, value] of strings(dictionaries[locale])) {
        expect(value, path).not.toContain(site.taxId);
        expect(value, path).not.toContain(site.email);
        expect(value, path).not.toContain(site.phones[0].display);
      }
    },
  );

  it('keeps a non-breaking space after one-letter Polish prepositions and conjunctions', () => {
    for (const [path, value] of strings(pl)) {
      // "a", "i", "o", "u", "w", "z" followed by a regular space would allow a line break after them.
      expect(value, path).not.toMatch(/(^|[\s(„])[aiouwzAIOUWZ] (?=\S)/);
    }
  });

  it('uses typographic quotes and apostrophes, never straight ones', () => {
    for (const locale of ['en', 'fr'] as const) {
      for (const [path, value] of strings(dictionaries[locale])) {
        expect(value, `${locale}:${path}`).not.toMatch(/[A-Za-z]'[A-Za-z]/);
      }
    }
  });

  it('puts a non-breaking space before French high punctuation', () => {
    for (const [path, value] of strings(fr)) {
      expect(value, path).not.toMatch(/[^\s ][ ]?[:;!?]( |$)/);
    }
  });

  it('exposes pluralised "years in practice" labels', () => {
    expect(pl.hero.stats.yearsLabel(30)).toBe('lat praktyki');
    expect(pl.hero.stats.yearsLabel(32)).toBe('lata praktyki');
    expect(en.hero.stats.yearsLabel(1)).toBe('year in practice');
    expect(fr.hero.stats.yearsLabel(30)).toBe('ans de pratique');
  });

  it('builds the copyright line with the current year and the brand', () => {
    for (const locale of ['pl', 'en', 'fr'] as const) {
      expect(dictionaries[locale].footer.copyright(2026)).toBe(`© 2026 ${site.brand}`);
    }
  });

  it('interpolates the confirmed company facts into the texts', () => {
    expect(pl.hero.lead).toContain(String(site.foundedYear));
    expect(pl.about.title).toContain(String(site.foundedYear));
    expect(pl.contact.lead).toContain(`${site.hours.opens}–${site.hours.closes}`);
    expect(fr.contact.lead).toContain('08h00');
    expect(fr.contact.hoursTime).toBe('08h00–16h00');
  });

  it('has four services, each with an id, a title, a description and an audience', () => {
    for (const locale of ['pl', 'en', 'fr'] as const) {
      const ids = dictionaries[locale].services.items.map((item) => item.id);
      expect(ids).toEqual(['houses', 'public', 'urban', 'permits']);
    }
  });
});
