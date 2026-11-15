/** Mutable state behind the mocked `next/navigation` hooks (see test/setup.ts). */
export const navigationState: { pathname: string; params: Record<string, string | undefined> } = {
  pathname: '/pl',
  params: { locale: 'pl' },
};

export function setNavigation(pathname: string, locale?: string): void {
  navigationState.pathname = pathname;
  navigationState.params = locale ? { locale } : {};
}
