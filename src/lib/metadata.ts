import type { Metadata } from 'next';

import { site } from '@/content/site';
import { defaultLocale, localeMeta, locales, type Locale } from '@/i18n/config';

/** Page paths below a locale: '' is the home page. */
export type PagePath = '' | '/privacy';

export const pagePaths: readonly PagePath[] = ['', '/privacy'];

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export function pageUrl(locale: Locale, path: PagePath): string {
  // Trailing slash: that is the URL of the exported page (`/pl/privacy/index.html`).
  return `${site.domain}/${locale}${path}/`;
}

/** hreflang map for one page: every language plus x-default pointing to the default language. */
export function languageAlternates(path: PagePath): Record<string, string> {
  const entries = locales.map((locale): [string, string] => [locale, pageUrl(locale, path)]);
  return { ...Object.fromEntries(entries), 'x-default': pageUrl(defaultLocale, path) };
}

export function ogImageUrl(locale: Locale): string {
  return `${site.domain}/${locale}/opengraph-image`;
}

interface PageMetadataInput {
  locale: Locale;
  path: PagePath;
  /** `<title>`: a string uses the layout template ("%s — Archica"); `absolute` bypasses it. */
  title: string | { absolute: string };
  /** Title for Open Graph and Twitter cards (already complete). */
  socialTitle: string;
  description: string;
  imageAlt: string;
}

/** Complete metadata for one page: title, canonical, hreflang, Open Graph and Twitter. */
export function createPageMetadata({
  locale,
  path,
  title,
  socialTitle,
  description,
  imageAlt,
}: PageMetadataInput): Metadata {
  const url = pageUrl(locale, path);
  const image = { url: ogImageUrl(locale), ...OG_IMAGE_SIZE, alt: imageAlt };

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: 'website',
      siteName: site.brand,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => localeMeta[other].ogLocale),
      url,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [{ url: image.url, alt: imageAlt }],
    },
  };
}
