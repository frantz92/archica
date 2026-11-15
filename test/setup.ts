import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import type * as Navigation from 'next/navigation';
import { createElement } from 'react';
import { afterEach, beforeEach, vi } from 'vitest';

import { FakeIntersectionObserver, installDomStubs, setReducedMotion } from './dom-stubs';
import { navigationState, setNavigation } from './navigation-state';

// next/image needs the Next.js image loader; a plain <img> keeps the props that matter for tests.
vi.mock('next/image', () => ({
  default: ({ src, alt, className, sizes }: Record<string, unknown>) =>
    createElement('img', {
      src: typeof src === 'string' ? src : ((src as { src?: string } | undefined)?.src ?? ''),
      alt,
      className,
      sizes,
    }),
}));

// Router hooks read mutable state, so a test can pretend to be on any page.
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof Navigation>()),
  usePathname: () => navigationState.pathname,
  useParams: () => navigationState.params,
}));

installDomStubs();

beforeEach(() => {
  setReducedMotion(false);
  setNavigation('/pl', 'pl');
  FakeIntersectionObserver.reset();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
