import { ImageResponse } from 'next/og';

import { MARK_PATH } from '@/components/ui/logo-paths';
import { brandColors } from '@/lib/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
// Required for a static export: the file is written once, at build time.
export const dynamic = 'force-static';

/** 180 × 180, coal background, full emblem in chalk at 60% of the width. */
export default function AppleIcon() {
  const markSize = size.width * 0.6;
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
      <svg width={markSize} height={markSize} viewBox="0 0 100 100">
        <path d={MARK_PATH} fill={brandColors.chalk} />
      </svg>
    </div>,
    size,
  );
}
