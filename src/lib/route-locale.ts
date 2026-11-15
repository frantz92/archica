import { notFound } from 'next/navigation';

import { isLocale, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/types';
import { getDictionary } from '@/i18n/get-dictionary';

/** The `params` object Next.js passes to a route below `[locale]`. */
export type LocaleParams = Promise<{ locale: string }>;

/** Language of the current route. An unsupported language segment renders the 404 page. */
export async function resolveLocale(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

/** Language of the current route together with its dictionary. */
export async function resolveRoute(
  params: LocaleParams,
): Promise<{ locale: Locale; dictionary: Dictionary }> {
  const locale = await resolveLocale(params);
  return { locale, dictionary: getDictionary(locale) };
}
