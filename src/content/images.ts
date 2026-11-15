import type { StaticImageData } from 'next/image';

import aboutStudio from '../../public/images/about-studio.png';
import heroBuilding from '../../public/images/hero-building.png';
import portfolio1 from '../../public/images/portfolio-1.png';
import portfolio2 from '../../public/images/portfolio-2.png';
import portfolio3 from '../../public/images/portfolio-3.png';
import portfolio4 from '../../public/images/portfolio-4.png';

export interface ImageAsset {
  readonly src: StaticImageData;
  /** Optional CSS object-position for cropping inside the slot. */
  readonly objectPosition?: string;
  /** True while the file is a temporary generated image (shows the placeholder badge on previews). */
  readonly placeholder: boolean;
}

// PLACEHOLDER: all six files are temporary free stock photos (CC0, Wikimedia Commons; credits in
// README.md), cropped to the slot ratios. They are not Archica projects. Replace them in
// public/images/ keeping the file names, then set `placeholder: false`.
export const images: Record<ImageKey, ImageAsset> = {
  hero: { src: heroBuilding, placeholder: true },
  about: { src: aboutStudio, placeholder: true },
  portfolio1: { src: portfolio1, placeholder: true },
  portfolio2: { src: portfolio2, placeholder: true },
  portfolio3: { src: portfolio3, placeholder: true },
  portfolio4: { src: portfolio4, placeholder: true },
};

export type ImageKey = 'hero' | 'about' | 'portfolio1' | 'portfolio2' | 'portfolio3' | 'portfolio4';
