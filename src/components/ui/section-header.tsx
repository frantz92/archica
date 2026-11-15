import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  /** id of the h2; the parent `<section>` points to it with `aria-labelledby`. */
  id: string;
  title: string;
  /** Optional intro text. When present it sits to the right of the title on desktop. */
  lead?: string;
}

/** Shared section heading: h2 on the left, optional lead on the right (BLUEPRINT §6.3). */
export function SectionHeader({ id, title, lead }: SectionHeaderProps) {
  return (
    <div className="reveal mb-12 grid-page gap-y-6 lg:mb-20">
      <h2
        id={id}
        className={cn(
          'col-span-4 type-h2 md:col-span-12',
          lead ? 'lg:col-span-5' : 'lg:col-span-12',
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className="col-span-4 type-lead text-fg-muted md:col-span-12 lg:col-span-6 lg:col-start-7">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
