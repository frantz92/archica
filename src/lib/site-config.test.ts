import { describe, expect, it } from 'vitest';

import {
  FORCED_TYPES,
  HOME_PATH,
  SITE_ORIGIN,
  contentSecurityPolicy,
  securityHeaders,
} from '../../scripts/lib/site-config.mjs';
import { site } from '@/content/site';
import { defaultLocale } from '@/i18n/config';

describe('server configuration of the static export', () => {
  it('uses the same origin as the site data', () => {
    expect(SITE_ORIGIN).toBe(site.domain);
  });

  it('sends visitors from the root to the default language', () => {
    expect(HOME_PATH).toBe(`/${defaultLocale}/`);
  });

  it('locks the content security policy down to the own origin', () => {
    const csp = contentSecurityPolicy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).not.toMatch(/https?:\/\//);
    expect(csp).not.toContain('unsafe-eval');
  });

  it('can leave out the upgrade directive for the local server', () => {
    expect(contentSecurityPolicy({ upgradeInsecure: false })).not.toContain(
      'upgrade-insecure-requests',
    );
  });

  it('lists the agreed security headers', () => {
    const names = securityHeaders().map(([name]) => name);
    expect(names).toEqual([
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'X-Frame-Options',
      'Cross-Origin-Opener-Policy',
    ]);
  });

  it('declares the type of the image routes that have no file extension', () => {
    expect(FORCED_TYPES).toEqual({ 'apple-icon': 'image/png', 'opengraph-image': 'image/png' });
  });
});
