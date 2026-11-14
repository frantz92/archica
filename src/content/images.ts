import type { StaticImageData } from 'next/image';

import aboutStudio from '../../public/images/about-studio.png';
import heroBuilding from '../../public/images/hero-building.png';
import portfolioInterior from '../../public/images/portfolio-interior.png';
import portfolioOffice from '../../public/images/portfolio-office.png';
import portfolioPavilion from '../../public/images/portfolio-pavilion.png';
import portfolioResidence from '../../public/images/portfolio-residence.png';

export interface ImageAsset {
  readonly src: StaticImageData;
  /** Optional CSS object-position for cropping inside the slot. */
  readonly objectPosition?: string;
  /** True while the file is a temporary generated image (shows the placeholder badge on previews). */
  readonly placeholder: boolean;
}

// PLACEHOLDER: all six files are temporary generated images (scripts/generate-placeholder-images.mjs).
// Replace them in public/images/ keeping the file names.
export const images: Record<ImageKey, ImageAsset> = {
  hero: { src: heroBuilding, placeholder: true },
  about: { src: aboutStudio, placeholder: true },
  residence: { src: portfolioResidence, placeholder: true },
  office: { src: portfolioOffice, placeholder: true },
  interior: { src: portfolioInterior, placeholder: true },
  pavilion: { src: portfolioPavilion, placeholder: true },
};

export type ImageKey = 'hero' | 'about' | 'residence' | 'office' | 'interior' | 'pavilion';
