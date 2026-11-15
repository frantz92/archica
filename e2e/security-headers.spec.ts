import { expect, test } from '@playwright/test';

// BLUEPRINT §10. The suite runs against the production build, so the strict policy applies.
const paths = ['/pl', '/en/privacy', '/fr', '/sitemap.xml'];

for (const path of paths) {
  test.describe(`security headers on ${path}`, () => {
    test('are present with the agreed values', async ({ request }) => {
      const headers = (await request.get(path)).headers();

      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['cross-origin-opener-policy']).toBe('same-origin');
      expect(headers['permissions-policy']).toBe(
        'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      );
      // HSTS without includeSubDomains/preload until subdomains are confirmed to be HTTPS-only.
      expect(headers['strict-transport-security']).toBe('max-age=63072000');
      expect(headers['x-powered-by']).toBeUndefined();
    });

    test('content security policy locks down the page', async ({ request }) => {
      const csp = (await request.get(path)).headers()['content-security-policy'] ?? '';
      const directives = Object.fromEntries(
        csp.split(';').map((part) => {
          const [name = '', ...values] = part.trim().split(/\s+/);
          return [name, values.join(' ')];
        }),
      );

      expect(directives['default-src']).toBe("'self'");
      expect(directives['script-src']).toBe("'self' 'unsafe-inline'");
      expect(directives['object-src']).toBe("'none'");
      expect(directives['base-uri']).toBe("'self'");
      expect(directives['form-action']).toBe("'self'");
      expect(directives['frame-ancestors']).toBe("'none'");
      expect(directives['font-src']).toBe("'self'");
      expect(csp).toContain('upgrade-insecure-requests');
      // No third-party origins and no eval in production.
      expect(csp).not.toMatch(/https?:\/\//);
      expect(csp).not.toContain('unsafe-eval');
    });
  });
}
