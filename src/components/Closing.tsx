import { brand } from '../config/brand';
import { links } from '../config/links';
import { Arrow } from './ui';
import './Closing.css';

export function Closing({ registrationOpen = true }: { registrationOpen?: boolean }) {
  return (
    <section className="closing" id="closing" aria-labelledby="closing-heading">
      {/* Upper Hero Section with Sculptural Materials on the right and Centre-Left Text Group matching approved reference */}
      <div className="closing__hero">
        <div className="closing__backdrop" aria-hidden="true">
          <img
            src="/assets/showtell/04_welcoming_closing_soft.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="closing__backdrop-img"
          />
          <div className="closing__backdrop-overlay" />
        </div>

        <div className="container closing__container">
          <div className="closing__content reveal">
            <p className="closing__label">
              <span className="closing__label-brand">→ ABC EMPORIO</span>
            </p>
            <h2 id="closing-heading" className="display closing__heading">
              We Look Forward to<br />Welcoming You.
            </h2>
            <p className="lead closing__body">
              Discover the details. Explore new possibilities.<br />
              Experience ABC Emporio.
            </p>

            {/* Primary CTA button left-aligned with text group */}
            {registrationOpen && (
              <div className="closing__action">
                <a className="btn closing__btn" href="#rsvp">
                  <span>RESERVE YOUR PLACE</span>
                  <Arrow />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-Column Footer Layout matching Screen 4 of approved visual reference */}
      <footer className="closing__footer">
        <div className="container closing__footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col footer-col--brand">
            <a href="#top" className="footer__logo-link" aria-label="Back to top">
              <img
                src={brand.logo.light}
                width={172}
                height={Math.round(172 / brand.logo.aspectRatio)}
                alt={brand.logo.alt}
                className="footer__logo"
              />
            </a>
            <p className="footer__tagline">The Show &amp; Tell Experience</p>
          </div>

          {/* Vertical hairline divider */}
          <div className="footer-col__divider" aria-hidden="true" />

          {/* Column 2: Dar es Salaam Showroom */}
          <div className="footer-col footer-col--showroom">
            <h4 className="footer-col__heading">DAR ES SALAAM SHOWROOM</h4>
            <p className="footer-col__text">Next to Vodacom Head Office,</p>
            <p className="footer-col__text">Bagamoyo Rd, Dar es Salaam</p>
            <p className="footer-col__detail">Plus Code: {links.plusCode}</p>
            <p className="footer-col__detail">Open &middot; Closes 5:30 pm</p>
          </div>

          {/* Vertical hairline divider */}
          <div className="footer-col__divider" aria-hidden="true" />

          {/* Column 3: Official Links & Social */}
          <div className="footer-col footer-col--links">
            <h4 className="footer-col__heading">OFFICIAL LINKS &amp; SOCIAL</h4>
            <ul className="footer__links-list">
              <li>
                <a
                  href="https://abcemporio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  Official website: abcemporio.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/abcemporio.tz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  Instagram: @abcemporio.tz
                </a>
              </li>
              <li>
                <a
                  href="tel:+255685289679"
                  className="footer__link footer__link--phone"
                >
                  Phone / WhatsApp: +255 685 289 679
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </section>
  );
}
