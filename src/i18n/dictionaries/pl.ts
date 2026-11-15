import { site } from '@/content/site';
import { pluralForm } from '@/lib/plural';

/**
 * Polish dictionary: the reference for the `Dictionary` type (BLUEPRINT §4.2).
 * Typography (§4.3): non-breaking spaces ( ) after one-letter prepositions and conjunctions.
 */
export const pl = {
  meta: {
    title: 'Archica — pracownia architektoniczna w Stargardzie',
    description: `Pracownia architektury i urbanistyki w Stargardzie, od ${site.foundedYear} roku. Projektowanie architektoniczne, architektura wnętrz, planowanie urbanistyczne i nadzór inwestorski.`,
    ogImageAlt: 'Logo Archica — Studio Architektury i Urbanistyki',
    privacyTitle: 'Polityka prywatności',
    privacyDescription: `Informacje o przetwarzaniu danych osobowych na stronie ${site.hostname} oraz o prawach osób, których dane dotyczą.`,
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
    title: 'Projekt, wnętrza, nadzór. Jedna pracownia.',
    lead: 'Od pierwszego szkicu do odbioru inwestycji prowadzimy każdy etap projektu.',
    primaryCta: 'Omów swój projekt',
    secondaryCta: 'Zobacz projekty',
    imageAlt: 'Szklana fasada nowoczesnego budynku na tle nieba',
    stats: {
      yearsLabel: (years: number): string =>
        pluralForm('pl', years, {
          one: 'rok praktyki',
          few: 'lata praktyki',
          many: 'lat praktyki',
          other: 'lat praktyki',
        }),
      projectsLabel: 'projektów',
      awardsLabel: 'nagród',
      locationValue: site.address.city,
      locationLabel: 'siedziba pracowni',
    },
  },
  services: {
    title: 'Usługi',
    items: [
      {
        title: 'Projektowanie architektoniczne',
        description:
          'Od koncepcji do dokumentacji wykonawczej dla domów prywatnych, biur i budynków publicznych.',
      },
      {
        title: 'Architektura wnętrz',
        description: 'Planowanie przestrzeni dopasowane do sposobu życia.',
      },
      {
        title: 'Planowanie urbanistyczne',
        description: 'Koncepcje zagospodarowania terenu respektujące kontekst i społeczność.',
      },
      {
        title: 'Nadzór inwestorski',
        description: 'Nadzór na budowie, aby realizacja odpowiadała projektowi.',
      },
    ],
  },
  about: {
    title: 'Wiesz, z kim pracujesz',
    quote: '„Każdy projekt zaczyna się od działki, nie od szkicownika.”',
    quoteAuthor: `${site.founder}, założycielka pracowni`,
    paragraphs: [
      'Archica to kilkuosobowa pracownia, którą od początku prowadzi jej założycielka. Za projektem stoi więc konkretna osoba, a nie anonimowy zespół.',
      'Projekt prowadzą te same osoby od pierwszej wizyty na działce po nadzór na budowie. Niczego nie trzeba tłumaczyć dwa razy.',
    ],
    imageAlt: 'Makieta architektoniczna domu na wystawie',
    table: {
      foundedLabel: 'Rok założenia',
      seatLabel: 'Siedziba',
      clientsLabel: 'Klienci',
      clientsValue: 'Inwestorzy prywatni i samorządy',
    },
  },
  portfolio: {
    title: 'Wybrane projekty',
    lead: 'Projekty różnej skali: od domu jednorodzinnego po przestrzeń publiczną.',
    projects: {
      residence: {
        category: 'dom jednorodzinny',
        imageAlt: 'Wizualizacja: Rezydencja Brzozowa',
      },
      office: {
        category: 'obiekt komercyjny',
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
    title: 'Masz działkę albo pomysł? Porozmawiajmy.',
    lead: 'Zadzwoń lub napisz. Powiemy, od czego zacząć.',
    labels: {
      phone: 'Telefon',
      email: 'E-mail',
      address: 'Adres',
      hours: 'Godziny pracy',
    },
    copyEmail: 'Skopiuj e-mail',
    copiedEmail: 'Skopiowano',
    showOnMap: 'Zobacz w Mapach Google',
    hoursDays: 'pon.–pt.',
    hoursTime: `${site.hours.opens}–${site.hours.closes}`,
  },
  footer: {
    companyTitle: 'Dane firmy',
    navTitle: 'Nawigacja',
    taxIdLabel: 'NIP',
    licenseLabel: 'Numer uprawnień',
    licenseTodo: 'do uzupełnienia',
    backToTop: 'Wróć na górę',
    copyright: (year: number): string => `© ${year} ${site.brand}`,
  },
  privacy: {
    updatedLabel: 'Ostatnia aktualizacja',
    backToHome: 'Wróć na stronę główną',
  },
  notFound: {
    title: 'Tej strony nie ma w projekcie',
    description: 'Adres mógł się zmienić albo wkradła się literówka.',
    homeLink: 'Wróć na stronę główną',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 'otwiera się w nowej karcie',
  },
};
