import { describe, expect, it } from 'vitest';

import { locales } from '@/i18n/config';

import { site } from '../site';

import { getPrivacyDocument } from './index';

describe('privacy documents', () => {
  it('exists for every locale', () => {
    for (const locale of locales)
      expect(getPrivacyDocument(locale).sections.length).toBeGreaterThan(0);
  });

  it('has the same sections in the same order in every language', () => {
    const ids = (locale: (typeof locales)[number]) =>
      getPrivacyDocument(locale).sections.map((section) => section.id);
    expect(ids('en')).toEqual(ids('pl'));
    expect(ids('fr')).toEqual(ids('pl'));
  });

  it('covers the required topics', () => {
    const ids = getPrivacyDocument('pl').sections.map((section) => section.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'controller',
        'hosting',
        'cookies',
        'retention',
        'rights',
        'complaint',
      ]),
    );
  });

  it('names the controller with the company facts', () => {
    for (const locale of locales) {
      const text = JSON.stringify(getPrivacyDocument(locale));
      expect(text).toContain(site.fullName);
      expect(text).toContain(site.taxId);
      expect(text).toContain(site.email);
      expect(text).toContain(site.hostname);
    }
  });

  it('marks the retention periods as placeholders', () => {
    for (const locale of locales) {
      const retention = getPrivacyDocument(locale).sections.find((s) => s.id === 'retention');
      const flagged = retention?.blocks.filter(
        (block) => block.type === 'paragraph' && block.placeholder === true,
      );
      expect(flagged?.length).toBeGreaterThan(0);
    }
  });

  it('has a valid ISO date matching its readable date', () => {
    for (const locale of locales) {
      const doc = getPrivacyDocument(locale);
      expect(doc.updatedIso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(doc.updatedIso))).toBe(false);
      expect(doc.updated).toContain(doc.updatedIso.slice(0, 4));
    }
  });
});
