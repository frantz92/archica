import { logoAssets } from './logo-assets';

export type LogoVariant = 'mark' | 'horizontal' | 'stacked';

interface LogoProps {
  variant: LogoVariant;
  /** Accessible name, taken from the dictionary (a11y.logoName). */
  title: string;
  className?: string;
}

/**
 * Inline SVG logo. The emblem is amber (`--accent-line`, darkened on light backgrounds); the wordmark
 * uses currentColor, so one component serves both themes.
 */
export function Logo({ variant, title, className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={logoAssets.viewBoxes[variant]}
      role="img"
      aria-label={title}
      className={className}
      fill="currentColor"
      fillRule="nonzero"
      overflow="visible"
    >
      <title>{title}</title>
      {variant === 'mark' && <path d={logoAssets.markPath} className="fill-accent-line" />}
      {variant === 'horizontal' && (
        <>
          <path d={logoAssets.markPath} className="fill-accent-line" />
          <g transform="translate(128 -92.5)">
            <path d={logoAssets.wordmarkPath} />
          </g>
        </>
      )}
      {variant === 'stacked' && (
        <>
          <path d={logoAssets.stackedMarkPath} className="fill-accent-line" />
          <path d={logoAssets.wordmarkPath} />
        </>
      )}
    </svg>
  );
}
