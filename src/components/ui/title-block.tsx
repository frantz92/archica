import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface TitleBlockItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly value: ReactNode;
  /** Keeps the label for assistive technology but hides it visually. */
  readonly labelHidden?: boolean;
  /** Overrides the block's value style for this cell (e.g. a word that must not wrap in a narrow cell). */
  readonly valueStyle?: ValueStyle;
}

type ValueStyle = 'value' | 'stat' | 'small';

const valueClasses = {
  value: 'type-value',
  stat: 'type-stat',
  small: 'type-small',
} as const;

interface TitleBlockProps {
  items: readonly TitleBlockItem[];
  /** Typographic role of the values. */
  valueStyle?: ValueStyle;
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
          <dt className={item.labelHidden ? 'sr-only' : 'type-label text-fg-muted'}>
            {item.label}
          </dt>
          <dd className={valueClasses[item.valueStyle ?? valueStyle]}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
