'use client';

import { useEffect, useRef, useState } from 'react';

const RESET_DELAY_MS = 2000;

interface CopyButtonProps {
  /** Text copied to the clipboard. */
  text: string;
  label: string;
  copiedLabel: string;
}

/** Text button that copies `text`; the label changes for 2 s and is announced politely. */
export function CopyButton({ text, label, copiedLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // Clipboard unavailable: leave the label unchanged.
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_DELAY_MS);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center rounded-sm link-underline-draw type-small"
      >
        {copied ? copiedLabel : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
    </>
  );
}
