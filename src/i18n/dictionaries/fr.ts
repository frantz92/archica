import type { Dictionary } from './types';

/**
 * French. Guillemets « … » with non-breaking spaces, non-breaking space before : ; ! ? and
 * apostrophe ’ (BLUEPRINT §4.3). Non-breaking spaces are written as  .
 */
export const fr = {
  meta: {
    title: 'Archica — Atelier d’architecture et d’urbanisme, Stargard, Pologne',
    description:
      'Atelier d’architecture et d’urbanisme à Stargard, en Pologne, depuis 1996. Conception de maisons individuelles et de bâtiments publics, urbanisme et prise en charge complète des démarches administratives.',
    ogImageAlt: 'Logo Archica — Atelier d’architecture et d’urbanisme',
    privacyTitle: 'Politique de confidentialité',
    privacyDescription:
      'Informations sur le traitement des données personnelles sur archica.pl et sur les droits des personnes concernées.',
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
    title: 'Une architecture qui commence par le lieu.',
    lead: 'Depuis 1996, nous concevons à Stargard des maisons individuelles, des bâtiments publics et des espaces urbains. Nous accompagnons chaque projet, de l’analyse du terrain jusqu’au permis de construire.',
    primaryCta: 'Nous contacter',
    secondaryCta: 'Voir les réalisations',
    imageAlt: 'Visualisation d’un bâtiment conçu par l’atelier Archica',
    stats: {
      yearsLabel: 'ans de pratique',
      projectsLabel: 'projets',
      awardsLabel: 'prix',
      locationValue: 'Stargard',
      locationLabel: 'depuis 1996',
    },
  },
  services: {
    title: 'Ce que nous concevons',
    lead: 'Nous concevons les bâtiments de A à Z, et nous nous occupons nous-mêmes des permis, de la documentation et des autorisations.',
    items: [
      {
        title: 'Maisons individuelles',
        description:
          'Des projets de maisons sur mesure, adaptés au terrain, au budget et au mode de vie des habitants.',
        audience: 'Particuliers',
      },
      {
        title: 'Bâtiments publics et communaux',
        description:
          'Bâtiments publics, promenades et cimetières : des espaces destinés à bien servir les habitants pendant des décennies.',
        audience: 'Collectivités locales',
      },
      {
        title: 'Urbanisme',
        description:
          'Planification urbaine et concepts d’aménagement du territoire. Nous mettons de l’ordre dans l’espace avant que le premier bâtiment ne voie le jour.',
        audience: 'Collectivités locales',
      },
      {
        title: 'Démarches administratives',
        description:
          'Nous nous chargeons nous-mêmes des permis, de la documentation et des autorisations. Le client a un seul interlocuteur, de la première conversation jusqu’à la décision.',
        audience: 'Particuliers et collectivités locales',
      },
    ],
    audienceLabel: 'Pour qui',
  },
  about: {
    title: 'Un atelier depuis 1996',
    quote: '« Chaque projet commence par le site, pas par le carnet de croquis. »',
    quoteAuthor: 'Małgorzata Wojtaś-Frankowska, architecte',
    paragraphs: [
      'Archica est installé à Stargard depuis 1996. L’atelier a été fondé et est dirigé par Małgorzata Wojtaś-Frankowska, architecte.',
      'Nous travaillons en petite équipe : chaque projet est donc mené du début à la fin par les mêmes personnes, de la première visite sur le terrain jusqu’au dossier complet.',
    ],
    imageAlt: 'Intérieur de l’atelier d’architecture Archica',
    table: {
      foundedLabel: 'Fondation',
      seatLabel: 'Siège',
      leaderLabel: 'Direction',
    },
  },
  portfolio: {
    title: 'Réalisations choisies',
    projects: {
      residence: {
        category: 'maison privée',
        imageAlt: 'Visualisation : Rezydencja Brzozowa',
      },
      office: {
        category: 'commercial',
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
    title: 'Parlons de votre projet',
    lead: 'Appelez-nous ou écrivez-nous. Nous répondons du lundi au vendredi, de 08h00 à 16h00.',
    labels: {
      phone: 'Téléphone',
      email: 'E-mail',
      address: 'Adresse',
      hours: 'Horaires',
    },
    copyEmail: 'Copier l’adresse',
    copiedEmail: 'Copiée',
    showOnMap: 'Voir sur la carte',
    hoursDays: 'lun.–ven.',
    hoursTime: '08h00–16h00',
  },
  footer: {
    companyTitle: 'Société',
    contactTitle: 'Contact',
    navTitle: 'Navigation',
    taxIdLabel: 'NIP',
    licenseLabel: 'Numéro d’habilitation',
    licenseTodo: 'à compléter',
    backToTop: 'Haut de page',
    copyright: (year: number): string => `© ${year} Studio Architektury i Urbanistyki Archica`,
  },
  privacy: {
    updatedLabel: 'Dernière mise à jour',
    backToHome: 'Retour à la page d’accueil',
  },
  notFound: {
    title: 'Page introuvable',
    description: 'La page que vous recherchez n’existe pas ou a été déplacée.',
    homeLink: 'Retour à la page d’accueil',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 's’ouvre dans un nouvel onglet',
  },
} satisfies Dictionary;
