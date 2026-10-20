import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  downloadIcsFile,
  getCalendarEventDetails,
  detectUserPlatform,
  type PlatformType,
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
  const [platform, setPlatform] = useState<PlatformType>('other');
  const [showAllOptions, setShowAllOptions] = useState(false);

  useEffect(() => {
    setPlatform(detectUserPlatform());
  }, []);

  const event = useMemo(() => getCalendarEventDetails(attendanceDate), [attendanceDate]);

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
      setShowAllOptions(false);
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
    onClose();
  };

  const handleGoogleClick = () => {
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  // Primary action based on detected device
  const handlePrimaryYes = () => {
    if (platform === 'apple') {
      handleAppleClick();
    } else {
      handleGoogleClick();
    }
  };

  // Button title and icon tailored to their detected platform
  const primaryLabel =
    platform === 'apple'
      ? 'YES, ADD TO APPLE CALENDAR'
      : platform === 'android'
      ? 'YES, ADD TO GOOGLE CALENDAR'
      : 'YES, ADD TO CALENDAR';

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
        {/* Luxury gold accent line on top */}
        <div className="cal-modal-accent" aria-hidden="true" />

        {/* Close Button */}
        <button
          type="button"
          className="cal-modal-close"
          onClick={onClose}
          aria-label="Close calendar window"
        >
          &times;
        </button>

        {/* Header */}
        <div className="cal-modal-header">
          <div className="cal-modal-badge">
            <span className="cal-modal-badge__accent" aria-hidden="true" />
            <span>CALENDAR REMINDER</span>
          </div>

          <h3 id="cal-modal-title" className="cal-modal-title">
            Add to Your Calendar?
          </h3>

          <p className="cal-modal-intro">
            {guestName ? `Dear ${guestName}, ` : ''}would you like to add The Show &amp; Tell Experience to your calendar so you have directions, showroom hours, and your reservation ready?
          </p>
        </div>

        {/* Event Snapshot */}
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

        {/* Streamlined YES / NO Action Buttons */}
        <div className="cal-modal-decision-row">
          <button
            type="button"
            className="cal-btn-primary-yes"
            onClick={handlePrimaryYes}
            autoFocus
          >
            {platform === 'apple' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.87 1.48-.61.71-1.14 1.88-1 2.99 1.07.08 2.22-.55 2.88-1.37z" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            <span>{primaryLabel}</span>
          </button>

          <button
            type="button"
            className="cal-btn-secondary-no"
            onClick={onClose}
          >
            NOT NOW
          </button>
        </div>

        {/* Collapsible Alternative Calendar Providers */}
        <div className="cal-modal-alt-section">
          {!showAllOptions ? (
            <button
              type="button"
              className="cal-modal-alt-toggle"
              onClick={() => setShowAllOptions(true)}
            >
              <span>Using a different calendar? Choose provider &darr;</span>
            </button>
          ) : (
            <div className="cal-modal-alt-list">
              <span className="cal-modal-alt-heading">SELECT YOUR CALENDAR:</span>
              <div className="cal-modal-alt-buttons">
                <button
                  type="button"
                  className="cal-alt-chip"
                  onClick={handleGoogleClick}
                >
                  <span>Google Calendar</span>
                </button>
                <button
                  type="button"
                  className="cal-alt-chip"
                  onClick={handleAppleClick}
                >
                  <span>Apple / iCal</span>
                </button>
                <a
                  href={outlookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cal-alt-chip"
                  onClick={onClose}
                >
                  <span>Outlook / 365</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
