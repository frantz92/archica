import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { locales } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const themes = ['dark', 'light'] as const;
const pages = (locale: string) => [`/${locale}`, `/${locale}/privacy`];

for (const locale of locales) {
  for (const path of pages(locale)) {
    for (const theme of themes) {
      test(`${path} (${theme} theme) has no WCAG AA violations`, async ({ page }) => {
        // Reduced motion shows every section in its final state, so nothing is mid-animation.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript((value) => localStorage.setItem('archica-theme', value), theme);
        await page.goto(path);
        await expect(page.locator('html')).toHaveClass(new RegExp(theme));

        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const summary = results.violations.map(
          (violation) =>
            `${violation.id} (${violation.impact}): ${violation.help}\n` +
            violation.nodes
              .slice(0, 3)
              .map((node) => `   ${node.target.join(' ')}`)
              .join('\n'),
        );
        expect(summary, summary.join('\n')).toEqual([]);
      });
    }
  }
}

test('the mobile menu dialog is accessible when open', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/pl');
  await page.getByRole('button', { name: 'Otwórz menu' }).click();
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
