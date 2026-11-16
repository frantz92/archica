import { expect, test, type Page } from '@playwright/test';

import { dictionaries, plain, waitForScrollToSettle, type Locale } from './helpers';

/** The desktop navigation (the first landmark with this name; the mobile menu has its own). */
const mainNav = (page: Page) =>
  page.getByRole('navigation', { name: dictionaries.pl.a11y.mainNav }).first();

test.describe('section navigation', () => {
  for (const section of ['services', 'about', 'portfolio', 'contact'] as const) {
    test(`the menu link to ${section} lands with its heading just under the header`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/pl');
      await page
        .locator('header nav a', { hasText: plain(dictionaries.pl.nav[section]) })
        .first()
        .click();

      // The amber mark sits 1.5 rem (24 px) below the header, not after a band of empty background.
      // Smooth scrolling takes a while, so wait for the target position and then check it is stable.
      const gap = () =>
        page.evaluate((id) => {
          const mark = document.querySelector(`#${id} .section-mark`)?.getBoundingClientRect().top;
          const header = document.querySelector('header')?.getBoundingClientRect().bottom;
          return Math.round((mark ?? -999) - (header ?? 0));
        }, section);
      await expect.poll(gap, { timeout: 15_000, intervals: [250] }).toBeGreaterThanOrEqual(20);
      await expect.poll(gap, { timeout: 5_000, intervals: [250] }).toBeLessThanOrEqual(28);
      await page.waitForTimeout(500);
      const settled = await gap();
      expect(settled).toBeGreaterThanOrEqual(20);
      expect(settled).toBeLessThanOrEqual(28);
    });
  }

  test('the section in view is marked as current in the menu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pl');
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.evaluate(() =>
      document.getElementById('about')?.scrollIntoView({ behavior: 'instant' }),
    );
    const current = mainNav(page).locator('a[aria-current="true"]');
    await expect(current).toHaveText(plain(dictionaries.pl.nav.about));
  });

  test('"back to top" in the footer returns to the hero', async ({ page }) => {
    await page.goto('/pl');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole('link', { name: dictionaries.pl.footer.backToTop }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 10_000 }).toBe(0);
  });
});

test.describe('language switch', () => {
  test('always opens the page from the top, from any scroll position', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pl');
    const route: [string, Locale][] = [
      ['portfolio', 'en'],
      ['services', 'fr'],
      ['contact', 'pl'],
      ['about', 'en'],
    ];
    for (const [anchor, target] of route) {
      await page.evaluate(
        (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }),
        anchor,
      );
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
      await page.locator(`header a[hreflang="${target}"]`).first().click();
      await page.waitForURL(`**/${target}`);
      await expect(page.locator('html')).toHaveAttribute('lang', target);
      await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 10_000 }).toBe(0);
      expect(new URL(page.url()).hash).toBe('');
    }
  });

  test('keeps the page when switching language on the privacy policy', async ({ page }) => {
    // The desktop switcher is hidden on a phone viewport (iPhone project), so fix the width.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pl/privacy');
    await page.locator('header a[hreflang="fr"]').first().click();
    await page.waitForURL('**/fr/privacy');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      plain(dictionaries.fr.meta.privacyTitle),
    );
  });
});

test.describe('theme', () => {
  test('is dark by default and remembers the visitor choice', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/pl');
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page
      .locator('header button:visible', { hasText: dictionaries.pl.a11y.switchToLight })
      .click();
    await expect(page.locator('html')).toHaveClass(/light/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/light/);
    expect(await page.evaluate(() => localStorage.getItem('archica-theme'))).toBe('light');
  });
});

test.describe('mobile menu', () => {
  test('opens, shows the links and contact details, and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pl');
    const opener = page.getByRole('button', { name: dictionaries.pl.a11y.openMenu });
    await opener.click();

    const dialog = page.getByRole('dialog', { name: dictionaries.pl.a11y.mobileMenuTitle });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: /\+48/ }).first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('a chosen link closes the menu and scrolls to the section', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pl');
    await page.getByRole('button', { name: dictionaries.pl.a11y.openMenu }).click();
    await page
      .getByRole('dialog')
      .getByRole('link', { name: plain(dictionaries.pl.nav.contact) })
      .click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await waitForScrollToSettle(page);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  });
});
