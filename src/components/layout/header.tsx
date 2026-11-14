import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { site } from '@/content/site';
import { localeMeta, locales, sectionIds, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/types';

import { HeaderShell } from './header-shell';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';
import { NavLinks, type NavLinkItem } from './nav-links';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function Header({ locale, dictionary }: HeaderProps) {
  const { a11y, nav } = dictionary;

  const links: NavLinkItem[] = [
    { id: sectionIds.services, label: nav.services },
    { id: sectionIds.about, label: nav.about },
    { id: sectionIds.portfolio, label: nav.portfolio },
    { id: sectionIds.contact, label: nav.contact },
  ];

  const languageOptions = Object.fromEntries(
    locales.map((code) => [
      code,
      { short: localeMeta[code].label, name: a11y.languageNames[code] },
    ]),
  ) as Record<Locale, { short: string; name: string }>;

  const controls = (
    <>
      <LanguageSwitcher
        currentLocale={locale}
        options={languageOptions}
        ariaLabel={a11y.languageSwitcher}
      />
      <ThemeToggle switchToLight={a11y.switchToLight} switchToDark={a11y.switchToDark} />
    </>
  );

  return (
    <HeaderShell>
      <Container className="flex h-full items-center justify-between gap-6">
        <Link
          prefetch={false}
          href={`/${locale}`}
          aria-label={a11y.homeLink}
          className="inline-flex min-h-11 items-center"
        >
          <Logo variant="horizontal" title={a11y.logoName} className="h-7 w-auto lg:h-8" />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <NavLinks locale={locale} links={links} ariaLabel={a11y.mainNav} />
          {controls}
        </div>

        <MobileMenu
          locale={locale}
          links={links}
          phones={site.phones}
          email={site.email}
          labels={{ open: a11y.openMenu, close: a11y.closeMenu, title: a11y.mobileMenuTitle }}
        >
          {controls}
        </MobileMenu>
      </Container>
    </HeaderShell>
  );
}
