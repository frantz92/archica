import { describe, expect, it } from 'vitest';

import { site } from './site';

describe('site', () => {
  it('holds the company identity', () => {
    expect(site.brand).toBe('Archica');
    expect(site.fullName).toContain(site.brand);
    expect(site.foundedYear).toBe(1996);
    expect(site.taxId).toMatch(/^\d{10}$/);
  });

  it('keeps each phone link in sync with its display text', () => {
    for (const phone of site.phones) {
      const digits = phone.display.replace(/\D/g, '');
      expect(phone.href).toBe(`tel:+${digits}`);
      expect(phone.display.startsWith('+48')).toBe(true);
    }
  });

  it('has a valid e-mail and domain', () => {
    expect(site.email).toBe(`archica@${site.hostname}`);
    expect(site.domain).toBe(`https://${site.hostname}`);
  });

  it('formats the address on one line in the Polish order', () => {
    expect(site.address.line).toBe(
      `${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
    );
    expect(site.address.postalCode).toMatch(/^\d{2}-\d{3}$/);
  });

  it('links to a map search for the same address', () => {
    const query = decodeURIComponent(new URL(site.mapUrl).searchParams.get('query') ?? '');
    expect(query).toBe(site.address.line);
  });

  it('opens Monday to Friday between two HH:MM times', () => {
    expect(site.hours.dayOfWeek).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    expect(site.hours.opens).toMatch(/^\d{2}:\d{2}$/);
    expect(site.hours.closes > site.hours.opens).toBe(true);
  });

  it('splits the founder name consistently', () => {
    expect(site.founder).toBe(`${site.founderTitle} ${site.founderName}`);
  });

  it('flags the licence number as a placeholder', () => {
    expect(site.license.placeholder).toBe(true);
    expect(site.license.number).toMatch(/^MOCK/);
  });

  it('holds the confirmed hero figures', () => {
    expect(site.stats).toEqual({ projects: 86, tendersWon: 26, municipalities: 15 });
  });
});
