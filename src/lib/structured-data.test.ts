import { describe, expect, it } from 'vitest';

import { site } from '@/content/site';

import { buildProfessionalService } from './structured-data';

describe('buildProfessionalService', () => {
  const data = buildProfessionalService('pl');

  it('is a schema.org ProfessionalService', () => {
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('ProfessionalService');
  });

  it('uses the company facts from site.ts', () => {
    expect(data).toMatchObject({
      name: site.brand,
      legalName: site.fullName,
      url: `${site.domain}/pl/`,
      email: site.email,
      foundingDate: String(site.foundedYear),
      vatID: `PL${site.taxId}`,
    });
    expect(data.telephone).toEqual(site.phones.map((phone) => phone.display));
  });

  it('describes the postal address and the opening hours', () => {
    expect(data.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    });
    expect(data.openingHoursSpecification).toEqual({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: site.hours.dayOfWeek,
      opens: site.hours.opens,
      closes: site.hours.closes,
    });
  });

  it('names the founder with the academic title', () => {
    expect(data.founder).toEqual({
      '@type': 'Person',
      name: site.founderName,
      honorificPrefix: site.founderTitle,
    });
  });

  it('does not leak placeholder data (licence number, coordinates, ratings)', () => {
    const json = JSON.stringify(data);
    expect(json).not.toContain(site.license.number);
    expect(json).not.toMatch(/geo|aggregateRating/);
  });

  it('points the URL at the requested locale', () => {
    expect(buildProfessionalService('fr').url).toBe(`${site.domain}/fr/`);
  });
});
