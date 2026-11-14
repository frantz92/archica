import { cn } from '@/lib/cn';

interface PlaceholderBadgeProps {
  /** Text from the dictionary (common.placeholder). */
  label: string;
  className?: string;
}

/**
 * Small "placeholder" tag, visible locally and on preview deployments only
 * (VERCEL_ENV !== 'production', BLUEPRINT §3.3). Renders nothing in production.
 */
export function PlaceholderBadge({ label, className }: PlaceholderBadgeProps) {
  if (process.env.VERCEL_ENV === 'production') {
    return null;
  }
  return (
    <span
      className={cn(
        'inline-block rounded-sm border border-line-strong px-1.5 py-0.5 type-label text-fg-muted',
        className,
      )}
    >
      {label}
    </span>
  );
}
