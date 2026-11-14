import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface SectionProps {
  id: string;
  /** id of the heading element that labels this section. */
  labelledBy: string;
  /** Applies the contrast band token set (BLUEPRINT §2.3). */
  band?: boolean;
  className?: string;
  children: ReactNode;
}

/** Full-width semantic section with the standard vertical rhythm. */
export function Section({ id, labelledBy, band = false, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('bg-bg section-y text-fg', band && 'band', className)}
    >
      {children}
    </section>
  );
}
