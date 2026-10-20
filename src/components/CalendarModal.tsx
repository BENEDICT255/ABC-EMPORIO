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
}) => {
  const [platform, setPlatform] = useState<PlatformType>('other');
  const [showAltOptions, setShowAltOptions] = useState(false);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);

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
      setShowAltOptions(false);
      setIsSuccessFeedback(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const googleUrl = generateGoogleCalendarUrl(attendanceDate);
  const outlookUrl = generateOutlookCalendarUrl(attendanceDate);

  const triggerApple = () => {
    downloadIcsFile(attendanceDate);
    confirmAndClose();
  };

  const triggerGoogle = () => {
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
    confirmAndClose();
  };

  const triggerOutlook = () => {
    window.open(outlookUrl, '_blank', 'noopener,noreferrer');
    confirmAndClose();
  };

  const confirmAndClose = () => {
    setIsSuccessFeedback(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handlePrimaryYes = () => {
    if (platform === 'apple') {
      triggerApple();
    } else {
      triggerGoogle();
    }
  };

  const primaryLabel =
    platform === 'apple'
      ? 'YES, ADD TO CALENDAR'
      : platform === 'android'
      ? 'YES, ADD TO CALENDAR'
      : 'YES, ADD TO CALENDAR';

  return (
    <div
      className="cal-mini-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cal-mini-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cal-mini-card">
        {/* Subtle gold accent top bar */}
        <div className="cal-mini-accent" aria-hidden="true" />

        {/* Close Button */}
        <button
          type="button"
          className="cal-mini-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {isSuccessFeedback ? (
          <div className="cal-mini-feedback">
            <div className="cal-mini-feedback__badge">CALENDAR INVITE SET</div>
            <h4 className="cal-mini-feedback__title">Date Saved</h4>
            <p className="cal-mini-feedback__text">
              We look forward to welcoming you to the showroom on {event.dateFormatted}.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="cal-mini-header">
              <span className="cal-mini-badge">CALENDAR REMINDER</span>
              <h3 id="cal-mini-title" className="cal-mini-title">
                Add to Your Calendar?
              </h3>
              <p className="cal-mini-time">
                {event.dateFormatted} &bull; 10:00 AM – 5:00 PM
              </p>
              <p className="cal-mini-venue">
                ABC Emporio Showroom, Bagamoyo Rd
              </p>
            </div>

            {/* Direct YES / NO Action Buttons */}
            <div className="cal-mini-buttons">
              <button
                type="button"
                className="cal-mini-btn-yes"
                onClick={handlePrimaryYes}
                autoFocus
              >
                {platform === 'apple' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.87 1.48-.61.71-1.14 1.88-1 2.99 1.07.08 2.22-.55 2.88-1.37z" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
                <span>{primaryLabel}</span>
              </button>

              <button
                type="button"
                className="cal-mini-btn-no"
                onClick={onClose}
              >
                NOT NOW
              </button>
            </div>

            {/* Discreet alternative selector */}
            <div className="cal-mini-alt">
              {!showAltOptions ? (
                <button
                  type="button"
                  className="cal-mini-alt-link"
                  onClick={() => setShowAltOptions(true)}
                >
                  Choose provider (Google / Apple / Outlook)
                </button>
              ) : (
                <div className="cal-mini-chips">
                  <button type="button" className="cal-mini-chip" onClick={triggerGoogle}>
                    Google
                  </button>
                  <button type="button" className="cal-mini-chip" onClick={triggerApple}>
                    Apple / iCal
                  </button>
                  <button type="button" className="cal-mini-chip" onClick={triggerOutlook}>
                    Outlook
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
