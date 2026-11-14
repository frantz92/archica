'use client';

import { useEffect, useState, type ReactNode } from 'react';

const SCROLL_THRESHOLD_PX = 24;

/** Fixed header frame. Only toggles `data-scrolled`; all content is rendered on the server. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:bg-bg/88 data-[scrolled=true]:backdrop-blur-[12px]"
    >
      {children}
    </header>
  );
}
