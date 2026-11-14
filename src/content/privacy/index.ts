import type { Locale } from '@/i18n/config';

import { privacyEn } from './en';
import { privacyFr } from './fr';
import { privacyPl } from './pl';
import type { PrivacyDocument } from './types';

const documents: Record<Locale, PrivacyDocument> = {
  pl: privacyPl,
  en: privacyEn,
  fr: privacyFr,
};

export function getPrivacyDocument(locale: Locale): PrivacyDocument {
  return documents[locale];
}
