import { useEffect, useRef, useState } from 'react';
import { content } from '../config/content';
import { eventConfig } from '../config/event';
import { slideshowConfig, type SlideItem } from '../config/slideshow';
import { Arrow } from './ui';
import './Hero.css';

/**
 * Preloads and decodes an image source before starting crossfade.
 * Prevents unrendered white/black/empty frames during transition.
 */
function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(() => resolve(true))
        .catch(() => {
          resolve(true);
        });
    } else {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    }
  });
}

function getSlideSrc(slide: SlideItem): string {
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
    return slide.mobile;
  }
  return slide.desktop;
}

/**
 * Renders an individual slide's picture element preserving identical responsive rules.
 */
function SlidePicture({ slide }: { slide: SlideItem }) {
  return (
    <picture className="hero__media">
      <source media="(max-width: 767px)" srcSet={slide.mobile} type="image/webp" />
      <source media="(min-width: 768px)" srcSet={slide.desktop} type="image/webp" />
      <img
        src={slide.desktop}
        alt={slide.alt}
        decoding="async"
        className="hero__img"
        style={
          {
            '--obj-pos-desktop': slide.objectPositionDesktop || 'center center',
            '--obj-pos-mobile': slide.objectPositionMobile || 'center center',
          } as React.CSSProperties
        }
      />
    </picture>
  );
}

/**
 * Two-layer crossfade slideshow:
 * - Base layer: always visible underneath (z-index: 1, opacity: 1), never drops to black.
 * - Incoming layer: smoothly dissolves on top (z-index: 2, opacity 0 -> 1 over 1.8s ease-in-out).
 * - Preloads and decodes next image before initiating transition.
 * - Continuous automatic loop across all slides.
 */
function HeroSlideshow({ slides }: { slides: SlideItem[] }) {
  if (slides.length === 0) return null;

  const getSlideAt = (idx: number): SlideItem => {
    const safeIdx = ((idx % slides.length) + slides.length) % slides.length;
    return slides[safeIdx] as SlideItem;
  };

  const [baseSlide, setBaseSlide] = useState<SlideItem>(() => getSlideAt(0));
  const [incomingSlide, setIncomingSlide] = useState<SlideItem | null>(null);
  const [isFadingIn, setIsFadingIn] = useState(false);

  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Preload next slide immediately on initial mount
    const nextIdx = (currentIndexRef.current + 1) % slides.length;
    preloadImage(getSlideSrc(getSlideAt(nextIdx)));

    const scheduleNext = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(async () => {
        if (!isMounted || document.hidden || isTransitioningRef.current) {
          scheduleNext();
          return;
        }

        const targetIdx = (currentIndexRef.current + 1) % slides.length;
        const targetSlide = getSlideAt(targetIdx);

        // Preload and decode target image before initiating transition
        await preloadImage(getSlideSrc(targetSlide));
        if (!isMounted) return;

        isTransitioningRef.current = true;
        setIncomingSlide(targetSlide);
        setIsFadingIn(false);

        // 50ms tick ensures browser renders layer at opacity: 0 before starting CSS transition
        window.setTimeout(() => {
          if (!isMounted) return;
          setIsFadingIn(true);

          // Complete transition after crossfadeDuration (1800ms)
          window.setTimeout(() => {
            if (!isMounted) return;
            setBaseSlide(targetSlide);
            setIncomingSlide(null);
            setIsFadingIn(false);
            currentIndexRef.current = targetIdx;
            isTransitioningRef.current = false;

            // Preload subsequent slide ahead of time
            const upcomingIdx = (targetIdx + 1) % slides.length;
            preloadImage(getSlideSrc(getSlideAt(upcomingIdx)));

            scheduleNext();
          }, slideshowConfig.crossfadeDuration);
        }, 50);
      }, slideshowConfig.slideDuration);
    };

    scheduleNext();

    const handleVisibility = () => {
      if (!document.hidden && !isTransitioningRef.current) {
        scheduleNext();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [slides]);

  return (
    <div className="hero__slides" aria-hidden="true">
      {/* Base Layer: Always visible underneath, completely preventing any black/white flash */}
      <div className="hero__layer hero__layer--base">
        <SlidePicture slide={baseSlide} />
      </div>

      {/* Incoming Layer: Fades in on top over 1.8s with ease-in-out */}
      {incomingSlide && (
        <div className={`hero__layer hero__layer--incoming ${isFadingIn ? 'is-fading-in' : ''}`}>
          <SlidePicture slide={incomingSlide} />
        </div>
      )}
    </div>
  );
}

export function Hero({ registrationOpen }: { registrationOpen: boolean }) {
  const activeSlides = slideshowConfig.slides.filter((s) => s.active);

  return (
    <section className="hero" id="top" aria-label="Landing page showcase">
      {/* Isolated background crossfade layers */}
      <HeroSlideshow slides={activeSlides} />

      {/* Atmospheric subtle text-side gradient overlay */}
      <div className="hero__gradient" aria-hidden="true" />

      {/* Stationary Foreground Content (Editorial typography & CTA) */}
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="label hero__eyebrow">{eventConfig.eyebrow}</p>
          <h1 id="hero-title" className="display hero__title">
            The Show &amp;<br />Tell Experience
          </h1>
          <p className="hero__description">{eventConfig.eventDescription}</p>

          <div className="hero__actions">
            {registrationOpen && (
              <a className="btn hero__primary-btn" href="#rsvp">
                {content.hero.primaryCta}
                <Arrow />
              </a>
            )}
            <a className="text-link hero__secondary-link" href="#details">
              {content.hero.secondaryCta}
            </a>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar: Scroll Indicator only */}
      <div className="container hero__footer">
        <div className="hero__footer-spacer" aria-hidden="true" />

        <a className="hero__scroll" href="#details" aria-label="Scroll to event details">
          <span>Scroll</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
