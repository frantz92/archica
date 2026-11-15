import { ImageResponse } from 'next/og';

import { STACKED_MARK_PATH, WORDMARK_PATH } from '@/components/ui/logo-paths';
import { isLocale, locales } from '@/i18n/config';
import { brandColors } from '@/lib/brand';
import { OG_IMAGE_SIZE } from '@/lib/metadata';
import { notFound } from 'next/navigation';

export const size = OG_IMAGE_SIZE;
export const dynamicParams = false;
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const LOGO_HEIGHT = 320;
const LOGO_WIDTH = Math.round((LOGO_HEIGHT * 230.3) / 166.789);

/**
 * 1200 × 630, coal background, stacked logo in chalk drawn from vector paths (no font text).
 * The alt text is set per language in the page metadata (the `alt` export cannot vary by locale).
 */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

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
      <svg width={LOGO_WIDTH} height={LOGO_HEIGHT} viewBox="0 0 230.3 166.789">
        <path d={STACKED_MARK_PATH} fill={brandColors.chalk} />
        <path d={WORDMARK_PATH} fill={brandColors.chalk} />
      </svg>
    </div>,
    size,
  );
}
