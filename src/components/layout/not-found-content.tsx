'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

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

/**
 * not-found.tsx receives no props or params in this Next.js version (BLUEPRINT §6.9), so the
 * language is read from the route params on the client. All three languages are passed in.
 */
export function NotFoundContent({ strings, logoName }: NotFoundContentProps) {
  const { locale: param } = useParams<{ locale?: string }>();
  const locale = param && isLocale(param) ? param : defaultLocale;
  const text = strings[locale];

  return (
    <div className="container-page flex min-h-svh flex-col items-center justify-center gap-6 py-32 text-center">
      <Logo variant="mark" title={logoName} className="size-24" />
      <h1 className="type-h2">{text.title}</h1>
      <p className="type-body">{text.description}</p>
      <Link href={`/${locale}`} className="inline-flex min-h-11 items-center link-underline">
        {text.homeLink}
      </Link>
    </div>
  );
}
