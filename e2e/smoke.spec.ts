import { expect, test } from '@playwright/test';

import { dictionaries, locales, plain, sectionIds, trackErrors } from './helpers';

test('the root URL redirects permanently to the Polish site', async ({ request }) => {
  const response = await request.get('/', { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers()['location']).toBe('/pl');
});

for (const locale of locales) {
  const dictionary = dictionaries[locale];

  test.describe(`home page (${locale})`, () => {
    test('loads with the right language, title, headline and all sections', async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(`/${locale}`);

      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page).toHaveTitle(plain(dictionary.meta.title));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        plain(dictionary.hero.title),
      );
      for (const id of sectionIds) await expect(page.locator(`section#${id}`)).toHaveCount(1);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('declares canonical, hreflang alternates and structured data', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://archica.pl/${locale}`,
      );
      for (const code of [...locales, 'x-default']) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${code}"]`)).toHaveCount(1);
      }
      const json = await page.locator('script[type="application/ld+json"]').textContent();
      expect(JSON.parse(json ?? '{}')['@type']).toBe('ProfessionalService');
    });

    test('counts the hero figures up to their final values', async ({ page }) => {
      await page.goto(`/${locale}`);
      // The counter starts when the figures are half in view, as for a visitor who scrolls down.
      await page.locator('.hero-stats').scrollIntoViewIfNeeded();
      const figures = page.locator('.hero-stats dd .sr-only');
      await expect(figures).toHaveText(['30', '86', '26', '15']);
      await expect(page.locator('.hero-stats dd .count-up')).toHaveText(['30', '86', '26', '15'], {
        timeout: 8_000,
      });
    });
  });
}

test.describe('error pages', () => {
  for (const locale of locales) {
    test(`an unknown page in ${locale} is a localised 404`, async ({ page }) => {
      const response = await page.goto(`/${locale}/nie-ma-takiej-strony`);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        plain(dictionaries[locale].notFound.title),
      );
    });
  }

  test('an unsupported language is a 404', async ({ request }) => {
    expect((await request.get('/de')).status()).toBe(404);
  });
});

test.describe('generated resources', () => {
  test('sitemap lists six URLs with alternates', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    expect(body.match(/<loc>/g)).toHaveLength(6);
    expect(body).toContain('hreflang="x-default"');
  });

  test('robots.txt points at the sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toContain('Sitemap: https://archica.pl/sitemap.xml');
  });

  test('web app manifest is valid JSON with the brand colour', async ({ request }) => {
    const manifest = await (await request.get('/manifest.webmanifest')).json();
    expect(manifest).toMatchObject({ short_name: 'Archica', theme_color: '#1E1916' });
  });

  for (const path of [
    '/pl/opengraph-image',
    '/en/opengraph-image',
    '/fr/opengraph-image',
    '/apple-icon',
  ]) {
    test(`${path} is a PNG image`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('image/png');
    });
  }

  test('the favicon is an SVG', async ({ request }) => {
    const response = await request.get('/icon.svg');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('svg');
  });
});
