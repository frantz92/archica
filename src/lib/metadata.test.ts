import { describe, expect, it } from 'vitest';

import { site } from '@/content/site';
import { locales } from '@/i18n/config';

import {
  OG_IMAGE_SIZE,
  createPageMetadata,
  languageAlternates,
  ogImageUrl,
  pagePaths,
  pageUrl,
} from './metadata';

describe('pageUrl', () => {
  it('builds the home URL of a locale', () => {
    expect(pageUrl('pl', '')).toBe(`${site.domain}/pl/`);
  });

  it('builds a sub-page URL', () => {
    expect(pageUrl('fr', '/privacy')).toBe(`${site.domain}/fr/privacy/`);
  });
});

describe('languageAlternates', () => {
  it('lists every locale plus x-default pointing at the default language', () => {
    const map = languageAlternates('');
    expect(Object.keys(map).sort()).toEqual([...locales, 'x-default'].sort());
    expect(map['x-default']).toBe(`${site.domain}/pl/`);
  });

  it('keeps the sub-path for every language', () => {
    const map = languageAlternates('/privacy');
    for (const locale of locales) expect(map[locale]).toBe(`${site.domain}/${locale}/privacy/`);
  });
});

describe('ogImageUrl', () => {
  it('points at the per-locale Open Graph image route', () => {
    expect(ogImageUrl('en')).toBe(`${site.domain}/en/opengraph-image`);
  });
});

describe('createPageMetadata', () => {
  const input = {
    locale: 'en',
    path: '/privacy',
    title: 'Privacy policy',
    socialTitle: 'Privacy policy — Archica',
    description: 'Description',
    imageAlt: 'Alt',
  } as const;

  it('sets title, description, canonical and hreflang', () => {
    const meta = createPageMetadata(input);
    expect(meta.title).toBe('Privacy policy');
    expect(meta.description).toBe('Description');
    expect(meta.alternates?.canonical).toBe(`${site.domain}/en/privacy/`);
    expect(meta.alternates?.languages).toEqual(languageAlternates('/privacy'));
  });

  it('fills Open Graph with the current and the alternate locales', () => {
    const meta = createPageMetadata(input);
    expect(meta.openGraph).toMatchObject({
      type: 'website',
      siteName: site.brand,
      locale: 'en_GB',
      alternateLocale: ['pl_PL', 'fr_FR'],
      url: `${site.domain}/en/privacy/`,
      title: 'Privacy policy — Archica',
    });
    expect(meta.openGraph?.images).toEqual([
      { url: ogImageUrl('en'), ...OG_IMAGE_SIZE, alt: 'Alt' },
    ]);
  });

  it('uses a large Twitter card with the same image', () => {
    const meta = createPageMetadata(input);
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image', title: input.socialTitle });
  });

  it('accepts an absolute title object for the home page', () => {
    const meta = createPageMetadata({ ...input, path: '', title: { absolute: 'Home' } });
    expect(meta.title).toEqual({ absolute: 'Home' });
  });
});

describe('pagePaths', () => {
  it('covers the home page and the privacy page', () => {
    expect(pagePaths).toEqual(['', '/privacy']);
  });
});
