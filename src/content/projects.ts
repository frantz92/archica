import type { ImageKey } from './images';

export type ProjectId = 'beaches' | 'house' | 'promenade' | 'plan';
export type ProjectSlot = 'A' | 'B' | 'C' | 'D';

/**
 * Real projects supplied by the owner (Aneks 1, 2026-11-15). Titles, categories and alt texts are
 * translated and live in the dictionaries; place names stay Polish. `year` is empty on purpose:
 * no years were given.
 */
export interface Project {
  readonly id: ProjectId;
  /** Reserved for future project sub-pages (not created yet). */
  readonly slug: string;
  readonly image: ImageKey;
  readonly slot: ProjectSlot;
  readonly location?: string;
  readonly year?: number;
}

export const projects: readonly Project[] = [
  {
    id: 'beaches',
    slug: 'modernizacja-plaz',
    image: 'portfolio1',
    slot: 'A',
    location: 'Szczecin',
  },
  { id: 'house', slug: 'dom-w-pelczycach', image: 'portfolio2', slot: 'B', location: 'Pełczyce' },
  { id: 'promenade', slug: 'promenada-miedwie', image: 'portfolio3', slot: 'C' },
  {
    id: 'plan',
    slug: 'plan-urbanistyczny-stargard',
    image: 'portfolio4',
    slot: 'D',
    location: 'Stargard',
  },
];
