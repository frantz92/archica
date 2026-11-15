import { vi } from 'vitest';

/** Browser APIs that jsdom does not implement, as controllable stubs for component tests. */

let reducedMotion = false;

/** Makes `(prefers-reduced-motion: reduce)` match (or not) for the following tests. */
export function setReducedMotion(value: boolean): void {
  reducedMotion = value;
}

export class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  readonly observed = new Set<Element>();
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.add(target);
  }
  unobserve(target: Element): void {
    this.observed.delete(target);
  }
  disconnect(): void {
    this.disconnected = true;
    this.observed.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Reports every observed element as entering (or leaving) the viewport. */
  trigger(isIntersecting: boolean): void {
    const entries = [...this.observed].map(
      (target) => ({ target, isIntersecting }) as IntersectionObserverEntry,
    );
    this.callback(entries, this);
  }

  /** Reports one element, e.g. a section that becomes active in the navigation. */
  triggerFor(target: Element, isIntersecting: boolean): void {
    this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this);
  }

  static reset(): void {
    FakeIntersectionObserver.instances = [];
  }
}

export function installDomStubs(): void {
  if (typeof window === 'undefined') return;

  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  globalThis.IntersectionObserver = FakeIntersectionObserver;

  // jsdom's <dialog> has no modal behaviour: model open/close with the `open` attribute.
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };

  // Element.animate is not implemented either; return a minimal Animation.
  Element.prototype.animate = vi.fn(() => ({ cancel: vi.fn(), onfinish: null })) as never;
}
