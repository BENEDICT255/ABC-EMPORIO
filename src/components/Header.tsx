import { useEffect, useState } from 'react';
import { brand } from '../config/brand';
import { content } from '../config/content';
import { eventConfig } from '../config/event';
import './Header.css';

export function Header({ registrationOpen }: { registrationOpen: boolean }) {
  const [solid, setSolid] = useState(false);
  const [activeSection, setActiveSection] = useState<'top' | 'details' | 'rsvp' | 'closing'>('top');

  useEffect(() => {
    const handleScroll = () => {
      setSolid(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Section-aware CTA logic matching Section 6 instructions:
    // Hide header CTA during hero (#top) and closing (#closing)
    // Show header CTA during event details (#details) and RSVP (#rsvp)
    const sections = ['top', 'details', 'rsvp', 'closing'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as 'top' | 'details' | 'rsvp' | 'closing');
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // CTA is hidden on Landing Hero and Closing section as explicitly requested
  const shouldShowCta = registrationOpen && (activeSection === 'details' || activeSection === 'rsvp');
  const isDetails = activeSection === 'details';

  return (
    <header className={`site-header${solid ? ' is-solid' : ''}${isDetails ? ' is-details' : ''}`}>
      {!eventConfig.launchApproved && (
        <p className="preview-notice">{content.previewNotice}</p>
      )}
      <div className="container site-header__inner">
        <span className="site-header__descriptor">{content.header.descriptor}</span>
        
        <a className="site-header__logo" href="#top" aria-label="ABC Emporio home">
          <img
            src={isDetails ? brand.logo.dark : brand.logo.light}
            width={210}
            height={Math.round(210 / brand.logo.aspectRatio)}
            alt={brand.logo.alt}
          />
        </a>

        <div className="site-header__cta-wrap">
          <a
            className={`btn btn--small site-header__cta ${!shouldShowCta ? 'is-hidden' : ''}`}
            href="#rsvp"
            tabIndex={shouldShowCta ? 0 : -1}
            aria-hidden={!shouldShowCta}
          >
            {content.header.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
