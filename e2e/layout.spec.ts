import { expect, test } from '@playwright/test';

import { locales } from './helpers';

const widths = [320, 390, 768, 1024, 1440];

test.describe('no horizontal scrolling', () => {
  for (const locale of locales) {
    for (const width of widths) {
      test(`${locale} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }

  test('the privacy page too', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/pl/privacy');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('first screen on a small phone (BLUEPRINT §6.2)', () => {
  for (const locale of locales) {
    test(`${locale}: the headline and the main button fit in 360 x 640`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 640 });
      await page.goto(`/${locale}`);
      const bottom = await page.evaluate(
        () =>
          document.querySelector('section#top a[class*="bg-accent"]')?.getBoundingClientRect()
            .bottom ?? Number.POSITIVE_INFINITY,
      );
      expect(bottom).toBeLessThanOrEqual(640);
    });
  }
});
