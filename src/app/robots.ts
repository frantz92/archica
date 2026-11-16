import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { getSiteEnv } from '@/lib/site-env';

// Required for a static export: the file is written once, at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // A review copy (SITE_ENV=preview) must not appear in search results.
  if (getSiteEnv() === 'preview') return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
