import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';
import { PlaceholderBadge } from '@/components/ui/placeholder-badge';
import { TitleBlock, type TitleBlockItem } from '@/components/ui/title-block';
import { site } from '@/content/site';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/types';
import { getNavLinks, privacyHref, sectionHref } from '@/lib/navigation';

interface FooterProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function Footer({ locale, dictionary }: FooterProps) {
  const { footer, nav, a11y, common } = dictionary;
  const year = new Date().getFullYear();

  const navLinks = [
    ...getNavLinks(nav).map(({ id, label }) => ({ href: sectionHref(locale, id), label })),
    { href: privacyHref(locale), label: nav.privacy },
  ];

  const items: TitleBlockItem[] = [
    {
      id: 'logo',
      label: a11y.logoName,
      labelHidden: true,
      value: (
        <>
          <Logo
            variant="stacked"
            title={a11y.logoName}
            className="hidden h-[120px] w-auto lg:block"
          />
          <Logo variant="mark" title={a11y.logoName} className="size-16 lg:hidden" />
        </>
      ),
    },
    {
      id: 'company',
      label: footer.companyTitle,
      value: (
        <div className="grid gap-1">
          <p>{site.fullName}</p>
          <p>
            {footer.taxIdLabel}: {site.taxId}
          </p>
          <p>
            {footer.licenseLabel}: {site.license.number} ({footer.licenseTodo})
          </p>
          <PlaceholderBadge label={common.placeholder} className="mt-1 w-fit" />
        </div>
      ),
    },
    {
      id: 'nav',
      label: footer.navTitle,
      value: (
        <nav aria-label={a11y.footerNav}>
          <ul className="grid">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  prefetch={false}
                  href={link.href}
                  className="inline-flex min-h-11 items-center"
                >
                  <span className="link-underline-draw">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ),
    },
  ];

  return (
    <footer className="bg-bg text-fg">
      <Container className="pt-12 pb-10">
        <TitleBlock
          items={items}
          valueStyle="small"
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 type-small text-fg-muted">
          <p>{footer.copyright(year)}</p>
          <Link
            prefetch={false}
            href={sectionHref(locale, 'top')}
            className="inline-flex min-h-11 items-center"
          >
            <span className="link-underline-draw">{footer.backToTop}</span>
          </Link>
        </div>
      </Container>
    </footer>
  );
}
