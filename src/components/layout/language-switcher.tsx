'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

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

function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

const getHash = (): string => window.location.hash;
const getServerHash = (): string => '';

/** Links to the same path in the other languages, keeping the anchor. Plain text, no flags. */
export function LanguageSwitcher({ currentLocale, options, ariaLabel }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const rest = pathname.startsWith(`/${currentLocale}`)
    ? pathname.slice(currentLocale.length + 1)
    : '';

  return (
    <nav aria-label={ariaLabel}>
      <ul className="flex items-center">
        {locales.map((locale) => {
          const current = locale === currentLocale;
          return (
            <li key={locale}>
              <Link
                prefetch={false}
                href={`/${locale}${rest}${hash}`}
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
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
