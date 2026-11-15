import { MARK_PATH, STACKED_MARK_PATH, WORDMARK_PATH } from './logo-paths';

export type LogoVariant = 'mark' | 'horizontal' | 'stacked';

interface LogoProps {
  variant: LogoVariant;
  /** Accessible name, taken from the dictionary (a11y.logoName). */
  title: string;
  className?: string;
}

const viewBoxes: Record<LogoVariant, string> = {
  mark: '0 0 100 100',
  horizontal: '0 0 358.3 100',
  stacked: '0 0 230.3 166.789',
};

/**
 * Inline SVG logo. The emblem is amber (`--accent-line`, darkened on light backgrounds); the wordmark
 * uses currentColor, so one component serves both themes.
 */
export function Logo({ variant, title, className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBoxes[variant]}
      role="img"
      aria-label={title}
      className={className}
      fill="currentColor"
      fillRule="nonzero"
      overflow="visible"
    >
      <title>{title}</title>
      {variant === 'mark' && <path d={MARK_PATH} className="fill-accent-line" />}
      {variant === 'horizontal' && (
        <>
          <path d={MARK_PATH} className="fill-accent-line" />
          <g transform="translate(128 -92.5)">
            <path d={WORDMARK_PATH} />
          </g>
        </>
      )}
      {variant === 'stacked' && (
        <>
          <path d={STACKED_MARK_PATH} className="fill-accent-line" />
          <path d={WORDMARK_PATH} />
        </>
      )}
    </svg>
  );
}
