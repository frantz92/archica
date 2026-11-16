import { ImageResponse } from 'next/og';

import { logoAssets } from '@/components/ui/logo-assets';
import { locales } from '@/i18n/config';
import { brandColors } from '@/lib/brand';
import { OG_IMAGE_SIZE } from '@/lib/metadata';
import { resolveLocale, type LocaleParams } from '@/lib/route-locale';

export const size = OG_IMAGE_SIZE;
export const dynamicParams = false;
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const LOGO_HEIGHT = 320;
const LOGO_WIDTH = Math.round(
  (LOGO_HEIGHT * logoAssets.stackedSize.width) / logoAssets.stackedSize.height,
);

/**
 * 1200 × 630, coal background, stacked logo in chalk drawn from vector paths (no font text).
 * The alt text is set per language in the page metadata (the `alt` export cannot vary by locale).
 */
export default async function OpenGraphImage({ params }: { params: LocaleParams }) {
  await resolveLocale(params);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: brandColors.coal,
      }}
    >
      <svg width={LOGO_WIDTH} height={LOGO_HEIGHT} viewBox={logoAssets.viewBoxes.stacked}>
        <path d={logoAssets.stackedMarkPath} fill={brandColors.chalk} />
        <path d={logoAssets.wordmarkPath} fill={brandColors.chalk} />
      </svg>
    </div>,
    size,
  );
}
