import { useEffect, useRef, useState, useCallback } from 'react';
import { content } from '../config/content';
import { eventConfig } from '../config/event';
import { slideshowConfig, type SlideItem } from '../config/slideshow';
import { Arrow } from './ui';
import './Hero.css';

export function Hero({ registrationOpen }: { registrationOpen: boolean }) {
  const activeSlides = slideshowConfig.slides.filter((s) => s.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const totalSlides = activeSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer with pause on tab hidden or user hover/focus
  useEffect(() => {
    if (isPaused) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    timerRef.current = window.setInterval(() => {
      if (!document.hidden) {
        nextSlide();
      }
    }, slideshowConfig.slideDuration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, nextSlide]);

  return (
    <section
      className="hero"
      id="top"
      aria-label="Landing page showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background Slideshow Layer */}
      <div className="hero__slides" aria-hidden="true">
        {activeSlides.map((slide: SlideItem, index: number) => {
          const isActive = index === currentIndex;
          // Preload first slide eagerly, lazy load subsequent ones
          const shouldLoad = index === 0 || Math.abs(index - currentIndex) <= 1 || index === totalSlides - 1;

          return (
            <div
              key={slide.id}
              className={`hero__slide ${isActive ? 'is-active' : ''}`}
              style={{
                transitionDuration: `${slideshowConfig.crossfadeDuration}ms`,
              }}
            >
              {shouldLoad && (
                <picture className="hero__media">
                  <source media="(max-width: 767px)" srcSet={slide.mobile} type="image/webp" />
                  <source media="(min-width: 768px)" srcSet={slide.desktop} type="image/webp" />
                  <img
                    src={slide.desktop}
                    alt={slide.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="hero__img"
                    style={{
                      objectPosition: slide.objectPositionDesktop || 'center center',
                    }}
                  />
                </picture>
              )}
            </div>
          );
        })}
      </div>

      {/* Atmospheric subtle text-side gradient overlay: preserves rich photographic details on the right */}
      <div className="hero__gradient" aria-hidden="true" />

      {/* Stationary Content (Editorial typography & CTA) */}
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

      {/* Hero Bottom Bar: Scroll Indicator only (no slide controls as instructed) */}
      <div className="container hero__footer">
        <div className="hero__footer-spacer" aria-hidden="true" />

        {/* Subtle vertical Scroll cue */}
        <a className="hero__scroll" href="#details" aria-label="Scroll to event details">
          <span>Scroll</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
