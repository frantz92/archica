import 'server-only';

import type { Locale } from './config';
import { en } from './dictionaries/en';
import { fr } from './dictionaries/fr';
import { pl } from './dictionaries/pl';
import type { Dictionary } from './dictionaries/types';

const dictionaries: Record<Locale, Dictionary> = { pl, en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
