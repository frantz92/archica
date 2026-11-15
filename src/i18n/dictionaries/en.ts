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
    eyebrow: 'Architecture and Urban Planning Studio · Stargard',
    title: 'From first idea to a place you want to be.',
    lead: `Since ${site.foundedYear} we have designed houses, public spaces and urban plans. We help you choose a plot, handle the paperwork and look for practical, contemporary solutions together.`,
    primaryCta: 'Get in touch',
    secondaryCta: 'See our work',
    // PLACEHOLDER: describe the real photo after replacing hero-building.png.
    imageAlt: 'Glass facade of a modern building against the sky',
    stats: {
      yearsLabel: (years: number): string =>
        pluralForm('en', years, { one: 'year in practice', other: 'years in practice' }),
      projectsLabel: 'projects',
      tendersLabel: 'municipal tenders won',
      municipalitiesLabel: 'municipalities and towns',
    },
  },
  services: {
    title: 'How we can help',
    lead: 'From choosing the plot to the end of construction, we stay with your project at every stage: design, paperwork and support during the build.',
    items: [
      {
        id: 'houses',
        title: 'Single-family houses',
        description:
          'We help you choose a plot, then design the house together with you. We propose practical, contemporary solutions, and we can adapt an existing design to your needs. Every project comes with a visualisation.',
        audience: 'Private clients',
      },
      {
        id: 'public',
        title: 'Public and municipal projects',
        description:
          'Lakeside promenades, beaches, playgrounds, skate parks, cemeteries and public buildings. We design the whole scheme, from the layout of the paths to shelters, footbridges and street furniture.',
        audience: 'Local authorities',
      },
      {
        id: 'urban',
        title: 'Urban planning',
        description:
          'Local spatial development plans, planning studies and development conditions decisions. We put the space in order before the first building goes up.',
        audience: 'Local authorities',
      },
      {
        id: 'permits',
        title: 'Permits and approvals',
        description:
          'We handle permits, documentation and approvals from the authorities ourselves, and we supervise the work during construction. We have a wide network of contacts, so at every stage we can tell you who is worth working with.',
        audience: 'Private clients and local authorities',
      },
    ],
    audienceLabel: 'For whom:',
  },
  about: {
    title: `A studio since ${site.foundedYear}`,
    quote: '“Every project starts with the site, not the sketchbook.”',
    quoteAuthor: `${site.founderName}, architect`,
    paragraphs: [
      'We are a small team based in Stargard. We design together with the client and favour practical, contemporary solutions.',
      'We have a wide network of contacts and many years of experience working with local authorities and contractors. That lets us support your decisions at every stage, from choosing the plot to the end of construction.',
    ],
    // PLACEHOLDER: describe the real photo after replacing about-studio.png.
    imageAlt: 'Architectural model of a house on display',
  },
  portfolio: {
    title: 'Selected work',
    // PLACEHOLDER: alt texts follow the pattern "Project: {title}" until the photos are replaced.
    projects: {
      beaches: {
        title: 'Beach renovation: Dziewoklicz, Dąbie, Głębokie',
        category: 'Public space',
        imageAlt: 'Project: Beach renovation: Dziewoklicz, Dąbie, Głębokie',
      },
      house: {
        title: 'Single-family house in Pełczyce',
        category: 'Private house',
        imageAlt: 'Project: Single-family house in Pełczyce',
      },
      promenade: {
        title: 'Promenade on Lake Miedwie',
        category: 'Public space',
        imageAlt: 'Project: Promenade on Lake Miedwie',
      },
      plan: {
        title: 'Urban plan for Stargard',
        category: 'Urban planning',
        imageAlt: 'Project: Urban plan for Stargard',
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
