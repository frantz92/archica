'use client';

import { useTheme } from 'next-themes';
import { flushSync } from 'react-dom';

import { MoonIcon, SunIcon } from '@/components/ui/icons';

interface ThemeToggleProps {
  /** Accessible name while the dark theme is active (dictionary: a11y.switchToLight). */
  switchToLight: string;
  /** Accessible name while the light theme is active (dictionary: a11y.switchToDark). */
  switchToDark: string;
}

/**
 * Icon and accessible name switch through the `.dark` class on <html> (CSS only), so there is
 * no `mounted` state and no flicker. The theme change cross-fades via View Transitions when available.
 */
export function ThemeToggle({ switchToLight, switchToDark }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light';
    const apply = () => flushSync(() => setTheme(next));
    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex size-11 items-center justify-center rounded-sm"
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
      <span className="hidden dark:block">
        <span className="sr-only">{switchToLight}</span>
      </span>
      <span className="dark:hidden">
        <span className="sr-only">{switchToDark}</span>
      </span>
    </button>
  );
}
