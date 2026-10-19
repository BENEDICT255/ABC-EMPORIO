import { brand } from '../config/brand';
import { content } from '../config/content';
import { eventConfig } from '../config/event';
import './Footer.css';

export function Footer() {
  const f = content.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        {/* Top: Logo & Event description */}
        <div className="site-footer__brand">
          <a href="#top" className="site-footer__logo-link">
            <img
              src={brand.logo.light}
              width={180}
              height={Math.round(180 / brand.logo.aspectRatio)}
              alt={brand.logo.alt}
              className="site-footer__logo"
            />
          </a>
          <p className="site-footer__event-name">{eventConfig.eventName}</p>
          <p className="site-footer__slogan">{brand.slogan}</p>
        </div>

        {/* Links & Information */}
        <div className="site-footer__nav">
          <ul className="site-footer__links">
            <li>
              <a
                href={brand.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__link"
              >
                {f.officialSite} ({brand.officialUrlLabel})
              </a>
            </li>
            <li>
              <a href="#rsvp" className="site-footer__link">
                {f.privacyLink}
              </a>
            </li>
            {eventConfig.organiserContact.email && (
              <li>
                <a
                  href={`mailto:${eventConfig.organiserContact.email}`}
                  className="site-footer__link"
                >
                  {eventConfig.organiserContact.email}
                </a>
              </li>
            )}
            {eventConfig.organiserContact.phone && (
              <li>
                <a
                  href={`tel:${eventConfig.organiserContact.phone}`}
                  className="site-footer__link"
                >
                  {eventConfig.organiserContact.phone}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright notice */}
      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p className="site-footer__copyright">
            &copy; {currentYear} {brand.name}. {f.rights}
          </p>
          <p className="site-footer__descriptor">
            Show &amp; Tell Experience &mdash; Private Showroom Invitation
          </p>
        </div>
      </div>
    </footer>
  );
}
