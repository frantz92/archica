import { notFound } from 'next/navigation';

/** Catches unknown paths below a valid locale so they render the localized 404 inside the layout. */
export default function UnknownPage(): never {
  notFound();
}
