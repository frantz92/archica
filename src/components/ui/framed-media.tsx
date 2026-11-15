import { cn } from '@/lib/cn';
import type { ImageKey } from '@/content/images';

import { Media } from './media';

interface FramedMediaProps {
  image: ImageKey;
  alt: string;
  sizes: string;
  /** Dictionary text for the placeholder badge (common.placeholder). */
  placeholderLabel: string;
  /** Size and aspect ratio of the frame, e.g. "aspect-[4/5] w-full". */
  frameClassName: string;
  /** Distance of the photo from the frame's left/right edges, in percent of the frame width. */
  insetX: number;
  /** Distance of the photo from the frame's top/bottom edges, in percent of the frame height. */
  insetY: number;
  /**
   * `load`: opens once when the page loads (hero). `scroll`: lines and photo open while the frame
   * scrolls into view. Both are CSS only and fall back to the final state.
   */
  motion: 'load' | 'scroll';
  preload?: boolean;
  quality?: 75 | 85;
}

/**
 * Photo in a frame whose four amber diagonals join the frame's corners to the photo's corners,
 * echoing the emblem (BLUEPRINT §2.1). Equal insets keep a photo of the frame's own ratio.
 */
export function FramedMedia({
  image,
  alt,
  sizes,
  placeholderLabel,
  frameClassName,
  insetX,
  insetY,
  motion,
  preload,
  quality,
}: FramedMediaProps) {
  const right = 100 - insetX;
  const bottom = 100 - insetY;
  const lines: readonly (readonly [number, number, number, number])[] = [
    [0, 0, insetX, insetY],
    [100, 0, right, insetY],
    [0, 100, insetX, bottom],
    [100, 100, right, bottom],
  ];
  const scroll = motion === 'scroll';

  return (
    <div className={cn('relative border border-line', scroll && 'frame-scroll', frameClassName)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full stroke-accent-line"
      >
        {lines.map(([x1, y1, x2, y2]) => (
          <line
            key={`${x1}-${y1}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            className={scroll ? 'frame-line' : 'hero-line'}
            style={{ transformOrigin: `${x1}px ${y1}px` }}
          />
        ))}
      </svg>
      <div
        className={cn('absolute', !scroll && 'hero-reveal')}
        style={{ insetInline: `${insetX}%`, insetBlock: `${insetY}%` }}
      >
        <Media
          image={image}
          alt={alt}
          sizes={sizes}
          placeholderLabel={placeholderLabel}
          className={scroll ? 'reveal-media' : undefined}
          preload={preload}
          quality={quality}
        />
      </div>
    </div>
  );
}
