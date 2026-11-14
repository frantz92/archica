import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/config';
import { languageAlternates, pagePaths, pageUrl } from '@/lib/metadata';

/** Six URLs (3 languages × 2 pages), each with its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pagePaths.flatMap((path) =>
    locales.map((locale) => ({
      url: pageUrl(locale, path),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
