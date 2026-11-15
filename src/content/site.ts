/** Company facts (BLUEPRINT §3.1). Do not change without a new source. */
const address = {
  street: 'ul. Czarnieckiego 25a',
  postalCode: '73-110',
  city: 'Stargard',
  country: 'PL',
} as const;

const domain = 'https://archica.pl';

export const site = {
  fullName: 'Studio Architektury i Urbanistyki Archica',
  brand: 'Archica',
  founder: 'mgr arch. Małgorzata Wojtaś-Frankowska',
  /** The same fact split into parts, for structured data. */
  founderName: 'Małgorzata Wojtaś-Frankowska',
  founderTitle: 'mgr arch.',
  foundedYear: 1996,
  taxId: '8541544655',
  phones: [
    { display: '+48 91 578-37-63', href: 'tel:+48915783763' },
    { display: '+48 601-916-096', href: 'tel:+48601916096' },
  ],
  email: 'archica@archica.pl',
  address: {
    ...address,
    /** Single-line Polish postal format, used in running text (privacy policy). */
    line: `${address.street}, ${address.postalCode} ${address.city}`,
  },
  /** Opening hours, Monday to Friday. The only place they are defined (24 h, "HH:MM"). */
  hours: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '16:00',
  },
  /** Hero figures confirmed by the owner (Aneks 1, 2026-11-15). Years of practice are computed. */
  stats: { projects: 86, tendersWon: 26, municipalities: 15 },
  domain,
  /** Host name without the scheme, for running text. */
  hostname: domain.replace('https://', ''),
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=ul.+Czarnieckiego+25a%2C+73-110+Stargard',
  // PLACEHOLDER: replace with the real professional licence number. Always shown as a mock value.
  // TODO: obtain the real licence number from the client.
  license: { number: 'MOCK/000/0000', placeholder: true },
} as const;
