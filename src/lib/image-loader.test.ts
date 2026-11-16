import { afterEach, describe, expect, it, vi } from 'vitest';

import imageLoader, { IMAGE_WIDTHS } from './image-loader';

const hashed = '/_next/static/media/hero-building.1njx2198dxipq.png';

afterEach(() => vi.unstubAllEnvs());

describe('imageLoader (static export)', () => {
  it('maps a hashed original to the smallest WebP variant that is wide enough', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(imageLoader({ src: hashed, width: 640 })).toBe(
      '/images/optimized/hero-building-640.webp',
    );
    expect(imageLoader({ src: hashed, width: 700 })).toBe(
      '/images/optimized/hero-building-750.webp',
    );
    expect(imageLoader({ src: hashed, width: 96 })).toBe(
      '/images/optimized/hero-building-384.webp',
    );
  });

  it('uses the largest variant for very wide requests', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(imageLoader({ src: hashed, width: 3840 })).toBe(
      `/images/optimized/hero-building-${IMAGE_WIDTHS.at(-1)}.webp`,
    );
  });

  it('serves the original (with the width in the query) in development and unknown files as is', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(imageLoader({ src: hashed, width: 640 })).toBe(`${hashed}?w=640`);
    vi.stubEnv('NODE_ENV', 'production');
    expect(imageLoader({ src: '/other.svg', width: 640 })).toBe('/other.svg');
  });
});
