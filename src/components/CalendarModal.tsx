import React, { useEffect, useCallback } from 'react';
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  downloadIcsFile,
  getCalendarEventDetails,
} from '../lib/calendar';
import './CalendarModal.css';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceDate: string;
  guestName?: string;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  attendanceDate,
  guestName,
}) => {
  const event = getCalendarEventDetails(attendanceDate);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const googleUrl = generateGoogleCalendarUrl(attendanceDate);
  const outlookUrl = generateOutlookCalendarUrl(attendanceDate);

  const handleAppleClick = () => {
    downloadIcsFile(attendanceDate);
  };

  return (
    <div
      className="cal-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cal-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cal-modal-card">
        {/* Subtle gold accent top border */}
        <div className="cal-modal-accent" aria-hidden="true" />

        {/* Close Button */}
        <button
          type="button"
          className="cal-modal-close"
          onClick={onClose}
          aria-label="Close calendar reminder window"
        >
          &times;
        </button>

        {/* Header */}
        <div className="cal-modal-header">
          <div className="cal-modal-badge">
            <span className="cal-modal-badge__dot" aria-hidden="true" />
            <span>CONFIRMED RESERVATION</span>
          </div>

          <h3 id="cal-modal-title" className="cal-modal-title">
            Save to Your Calendar
          </h3>

          <p className="cal-modal-intro">
            {guestName ? `Dear ${guestName}, ` : ''}add The Show &amp; Tell Experience to your calendar so you have the schedule, directions, and showroom concierge handy.
          </p>
        </div>

        {/* Event Snapshot Card */}
        <div className="cal-modal-summary">
          <div className="cal-modal-summary__row">
            <span className="cal-modal-summary__label">DATE:</span>
            <span className="cal-modal-summary__value cal-modal-summary__value--highlight">
              {event.dateFormatted}
            </span>
          </div>
          <div className="cal-modal-summary__row">
            <span className="cal-modal-summary__label">TIME:</span>
            <span className="cal-modal-summary__value">10:00 AM – 5:00 PM EAT</span>
          </div>
          <div className="cal-modal-summary__row">
            <span className="cal-modal-summary__label">VENUE:</span>
            <span className="cal-modal-summary__value">
              ABC Emporio Showroom, Bagamoyo Rd (Next to Vodacom Head Office)
            </span>
          </div>
        </div>

        {/* Calendar Action Buttons */}
        <div className="cal-modal-actions">
          {/* Google Calendar */}
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cal-btn cal-btn--google"
            onClick={onClose}
          >
            <span className="cal-btn__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="#b89758" strokeWidth="1.8" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#b89758" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="8" cy="15" r="1.5" fill="#ffffff" />
                <circle cx="12" cy="15" r="1.5" fill="#ffffff" />
                <circle cx="16" cy="15" r="1.5" fill="#ffffff" />
              </svg>
            </span>
            <div className="cal-btn__text">
              <span className="cal-btn__title">Google Calendar</span>
              <span className="cal-btn__desc">Web &amp; Android devices</span>
            </div>
            <span className="cal-btn__arrow" aria-hidden="true">&rarr;</span>
          </a>

          {/* Apple Calendar */}
          <button
            type="button"
            className="cal-btn cal-btn--apple"
            onClick={() => {
              handleAppleClick();
              onClose();
            }}
          >
            <span className="cal-btn__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.87 1.48-.61.71-1.14 1.88-1 2.99 1.07.08 2.22-.55 2.88-1.37z"/>
              </svg>
            </span>
            <div className="cal-btn__text">
              <span className="cal-btn__title">Apple Calendar</span>
              <span className="cal-btn__desc">iPhone, iPad &amp; Mac</span>
            </div>
            <span className="cal-btn__arrow" aria-hidden="true">&rarr;</span>
          </button>

          {/* Outlook / Office 365 */}
          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cal-btn cal-btn--outlook"
            onClick={onClose}
          >
            <span className="cal-btn__icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#60a5fa" strokeWidth="1.8" />
                <path d="M3 9h18M9 21V9" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <div className="cal-btn__text">
              <span className="cal-btn__title">Outlook / Office 365</span>
              <span className="cal-btn__desc">Desktop &amp; Outlook Web</span>
            </div>
            <span className="cal-btn__arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>

        {/* Footer dismissal */}
        <div className="cal-modal-footer">
          <button
            type="button"
            className="cal-modal-dismiss-btn"
            onClick={onClose}
          >
            Done &bull; View Registration Summary
          </button>
        </div>
      </div>
    </div>
  );
};
