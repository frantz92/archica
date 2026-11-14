import type { Dictionary } from './types';

/** British English. Quotation marks “…”, apostrophe ’ (BLUEPRINT §4.3). */
export const en = {
  meta: {
    title: 'Archica — Architecture and Urban Planning Studio, Stargard, Poland',
    description:
      'Architecture and urban planning studio in Stargard, Poland, since 1996. Design of family houses and public buildings, urban planning and full handling of permits and formalities.',
    ogImageAlt: 'Archica logo — Architecture and Urban Planning Studio',
    privacyTitle: 'Privacy policy',
    privacyDescription:
      'Information on how personal data is processed on archica.pl and on the rights of data subjects.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    homeLink: 'Archica — home page',
    mainNav: 'Main navigation',
    footerNav: 'Footer navigation',
    mobileMenuTitle: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    languageSwitcher: 'Language selection',
    languageNames: { pl: 'Polski', en: 'English', fr: 'Français' },
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
    logoName: 'Archica',
  },
  nav: {
    services: 'Services',
    about: 'About',
    portfolio: 'Portfolio',
    contact: 'Contact',
    privacy: 'Privacy policy',
  },
  hero: {
    eyebrow: 'Architecture and Urban Planning Studio',
    title: 'Architecture that begins with the place.',
    lead: 'Since 1996 we have been designing family houses, public buildings and urban spaces in Stargard. We lead each project from the site analysis to the building permit.',
    primaryCta: 'Get in touch',
    secondaryCta: 'See our work',
    imageAlt: 'Visualisation of a building designed by the Archica studio',
    stats: {
      yearsLabel: 'years in practice',
      projectsLabel: 'projects',
      awardsLabel: 'awards',
      locationValue: 'Stargard',
      locationLabel: 'since 1996',
    },
  },
  services: {
    title: 'What we design',
    lead: 'We design buildings from start to finish, and we handle permits, documentation and approvals ourselves.',
    items: [
      {
        title: 'Family houses',
        description:
          'Individual house designs tailored to the plot, the budget and the way the household lives.',
        audience: 'Private clients',
      },
      {
        title: 'Public and municipal buildings',
        description:
          'Public buildings, promenades and cemeteries: spaces meant to serve residents well for decades.',
        audience: 'Local authorities',
      },
      {
        title: 'Urban planning',
        description:
          'Urban planning and land development concepts. We put the space in order before the first building appears.',
        audience: 'Local authorities',
      },
      {
        title: 'Formalities',
        description:
          'We take care of permits, documentation and approvals ourselves. The client has a single point of contact from the first conversation to the decision.',
        audience: 'Private clients and local authorities',
      },
    ],
    audienceLabel: 'For whom',
  },
  about: {
    title: 'A studio since 1996',
    quote: '“Every project starts with the site, not the sketchbook.”',
    quoteAuthor: 'Małgorzata Wojtaś-Frankowska, architect',
    paragraphs: [
      'Archica has been working in Stargard since 1996. The studio was founded and is led by Małgorzata Wojtaś-Frankowska, architect.',
      'We work in a small team, so every project is led from start to finish by the same people: from the first visit to the site to the complete set of documents.',
    ],
    imageAlt: 'Interior of the Archica architectural studio',
    table: {
      foundedLabel: 'Founded',
      seatLabel: 'Office',
      leaderLabel: 'Led by',
    },
  },
  portfolio: {
    title: 'Selected work',
    projects: {
      residence: {
        category: 'private house',
        imageAlt: 'Visualisation: Rezydencja Brzozowa',
      },
      office: {
        category: 'commercial',
        imageAlt: 'Visualisation: Biura Meridian',
      },
      interior: {
        category: 'interior architecture',
        imageAlt: 'Visualisation: Wnętrze Linden',
      },
      pavilion: {
        category: 'public space',
        imageAlt: 'Visualisation: Pawilon Grove',
      },
    },
  },
  contact: {
    title: 'Let’s talk about your project',
    lead: 'Call or write to us. We reply Monday to Friday, 08:00–16:00.',
    labels: {
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      hours: 'Hours',
    },
    copyEmail: 'Copy address',
    copiedEmail: 'Copied',
    showOnMap: 'Show on map',
    hoursDays: 'Mon–Fri',
    hoursTime: '08:00–16:00',
  },
  footer: {
    companyTitle: 'Company',
    contactTitle: 'Contact',
    navTitle: 'Navigation',
    taxIdLabel: 'NIP',
    licenseLabel: 'Licence number',
    licenseTodo: 'to be completed',
    backToTop: 'Back to top',
    copyright: (year: number): string => `© ${year} Studio Architektury i Urbanistyki Archica`,
  },
  privacy: {
    updatedLabel: 'Last updated',
    backToHome: 'Back to the home page',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has been moved.',
    homeLink: 'Back to the home page',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 'opens in a new tab',
  },
} satisfies Dictionary;
