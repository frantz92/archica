import { cn } from '@/lib/cn';
import { getSiteEnv } from '@/lib/site-env';

interface PlaceholderBadgeProps {
  /** Text from the dictionary (common.placeholder). */
  label: string;
  className?: string;
}

/**
 * Small "placeholder" tag, visible locally and in CI builds only. The deploy workflow sets
 * SITE_ENV=production (live site) or SITE_ENV=preview (review copy), which hide it (BLUEPRINT §3.3).
 */
export function PlaceholderBadge({ label, className }: PlaceholderBadgeProps) {
  if (getSiteEnv() !== 'development') {
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
