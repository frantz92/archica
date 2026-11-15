import { site } from '@/content/site';
import { pluralForm } from '@/lib/plural';

import type { Dictionary } from './types';

/** British English. Quotation marks “…”, apostrophe ’ (BLUEPRINT §4.3). */
export const en = {
  meta: {
    title: 'Archica — architecture studio in Stargard, Poland',
    description: `Architecture and urban planning studio in Stargard, Poland, since ${site.foundedYear}. Architectural design, interior architecture, urban planning and construction supervision.`,
    ogImageAlt: 'Archica logo — Architecture and Urban Planning Studio',
    privacyTitle: 'Privacy policy',
    privacyDescription: `Information on how personal data is processed on ${site.hostname} and on the rights of data subjects.`,
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
    title: 'Design, interiors, supervision. One studio.',
    lead: 'From the first sketch to the final handover, we lead every stage of the project.',
    primaryCta: 'Discuss your project',
    secondaryCta: 'See our projects',
    imageAlt: 'Glass facade of a modern building against the sky',
    stats: {
      yearsLabel: (years: number): string =>
        pluralForm('en', years, { one: 'year in practice', other: 'years in practice' }),
      projectsLabel: 'projects',
      awardsLabel: 'awards',
      locationValue: site.address.city,
      locationLabel: 'studio location',
    },
  },
  services: {
    title: 'Services',
    items: [
      {
        id: 'design',
        title: 'Architectural design',
        description:
          'From concept to construction documentation for private houses, offices and public buildings.',
      },
      {
        id: 'interiors',
        title: 'Interior architecture',
        description: 'Space planning tailored to the way you live.',
      },
      {
        id: 'urban',
        title: 'Urban planning',
        description: 'Land development concepts that respect their context and community.',
      },
      {
        id: 'supervision',
        title: 'Construction supervision',
        description: 'Supervision on site so that the finished building matches the design.',
      },
    ],
  },
  about: {
    title: 'Know who you are working with',
    quote: '“Every project starts with the site, not the sketchbook.”',
    quoteAuthor: `${site.founderName}, architect and founder`,
    paragraphs: [
      'Archica is a small studio led from the start by its founder. A real person stands behind every project, not an anonymous team.',
      'The same people lead a project from the first visit to the site through to supervision on site. Nothing has to be explained twice.',
    ],
    imageAlt: 'Architectural model of a house on display',
    table: {
      foundedLabel: 'Founded',
      seatLabel: 'Office',
      clientsLabel: 'Clients',
      clientsValue: 'Private investors and local authorities',
    },
  },
  portfolio: {
    title: 'Selected projects',
    lead: 'Projects of various scales, from a family house to a public space.',
    projects: {
      residence: {
        category: 'family house',
        imageAlt: 'Visualisation: Rezydencja Brzozowa',
      },
      office: {
        category: 'commercial building',
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
    title: 'Got a plot or an idea? Let’s talk.',
    lead: 'Call or write to us. We will tell you where to start.',
    labels: {
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      hours: 'Opening hours',
    },
    copyEmail: 'Copy email',
    copiedEmail: 'Copied',
    showOnMap: 'View in Google Maps',
    hoursDays: 'Mon–Fri',
    hoursTime: `${site.hours.opens}–${site.hours.closes}`,
  },
  footer: {
    companyTitle: 'Company details',
    navTitle: 'Navigation',
    taxIdLabel: 'NIP',
    licenseLabel: 'Licence number',
    licenseTodo: 'to be completed',
    backToTop: 'Back to top',
    copyright: (year: number): string => `© ${year} ${site.brand}`,
  },
  privacy: {
    updatedLabel: 'Last updated',
    backToHome: 'Back to the home page',
  },
  notFound: {
    title: 'This page isn’t in the plans',
    description: 'The address may have changed, or there may be a typo.',
    homeLink: 'Back to the home page',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 'opens in a new tab',
  },
} satisfies Dictionary;
