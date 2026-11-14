/** Company facts (BLUEPRINT §3.1). Do not change without a new source. */
export const site = {
  fullName: 'Studio Architektury i Urbanistyki Archica',
  brand: 'Archica',
  founder: 'mgr arch. Małgorzata Wojtaś-Frankowska',
  foundedYear: 1996,
  taxId: '8541544655',
  phones: [
    { display: '+48 91 578-37-63', href: 'tel:+48915783763' },
    { display: '+48 601-916-096', href: 'tel:+48601916096' },
  ],
  email: 'archica@archica.pl',
  address: {
    street: 'ul. Czarnieckiego 25a',
    postalCode: '73-110',
    city: 'Stargard',
    country: 'PL',
  },
  domain: 'https://archica.pl',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=ul.+Czarnieckiego+25a%2C+73-110+Stargard',
  // PLACEHOLDER: replace with the real professional licence number. Always shown as a mock value.
  // TODO: obtain the real licence number from the client.
  license: { number: 'MOCK/000/0000', placeholder: true },
} as const;
