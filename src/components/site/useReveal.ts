import { useLayoutEffect, useRef } from 'react';
import { prefersReducedMotion } from '~/lib/utils';

/**
 * Makes an element rise and fade in once when it scrolls into view. Elements
 * already on screen when the page loads stay put, and nothing is hidden before
 * JavaScript runs, so text and images are never held back.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.96) return;

    element.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.dataset.reveal = 'in';
        observer.disconnect();
      },
      { rootMargin: '0px 0px -6% 0px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
