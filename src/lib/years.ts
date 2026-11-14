import { site } from '@/content/site';

/** Years of practice, computed on the server: current year minus the founding year. */
export function getYearsOfPractice(now: Date = new Date()): number {
  return now.getFullYear() - site.foundedYear;
}
