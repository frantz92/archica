// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { site } from '@/content/site';
import { locales } from '@/i18n/config';
import { en, fr, pl } from '@/i18n/test-utils';
import { brandColors } from '@/lib/brand';
import { pageUrl } from '@/lib/metadata';

import LocaleLayout, {
  generateMetadata as layoutMetadata,
  generateStaticParams,
  viewport,
} from './[locale]/layout';
import GlobalNotFound from './global-not-found';
import HomePage, { generateMetadata as homeMetadata } from './[locale]/page';
import PrivacyPage, { generateMetadata as privacyMetadata } from './[locale]/privacy/page';
import manifest from './manifest';
import robots from './robots';
import sitemap from './sitemap';

vi.mock('next/font/google', () => ({ Inter: () => ({ variable: 'font-inter-var' }) }));

/** Route props as Next.js passes them: `params` is a promise. */
const route = (locale: string) => ({ params: Promise.resolve({ locale }) }) as never;

describe('manifest', () => {
  it('describes the installable app with the brand colours', () => {
    const data = manifest();
    expect(data).toMatchObject({
      name: site.fullName,
      short_name: site.brand,
      start_url: '/pl/',
      display: 'standalone',
      lang: 'pl',
      theme_color: brandColors.coal,
      background_color: brandColors.coal,
    });
    expect(data.icons?.map((icon) => icon.src)).toEqual(['/icon.svg', '/apple-icon']);
  });
});

describe('robots', () => {
  it('allows everything and points at the sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${site.domain}/sitemap.xml`,
    });
  });
});

describe('sitemap', () => {
  const entries = sitemap();

  it('lists six URLs: three languages times two pages', () => {
    expect(entries).toHaveLength(6);
    expect(entries.map((entry) => entry.url)).toContain(pageUrl('fr', '/privacy'));
  });

  it('gives every entry its hreflang alternates', () => {
    for (const entry of entries) {
      expect(Object.keys(entry.alternates?.languages ?? {})).toEqual(
        expect.arrayContaining([...locales, 'x-default']),
      );
    }
  });
});

describe('locale layout', () => {
  it('generates a static page for each language', () => {
    expect(generateStaticParams()).toEqual([{ locale: 'pl' }, { locale: 'en' }, { locale: 'fr' }]);
  });

  it('has the brand theme colour in the viewport', () => {
    expect(viewport.themeColor).toBe(brandColors.coal);
  });

  it.each(locales)('(%s) gives the title template and default title', async (locale) => {
    const meta = await layoutMetadata(route(locale));
    expect(meta.metadataBase?.toString()).toBe(`${site.domain}/`);
    expect(meta.title).toEqual({
      default: { pl, en, fr }[locale].meta.title,
      template: `%s — ${site.brand}`,
    });
  });

  it('renders the document shell with language, dark default, landmarks and structured data', async () => {
    const html = renderToStaticMarkup(
      await LocaleLayout({
        children: <p>child</p>,
        params: Promise.resolve({ locale: 'fr' }),
      } as never),
    );
    expect(html).toContain('<html lang="fr"');
    expect(html).toMatch(/class="[^"]*font-inter-var[^"]*dark/);
    expect(html).toContain('href="#main"');
    expect(html).toContain('<main id="main"><p>child</p></main>');
    expect(html).toContain('<footer');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('"@type":"ProfessionalService"');
  });

  it('rejects an unknown language with a 404', async () => {
    await expect(layoutMetadata(route('de'))).rejects.toThrow();
    await expect(
      LocaleLayout({ children: null, params: Promise.resolve({ locale: 'de' }) } as never),
    ).rejects.toThrow();
  });
});

describe('home page', () => {
  it.each(locales)('(%s) has an absolute title, canonical URL and hreflang', async (locale) => {
    const meta = await homeMetadata(route(locale));
    const dictionary = { pl, en, fr }[locale];
    expect(meta.title).toEqual({ absolute: dictionary.meta.title });
    expect(meta.description).toBe(dictionary.meta.description);
    expect(meta.alternates?.canonical).toBe(pageUrl(locale, ''));
  });

  it('renders the five sections in order', async () => {
    render(await HomePage(route('pl')));
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    const ids = [...document.querySelectorAll('section[id]')].map((section) => section.id);
    expect(ids).toEqual(['top', 'services', 'about', 'portfolio', 'contact']);
  });

  it('rejects an unknown language', async () => {
    await expect(homeMetadata(route('xx'))).rejects.toThrow();
    await expect(HomePage(route('xx'))).rejects.toThrow();
  });
});

describe('privacy page', () => {
  it.each(locales)('(%s) has a titled, canonical page', async (locale) => {
    const meta = await privacyMetadata(route(locale));
    const dictionary = { pl, en, fr }[locale];
    expect(meta.title).toBe(dictionary.meta.privacyTitle);
    expect(meta.alternates?.canonical).toBe(pageUrl(locale, '/privacy'));
    expect(meta.openGraph?.title).toBe(`${dictionary.meta.privacyTitle} — ${site.brand}`);
  });

  it('renders the policy with its update date and a link back home', async () => {
    const { container } = render(await PrivacyPage(route('en')));
    expect(
      screen.getByRole('heading', { level: 1, name: en.meta.privacyTitle }),
    ).toBeInTheDocument();
    expect(container.querySelector('time')).toHaveAttribute('datetime');
    expect(screen.getByRole('link', { name: en.privacy.backToHome })).toHaveAttribute(
      'href',
      '/en',
    );
  });

  it('rejects an unknown language', async () => {
    await expect(privacyMetadata(route('xx'))).rejects.toThrow();
    await expect(PrivacyPage(route('xx'))).rejects.toThrow();
  });
});

describe('global 404 page', () => {
  it('renders the 404 with the default language until the browser has read the address', () => {
    render(<GlobalNotFound />, {
      container: document.body.appendChild(document.createElement('div')),
    });
    expect(screen.getByRole('heading', { level: 1, name: pl.notFound.title })).toBeInTheDocument();
  });
});
