import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { defaultLocale } from '@/i18n/config';
import { brandColors } from '@/lib/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.brand,
    start_url: `/${defaultLocale}`,
    display: 'standalone',
    lang: defaultLocale,
    theme_color: brandColors.moss,
    background_color: brandColors.moss,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
