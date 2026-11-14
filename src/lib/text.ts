/** Replaces ordinary spaces with non-breaking spaces, e.g. to keep a phone number on one line. */
export function nonBreaking(value: string): string {
  return value.replace(/ /g, ' ');
}
