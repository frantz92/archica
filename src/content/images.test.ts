import { describe, expect, it } from 'vitest';

import { images, type ImageKey } from './images';

describe('images', () => {
  const keys = Object.keys(images) as ImageKey[];

  it('registers the six fixed photo slots', () => {
    expect(keys.sort()).toEqual(
      ['about', 'hero', 'portfolio1', 'portfolio2', 'portfolio3', 'portfolio4'].sort(),
    );
  });

  it('marks every photo as a placeholder until the real ones arrive', () => {
    for (const key of keys) expect(images[key].placeholder).toBe(true);
  });

  it('provides an image source for every slot', () => {
    for (const key of keys) expect(images[key].src).toBeTruthy();
  });
});
