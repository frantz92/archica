import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface SectionProps {
  id: string;
  /** id of the heading element that labels this section. */
  labelledBy: string;
  /** Background tone: base, a slightly lifted `surface`, or the contrast `band` (BLUEPRINT §2.3). */
  tone?: 'default' | 'surface' | 'band';
  /** Shorter bottom padding, for the section directly above the footer. */
  tightEnd?: boolean;
  className?: string;
  children: ReactNode;
}

/** Full-width semantic section with the standard vertical rhythm. */
export function Section({
  id,
  labelledBy,
  tone = 'default',
  tightEnd = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'bg-bg text-fg',
        tightEnd ? 'section-y-tight-end' : 'section-y',
        tone !== 'default' && tone,
        className,
      )}
    >
      {children}
    </section>
  );
}
