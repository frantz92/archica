import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface ButtonLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/** Primary call-to-action: amber fill, ink text (BLUEPRINT §6.2). */
export function ButtonLink({ href, className, children }: ButtonLinkProps) {
  return (
    <Link
      prefetch={false}
      href={href}
      className={cn(
        'inline-flex min-h-12 min-w-11 items-center justify-center rounded-sm bg-accent px-6 text-base font-medium text-on-accent',
        'transition-[transform,filter] duration-150 hover:-translate-y-px hover:brightness-110 active:translate-y-0 active:scale-[0.98]',
        className,
      )}
    >
      {children}
    </Link>
  );
}
