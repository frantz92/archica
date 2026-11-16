import { describe, expect, it } from 'vitest';

import { logoAssets, logoAssetsByProposal, resolveLogoProposal } from './logo-assets';
import { WORDMARK_PATH } from './logo-paths';

describe('logo proposals', () => {
  it('uses proposal 1 unless proposal 2 is asked for', () => {
    expect(resolveLogoProposal(undefined)).toBe('1');
    expect(resolveLogoProposal('1')).toBe('1');
    expect(resolveLogoProposal('3')).toBe('1');
    expect(resolveLogoProposal('2')).toBe('2');
    expect(logoAssets.proposal).toBe('1');
  });

  it('shares the wordmark and differs in the emblem', () => {
    const [one, two] = [logoAssetsByProposal['1'], logoAssetsByProposal['2']];
    expect(one.wordmarkPath).toBe(WORDMARK_PATH);
    expect(two.wordmarkPath).toBe(WORDMARK_PATH);
    expect(one.markPath).not.toBe(two.markPath);
    expect(one.stackedMarkPath).not.toBe(two.stackedMarkPath);
  });

  it.each(['1', '2'] as const)(
    '(proposal %s) declares view boxes and a favicon in /public',
    (proposal) => {
      const assets = logoAssetsByProposal[proposal];
      expect(assets.viewBoxes.mark).toBe('0 0 100 100');
      expect(assets.viewBoxes.horizontal).toBe('0 0 358.3 100');
      const [, , width, height] = assets.viewBoxes.stacked.split(' ').map(Number);
      expect(width).toBeCloseTo(assets.stackedSize.width);
      expect(height).toBeCloseTo(assets.stackedSize.height);
      expect(assets.favicon).toBe(`/favicon-${proposal}.svg`);
    },
  );

  it('keeps the proposal 2 emblem inside its 100 x 100 box', () => {
    const numbers = logoAssetsByProposal['2'].markPath.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
    const xs = numbers.filter((_, index) => index % 2 === 0);
    const ys = numbers.filter((_, index) => index % 2 === 1);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(100);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(3);
    expect(Math.max(...ys)).toBeLessThanOrEqual(97);
  });
});
