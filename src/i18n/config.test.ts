import { describe, expect, it } from 'vitest';

import { defaultLocale, isLocale, localeMeta, locales, sectionIds } from './config';

describe('locales', () => {
  it('supports Polish, English and French with Polish as the default', () => {
    expect([...locales]).toEqual(['pl', 'en', 'fr']);
    expect(defaultLocale).toBe('pl');
  });

  it('has metadata for every locale', () => {
    for (const locale of locales) {
      expect(localeMeta[locale].label).toBe(locale.toUpperCase());
      expect(localeMeta[locale].ogLocale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    }
  });
});

describe('isLocale', () => {
  it.each(['pl', 'en', 'fr'])('accepts %s', (value) => {
    expect(isLocale(value)).toBe(true);
  });

  it.each(['de', 'PL', '', 'pl-PL', 'privacy'])('rejects %j', (value) => {
    expect(isLocale(value)).toBe(false);
  });
});

describe('sectionIds', () => {
  it('uses the same anchors in every language', () => {
    expect(sectionIds).toEqual({
      top: 'top',
      services: 'services',
      about: 'about',
      portfolio: 'portfolio',
      contact: 'contact',
    });
  });
});
