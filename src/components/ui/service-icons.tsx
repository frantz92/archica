import { cn } from '@/lib/cn';

/**
 * Line pictograms for the four services, drawn on a 40 × 40 grid in the language of a technical
 * drawing: thin square-capped strokes, right angles, no fills. They echo the emblem. Keys match
 * `services.items[].id` in the dictionaries.
 */
const ICON_PATHS: Readonly<Record<string, string>> = {
  /** House with a door: single-family houses. */
  houses: 'M4 20L20 6L36 20 M8 17V34H32V17 M17 34V24H23V34',
  /** Civic building with a pediment and columns: public and municipal projects. */
  public: 'M4 14L20 6L36 14Z M9 18V30 M16 18V30 M24 18V30 M31 18V30 M6 30H34 M4 34H36',
  /** Urban blocks. */
  urban: 'M4 4H16V14H4Z M22 4H36V14H22Z M4 20H16V36H4Z M22 20H36V28H22Z M22 34H36',
  /** Document with a folded corner and a tick: permits and approvals. */
  permits: 'M10 4H26L32 10V36H10Z M26 4V10H32 M15 17H27 M15 22H27 M15 30L19 34L26 27',
};

interface ServiceIconProps {
  /** Service id (`services.items[].id`). Unknown ids render nothing. */
  id: string;
  className?: string;
}

export function ServiceIcon({ id, className }: ServiceIconProps) {
  const paths = ICON_PATHS[id]?.split(/(?=M)/);
  if (!paths) return null;

  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={cn('service-icon text-accent-line', className)}
    >
      {/* One element per stroke so each is normalised to pathLength 1 and draws at the same pace. */}
      {paths.map((d) => (
        <path key={d} d={d.trim()} pathLength={1} />
      ))}
    </svg>
  );
}
