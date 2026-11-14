'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

const THEMES = ['dark', 'light'];

/**
 * React 19 warns when a client component renders a <script>. The theme script must run
 * during HTML parsing, so it is emitted as executable JS on the server and as inert
 * text/plain on the client (the mismatch is suppressed by next-themes). See the Next.js
 * guide "Preventing flash before hydration".
 */
const SCRIPT_PROPS = {
  type: typeof window === 'undefined' ? 'text/javascript' : 'text/plain',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={THEMES}
      storageKey="archica-theme"
      disableTransitionOnChange
      scriptProps={SCRIPT_PROPS}
    >
      {children}
    </NextThemesProvider>
  );
}
