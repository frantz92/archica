// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ButtonLink } from './button-link';
import { Container } from './container';
import { EmailLink, PhoneLinks } from './contact-links';
import { PlaceholderBadge } from './placeholder-badge';
import { PostalAddress } from './postal-address';
import { Section } from './section';
import { SectionHeader } from './section-header';
import { SectionMark } from './section-mark';
import { ServiceIcon } from './service-icons';
import { TextLink } from './text-link';
import { TitleBlock } from './title-block';
import { site } from '@/content/site';

describe('Container', () => {
  it('renders its children in a page container', () => {
    render(<Container className="extra">hello</Container>);
    expect(screen.getByText('hello')).toHaveClass('container-page', 'extra');
  });

  it('can render as another element', () => {
    render(<Container as="main">content</Container>);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

describe('Section', () => {
  it('is a labelled landmark with the default tone', () => {
    render(
      <Section id="services" labelledBy="title">
        <h2 id="title">Title</h2>
      </Section>,
    );
    const section = screen.getByRole('region', { name: 'Title' });
    expect(section).toHaveAttribute('id', 'services');
    expect(section).toHaveClass('section-y', 'section-anchor');
    expect(section).not.toHaveClass('surface');
  });

  it.each(['surface', 'band'] as const)('applies the %s tone', (tone) => {
    render(
      <Section id="s" labelledBy="t" tone={tone}>
        <h2 id="t">T</h2>
      </Section>,
    );
    expect(screen.getByRole('region')).toHaveClass(tone);
  });

  it('can shorten its bottom padding', () => {
    render(
      <Section id="s" labelledBy="t" tightEnd>
        <h2 id="t">T</h2>
      </Section>,
    );
    expect(screen.getByRole('region')).toHaveClass('section-y-tight-end');
    expect(screen.getByRole('region')).not.toHaveClass('section-y');
  });
});

describe('SectionHeader', () => {
  it('renders the heading with its id and a decorative mark', () => {
    const { container } = render(<SectionHeader id="h" title="Usługi" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Usługi' })).toHaveAttribute('id', 'h');
    expect(container.querySelector('.section-mark')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('heading')).toHaveClass('lg:col-span-12');
  });

  it('adds the lead and narrows the heading when a lead is given', () => {
    render(<SectionHeader id="h" title="T" lead="Lead text" />);
    expect(screen.getByText('Lead text')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('lg:col-span-5');
  });
});

describe('SectionMark', () => {
  it('is purely decorative', () => {
    const { container } = render(<SectionMark />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('TitleBlock', () => {
  const items = [
    { id: 'a', label: 'Label A', value: 'Value A' },
    { id: 'b', label: 'Label B', value: 'Value B', labelHidden: true },
  ];

  it('renders a definition list with one term and one definition per item', () => {
    render(<TitleBlock items={items} />);
    expect(screen.getByText('Label A').tagName).toBe('DT');
    expect(screen.getByText('Value A').tagName).toBe('DD');
  });

  it('hides a label visually but keeps it for assistive technology', () => {
    render(<TitleBlock items={items} />);
    expect(screen.getByText('Label B')).toHaveClass('sr-only');
    expect(screen.getByText('Label A')).not.toHaveClass('sr-only');
  });

  it('applies the value style of the block or of a single item', () => {
    render(
      <TitleBlock
        items={[
          { id: 'a', label: 'A', value: 'plain' },
          { id: 'b', label: 'B', value: 'special', valueStyle: 'small' },
        ]}
        valueStyle="stat"
      />,
    );
    expect(screen.getByText('plain')).toHaveClass('type-stat');
    expect(screen.getByText('special')).toHaveClass('type-small');
  });

  it('opts cells and rules into the scroll reveal only when asked', () => {
    const { container, rerender } = render(<TitleBlock items={items} />);
    expect(container.querySelector('.reveal')).toBeNull();
    expect(container.querySelector('dl')).not.toHaveClass('rule-draw');
    rerender(<TitleBlock items={items} reveal />);
    expect(container.querySelectorAll('.reveal')).toHaveLength(2);
    expect(container.querySelector('dl')).toHaveClass('rule-draw');
  });
});

describe('ButtonLink', () => {
  it('is a link styled as the primary call to action', () => {
    render(<ButtonLink href="/pl#contact">Skontaktuj się</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Skontaktuj się' });
    expect(link).toHaveAttribute('href', '/pl#contact');
    expect(link).toHaveClass('bg-accent');
  });

  it('merges extra classes', () => {
    render(
      <ButtonLink href="/" className="w-full">
        x
      </ButtonLink>,
    );
    expect(screen.getByRole('link')).toHaveClass('w-full');
  });
});

describe('TextLink', () => {
  it('renders an internal link with the underline on the text', () => {
    render(<TextLink href="/pl">Home</TextLink>);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/pl');
    expect(link).not.toHaveAttribute('target');
    expect(screen.getByText('Home')).toHaveClass('link-underline');
  });

  it('opens external links in a new tab safely and announces it', () => {
    render(
      <TextLink href="https://example.com" external externalHint="opens in a new tab">
        Map
      </TextLink>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('(opens in a new tab)')).toHaveClass('sr-only');
  });

  it('omits the hint when none is provided', () => {
    render(
      <TextLink href="https://example.com" external>
        Map
      </TextLink>,
    );
    expect(screen.queryByText(/\(/)).toBeNull();
  });
});

describe('PostalAddress', () => {
  it('prints the address from site.ts in two lines', () => {
    const { container } = render(<PostalAddress className="x" />);
    const address = container.querySelector('address');
    expect(address).toHaveTextContent(site.address.street);
    expect(address).toHaveTextContent(`${site.address.postalCode} ${site.address.city}`);
    expect(address?.querySelector('br')).not.toBeNull();
    expect(address).toHaveClass('not-italic', 'x');
  });
});

describe('contact links', () => {
  it('renders one tel: link per phone number', () => {
    render(<PhoneLinks />);
    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(site.phones.map((p) => p.href));
  });

  it('renders the mailto: link', () => {
    render(<EmailLink compact className="break-all" />);
    const link = screen.getByRole('link', { name: site.email });
    expect(link).toHaveAttribute('href', `mailto:${site.email}`);
    expect(link).toHaveClass('py-1.5', 'break-all');
  });

  it('uses regular padding unless compact', () => {
    render(<EmailLink />);
    expect(screen.getByRole('link')).toHaveClass('py-2');
  });
});

describe('PlaceholderBadge', () => {
  it('shows the label outside production', () => {
    vi.stubEnv('SITE_ENV', 'development');
    render(<PlaceholderBadge label="placeholder" />);
    expect(screen.getByText('placeholder')).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it.each(['production', 'preview'])('renders nothing in a %s build', (siteEnv) => {
    vi.stubEnv('SITE_ENV', siteEnv);
    const { container } = render(<PlaceholderBadge label="placeholder" />);
    expect(container).toBeEmptyDOMElement();
    vi.unstubAllEnvs();
  });
});

describe('ServiceIcon', () => {
  it.each(['houses', 'public', 'urban', 'permits'])('draws the %s pictogram', (id) => {
    const { container } = render(<ServiceIcon id={id} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0);
    for (const path of svg?.querySelectorAll('path') ?? []) {
      expect(path).toHaveAttribute('pathLength', '1');
    }
  });

  it('renders nothing for an unknown id', () => {
    const { container } = render(<ServiceIcon id="nope" />);
    expect(container).toBeEmptyDOMElement();
  });
});
