import type { Dictionary } from '@/i18n/dictionaries/types';
import type { Locale } from '@/i18n/config';

/** Props shared by every page section: the active locale and its dictionary. */
export interface SectionProps {
  locale: Locale;
  dictionary: Dictionary;
}
