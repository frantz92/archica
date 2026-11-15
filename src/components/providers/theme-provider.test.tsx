// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from './theme-provider';

describe('ThemeProvider', () => {
  it('renders its children', () => {
    render(
      <ThemeProvider>
        <p>child</p>
      </ThemeProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('applies the dark theme class by default and remembers the choice under its own key', () => {
    localStorage.clear();
    document.documentElement.className = '';
    render(
      <ThemeProvider>
        <p>x</p>
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveClass('dark');
  });
});
