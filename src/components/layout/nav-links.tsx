'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { sectionHref, type NavLinkItem } from '@/lib/navigation';

interface NavLinksProps {
  locale: Locale;
  links: readonly NavLinkItem[];
  ariaLabel: string;
}

/** Section links; the section currently in view gets aria-current. No link is active off the home page. */
export function NavLinks({ locale, links, ariaLabel }: NavLinksProps) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
          else setActiveId((current) => (current === entry.target.id ? null : current));
        }
      },
      // A thin band around the upper-middle of the viewport decides the active section.
      { rootMargin: '-40% 0px -55% 0px' },
    );
    for (const link of links) {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [isHome, links]);

  return (
    <nav aria-label={ariaLabel}>
      <ul className="flex items-center gap-8">
        {links.map((link) => {
          const active = isHome && activeId === link.id;
          return (
            <li key={link.id}>
              <Link
                prefetch={false}
                href={sectionHref(locale, link.id)}
                aria-current={active ? 'true' : undefined}
                className="inline-flex min-h-11 items-center"
              >
                <span className="link-underline-draw">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
