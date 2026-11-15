import { describe, expect, it } from 'vitest';

import { pl } from '@/i18n/test-utils';

import { resolveLocale, resolveRoute } from './route-locale';

const params = (locale: string) => Promise.resolve({ locale });

describe('resolveLocale', () => {
  it.each(['pl', 'en', 'fr'])('accepts %s', async (locale) => {
    await expect(resolveLocale(params(locale))).resolves.toBe(locale);
  });

  it.each(['de', '', 'PL', 'privacy'])('turns %j into a 404', async (locale) => {
    await expect(resolveLocale(params(locale))).rejects.toThrow();
  });
});

describe('resolveRoute', () => {
  it('returns the language together with its dictionary', async () => {
    const route = await resolveRoute(params('pl'));
    expect(route.locale).toBe('pl');
    expect(route.dictionary).toBe(pl);
  });

  it('rejects an unsupported language', async () => {
    await expect(resolveRoute(params('xx'))).rejects.toThrow();
  });
});
