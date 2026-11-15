import { en } from './dictionaries/en';
import { fr } from './dictionaries/fr';
import { pl } from './dictionaries/pl';

/** All dictionaries, for tests that must hold in every language. */
export const dictionaries = [pl, en, fr] as const;

export { en, fr, pl };
