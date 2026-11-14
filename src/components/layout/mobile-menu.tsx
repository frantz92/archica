'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';

import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import { Container } from '@/components/ui/container';
import type { NavLinkItem } from './nav-links';

interface MobileMenuProps {
  locale: string;
  links: readonly NavLinkItem[];
  phones: readonly { readonly display: string; readonly href: string }[];
  email: string;
  labels: { open: string; close: string; title: string };
  /** Server-rendered bottom row (language switcher and theme toggle). */
  children: ReactNode;
}

const DESKTOP_QUERY = '(min-width: 1024px)';

/** Full-screen menu on a native <dialog>: focus is trapped by showModal() and returned on close. */
export function MobileMenu({ locale, links, phones, email, labels, children }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener('change', closeOnDesktop);
    return () => query.removeEventListener('change', closeOnDesktop);
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <div className="lg:hidden">
      <button
        ref={openerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex size-11 items-center justify-center rounded-sm"
      >
        <MenuIcon />
        <span className="sr-only">{labels.open}</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.title}
        onClose={() => openerRef.current?.focus()}
        className="menu-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg p-0 text-fg"
      >
        <Container className="flex min-h-dvh flex-col">
          <div className="flex h-(--header-h) shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-sm"
            >
              <CloseIcon />
              <span className="sr-only">{labels.close}</span>
            </button>
          </div>

          <nav aria-label={labels.title} className="pt-8">
            <ul className="grid gap-4">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={`/${locale}#${link.id}`}
                    onClick={close}
                    className="inline-block min-h-11 type-h2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 grid gap-1 border-t border-line pt-6">
            {phones.map((phone) => (
              <a key={phone.href} href={phone.href} className="inline-block min-h-11 py-2">
                {phone.display}
              </a>
            ))}
            <a href={`mailto:${email}`} className="inline-block min-h-11 py-2">
              {email}
            </a>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 py-8">{children}</div>
        </Container>
      </dialog>
    </div>
  );
}
