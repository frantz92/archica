import { site } from '@/content/site';
import { pluralForm } from '@/lib/plural';

/**
 * Polish dictionary: the reference for the `Dictionary` type (BLUEPRINT §4.2).
 * Typography (§4.3): non-breaking spaces ( ) after one-letter prepositions and conjunctions.
 */
export const pl = {
  meta: {
    title: 'Architekt Stargard — projekty domów i urbanistyka | Archica',
    description: `Biuro architektoniczne w Stargardzie, od ${site.foundedYear} roku. Projekty domów jednorodzinnych, przestrzeni publicznych i plany urbanistyczne. Od działki do końca budowy.`,
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
    eyebrow: 'Studio Architektury i Urbanistyki · Stargard',
    title: 'Od pierwszej myśli do miejsca, w którym chce się być.',
    lead: `Od ${site.foundedYear} roku projektujemy domy jednorodzinne, przestrzenie publiczne i plany urbanistyczne. Pomagamy wybrać działkę, prowadzimy formalności i wspólnie szukamy rozwiązań praktycznych i współczesnych.`,
    primaryCta: 'Skontaktuj się',
    secondaryCta: 'Zobacz realizacje',
    // PLACEHOLDER: describe the real photo after replacing hero-building.png.
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
      tendersLabel: 'wygranych przetargów miejskich',
      municipalitiesLabel: 'gmin i miast',
    },
  },
  services: {
    title: 'W\u00A0czym pomagamy',
    lead: 'Od wyboru działki do zakończenia budowy jesteśmy przy inwestycji na każdym etapie: projekt, formalności i wsparcie w trakcie realizacji.',
    items: [
      {
        id: 'houses',
        title: 'Domy jednorodzinne',
        description:
          'Pomagamy wybrać działkę, a potem projektujemy dom razem z inwestorem. Proponujemy rozwiązania praktyczne i współczesne, a gotowy projekt możemy dopasować do indywidualnych potrzeb. Każdy projekt pokazujemy na wizualizacji.',
        audience: 'Inwestorzy prywatni',
      },
      {
        id: 'public',
        title: 'Obiekty publiczne i komunalne',
        description:
          'Promenady nad jeziorami, plaże, place zabaw, skate parki, cmentarze i budynki publiczne. Projektujemy całe założenia: od układu ścieżek po altany, mostki i małą architekturę.',
        audience: 'Samorządy',
      },
      {
        id: 'urban',
        title: 'Urbanistyka',
        description:
          'Miejscowe plany zagospodarowania, studia uwarunkowań i kierunków zagospodarowania oraz decyzje o warunkach zabudowy. Porządkujemy przestrzeń, zanim powstanie pierwszy budynek.',
        audience: 'Samorządy',
      },
      {
        id: 'permits',
        title: 'Formalności',
        description:
          'Pozwolenia, dokumentację i uzgodnienia z urzędami załatwiamy we własnym zakresie, a w trakcie budowy zapewniamy nadzór. Mamy szerokie kontakty w branży, więc na każdym etapie podpowiemy, z kim warto współpracować.',
        audience: 'Inwestorzy prywatni i samorządy',
      },
    ],
    audienceLabel: 'Dla kogo:',
  },
  about: {
    title: `Pracownia od ${site.foundedYear} roku`,
    quote: '„Każdy projekt zaczyna się od działki, nie od szkicownika.”',
    quoteAuthor: `${site.founder}`,
    paragraphs: [
      'Jesteśmy kilkuosobowym zespołem ze Stargardu. Projektujemy wspólnie z inwestorem i stawiamy na rozwiązania praktyczne i współczesne.',
      'Mamy szerokie kontakty i wieloletnie doświadczenie we współpracy z urzędami i wykonawcami. Dlatego wspieramy inwestora w decyzjach na każdym etapie, od wyboru działki do zakończenia budowy.',
    ],
    // PLACEHOLDER: describe the real photo after replacing about-studio.png.
    imageAlt: 'Makieta architektoniczna domu na wystawie',
  },
  portfolio: {
    title: 'Wybrane realizacje',
    // PLACEHOLDER: alt texts follow the pattern "Projekt: {title}" until the photos are replaced.
    projects: {
      beaches: {
        title: 'Modernizacja plaż: Dziewoklicz, Dąbie, Głębokie',
        category: 'Przestrzeń publiczna',
        imageAlt: 'Projekt: Modernizacja plaż: Dziewoklicz, Dąbie, Głębokie',
      },
      house: {
        title: 'Dom jednorodzinny w Pełczycach',
        category: 'Dom prywatny',
        imageAlt: 'Projekt: Dom jednorodzinny w Pełczycach',
      },
      promenade: {
        title: 'Promenada nad jeziorem Miedwie',
        category: 'Przestrzeń publiczna',
        imageAlt: 'Projekt: Promenada nad jeziorem Miedwie',
      },
      plan: {
        title: 'Plan urbanistyczny w Stargardzie',
        category: 'Urbanistyka',
        imageAlt: 'Projekt: Plan urbanistyczny w Stargardzie',
      },
    },
  },
  contact: {
    title: 'Porozmawiajmy o projekcie',
    lead: `Zadzwoń albo napisz: opowiedz, co chcesz zbudować lub zagospodarować, a podpowiemy, od czego zacząć. Jesteśmy dostępni od poniedziałku do piątku, ${site.hours.opens}–${site.hours.closes}.`,
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
    hoursTime: `${site.hours.opens}–${site.hours.closes}`,
  },
  footer: {
    companyTitle: 'Firma',
    navTitle: 'Nawigacja',
    taxIdLabel: 'NIP',
    licenseLabel: 'Nr uprawnień',
    licenseTodo: 'do uzupełnienia',
    backToTop: 'Do góry',
    copyright: (year: number): string => `© ${year} ${site.brand}`,
  },
  privacy: {
    updatedLabel: 'Ostatnia aktualizacja',
    backToHome: 'Wróć na stronę główną',
  },
  notFound: {
    title: 'Nie znaleziono strony',
    description: 'Strona, której szukasz, nie istnieje albo została przeniesiona.',
    homeLink: 'Wróć na stronę główną',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 'otwiera się w nowej karcie',
  },
};
