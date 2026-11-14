import Image from 'next/image';

import { PlaceholderBadge } from '@/components/ui/placeholder-badge';
import { images, type ImageKey } from '@/content/images';
import { cn } from '@/lib/cn';

interface MediaProps {
  image: ImageKey;
  alt: string;
  sizes: string;
  /**
   * Tailwind aspect-ratio class(es) of the slot, e.g. "aspect-[4/5]". Omit when the parent
   * already fixes the size (the media then fills it).
   */
  aspectClassName?: string;
  /** Dictionary text for the placeholder badge (common.placeholder). */
  placeholderLabel: string;
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
  aspectClassName,
  placeholderLabel,
  preload = false,
  quality,
  className,
}: MediaProps) {
  const asset = images[image];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-media',
        aspectClassName ?? 'h-full',
        className,
      )}
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
        style={asset.objectPosition ? { objectPosition: asset.objectPosition } : undefined}
      />
      {asset.placeholder ? (
        <PlaceholderBadge label={placeholderLabel} className="absolute top-2 left-2 bg-bg" />
      ) : null}
    </div>
  );
}
