import { site } from '@/content/site';
import { cn } from '@/lib/cn';

interface PostalAddressProps {
  className?: string;
}

/** The studio's postal address in the Polish two-line format. Single source: `site.address`. */
export function PostalAddress({ className }: PostalAddressProps) {
  return (
    <address className={cn('not-italic', className)}>
      {site.address.street}
      <br />
      {site.address.postalCode} {site.address.city}
    </address>
  );
}
