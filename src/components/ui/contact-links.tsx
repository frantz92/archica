import { site } from '@/content/site';
import { cn } from '@/lib/cn';

interface ContactLinkProps {
  /** Tighter vertical padding (the contact section's large values). */
  compact?: boolean;
  className?: string;
}

function linkClasses({ compact = false, className }: ContactLinkProps): string {
  return cn('inline-block min-h-11 link-underline-draw', compact ? 'py-1.5' : 'py-2', className);
}

/** One `tel:` link per phone number from `site.phones`. Layout is left to the parent. */
export function PhoneLinks(props: ContactLinkProps) {
  return (
    <>
      {site.phones.map((phone) => (
        <a key={phone.href} href={phone.href} className={linkClasses(props)}>
          {phone.display}
        </a>
      ))}
    </>
  );
}

/** `mailto:` link to `site.email`. */
export function EmailLink(props: ContactLinkProps) {
  return (
    <a href={`mailto:${site.email}`} className={linkClasses(props)}>
      {site.email}
    </a>
  );
}
