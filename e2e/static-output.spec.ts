import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';

const out = join(process.cwd(), 'out');

function* walk(directory: string): Generator<string> {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

// The files that are uploaded to the host. The Apache rules cannot be run here, so the generated
// file is checked for the rules the deployed site depends on.
test.describe('static export (out/)', () => {
  test.skip(!existsSync(out), 'run `npm run build` first');

  test('has a page for every language and the privacy policy', () => {
    for (const locale of ['pl', 'en', 'fr']) {
      expect(existsSync(join(out, locale, 'index.html'))).toBe(true);
      expect(existsSync(join(out, locale, 'privacy', 'index.html'))).toBe(true);
      expect(existsSync(join(out, locale, 'opengraph-image'))).toBe(true);
    }
    for (const file of ['404.html', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest']) {
      expect(existsSync(join(out, file)), file).toBe(true);
    }
  });

  test('contains no oversized files (originals are replaced by WebP variants)', () => {
    const large = [...walk(out)].filter((file) => statSync(file).size > 1024 * 1024);
    expect(large).toEqual([]);
    expect(existsSync(join(out, 'images', 'optimized', 'hero-building-640.webp'))).toBe(true);
  });

  test('has an .htaccess with HTTPS, the home redirect, the 404 page and security headers', () => {
    const htaccess = readFileSync(join(out, '.htaccess'), 'utf8');
    expect(htaccess).toContain('RewriteRule ^$ /pl/ [R=301,L]');
    expect(htaccess).toContain('RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]');
    expect(htaccess).toContain('RewriteCond %{HTTP_HOST} ^www\\.archica\\.pl$ [NC]');
    expect(htaccess).toContain('RewriteRule ^ https://archica.pl%{REQUEST_URI} [R=301,L]');
    expect(htaccess).toContain('ErrorDocument 404 /404.html');
    for (const name of [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'X-Frame-Options',
      'Cross-Origin-Opener-Policy',
    ]) {
      expect(htaccess, name).toContain(`Header always set ${name} "`);
    }
    expect(htaccess).toContain('upgrade-insecure-requests');
    expect(htaccess).toContain('<Files "opengraph-image">');
  });

  test('has no leftovers of the Vercel hosting', () => {
    const text = [...walk(out)]
      .filter((file) => /\.(html|js|txt)$/.test(file))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');
    expect(text).not.toContain('/_vercel/');
  });
});
