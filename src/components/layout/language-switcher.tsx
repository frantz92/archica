'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';
import { locales, type Locale } from '@/i18n/config';

interface LanguageOption {
  readonly short: string;
  readonly name: string;
}

interface LanguageSwitcherProps {
  currentLocale: Locale;
  options: Record<Locale, LanguageOption>;
  ariaLabel: string;
}

/**
 * Links to the same page in the other languages. Plain text, no flags.
 *
 * Deliberately plain `<a>` elements (a full page load, not client-side navigation) and no anchor:
 * with `scroll-behavior: smooth` on <html> (Next.js 16 no longer overrides it), the router's
 * scroll-to-top is a smooth scroll that Safari interrupts while the new page lays out, leaving
 * the page stuck mid-way. A full load always starts at the top.
 */
export function LanguageSwitcher({ currentLocale, options, ariaLabel }: LanguageSwitcherProps) {
  const pathname = usePathname();
  // `/pl/privacy/` -> `/privacy` (the exported pages end with a slash, added back in the href).
  const rest = pathname.startsWith(`/${currentLocale}`)
    ? pathname.slice(currentLocale.length + 1).replace(/\/$/, '')
    : '';

  return (
    <nav aria-label={ariaLabel}>
      <ul className="flex items-center">
        {locales.map((locale) => {
          const current = locale === currentLocale;
          return (
            <li key={locale}>
              <a
                href={`/${locale}${rest}/`}
                lang={locale}
                hrefLang={locale}
                title={options[locale].name}
                aria-current={current ? 'true' : undefined}
                className={cn(
                  'inline-flex min-h-11 min-w-11 items-center justify-center type-small font-medium transition-colors duration-150',
                  current ? 'text-fg' : 'text-fg-muted hover:text-fg',
                )}
              >
                {options[locale].short}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
