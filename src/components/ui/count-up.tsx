'use client';

import { useEffect, useRef } from 'react';

interface CountUpProps {
  /** Final value. It is also what the server renders, so it is correct without JavaScript. */
  value: number;
  durationMs?: number;
  delayMs?: number;
}

const SLIDE_MS = 900;
const SLIDE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * Number that slides up and counts from 0 to `value` once, when it is half in view. The final
 * value is in the HTML (and in a screen-reader-only copy); with reduced motion nothing animates.
 * The text is written straight to the DOM so the counter does not re-render React every frame.
 */
export function CountUp({ value, durationMs = 1400, delayMs = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Hide the final value until the animation starts (`data-ready` also ends the CSS veil).
    element.dataset.ready = 'true';
    element.style.opacity = '0';
    element.textContent = '0';

    let frame = 0;
    let slide: Animation | undefined;

    const start = () => {
      slide = element.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: SLIDE_MS, delay: delayMs, easing: SLIDE_EASING, fill: 'both' },
      );
      slide.onfinish = () => {
        element.style.opacity = '';
        slide?.cancel();
      };

      const begin = performance.now() + delayMs;
      const tick = (now: number) => {
        const progress = Math.min(Math.max((now - begin) / durationMs, 0), 1);
        element.textContent = String(Math.round(easeOutCubic(progress) * value));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      slide?.cancel();
      element.textContent = String(value);
      element.style.opacity = '';
      delete element.dataset.ready;
    };
  }, [value, durationMs, delayMs]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className="count-up inline-block">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
