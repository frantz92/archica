interface SkipLinkProps {
  label: string;
}

/** First focusable element in <body>; visible only when focused (BLUEPRINT §9). */
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main"
      className="sr-only z-[60] rounded-sm bg-accent px-4 py-3 font-medium text-on-accent focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      {label}
    </a>
  );
}
