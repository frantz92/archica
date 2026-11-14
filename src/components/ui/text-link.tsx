import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface TextLinkProps {
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
  /** Visually hidden suffix for external links (dictionary: common.opensInNewTab). */
  externalHint?: string;
  className?: string;
  children: ReactNode;
}

/** Text link with a 1 px underline that draws from the left on hover/focus. */
export function TextLink({
  href,
  external = false,
  externalHint,
  className,
  children,
}: TextLinkProps) {
  const classes = cn('inline-block min-h-11 py-2 link-underline', className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {externalHint ? <span className="sr-only"> ({externalHint})</span> : null}
      </a>
    );
  }

  return (
    <Link prefetch={false} href={href} className={classes}>
      {children}
    </Link>
  );
}
