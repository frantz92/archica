import { cn } from '@/lib/cn';

/**
 * Line pictograms for the four services, drawn on a 40 × 40 grid in the language of a technical
 * drawing: thin square-capped strokes, right angles, no fills. They echo the emblem. Keys match
 * `services.items[].id` in the dictionaries.
 */
const ICON_PATHS: Readonly<Record<string, string>> = {
  /** Floor plan with a door swing. */
  design: 'M4 4H36V36H4Z M4 16H14 M22 4V20H36 M14 36V28 M14 28A8 8 0 0 1 22 36',
  /** Room in perspective, like the emblem. */
  interiors: 'M4 4H36V36H4Z M14 12H26V28H14Z M4 4L14 12 M36 4L26 12 M4 36L14 28 M36 36L26 28',
  /** Urban blocks. */
  urban: 'M4 4H16V14H4Z M22 4H36V14H22Z M4 20H16V36H4Z M22 20H36V28H22Z M22 34H36',
  /** Building frame with scaffolding. */
  supervision: 'M6 36H34 M10 36V6H30V36 M10 14H30 M10 22H30 M10 30H30',
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
