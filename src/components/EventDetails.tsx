import { content } from '../config/content';
import { eventConfig } from '../config/event';
import { links } from '../config/links';
import { Arrow } from './ui';
import './EventDetails.css';

export function EventDetails() {
  const d = content.details;

  return (
    <section className="section section--light event-details" id="details" aria-labelledby="details-heading">
      {/* Dedicated decorative architectural stone slabs & olive branch on the upper right matching approved Page 2 reference */}
      <div className="event-details__decor-wrap" aria-hidden="true">
        <img
          src="/assets/showtell/02_youre_invited_cream_stones_olive.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="event-details__decor-img"
        />
      </div>

      <div className="container event-details__container">
        <div className="event-details__header reveal">
          <p className="label event-details__label">{d.label}</p>
          <h2 id="details-heading" className="display event-details__heading">You're Invited.</h2>
          <p className="lead event-details__intro">{d.intro}</p>
        </div>

        {/* 3-Column Aligned Structure: WHEN | WHERE | HOST */}
        <div className="event-details__grid reveal">
          {/* Column 1: WHEN */}
          <div className="detail-col detail-col--when">
            <span className="detail-col__eyebrow">WHEN</span>
            <div className="detail-col__body">
              <h3 className="h3 detail-col__title">
                Monday, 2 November<br />2026
              </h3>
              <p className="detail-col__sub">
                Showroom closes 5:30 pm
              </p>
              <p className="detail-col__pending-note">
                (Start time to be confirmed)
              </p>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="detail-col__divider" aria-hidden="true" />

          {/* Column 2: WHERE */}
          <div className="detail-col detail-col--where">
            <span className="detail-col__eyebrow">WHERE</span>
            <div className="detail-col__body">
              <h3 className="h3 detail-col__title">
                {eventConfig.venueName || 'ABC Emporio — Dar es Salaam'}
              </h3>
              <p className="detail-col__address">
                {eventConfig.venueAddress || 'Next to Vodacom Head Office, Bagamoyo Rd, Dar es Salaam'}
              </p>
              <a
                className="detail-col__action text-link"
                href={links.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Navigate to ABC Emporio on Google Maps"
              >
                <span>NAVIGATE ON GOOGLE MAPS</span>
                <Arrow />
              </a>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="detail-col__divider" aria-hidden="true" />

          {/* Column 3: HOST */}
          <div className="detail-col detail-col--host">
            <span className="detail-col__eyebrow">HOST</span>
            <div className="detail-col__body">
              <h3 className="h3 detail-col__title detail-col__title--host">
                ABC EMPORIO
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
