// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FakeIntersectionObserver, setReducedMotion } from '../../../test/dom-stubs';

import { CopyButton } from './copy-button';
import { CountUp } from './count-up';

describe('CopyButton', () => {
  it('copies the text, confirms it for two seconds, then resets', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<CopyButton text="archica@archica.pl" label="Copy" copiedLabel="Copied" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(await navigator.clipboard.readText()).toBe('archica@archica.pl');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Copied');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('restarts the confirmation timer when clicked again', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<CopyButton text="x" label="Copy" copiedLabel="Copied" />);

    await user.click(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await user.click(screen.getByRole('button'));
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('keeps the label unchanged when the clipboard is unavailable', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    render(<CopyButton text="x" label="Copy" copiedLabel="Copied" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('clears its timer on unmount', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { unmount } = render(<CopyButton text="x" label="Copy" copiedLabel="Copied" />);
    await user.click(screen.getByRole('button'));
    unmount();
    expect(() => vi.advanceTimersByTime(3000)).not.toThrow();
  });
});

describe('CountUp', () => {
  const shown = (container: HTMLElement): HTMLElement => {
    const element = container.querySelector<HTMLElement>('.count-up');
    if (!element) throw new Error('count-up element missing');
    return element;
  };

  it('renders the final value for screen readers and as the server markup', () => {
    const { container } = render(<CountUp value={86} />);
    expect(container.querySelector('.sr-only')).toHaveTextContent('86');
    expect(shown(container)).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not animate with reduced motion', () => {
    setReducedMotion(true);
    const { container } = render(<CountUp value={30} />);
    expect(shown(container)).toHaveTextContent('30');
    expect(shown(container)).not.toHaveAttribute('data-ready');
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it('hides the value, then counts from zero to the target once it is in view', () => {
    vi.useFakeTimers();
    const { container } = render(<CountUp value={26} durationMs={1000} delayMs={200} />);
    const element = shown(container);

    expect(element).toHaveAttribute('data-ready', 'true');
    expect(element).toHaveTextContent('0');
    expect(element.style.opacity).toBe('0');

    act(() => FakeIntersectionObserver.instances[0]?.trigger(true));
    expect(Element.prototype.animate).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(700);
    });
    const midway = Number(element.textContent);
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(26);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(element).toHaveTextContent('26');
  });

  it('waits until the element is visible', () => {
    vi.useFakeTimers();
    const { container } = render(<CountUp value={15} />);
    act(() => FakeIntersectionObserver.instances[0]?.trigger(false));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(shown(container)).toHaveTextContent('0');
  });

  it('restores the final value when unmounted early', () => {
    const { container, unmount } = render(<CountUp value={9} />);
    const element = shown(container);
    unmount();
    expect(element).toHaveTextContent('9');
    expect(element).not.toHaveAttribute('data-ready');
    expect(FakeIntersectionObserver.instances[0]?.disconnected).toBe(true);
  });
});
