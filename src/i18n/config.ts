export const locales = ['pl', 'en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

interface LocaleMeta {
  /** Open Graph locale code. */
  readonly ogLocale: string;
  /** Visible, native name of the language (used in the language switcher). */
  readonly label: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  pl: { ogLocale: 'pl_PL', label: 'PL' },
  en: { ogLocale: 'en_GB', label: 'EN' },
  fr: { ogLocale: 'fr_FR', label: 'FR' },
};

/** Section anchors, identical in every language (BLUEPRINT §4.1). */
export const sectionIds = {
  top: 'top',
  services: 'services',
  about: 'about',
  portfolio: 'portfolio',
  contact: 'contact',
} as const;

export type SectionId = keyof typeof sectionIds;
