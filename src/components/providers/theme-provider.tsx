'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

const THEMES = ['dark', 'light'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={THEMES}
      storageKey="archica-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
