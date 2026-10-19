import { useEffect } from 'react';

/**
 * Subtle fade-up for elements with the `reveal` class as they enter the viewport.
 * Progressive enhancement: content is fully visible without JavaScript, without
 * IntersectionObserver, and for visitors who prefer reduced motion.
 */
export function useReveal(): void {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    root.classList.add('js-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove('js-reveal');
    };
  }, []);
}
