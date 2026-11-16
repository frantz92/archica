import { site } from '@/content/site';
import { locales, type Locale } from '@/i18n/config';
import { ogImageUrl } from '@/lib/metadata';

/**
 * schema.org ProfessionalService (BLUEPRINT §8). Contains only confirmed facts:
 * no coordinates, no ratings, no placeholder data.
 */
export function buildProfessionalService(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.brand,
    legalName: site.fullName,
    url: `${site.domain}/${locale}/`,
    logo: `${site.domain}/apple-icon`,
    image: ogImageUrl(locale),
    telephone: site.phones.map((phone) => phone.display),
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: site.hours.dayOfWeek,
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    foundingDate: String(site.foundedYear),
    founder: {
      '@type': 'Person',
      name: site.founderName,
      honorificPrefix: site.founderTitle,
    },
    vatID: `PL${site.taxId}`,
    knowsLanguage: [...locales],
  };
}
