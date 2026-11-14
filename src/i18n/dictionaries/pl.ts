/**
 * Polish dictionary: the reference for the `Dictionary` type (BLUEPRINT §4.2).
 * Typography (§4.3): non-breaking spaces ( ) after one-letter prepositions and conjunctions.
 */
export const pl = {
  meta: {
    title: 'Archica — Studio Architektury i\u00A0Urbanistyki, Stargard',
    description:
      'Pracownia architektury i urbanistyki w Stargardzie, od 1996 roku. Projekty domów jednorodzinnych i obiektów publicznych, urbanistyka oraz pełna obsługa formalności.',
    ogImageAlt: 'Logo Archica — Studio Architektury i Urbanistyki',
    privacyTitle: 'Polityka prywatności',
    privacyDescription:
      'Informacje o przetwarzaniu danych osobowych na stronie archica.pl oraz o prawach osób, których dane dotyczą.',
  },
  a11y: {
    skipToContent: 'Przejdź do treści',
    homeLink: 'Archica — strona główna',
    mainNav: 'Nawigacja główna',
    footerNav: 'Nawigacja w stopce',
    mobileMenuTitle: 'Menu',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
    languageSwitcher: 'Wybór języka',
    languageNames: { pl: 'Polski', en: 'English', fr: 'Français' },
    switchToLight: 'Włącz motyw jasny',
    switchToDark: 'Włącz motyw ciemny',
    logoName: 'Archica',
  },
  nav: {
    services: 'Usługi',
    about: 'O nas',
    portfolio: 'Portfolio',
    contact: 'Kontakt',
    privacy: 'Polityka prywatności',
  },
  hero: {
    eyebrow: 'Studio Architektury i Urbanistyki',
    title: 'Architektura, która zaczyna się od miejsca.',
    lead: 'Od 1996 roku projektujemy w Stargardzie domy jednorodzinne, obiekty publiczne i przestrzenie miejskie. Prowadzimy inwestycję od analizy działki po pozwolenie na budowę.',
    primaryCta: 'Skontaktuj się',
    secondaryCta: 'Zobacz realizacje',
    imageAlt: 'Wizualizacja budynku projektowanego przez pracownię Archica',
    stats: {
      yearsLabel: 'lat praktyki',
      projectsLabel: 'projektów',
      awardsLabel: 'nagród',
      locationValue: 'Stargard',
      locationLabel: 'od 1996',
    },
  },
  services: {
    title: 'Co projektujemy',
    lead: 'Budynki projektujemy od A do Z, a pozwolenia, dokumentację i uzgodnienia prowadzimy we własnym zakresie.',
    items: [
      {
        title: 'Domy jednorodzinne',
        description:
          'Indywidualne projekty domów dopasowane do działki, budżetu i sposobu życia domowników.',
        audience: 'Inwestorzy prywatni',
      },
      {
        title: 'Obiekty publiczne i komunalne',
        description:
          'Budynki publiczne, promenady i cmentarze: przestrzenie, które mają dobrze służyć mieszkańcom przez dziesięciolecia.',
        audience: 'Samorządy',
      },
      {
        title: 'Urbanistyka',
        description:
          'Planowanie urbanistyczne i koncepcje zagospodarowania terenu. Porządkujemy przestrzeń, zanim powstanie pierwszy budynek.',
        audience: 'Samorządy',
      },
      {
        title: 'Formalności',
        description:
          'Pozwolenia, dokumentację i uzgodnienia załatwiamy sami. Inwestor ma jeden punkt kontaktu od pierwszej rozmowy do decyzji.',
        audience: 'Inwestorzy prywatni i samorządy',
      },
    ],
    audienceLabel: 'Dla kogo',
  },
  about: {
    title: 'Pracownia od 1996 roku',
    quote: '„Każdy projekt zaczyna się od działki, nie od szkicownika.”',
    quoteAuthor: 'mgr arch. Małgorzata Wojtaś-Frankowska',
    paragraphs: [
      'Archica działa w Stargardzie od 1996 roku. Pracownię założyła i prowadzi mgr arch. Małgorzata Wojtaś-Frankowska.',
      'Pracujemy w kilkuosobowym zespole, więc każdy projekt od początku do końca prowadzą te same osoby: od pierwszej wizyty na działce po komplet dokumentów.',
    ],
    imageAlt: 'Wnętrze pracowni architektonicznej Archica',
    table: {
      foundedLabel: 'Założenie',
      seatLabel: 'Siedziba',
      leaderLabel: 'Prowadząca',
    },
  },
  portfolio: {
    title: 'Wybrane realizacje',
    projects: {
      residence: {
        category: 'dom prywatny',
        imageAlt: 'Wizualizacja: Rezydencja Brzozowa',
      },
      office: {
        category: 'komercyjne',
        imageAlt: 'Wizualizacja: Biura Meridian',
      },
      interior: {
        category: 'architektura wnętrz',
        imageAlt: 'Wizualizacja: Wnętrze Linden',
      },
      pavilion: {
        category: 'przestrzeń publiczna',
        imageAlt: 'Wizualizacja: Pawilon Grove',
      },
    },
  },
  contact: {
    title: 'Porozmawiajmy o projekcie',
    lead: 'Zadzwoń albo napisz. Odpowiadamy od poniedziałku do piątku w godzinach 08:00–16:00.',
    labels: {
      phone: 'Telefon',
      email: 'E-mail',
      address: 'Adres',
      hours: 'Godziny',
    },
    copyEmail: 'Kopiuj adres',
    copiedEmail: 'Skopiowano',
    showOnMap: 'Pokaż na mapie',
    hoursDays: 'pon.–pt.',
    hoursTime: '08:00–16:00',
  },
  footer: {
    companyTitle: 'Firma',
    contactTitle: 'Kontakt',
    navTitle: 'Nawigacja',
    taxIdLabel: 'NIP',
    licenseLabel: 'Numer uprawnień',
    licenseTodo: 'do uzupełnienia',
    backToTop: 'Do góry',
    copyright: (year: number): string => `© ${year} Studio Architektury i Urbanistyki Archica`,
  },
  privacy: {
    updatedLabel: 'Ostatnia aktualizacja',
    backToHome: 'Wróć na stronę główną',
  },
  notFound: {
    title: 'Nie znaleziono strony',
    description: 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
    homeLink: 'Wróć na stronę główną',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 'otwiera się w nowej karcie',
  },
};
