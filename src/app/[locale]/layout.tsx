import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SkipLink } from '@/components/layout/skip-link';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { JsonLd } from '@/components/seo/json-ld';
import { site } from '@/content/site';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { brandColors } from '@/lib/brand';
import { buildProfessionalService } from '@/lib/structured-data';
import { notFound } from 'next/navigation';

import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  axes: ['opsz'],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  // Pages provide their own complete metadata (canonical, hreflang, Open Graph); this is the base.
  return {
    metadataBase: new URL(site.domain),
    title: { default: dictionary.meta.title, template: `%s — ${site.brand}` },
    description: dictionary.meta.description,
  };
}

export const viewport: Viewport = {
  themeColor: brandColors.moss,
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale} className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-svh">
        <ThemeProvider>
          <SkipLink label={dictionary.a11y.skipToContent} />
          <Header locale={locale} dictionary={dictionary} />
          <main id="main">{children}</main>
          <Footer locale={locale} dictionary={dictionary} />
        </ThemeProvider>
        <JsonLd data={buildProfessionalService(locale)} />
        <Analytics />
      </body>
    </html>
  );
}
