import { useEffect, useState } from 'react';
import { content } from '../config/content';
import { eventConfig } from '../config/event';
import { slideshowConfig, type SlideItem } from '../config/slideshow';
import { Arrow } from './ui';
import './Hero.css';

const MOBILE_QUERY = '(max-width: 767px)';

/** Resolve the variant the <picture> element will actually use, so we preload only that one. */
function variantSrc(slide: SlideItem): string {
  return window.matchMedia(MOBILE_QUERY).matches ? slide.mobile : slide.desktop;
}

function SlidePicture({ slide, priority = false }: { slide: SlideItem; priority?: boolean }) {
  return (
    <picture className="hero__media">
      <source media={MOBILE_QUERY} srcSet={slide.mobile} type="image/webp" />
      <source media="(min-width: 768px)" srcSet={slide.desktop} type="image/webp" />
      <img
        src={slide.desktop}
        alt=""
        className="hero__img"
        loading="eager"
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        draggable={false}
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

function HeroSlideshow({ slides }: { slides: SlideItem[] }) {
  const count = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  // Preload and decode all images into browser memory immediately on mount
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = variantSrc(slide);
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, [slides]);

  useEffect(() => {
    if (count < 2) return;

    let cancelled = false;
    let mainTimer: number | undefined;
    let cleanPrevTimer: number | undefined;

    const advance = () => {
      if (cancelled) return;
      if (document.hidden) {
        scheduleNext(slideshowConfig.slideDuration);
        return;
      }

      setActiveIndex((current) => {
        const next = (current + 1) % count;
        setPrevIndex(current);

        // After the crossfade duration (1800ms), clear prevIndex smoothly without any DOM unmount
        window.clearTimeout(cleanPrevTimer);
        cleanPrevTimer = window.setTimeout(() => {
          if (!cancelled) {
            setPrevIndex(null);
          }
        }, slideshowConfig.crossfadeDuration + 50);

        return next;
      });

      scheduleNext(slideshowConfig.slideDuration);
    };

    const scheduleNext = (delay: number) => {
      window.clearTimeout(mainTimer);
      mainTimer = window.setTimeout(advance, delay);
    };

    scheduleNext(slideshowConfig.slideDuration);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        scheduleNext(slideshowConfig.slideDuration);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearTimeout(mainTimer);
      window.clearTimeout(cleanPrevTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [count]);

  return (
    <div className="hero__slides" aria-hidden="true">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        const isPrev = index === prevIndex;
        return (
          <div
            key={slide.id}
            className={`hero__slide-layer ${isActive ? 'is-active' : ''} ${isPrev ? 'is-prev' : ''}`}
          >
            <SlidePicture slide={slide} priority={index === 0} />
          </div>
        );
      })}
    </div>
  );
}

export function Hero({ registrationOpen }: { registrationOpen: boolean }) {
  // Stable reference so the slideshow effect is not restarted on parent re-renders.
  const [activeSlides] = useState(() => slideshowConfig.slides.filter((s) => s.active));

  return (
    <section className="hero" id="top" aria-label="Landing page showcase">
      {/* Background photography: opacity crossfade only */}
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
