import { sectionIds, type Locale, type SectionId } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/types';

/** One entry of the section navigation (header, mobile menu, footer). */
export interface NavLinkItem {
  readonly id: SectionId;
  readonly label: string;
}

/** The sections that appear in the navigation, in page order. The hero has no entry: the logo leads there. */
export function getNavLinks(nav: Dictionary['nav']): NavLinkItem[] {
  return [
    { id: 'services', label: nav.services },
    { id: 'about', label: nav.about },
    { id: 'portfolio', label: nav.portfolio },
    { id: 'contact', label: nav.contact },
  ];
}

/** URL of a section of the home page in a given language, e.g. `/pl#services`. */
export function sectionHref(locale: Locale, id: SectionId): string {
  return `/${locale}#${sectionIds[id]}`;
}

/** URL of the privacy policy in a given language. */
export function privacyHref(locale: Locale): string {
  return `/${locale}/privacy`;
}
