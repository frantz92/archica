import type { ImageLoaderProps } from 'next/image';

/**
 * Widths of the generated variants (keep in sync with scripts/optimize-images.mjs). Next.js asks
 * for the widths of its `srcset`; each request is answered with the next variant that is large enough.
 */
export const IMAGE_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920] as const;

/** `/_next/static/media/hero-building.1njx2198dxipq.png` -> `hero-building` */
const HASHED_FILE = /\/([\w-]+)\.[\w]+\.(?:png|jpe?g)$/;

/**
 * Custom loader for the static export (no image server). Static imports resolve to hashed
 * originals; their optimized WebP variants sit in /images/optimized/ (generated before the build).
 * In development the original is served as is; the width is appended as a query string only so
 * that Next.js sees a loader that uses the width (the dev server ignores it).
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const name = HASHED_FILE.exec(src)?.[1];
  if (process.env.NODE_ENV !== 'production') return `${src}?w=${width}`;
  if (!name) return src;
  const target = IMAGE_WIDTHS.find((candidate) => candidate >= width) ?? IMAGE_WIDTHS.at(-1);
  return `/images/optimized/${name}-${target}.webp`;
}
