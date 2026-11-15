import { describe, expect, it } from 'vitest';

import { en, pl } from '@/i18n/test-utils';

import { getNavLinks, privacyHref, sectionHref } from './navigation';

describe('getNavLinks', () => {
  it('lists the four sections in page order with the labels of the language', () => {
    expect(getNavLinks(pl.nav)).toEqual([
      { id: 'services', label: pl.nav.services },
      { id: 'about', label: pl.nav.about },
      { id: 'portfolio', label: pl.nav.portfolio },
      { id: 'contact', label: pl.nav.contact },
    ]);
  });

  it('has no entry for the hero (the logo leads there)', () => {
    expect(getNavLinks(en.nav).map((link) => link.id)).not.toContain('top');
  });
});

describe('sectionHref', () => {
  it('builds an anchor link to a section of the home page', () => {
    expect(sectionHref('pl', 'services')).toBe('/pl#services');
    expect(sectionHref('fr', 'top')).toBe('/fr#top');
  });
});

describe('privacyHref', () => {
  it('points at the privacy policy of the language', () => {
    expect(privacyHref('en')).toBe('/en/privacy');
  });
});
