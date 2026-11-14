import Image from 'next/image';

import { images, type ImageKey } from '@/content/images';
import { cn } from '@/lib/cn';

interface MediaProps {
  image: ImageKey;
  alt: string;
  sizes: string;
  /** Slot aspect ratio as a CSS value, e.g. "4 / 5". */
  aspect: string;
  /** Preload and eager-load (hero only). */
  preload?: boolean;
  quality?: 75 | 85;
  className?: string;
}

/**
 * Image in a fixed-ratio slot. The file itself may have any size: the slot crops it with
 * object-fit: cover, so photos can be replaced without code changes (BLUEPRINT §7).
 */
export function Media({
  image,
  alt,
  sizes,
  aspect,
  preload = false,
  quality,
  className,
}: MediaProps) {
  const asset = images[image];
  const position = asset.objectPosition;

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-media', className)}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={asset.src}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        preload={preload}
        quality={quality}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
