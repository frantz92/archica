import { describe, expect, it } from 'vitest';

import { getSiteEnv } from './site-env';

describe('getSiteEnv', () => {
  it('knows production and preview builds', () => {
    expect(getSiteEnv('production')).toBe('production');
    expect(getSiteEnv('preview')).toBe('preview');
  });

  it('treats everything else as development', () => {
    expect(getSiteEnv(undefined)).toBe('development');
    expect(getSiteEnv('')).toBe('development');
    expect(getSiteEnv('staging')).toBe('development');
  });
});
