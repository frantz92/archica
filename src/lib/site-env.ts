/**
 * Which build this is, from `SITE_ENV` (set by the deploy workflow):
 * - `production`: the live site;
 * - `preview`: a copy for review (e.g. another logo proposal): not indexed, no "placeholder" tags;
 * - anything else (unset): local development and CI builds, with "placeholder" tags.
 */
export type SiteEnv = 'production' | 'preview' | 'development';

export function getSiteEnv(value: string | undefined = process.env.SITE_ENV): SiteEnv {
  if (value === 'production' || value === 'preview') return value;
  return 'development';
}
