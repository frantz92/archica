// @vitest-environment jsdom
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { site } from '@/content/site';
import { en, fr, pl } from '@/i18n/test-utils';

import { FakeIntersectionObserver, setReducedMotion } from '../../../test/dom-stubs';
import { setNavigation } from '../../../test/navigation-state';
import { ThemeProvider } from '../providers/theme-provider';

import { Footer } from './footer';
import { Header } from './header';
import { HeaderShell } from './header-shell';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';
import { NavLinks, type NavLinkItem } from './nav-links';
import { NotFoundContent } from './not-found-content';
import { SkipLink } from './skip-link';
import { ThemeToggle } from './theme-toggle';

/**
 * `next/link` creates its own observers for prefetching, so the navigation's observer is found by
 * its root margin (the thin band that decides which section is active).
 */
const liveObserver = (): FakeIntersectionObserver | undefined =>
  FakeIntersectionObserver.instances.find(
    (observer) => !observer.disconnected && observer.options?.rootMargin?.includes('-40%'),
  );

const links: NavLinkItem[] = [
  { id: 'services', label: 'Usługi' },
  { id: 'about', label: 'O nas' },
];

describe('SkipLink', () => {
  it('jumps to the main landmark', () => {
    render(<SkipLink label="Przejdź do treści" />);
    expect(screen.getByRole('link', { name: 'Przejdź do treści' })).toHaveAttribute(
      'href',
      '#main',
    );
  });
});

describe('HeaderShell', () => {
  const scrollTo = (y: number) => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    fireEvent.scroll(window);
  };

  it('marks the header as scrolled only after 24 px', () => {
    scrollTo(0);
    render(<HeaderShell>content</HeaderShell>);
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-scrolled', 'false');
    scrollTo(24);
    expect(header).toHaveAttribute('data-scrolled', 'false');
    scrollTo(25);
    expect(header).toHaveAttribute('data-scrolled', 'true');
    scrollTo(0);
    expect(header).toHaveAttribute('data-scrolled', 'false');
  });

  it('stops listening when unmounted', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<HeaderShell>x</HeaderShell>);
    unmount();
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});

describe('NavLinks', () => {
  const addSections = () => {
    for (const { id } of links) {
      const section = document.createElement('section');
      section.id = id;
      document.body.append(section);
    }
  };

  it('links every section of the current language', () => {
    render(<NavLinks locale="pl" links={links} ariaLabel="Nawigacja główna" />);
    const nav = screen.getByRole('navigation', { name: 'Nawigacja główna' });
    expect(within(nav).getByRole('link', { name: 'Usługi' })).toHaveAttribute(
      'href',
      '/pl#services',
    );
    expect(within(nav).getByRole('link', { name: 'O nas' })).toHaveAttribute('href', '/pl#about');
  });

  it('marks the section in view as current and clears it when it leaves', () => {
    addSections();
    render(<NavLinks locale="pl" links={links} ariaLabel="nav" />);
    const observer = liveObserver();
    const services = document.getElementById('services') as HTMLElement;
    const about = document.getElementById('about') as HTMLElement;

    act(() => observer?.triggerFor(services, true));
    expect(screen.getByRole('link', { name: 'Usługi' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'O nas' })).not.toHaveAttribute('aria-current');

    act(() => observer?.triggerFor(about, false)); // a different section leaving changes nothing
    expect(screen.getByRole('link', { name: 'Usługi' })).toHaveAttribute('aria-current', 'true');

    act(() => observer?.triggerFor(services, false));
    expect(screen.getByRole('link', { name: 'Usługi' })).not.toHaveAttribute('aria-current');
    document.body.innerHTML = '';
  });

  it('highlights nothing and observes nothing outside the home page', () => {
    setNavigation('/pl/privacy', 'pl');
    render(<NavLinks locale="pl" links={links} ariaLabel="nav" />);
    expect(liveObserver()).toBeUndefined();
    for (const link of screen.getAllByRole('link'))
      expect(link).not.toHaveAttribute('aria-current');
  });

  it('tolerates a section that is missing from the page', () => {
    render(<NavLinks locale="pl" links={links} ariaLabel="nav" />);
    expect(liveObserver()?.observed.size).toBe(0);
  });

  it('disconnects its observer on unmount', () => {
    const { unmount } = render(<NavLinks locale="pl" links={links} ariaLabel="nav" />);
    unmount();
    expect(liveObserver()).toBeUndefined();
  });
});

describe('LanguageSwitcher', () => {
  const options = {
    pl: { short: 'PL', name: 'Polski' },
    en: { short: 'EN', name: 'English' },
    fr: { short: 'FR', name: 'Français' },
  };

  it('links to the same page in every language, without an anchor', () => {
    setNavigation('/pl/privacy', 'pl');
    render(<LanguageSwitcher currentLocale="pl" options={options} ariaLabel="Wybór języka" />);
    expect(screen.getByRole('link', { name: 'PL' })).toHaveAttribute('href', '/pl/privacy');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en/privacy');
    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute('href', '/fr/privacy');
  });

  it('points to the home page of the other language from the home page', () => {
    render(<LanguageSwitcher currentLocale="pl" options={options} ariaLabel="x" />);
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
  });

  it('never carries over a location hash', () => {
    window.location.hash = '#services';
    render(<LanguageSwitcher currentLocale="pl" options={options} ariaLabel="x" />);
    expect(screen.getByRole('link', { name: 'FR' }).getAttribute('href')).not.toContain('#');
    window.location.hash = '';
  });

  it('marks the current language and declares the language of each link', () => {
    render(<LanguageSwitcher currentLocale="en" options={options} ariaLabel="x" />);
    setNavigation('/en', 'en');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'PL' })).not.toHaveAttribute('aria-current');
    const fr = screen.getByRole('link', { name: 'FR' });
    expect(fr).toHaveAttribute('lang', 'fr');
    expect(fr).toHaveAttribute('hreflang', 'fr');
    expect(fr).toHaveAttribute('title', 'Français');
  });

  it('copes with a path outside the current locale', () => {
    setNavigation('/something', 'pl');
    render(<LanguageSwitcher currentLocale="pl" options={options} ariaLabel="x" />);
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
  });
});

describe('ThemeToggle', () => {
  const renderToggle = () =>
    render(
      <ThemeProvider>
        <ThemeToggle switchToLight="Włącz motyw jasny" switchToDark="Włącz motyw ciemny" />
      </ThemeProvider>,
    );

  it('contains both accessible names and switches the theme class', async () => {
    const user = userEvent.setup();
    document.documentElement.className = 'dark';
    renderToggle();
    expect(screen.getByText('Włącz motyw jasny')).toBeInTheDocument();
    expect(screen.getByText('Włącz motyw ciemny')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(document.documentElement).toHaveClass('light');
    await user.click(screen.getByRole('button'));
    expect(document.documentElement).toHaveClass('dark');
  });

  it('cross-fades through the View Transitions API when it exists', async () => {
    const user = userEvent.setup();
    const startViewTransition = vi.fn((callback: () => void) => callback());
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      configurable: true,
    });
    renderToggle();
    await user.click(screen.getByRole('button'));
    expect(startViewTransition).toHaveBeenCalledOnce();
    Reflect.deleteProperty(document, 'startViewTransition');
  });

  it('skips the transition with reduced motion', async () => {
    const user = userEvent.setup();
    setReducedMotion(true);
    const startViewTransition = vi.fn();
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      configurable: true,
    });
    renderToggle();
    await user.click(screen.getByRole('button'));
    expect(startViewTransition).not.toHaveBeenCalled();
    Reflect.deleteProperty(document, 'startViewTransition');
  });
});

describe('MobileMenu', () => {
  const renderMenu = () =>
    render(
      <MobileMenu
        locale="pl"
        links={links}
        contact={<a href="tel:+48000">+48 000</a>}
        labels={{ open: 'Otwórz menu', close: 'Zamknij menu', title: 'Menu', nav: 'Nawigacja' }}
      >
        <span>controls</span>
      </MobileMenu>,
    );
  const dialog = () => document.querySelector('dialog') as HTMLDialogElement;

  it('starts closed and opens as a modal dialog', async () => {
    const user = userEvent.setup();
    renderMenu();
    expect(dialog()).not.toHaveAttribute('open');
    await user.click(screen.getByRole('button', { name: 'Otwórz menu' }));
    expect(dialog()).toHaveAttribute('open');
  });

  it('names the dialog and its link list differently', () => {
    renderMenu();
    expect(dialog()).toHaveAttribute('aria-label', 'Menu');
    expect(dialog().querySelector('nav')).toHaveAttribute('aria-label', 'Nawigacja');
  });

  it('shows the section links, the contact slot and the controls', () => {
    renderMenu();
    const menu = within(dialog());
    expect(menu.getByText('Usługi').closest('a')).toHaveAttribute('href', '/pl#services');
    expect(menu.getByText('+48 000')).toBeInTheDocument();
    expect(menu.getByText('controls')).toBeInTheDocument();
  });

  it('closes with the close button and returns focus to the opener', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Otwórz menu' }));
    fireEvent.click(within(dialog()).getByText('Zamknij menu').closest('button') as HTMLElement);
    expect(dialog()).not.toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Otwórz menu' })).toHaveFocus();
  });

  it('closes after a link is chosen', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Otwórz menu' }));
    fireEvent.click(within(dialog()).getByText('O nas'));
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('closes by itself when the viewport becomes desktop-sized', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Otwórz menu' }));
    const mock = vi.mocked(window.matchMedia);
    const handler = mock.mock.results.at(-1)?.value.addEventListener.mock.calls[0][1];
    act(() => handler({ matches: false }));
    expect(dialog()).toHaveAttribute('open');
    act(() => handler({ matches: true }));
    expect(dialog()).not.toHaveAttribute('open');
  });
});

describe('NotFoundContent', () => {
  const strings = { pl: pl.notFound, en: en.notFound, fr: fr.notFound };

  it.each([
    ['pl', pl.notFound],
    ['en', en.notFound],
    ['fr', fr.notFound],
  ] as const)('speaks %s on a localised route', (locale, text) => {
    setNavigation(`/${locale}/x`, locale);
    render(<NotFoundContent strings={strings} logoName="Archica" />);
    expect(screen.getByRole('heading', { level: 1, name: text.title })).toBeInTheDocument();
    expect(screen.getByText(text.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: text.homeLink })).toHaveAttribute('href', `/${locale}`);
  });

  it('falls back to Polish outside a locale route', () => {
    setNavigation('/zzz');
    render(<NotFoundContent strings={strings} logoName="Archica" />);
    expect(screen.getByRole('heading', { level: 1, name: pl.notFound.title })).toBeInTheDocument();
  });

  it('falls back to Polish for an unknown language segment', () => {
    setNavigation('/de/x', 'de');
    render(<NotFoundContent strings={strings} logoName="Archica" />);
    expect(screen.getByRole('link', { name: pl.notFound.homeLink })).toHaveAttribute('href', '/pl');
  });

  it('shows the logo with its accessible name', () => {
    render(<NotFoundContent strings={strings} logoName="Archica" />);
    expect(screen.getByRole('img', { name: 'Archica' })).toBeInTheDocument();
  });
});

describe('Header', () => {
  it('has the home link, the section navigation and the controls', () => {
    render(<Header locale="pl" dictionary={pl} />);
    expect(screen.getByRole('link', { name: pl.a11y.homeLink })).toHaveAttribute('href', '/pl');
    expect(screen.getAllByRole('navigation', { name: pl.a11y.mainNav }).length).toBeGreaterThan(0);
    // Labels use non-breaking spaces after one-letter words ("O nas"); testing-library normalises them.
    for (const label of [pl.nav.services, pl.nav.about, pl.nav.portfolio, pl.nav.contact]) {
      expect(screen.getAllByText(label.replace(/\u00A0/g, ' ')).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByRole('link', { name: 'EN' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: pl.a11y.openMenu })).toBeInTheDocument();
  });

  it('puts the contact details in the mobile menu from site.ts', () => {
    render(<Header locale="en" dictionary={en} />);
    const dialog = document.querySelector('dialog') as HTMLElement;
    expect(within(dialog).getByText(site.email)).toBeInTheDocument();
    for (const phone of site.phones)
      expect(within(dialog).getByText(phone.display)).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('shows the company data and the licence placeholder', () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    render(<Footer locale="pl" dictionary={pl} />);
    expect(screen.getByText(site.fullName)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(site.taxId))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(site.license.number))).toBeInTheDocument();
    expect(screen.getByText(pl.common.placeholder)).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('links the sections, the privacy policy and the top of the page', () => {
    render(<Footer locale="fr" dictionary={fr} />);
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/fr#services',
        '/fr#about',
        '/fr#portfolio',
        '/fr#contact',
        '/fr/privacy',
        '/fr#top',
      ]),
    );
  });

  it('prints the copyright with the current year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2031-06-01T12:00:00Z'));
    render(<Footer locale="en" dictionary={en} />);
    expect(screen.getByText(`© 2031 ${site.brand}`)).toBeInTheDocument();
  });

  it('shows both logo variants for the responsive layout', () => {
    render(<Footer locale="pl" dictionary={pl} />);
    expect(screen.getAllByRole('img', { name: pl.a11y.logoName })).toHaveLength(2);
  });
});
