import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SkipLink } from '@/components/layout/skip-link';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { JsonLd } from '@/components/seo/json-ld';
import { logoAssets } from '@/components/ui/logo-assets';
import { site } from '@/content/site';
import { locales } from '@/i18n/config';
import { brandColors } from '@/lib/brand';
import { resolveRoute } from '@/lib/route-locale';
import { getSiteEnv } from '@/lib/site-env';
import { buildProfessionalService } from '@/lib/structured-data';

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
  const { dictionary } = await resolveRoute(params);
  // Pages provide their own complete metadata (canonical, hreflang, Open Graph); this is the base.
  return {
    metadataBase: new URL(site.domain),
    title: { default: dictionary.meta.title, template: `%s — ${site.brand}` },
    description: dictionary.meta.description,
    icons: { icon: [{ url: logoAssets.favicon, type: 'image/svg+xml' }] },
    ...(getSiteEnv() === 'preview' ? { robots: { index: false, follow: false } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: brandColors.coal,
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale, dictionary } = await resolveRoute(params);

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
      </body>
    </html>
  );
}
