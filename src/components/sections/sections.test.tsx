// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getPrivacyDocument } from '@/content/privacy';
import { projects } from '@/content/projects';
import { site } from '@/content/site';
import type { Locale } from '@/i18n/config';
import { en, fr, pl } from '@/i18n/test-utils';

import { About } from './about';
import { Contact } from './contact';
import { Hero } from './hero';
import { Portfolio } from './portfolio';
import { PrivacyDocumentView } from './privacy-document';
import { Services } from './services';

/** Testing Library normalises non-breaking spaces in the DOM, so expected strings must be too. */
const plain = (value: string): string => value.split(String.fromCharCode(160)).join(' ');

const cases = [
  ['pl', pl],
  ['en', en],
  ['fr', fr],
] as const satisfies readonly (readonly [Locale, typeof pl])[];

describe('Hero', () => {
  it.each(cases)(
    '(%s) shows the headline, the lead and both calls to action',
    (locale, dictionary) => {
      render(<Hero locale={locale} dictionary={dictionary} years={30} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        dictionary.hero.title.replace(/ /g, ' '),
      );
      const primary = screen.getByRole('link', { name: dictionary.hero.primaryCta });
      expect(primary).toHaveAttribute('href', `/${locale}#contact`);
      expect(screen.getByRole('link', { name: dictionary.hero.secondaryCta })).toHaveAttribute(
        'href',
        `/${locale}#portfolio`,
      );
    },
  );

  it('shows the four confirmed figures with their labels', () => {
    const { container } = render(<Hero locale="pl" dictionary={pl} years={30} />);
    const values = [...container.querySelectorAll('dd .sr-only')].map((el) => el.textContent);
    expect(values).toEqual([
      '30',
      String(site.stats.projects),
      String(site.stats.tendersWon),
      String(site.stats.municipalities),
    ]);
    expect(screen.getByText('lat praktyki')).toBeInTheDocument();
    expect(screen.getByText(pl.hero.stats.tendersLabel)).toBeInTheDocument();
  });

  it('inflects the years label with the number of years', () => {
    render(<Hero locale="pl" dictionary={pl} years={32} />);
    expect(screen.getByText('lata praktyki')).toBeInTheDocument();
  });

  it('puts the hero photo in the amber frame and labels the section by the h1', () => {
    const { container } = render(<Hero locale="en" dictionary={en} years={30} />);
    expect(container.querySelectorAll('line')).toHaveLength(4);
    expect(screen.getByAltText(en.hero.imageAlt)).toBeInTheDocument();
    expect(container.querySelector('section')).toHaveAttribute('aria-labelledby', 'hero-title');
    expect(container.querySelector('section')).toHaveAttribute('id', 'top');
  });
});

describe('Services', () => {
  it.each(cases)(
    '(%s) lists the four services with pictogram and audience',
    (locale, dictionary) => {
      const { container } = render(<Services locale={locale} dictionary={dictionary} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        dictionary.services.title.replace(/ /g, ' '),
      );
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
      expect(container.querySelectorAll('li svg.service-icon')).toHaveLength(4);
      for (const item of dictionary.services.items) {
        expect(screen.getByText(item.title.replace(/ /g, ' '))).toBeInTheDocument();
        expect(
          screen.getAllByText(
            `${dictionary.services.audienceLabel} ${item.audience}`.replace(/ /g, ' '),
          ).length,
        ).toBeGreaterThan(0);
      }
    },
  );

  it('uses the lifted surface tone and is labelled by its heading', () => {
    const { container } = render(<Services locale="pl" dictionary={pl} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('surface');
    expect(section).toHaveAttribute('id', 'services');
    expect(section).toHaveAttribute('aria-labelledby', 'services-title');
  });
});

describe('About', () => {
  it.each(cases)(
    '(%s) has the heading, the quote with its author and two paragraphs',
    (locale, dictionary) => {
      const { container } = render(<About locale={locale} dictionary={dictionary} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(dictionary.about.title);
      expect(container.querySelector('blockquote')).toHaveTextContent(
        dictionary.about.quote.replace(/ /g, ' '),
      );
      expect(container.querySelector('figcaption')).toHaveTextContent(dictionary.about.quoteAuthor);
      expect(container.querySelectorAll('p.type-body')).toHaveLength(2);
    },
  );

  it('has no facts table: every fact appears once', () => {
    const { container } = render(<About locale="pl" dictionary={pl} />);
    expect(container.querySelector('dl')).toBeNull();
  });

  it('is the contrast band with a framed photo', () => {
    const { container } = render(<About locale="pl" dictionary={pl} />);
    expect(container.querySelector('section')).toHaveClass('band');
    expect(container.querySelectorAll('line')).toHaveLength(4);
    expect(screen.getByAltText(pl.about.imageAlt)).toBeInTheDocument();
  });
});

describe('Portfolio', () => {
  it.each(cases)('(%s) shows the four projects with category and place', (locale, dictionary) => {
    render(<Portfolio locale={locale} dictionary={dictionary} />);
    expect(screen.getAllByRole('figure')).toHaveLength(projects.length);
    for (const project of projects) {
      const text = dictionary.portfolio.projects[project.id];
      const caption = [text.category, project.location].filter(Boolean).join(', ');
      expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toContain(
        text.title,
      );
      expect(screen.getByText(caption)).toBeInTheDocument();
      expect(screen.getByAltText(plain(text.imageAlt))).toBeInTheDocument();
    }
  });

  it('frames only slot B and lays the slots out asymmetrically', () => {
    const { container } = render(<Portfolio locale="pl" dictionary={pl} />);
    const figures = screen.getAllByRole('figure');
    expect(figures.map((figure) => within(figure).queryAllByRole('img').length)).toEqual([
      1, 1, 1, 1,
    ]);
    expect(container.querySelectorAll('.frame-scroll')).toHaveLength(1);
    expect(figures[1]).toContainElement(container.querySelector('.frame-scroll') as HTMLElement);
    expect(figures[1]).toHaveClass('lg:mt-24');
    expect(figures[3]).toHaveClass('lg:mt-24');
  });

  it('appends year and place to the caption when they are set', () => {
    const original = projects[0];
    if (!original) throw new Error('no projects');
    const mutable = projects as unknown as { year?: number }[];
    Object.assign(mutable[0] as object, { year: 2024 });
    render(<Portfolio locale="pl" dictionary={pl} />);
    expect(screen.getByText(/Szczecin, 2024/)).toBeInTheDocument();
    Object.assign(mutable[0] as object, { year: undefined });
  });
});

describe('Contact', () => {
  it.each(cases)(
    '(%s) has the invitation, the lead and all four data cells',
    (locale, dictionary) => {
      const { container } = render(<Contact locale={locale} dictionary={dictionary} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        dictionary.contact.title.replace(/ /g, ' '),
      );
      const cells = [...container.querySelectorAll('dt')].map((dt) => dt.textContent);
      expect(cells).toEqual([
        dictionary.contact.labels.phone,
        dictionary.contact.labels.email,
        dictionary.contact.labels.address,
        dictionary.contact.labels.hours,
      ]);
      expect(screen.getAllByText(new RegExp(dictionary.contact.hoursTime)).length).toBeGreaterThan(
        0,
      );
    },
  );

  it('links phones and e-mail from site.ts and offers to copy the address', () => {
    render(<Contact locale="pl" dictionary={pl} />);
    for (const phone of site.phones) {
      expect(screen.getByRole('link', { name: phone.display })).toHaveAttribute('href', phone.href);
    }
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    );
    expect(screen.getByRole('button', { name: pl.contact.copyEmail })).toBeInTheDocument();
  });

  it('opens the map in a new tab and announces it', () => {
    render(<Contact locale="en" dictionary={en} />);
    const map = screen.getByRole('link', { name: new RegExp(en.contact.showOnMap) });
    expect(map).toHaveAttribute('href', site.mapUrl);
    expect(map).toHaveAttribute('target', '_blank');
    expect(map).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(map).getByText(`(${en.common.opensInNewTab})`)).toBeInTheDocument();
  });

  it('uses the surface tone with a shorter bottom edge', () => {
    const { container } = render(<Contact locale="pl" dictionary={pl} />);
    expect(container.querySelector('section')).toHaveClass('surface', 'section-y-tight-end');
  });
});

describe('PrivacyDocumentView', () => {
  it.each(['pl', 'en', 'fr'] as const)('(%s) renders one headed section per topic', (locale) => {
    const document = getPrivacyDocument(locale);
    render(<PrivacyDocumentView document={document} placeholderLabel="placeholder" />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(document.sections.length);
  });

  it('renders lists as bullet lists and paragraphs as text', () => {
    const { container } = render(
      <PrivacyDocumentView document={getPrivacyDocument('pl')} placeholderLabel="placeholder" />,
    );
    expect(container.querySelector('ul')).not.toBeNull();
    expect(container.querySelectorAll('p').length).toBeGreaterThan(5);
  });

  it('flags placeholder paragraphs on preview deployments only', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    const preview = render(
      <PrivacyDocumentView document={getPrivacyDocument('pl')} placeholderLabel="placeholder" />,
    );
    expect(preview.getAllByText('placeholder').length).toBeGreaterThan(0);
    preview.unmount();

    vi.stubEnv('VERCEL_ENV', 'production');
    render(
      <PrivacyDocumentView document={getPrivacyDocument('pl')} placeholderLabel="placeholder" />,
    );
    expect(screen.queryByText('placeholder')).toBeNull();
    vi.unstubAllEnvs();
  });
});
