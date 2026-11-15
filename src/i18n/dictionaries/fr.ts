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
    title: 'Architecte à Stargard — maisons et urbanisme | Archica',
    description: `Atelier d’architecture à Stargard (Pologne) depuis ${site.foundedYear}. Maisons individuelles, espaces publics et urbanisme, du choix du terrain à la fin du chantier.`,
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
    eyebrow: 'Atelier d’architecture et d’urbanisme · Stargard',
    title: 'De la première idée à un lieu où l’on a envie d’être.',
    lead: `Depuis ${site.foundedYear}, nous concevons des maisons, des espaces publics et des plans d’urbanisme. Nous vous aidons à choisir le terrain, nous gérons les démarches et nous cherchons ensemble des solutions pratiques et contemporaines.`,
    primaryCta: 'Nous contacter',
    secondaryCta: 'Voir les réalisations',
    // PLACEHOLDER: describe the real photo after replacing hero-building.png.
    imageAlt: 'Façade vitrée d’un bâtiment moderne sur fond de ciel',
    stats: {
      yearsLabel: (years: number): string =>
        pluralForm('fr', years, { one: 'an de pratique', other: 'ans de pratique' }),
      projectsLabel: 'projets',
      tendersLabel: 'appels d’offres municipaux remportés',
      municipalitiesLabel: 'communes et villes',
    },
  },
  services: {
    title: 'Comment nous pouvons vous aider',
    lead: 'Du choix du terrain à la fin du chantier, nous accompagnons votre projet à chaque étape : conception, démarches et suivi pendant les travaux.',
    items: [
      {
        id: 'houses',
        title: 'Maisons individuelles',
        description:
          'Nous vous aidons à choisir le terrain, puis nous concevons la maison avec vous. Nous proposons des solutions pratiques et contemporaines, et nous pouvons adapter un projet existant à vos besoins. Chaque projet est accompagné d’une visualisation.',
        audience: 'Maîtres d’ouvrage privés',
      },
      {
        id: 'public',
        title: 'Ouvrages publics et communaux',
        description:
          'Promenades au bord des lacs, plages, aires de jeux, skateparks, cimetières et bâtiments publics. Nous concevons l’ensemble de l’aménagement, du tracé des allées aux kiosques, passerelles et mobilier urbain.',
        audience: 'Collectivités locales',
      },
      {
        id: 'urban',
        title: 'Urbanisme',
        description:
          'Plans locaux d’aménagement, études des conditions et orientations d’aménagement et décisions sur les conditions de construction. Nous mettons de l’ordre dans l’espace avant que le premier bâtiment ne sorte de terre.',
        audience: 'Collectivités locales',
      },
      {
        id: 'permits',
        title: 'Démarches administratives',
        description:
          'Nous prenons en charge les permis, la documentation et les accords avec les administrations, et nous assurons le suivi du chantier. Grâce à notre large réseau de contacts, nous pouvons vous indiquer, à chaque étape, avec qui il vaut la peine de travailler.',
        audience: 'Maîtres d’ouvrage privés et collectivités locales',
      },
    ],
    audienceLabel: 'Pour qui :',
  },
  about: {
    title: `Un atelier depuis ${site.foundedYear}`,
    quote: '« Chaque projet commence par le site, pas par le carnet de croquis. »',
    quoteAuthor: `${site.founderName}, architecte`,
    paragraphs: [
      'Nous sommes une petite équipe installée à Stargard. Nous concevons avec le maître d’ouvrage et privilégions des solutions pratiques et contemporaines.',
      'Nous disposons d’un large réseau de contacts et d’une longue expérience de travail avec les administrations et les entreprises. Nous pouvons ainsi vous accompagner dans vos décisions à chaque étape, du choix du terrain à la fin du chantier.',
    ],
    // PLACEHOLDER: describe the real photo after replacing about-studio.png.
    imageAlt: 'Maquette d’architecture d’une maison exposée',
  },
  portfolio: {
    title: 'Réalisations choisies',
    // PLACEHOLDER: alt texts follow the pattern "Projet : {titre}" until the photos are replaced.
    projects: {
      beaches: {
        title: 'Réaménagement de plages : Dziewoklicz, Dąbie, Głębokie',
        category: 'Espace public',
        imageAlt: 'Projet : Réaménagement de plages : Dziewoklicz, Dąbie, Głębokie',
      },
      house: {
        title: 'Maison individuelle à Pełczyce',
        category: 'Maison individuelle',
        imageAlt: 'Projet : Maison individuelle à Pełczyce',
      },
      promenade: {
        title: 'Promenade du lac de Miedwie',
        category: 'Espace public',
        imageAlt: 'Projet : Promenade du lac de Miedwie',
      },
      plan: {
        title: 'Plan d’urbanisme de Stargard',
        category: 'Urbanisme',
        imageAlt: 'Projet : Plan d’urbanisme de Stargard',
      },
    },
  },
  contact: {
    title: 'Parlons de votre projet',
    lead: `Appelez-nous ou écrivez-nous : dites-nous ce que vous souhaitez construire ou aménager, nous vous indiquerons par où commencer. Nous sommes joignables du lundi au vendredi, de ${hours.opens} à ${hours.closes}.`,
    labels: {
      phone: 'Téléphone',
      email: 'E-mail',
      address: 'Adresse',
      hours: 'Horaires',
    },
    copyEmail: 'Copier l’adresse',
    copiedEmail: 'Copié',
    showOnMap: 'Voir sur la carte',
    hoursDays: 'lun.–ven.',
    hoursTime: `${hours.opens}–${hours.closes}`,
  },
  footer: {
    companyTitle: 'Société',
    navTitle: 'Navigation',
    taxIdLabel: 'NIP',
    licenseLabel: 'N° d’agrément',
    licenseTodo: 'à compléter',
    backToTop: 'Haut de page',
    copyright: (year: number): string => `© ${year} ${site.brand}`,
  },
  privacy: {
    updatedLabel: 'Dernière mise à jour',
    backToHome: 'Retour à la page d’accueil',
  },
  notFound: {
    title: 'Page introuvable',
    description: 'La page que vous cherchez n’existe pas ou a été déplacée.',
    homeLink: 'Retour à l’accueil',
  },
  common: {
    placeholder: 'placeholder',
    opensInNewTab: 's’ouvre dans un nouvel onglet',
  },
} satisfies Dictionary;
