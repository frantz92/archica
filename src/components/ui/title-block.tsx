import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface TitleBlockItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly value: ReactNode;
}

interface TitleBlockProps {
  items: readonly TitleBlockItem[];
  /** Typographic role of the values. */
  valueStyle?: 'value' | 'stat';
  /** Grid classes controlling the column layout per breakpoint. */
  className?: string;
}

/**
 * "Drawing title block": a definition list whose cells are separated by 1 px lines
 * (BLUEPRINT §2.1, §5). The lines are the 1 px grid gap showing the line-coloured list background
 * through opaque cells, so only inner edges and the top/bottom rules appear.
 */
export function TitleBlock({ items, valueStyle = 'value', className }: TitleBlockProps) {
  return (
    <dl className={cn('grid gap-px border-y border-line bg-line', className)}>
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-3 bg-bg p-4 md:p-6">
          <dt className="type-label text-fg-muted">{item.label}</dt>
          <dd className={valueStyle === 'stat' ? 'type-stat' : 'type-value'}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
