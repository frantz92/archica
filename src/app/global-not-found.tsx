import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { NotFoundContent } from '@/components/layout/not-found-content';
import { getDictionary } from '@/i18n/get-dictionary';

import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: getDictionary('pl').notFound.title,
  robots: { index: false },
};

/**
 * The 404 page of the static site (out/404.html). It does not go through the language layout,
 * so it sets up the document itself; the language is chosen in the browser from the address.
 */
export default function GlobalNotFound() {
  const pl = getDictionary('pl');
  const en = getDictionary('en');
  const fr = getDictionary('fr');

  return (
    <html lang="pl" className={`${inter.variable} dark`}>
      <body className="min-h-svh">
        <NotFoundContent
          strings={{ pl: pl.notFound, en: en.notFound, fr: fr.notFound }}
          logoName={pl.a11y.logoName}
        />
      </body>
    </html>
  );
}
