import type { Page } from '@playwright/test';

import { en } from '../src/i18n/dictionaries/en';
import { fr } from '../src/i18n/dictionaries/fr';
import { pl } from '../src/i18n/dictionaries/pl';

export const locales = ['pl', 'en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const dictionaries = { pl, en, fr } as const;

export const sectionIds = ['top', 'services', 'about', 'portfolio', 'contact'] as const;

/** Browsers normalise non-breaking spaces in rendered text; expected strings must be normalised too. */
export const plain = (value: string): string => value.split(String.fromCharCode(160)).join(' ');

/** Collects everything the page reports as an error (console errors, CSP violations, exceptions). */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  // Vercel Analytics requests /_vercel/insights/script.js, which only exists on Vercel itself.
  // Any other failing request is still reported, so the generic "Failed to load resource" console
  // line can be ignored without hiding real problems.
  const noise = /_vercel\/insights|Failed to load resource/;
  page.on('console', (message) => {
    if (message.type() === 'error' && !noise.test(message.text())) {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().includes('/_vercel/')) {
      errors.push(`http ${response.status()}: ${response.url()}`);
    }
  });
  page.on('pageerror', (error) => errors.push(`exception: ${error.message}`));
  return errors;
}

/**
 * Waits until the page has scrolled away from `from` and then stopped (smooth anchor scrolling
 * starts a moment after the click, so "unchanged" alone would return too early).
 */
export async function waitForScrollToSettle(page: Page, from = 0): Promise<void> {
  await page.waitForFunction((start) => Math.abs(window.scrollY - start) > 50, from, {
    timeout: 10_000,
  });
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const before = window.scrollY;
        setTimeout(() => resolve(window.scrollY === before), 300);
      }),
    undefined,
    { timeout: 10_000, polling: 400 },
  );
}
