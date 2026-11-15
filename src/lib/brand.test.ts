import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { brandColors } from './brand';

/** CSS custom properties are the source of truth; `brandColors` mirrors them for non-CSS contexts. */
const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

function cssHex(token: string): string {
  const match = css.match(new RegExp(`--${token}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match?.[1]) throw new Error(`--${token} not found in globals.css`);
  return match[1].toUpperCase();
}

describe('brandColors', () => {
  it('mirrors the coal token from globals.css', () => {
    expect(brandColors.coal.toUpperCase()).toBe(cssHex('coal'));
  });

  it('mirrors the chalk token from globals.css', () => {
    expect(brandColors.chalk.toUpperCase()).toBe(cssHex('chalk'));
  });
});
