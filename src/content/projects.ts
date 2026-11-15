import type { ImageKey } from './images';

export type ProjectId = 'residence' | 'office' | 'interior' | 'pavilion';
export type ProjectSlot = 'A' | 'B' | 'C' | 'D';

export interface Project {
  readonly id: ProjectId;
  /** Reserved for future project sub-pages (not created yet). */
  readonly slug: string;
  /** Proper name, not translated. */
  readonly title: string;
  readonly image: ImageKey;
  readonly slot: ProjectSlot;
  readonly location?: string;
  readonly year?: number;
  readonly placeholder: true;
}

// PLACEHOLDER: four fictional projects. Replace titles, images and add location/year when real data exists.
export const projects: readonly Project[] = [
  {
    id: 'residence',
    slug: 'rezydencja-brzozowa',
    title: 'Rezydencja Brzozowa',
    image: 'residence',
    slot: 'A',
    placeholder: true,
  },
  {
    id: 'office',
    slug: 'biura-meridian',
    title: 'Biura Meridian',
    image: 'office',
    slot: 'B',
    placeholder: true,
  },
  {
    id: 'interior',
    slug: 'wnetrze-linden',
    title: 'Wnętrze Linden',
    image: 'interior',
    slot: 'C',
    placeholder: true,
  },
  {
    id: 'pavilion',
    slug: 'pawilon-grove',
    title: 'Pawilon Grove',
    image: 'pavilion',
    slot: 'D',
    placeholder: true,
  },
];
