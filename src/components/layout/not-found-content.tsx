'use client';

import { useEffect, useSyncExternalStore } from 'react';

import { Logo } from '@/components/ui/logo';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';

interface NotFoundStrings {
  readonly title: string;
  readonly description: string;
  readonly homeLink: string;
}

interface NotFoundContentProps {
  strings: Record<Locale, NotFoundStrings>;
  logoName: string;
}

/** Language of a URL path: its first segment when it is a supported language, else the default. */
export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split('/')[1] ?? '';
  return isLocale(segment) ? segment : defaultLocale;
}

/**
 * One static 404.html serves every unknown URL, so the language is taken from the address in the
 * browser (`/en/missing/` -> English). All three languages are passed in. Until the browser
 * has read the address the default language is shown, which is also what a visitor without
 * JavaScript sees.
 */
export function NotFoundContent({ strings, logoName }: NotFoundContentProps) {
  // The server snapshot (the static HTML) is the default language; the browser reads the address.
  const pathname = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => '/',
  );
  const locale = localeFromPathname(pathname);
  const text = strings[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `${strings[locale].title} — ${logoName}`;
  }, [locale, strings, logoName]);

  return (
    <div className="container-page flex min-h-svh flex-col items-center justify-center gap-6 py-32 text-center">
      <Logo variant="mark" title={logoName} className="size-24" />
      <h1 className="type-h2">{text.title}</h1>
      <p className="type-body">{text.description}</p>
      <a href={`/${locale}/`} className="inline-flex min-h-11 items-center">
        <span className="link-underline">{text.homeLink}</span>
      </a>
    </div>
  );
}
