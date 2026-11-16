// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { images } from '@/content/images';

import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './icons';
import { FramedMedia } from './framed-media';
import { Logo } from './logo';
import { Media } from './media';

describe('icons', () => {
  it.each([MenuIcon, CloseIcon, SunIcon, MoonIcon])('render decorative 24px SVGs', (Icon) => {
    const { container } = render(<Icon className="x" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveClass('x');
  });
});

describe('Logo', () => {
  it.each([
    ['mark', 1, '0 0 100 100'],
    ['horizontal', 2, '0 0 358.3 100'],
    ['stacked', 2, '0 0 230.3 166.789'],
  ] as const)('%s variant', (variant, paths, viewBox) => {
    const { container } = render(<Logo variant={variant} title="Archica" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', viewBox);
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('overflow', 'visible');
    expect(svg?.querySelectorAll('path')).toHaveLength(paths);
    expect(screen.getByRole('img', { name: 'Archica' })).toBeInTheDocument();
  });

  it('paints the emblem amber and leaves the wordmark in the text colour', () => {
    const { container } = render(<Logo variant="horizontal" title="Archica" />);
    const [emblem, wordmark] = container.querySelectorAll('path');
    expect(emblem).toHaveClass('fill-accent-line');
    expect(wordmark).not.toHaveClass('fill-accent-line');
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor');
  });

  it('paints the emblem of the mark and stacked variants amber too', () => {
    for (const variant of ['mark', 'stacked'] as const) {
      const { container, unmount } = render(<Logo variant={variant} title="A" />);
      expect(container.querySelector('path')).toHaveClass('fill-accent-line');
      unmount();
    }
  });
});

describe('Media', () => {
  it('renders the photo with its alt text and sizes', () => {
    render(<Media image="hero" alt="Hero photo" sizes="50vw" placeholderLabel="placeholder" />);
    const img = screen.getByAltText('Hero photo');
    expect(img).toHaveAttribute('sizes', '50vw');
  });

  it('shows the placeholder badge while the file is a placeholder', () => {
    vi.stubEnv('SITE_ENV', 'development');
    render(<Media image="hero" alt="a" sizes="1px" placeholderLabel="placeholder" />);
    expect(screen.getByText('placeholder')).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('hides the badge once the real photo is in place', () => {
    vi.stubEnv('SITE_ENV', 'development');
    Object.defineProperty(images.about, 'placeholder', { value: false, configurable: true });
    render(<Media image="about" alt="a" sizes="1px" placeholderLabel="placeholder" />);
    expect(screen.queryByText('placeholder')).toBeNull();
    Object.defineProperty(images.about, 'placeholder', { value: true, configurable: true });
    vi.unstubAllEnvs();
  });

  it('fills its parent unless an aspect ratio is given', () => {
    const { container, rerender } = render(
      <Media image="hero" alt="a" sizes="1px" placeholderLabel="p" />,
    );
    expect(container.firstElementChild).toHaveClass('h-full');
    rerender(
      <Media
        image="hero"
        alt="a"
        sizes="1px"
        placeholderLabel="p"
        aspectClassName="aspect-[4/5]"
        className="reveal-media"
      />,
    );
    expect(container.firstElementChild).toHaveClass('aspect-[4/5]', 'reveal-media');
    expect(container.firstElementChild).not.toHaveClass('h-full');
  });
});

describe('FramedMedia', () => {
  const props = {
    image: 'hero',
    alt: 'Framed',
    sizes: '1px',
    placeholderLabel: 'p',
    frameClassName: 'aspect-square',
    insetX: 16,
    insetY: 8,
  } as const;

  it('joins each frame corner to the matching photo corner with four lines', () => {
    const { container } = render(<FramedMedia {...props} motion="load" />);
    const lines = [...container.querySelectorAll('line')].map((line) =>
      ['x1', 'y1', 'x2', 'y2'].map((name) => Number(line.getAttribute(name))),
    );
    expect(lines).toEqual([
      [0, 0, 16, 8],
      [100, 0, 84, 8],
      [0, 100, 16, 92],
      [100, 100, 84, 92],
    ]);
  });

  it('positions the photo by the insets', () => {
    const { container } = render(<FramedMedia {...props} motion="load" />);
    const opening = container.querySelector<HTMLElement>('div > div.absolute');
    expect(opening?.style.insetInline).toBe('16%');
    expect(opening?.style.insetBlock).toBe('8%');
  });

  it('opens once on load for the hero', () => {
    const { container } = render(<FramedMedia {...props} motion="load" preload quality={85} />);
    expect(container.querySelector('.hero-line')).not.toBeNull();
    expect(container.querySelector('.hero-reveal')).not.toBeNull();
    expect(container.querySelector('.frame-scroll')).toBeNull();
  });

  it('draws while scrolling into view elsewhere', () => {
    const { container } = render(<FramedMedia {...props} motion="scroll" />);
    expect(container.querySelector('.frame-scroll')).not.toBeNull();
    expect(container.querySelectorAll('.frame-line')).toHaveLength(4);
    expect(container.querySelector('.reveal-media')).not.toBeNull();
    expect(container.querySelector('.hero-reveal')).toBeNull();
  });

  it('hides the lines from assistive technology', () => {
    const { container } = render(<FramedMedia {...props} motion="load" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByAltText('Framed')).toBeInTheDocument();
  });
});
