import { site } from '@/content/site';
import { pluralForm } from '@/lib/plural';

import type { Dictionary } from './types';

/** French time format: 08:00 → 08h00 (BLUEPRINT §4.3). */
const hours = {
  opens: site.hours.opens.replace(':', 'h'),
  closes: site.hours.closes.replace(':', 'h'),
};

/**
 * French. Guillemets « … » with non-breaking spaces, non-breaking space before : ; ! ? and
 * apostrophe ’ (BLUEPRINT §4.3). Non-breaking spaces are written as  .
 */
export const fr = {
  meta: {
    title: 'Archica — atelier d’architecture à Stargard, Pologne',
    description: `Atelier d’architecture et d’urbanisme à Stargard, en Pologne, depuis ${site.foundedYear}. Conception architecturale, architecture d’intérieur, urbanisme et suivi de chantier.`,
    ogImageAlt: 'Logo Archica — Atelier d’architecture et d’urbanisme',
    privacyTitle: 'Politique de confidentialité',
    privacyDescription: `Informations sur le traitement des données personnelles sur ${site.hostname} et sur les droits des personnes concernées.`,
  },
  a11y: {
    skipToContent: 'Aller au contenu',
    homeLink: 'Archica — page d’accueil',
    mainNav: 'Navigation principale',
    footerNav: 'Navigation du pied de page',
    mobileMenuTitle: 'Menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    languageSwitcher: 'Choix de la langue',
    languageNames: { pl: 'Polski', en: 'English', fr: 'Français' },
    switchToLight: 'Activer le thème clair',
    switchToDark: 'Activer le thème sombre',
    logoName: 'Archica',
  },
  nav: {
    services: 'Services',
    about: 'À propos',
    portfolio: 'Portfolio',
    contact: 'Contact',
    privacy: 'Politique de confidentialité',
  },
  hero: {
    eyebrow: 'Atelier d’architecture et d’urbanisme',
    title: 'Conception, intérieurs, suivi de chantier. Un seul atelier.',
    lead: 'Du premier croquis à la réception de l’ouvrage, nous conduisons chaque étape du projet.',
    primaryCta: 'Présentez-nous votre projet',
    secondaryCta: 'Voir les projets',
    imageAlt: 'Façade vitrée d’un bâtiment moderne sur fond de ciel',
    stats: {
      yearsLabel: (years: number): string =>
        pluralForm('fr', years, { one: 'an de pratique', other: 'ans de pratique' }),
      projectsLabel: 'projets',
      awardsLabel: 'prix',
      locationValue: site.address.city,
      locationLabel: 'siège de l’atelier',
    },
  },
  services: {
    title: 'Services',
    items: [
      {
        title: 'Conception architecturale',
        description:
          'De la conception à la documentation d’exécution pour des maisons privées, des bureaux et des bâtiments publics.',
      },
      {
        title: 'Architecture d’intérieur',
        description: 'Aménagement des espaces adapté à votre mode de vie.',
      },
      {
        title: 'Planification urbaine',
        description:
          'Concepts d’aménagement du territoire respectueux du contexte et de la communauté.',
      },
      {
        title: 'Suivi de chantier',
        description: 'Suivi sur le chantier afin que la réalisation soit conforme au projet.',
      },
    ],
  },
  about: {
    title: 'Vous savez avec qui vous travaillez',
    quote: '« Chaque projet commence par le site, pas par le carnet de croquis. »',
    quoteAuthor: `${site.founderName}, architecte et fondatrice`,
    paragraphs: [
      'Archica est un petit atelier dirigé depuis ses débuts par sa fondatrice. Derrière chaque projet se tient une personne précise, et non une équipe anonyme.',
      'Les mêmes personnes mènent un projet de la première visite sur le terrain jusqu’au suivi de chantier. Rien n’a besoin d’être expliqué deux fois.',
    ],
    imageAlt: 'Maquette d’architecture d’une maison exposée',
    table: {
      foundedLabel: 'Fondation',
      seatLabel: 'Siège',
      clientsLabel: 'Clients',
      clientsValue: 'Particuliers et collectivités locales',
    },
  },
  portfolio: {
    title: 'Projets sélectionnés',
    lead: 'Des projets de toutes échelles, de la maison individuelle à l’espace public.',
    projects: {
      residence: {
        category: 'maison individuelle',
        imageAlt: 'Visualisation : Rezydencja Brzozowa',
      },
      office: {
        category: 'bâtiment commercial',
        imageAlt: 'Visualisation : Biura Meridian',
      },
      interior: {
        category: 'architecture d’intérieur',
        imageAlt: 'Visualisation : Wnętrze Linden',
      },
      pavilion: {
        category: 'espace public',
        imageAlt: 'Visualisation : Pawilon Grove',
      },
    },
  },
  contact: {
    title: 'Un terrain ou une idée ? Parlons-en.',
    lead: 'Appelez-nous ou écrivez-nous. Nous vous dirons par où commencer.',
    labels: {
      phone: 'Téléphone',
      email: 'E-mail',
      address: 'Adresse',
      hours: 'Horaires',
    },
    copyEmail: 'Copier l’e-mail',
    copiedEmail: 'Copié',
    showOnMap: 'Voir dans Google Maps',
    hoursDays: 'lun.–ven.',
    hoursTime: `${hours.opens}–${hours.closes}`,
  },
  footer: {
    companyTitle: 'Données de l’entreprise',
    navTitle: 'Navigation',
    taxIdLabel: 'NIP',
    licenseLabel: 'Numéro d’habilitation',
    licenseTodo: 'à compléter',
    backToTop: 'Haut de page',
    copyright: (year: number): string => `© ${year} ${site.brand}`,
  },
  privacy: {
    updatedLabel: 'Dernière mise à jour',
    backToHome: 'Retour à la page d’accueil',
  },
  notFound: {
    title: 'Cette page ne figure pas aux plans',
    description: 'L’adresse a peut-être changé, ou une faute de frappe s’est glissée.',
    homeLink: 'Retour à la page d’accueil',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 's’ouvre dans un nouvel onglet',
  },
} satisfies Dictionary;
