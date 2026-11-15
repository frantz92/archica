import { describe, expect, it } from 'vitest';

import { nonBreaking } from './text';

describe('nonBreaking', () => {
  it('replaces every regular space with a non-breaking space', () => {
    expect(nonBreaking('+48 91 578-37-63')).toBe('+48 91 578-37-63');
  });

  it('leaves text without spaces untouched', () => {
    expect(nonBreaking('archica')).toBe('archica');
  });

  it('keeps already non-breaking spaces', () => {
    expect(nonBreaking('a b c')).toBe('a b c');
  });
});
