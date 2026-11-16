import type { LogoVariant } from './logo';
import { MARK_PATH, STACKED_MARK_PATH, WORDMARK_PATH } from './logo-paths';
import { MARK_PATH as MARK_PATH_2, STACKED_MARK_PATH as STACKED_MARK_PATH_2 } from './logo-paths-2';

/** The two logo proposals under review. The client picks one; the other is then deleted. */
export type LogoProposal = '1' | '2';

export interface LogoAssets {
  readonly proposal: LogoProposal;
  /** Emblem in a 100 x 100 box. */
  readonly markPath: string;
  /** Emblem placed in the stacked logo frame. */
  readonly stackedMarkPath: string;
  /** "Archica" as outlines (identical in both proposals). */
  readonly wordmarkPath: string;
  readonly viewBoxes: Record<LogoVariant, string>;
  /** Size of the stacked logo frame (the viewBox of the `stacked` variant). */
  readonly stackedSize: { readonly width: number; readonly height: number };
  /** Favicon file in /public. */
  readonly favicon: string;
}

export const logoAssetsByProposal: Record<LogoProposal, LogoAssets> = {
  '1': {
    proposal: '1',
    markPath: MARK_PATH,
    stackedMarkPath: STACKED_MARK_PATH,
    wordmarkPath: WORDMARK_PATH,
    viewBoxes: { mark: '0 0 100 100', horizontal: '0 0 358.3 100', stacked: '0 0 230.3 166.789' },
    stackedSize: { width: 230.3, height: 166.789 },
    favicon: '/favicon-1.svg',
  },
  '2': {
    proposal: '2',
    markPath: MARK_PATH_2,
    stackedMarkPath: STACKED_MARK_PATH_2,
    wordmarkPath: WORDMARK_PATH,
    viewBoxes: {
      mark: '0 0 100 100',
      horizontal: '0 0 358.3 100',
      stacked: '0 7.198 230.3 159.591',
    },
    stackedSize: { width: 230.3, height: 159.591 },
    favicon: '/favicon-2.svg',
  },
};

/** Anything but "2" is proposal 1 (the current logo). */
export function resolveLogoProposal(value: string | undefined): LogoProposal {
  return value === '2' ? '2' : '1';
}

/**
 * The proposal chosen at build time: `NEXT_PUBLIC_LOGO=2 npm run build` builds the site with
 * proposal 2 (the value is inlined, so client components see it too).
 */
export const logoAssets: LogoAssets =
  logoAssetsByProposal[resolveLogoProposal(process.env.NEXT_PUBLIC_LOGO)];
