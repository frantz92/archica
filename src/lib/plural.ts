import type { Locale } from '@/i18n/config';

type PluralForms = { readonly other: string } & Partial<Record<Intl.LDMLPluralRule, string>>;

/** Picks the noun form for `count` using the CLDR plural rules of `locale` (PL: rok / lata / lat). */
export function pluralForm(locale: Locale, count: number, forms: PluralForms): string {
  return forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;
}
