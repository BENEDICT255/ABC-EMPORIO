import { useState, type FormEvent, type ChangeEvent } from 'react';
import { content } from '../config/content';
import { eventConfig } from '../config/event';
import {
  PROFESSIONS,
  RSVP_FORM_NAME,
  createSubmissionId,
  rememberSubmission,
  submitRsvp,
  validateRsvp,
  wasSubmittedThisSession,
  type EditableField,
  type FieldErrors,
  type RsvpInput,
} from '../lib/registration';
import { getRegistrationState } from '../lib/schedule';
import {
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  downloadIcsFile,
} from '../lib/calendar';
import { CalendarModal } from './CalendarModal';
import './RSVPForm.css';

const initialInput: RsvpInput = {
  fullName: '',
  attendanceDate: 'Monday, 2 November 2026',
  profession: '',
  professionOther: '',
  company: '',
  phone: '',
  email: '',
};

export function RSVPForm() {
  const rsvp = content.rsvp;
  const regState = getRegistrationState(eventConfig);
  const isClosed = regState === 'closed';

  const [input, setInput] = useState<RsvpInput>(initialInput);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    if (errors[name as EditableField]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isClosed || status === 'submitting') return;

    // Validate inputs
    const validationErrors = validateRsvp(input);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstField = Object.keys(validationErrors)[0];
      const el = document.querySelector<HTMLElement>(`[name="${firstField}"]`);
      if (el) el.focus();
      return;
    }

    // Check duplicate in same session
    if (wasSubmittedThisSession(input)) {
      setErrorMessage(rsvp.errorDuplicate);
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    const submissionId = createSubmissionId();
    const result = await submitRsvp(input, {
      eventName: eventConfig.eventName,
      submissionId,
      honeypot,
    });

    if (result.ok) {
      rememberSubmission(input);
      setStatus('success');
      setIsCalendarModalOpen(true);
    } else {
      setStatus('error');
      setErrorMessage(result.message || (result.reason === 'network' ? rsvp.errorNetwork : rsvp.errorProvider));
    }
  };

  const handleReset = () => {
    setInput(initialInput);
    setErrors({});
    setStatus('idle');
    setErrorMessage(null);
    setIsCalendarModalOpen(false);
  };

  return (
    <section className="section section--dark rsvp-section" id="rsvp" aria-labelledby="rsvp-heading">
      {/* Background artwork: Gemini_Generated_Image_fl82ygfl82ygfl82 */}
      <div className="rsvp-backdrop" aria-hidden="true">
        <img
          src="/assets/showtell/03_reserve_your_place_soft.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="rsvp-backdrop__img"
        />
        <div className="rsvp-backdrop__overlay" />
      </div>

      <div className="container rsvp-container">
        <div className="rsvp-grid">
          {/* Left Column: Context & Privacy */}
          <div className="rsvp-info reveal">
            <div className="rsvp__badge">
              <span className="rsvp__badge-line" aria-hidden="true" />
              <span className="rsvp__badge-text">RSVP</span>
            </div>

            <h2 id="rsvp-heading" className="display rsvp__heading">
              Reserve Your Place.
            </h2>

            <p className="lead rsvp__intro">
              We look forward to welcoming you. Please complete the form below to confirm your attendance.
            </p>

            {/* Hairline divider */}
            <div className="rsvp__divider" aria-hidden="true" />

            <div className="rsvp-privacy">
              <h3 className="rsvp-privacy__title">HOW WE USE YOUR DETAILS</h3>
              <p className="rsvp-privacy__text">
                Your details are collected by ABC Emporio solely to manage your attendance at the Show &amp; Tell Experience — for example, to confirm your place or share event updates. They are stored securely and are not used for general marketing or added to any mailing list.
              </p>
              <a href="#details" className="rsvp-privacy__link">
                <span>Full privacy information</span>
                <span className="rsvp-privacy__arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="rsvp-form-card reveal">
            {isClosed ? (
              <div className="rsvp-status rsvp-status--closed">
                <h3 className="h3 rsvp-status__title">{rsvp.closedHeading}</h3>
                <p className="rsvp-status__body">{rsvp.closedBody}</p>
              </div>
            ) : status === 'success' ? (
              <div className="rsvp-status rsvp-status--success" role="status" aria-live="polite">
                <h3 className="h3 rsvp-status__title">Thank You for Registering.</h3>
                <p className="rsvp-status__body">
                  Your registration for the ABC Emporio Show &amp; Tell Experience has been received.
                </p>
                <div className="rsvp-status__detail-box">
                  <div className="rsvp-status__detail-row">
                    <span className="rsvp-status__detail-label">NAME:</span>
                    <span className="rsvp-status__detail-value">{input.fullName}</span>
                  </div>
                  <div className="rsvp-status__detail-row">
                    <span className="rsvp-status__detail-label">DATE:</span>
                    <span className="rsvp-status__detail-value">{input.attendanceDate}</span>
                  </div>
                  <div className="rsvp-status__detail-row">
                    <span className="rsvp-status__detail-label">PROFESSION:</span>
                    <span className="rsvp-status__detail-value">{input.profession}</span>
                  </div>
                  <div className="rsvp-status__detail-row">
                    <span className="rsvp-status__detail-label">PHONE:</span>
                    <span className="rsvp-status__detail-value">{input.phone}</span>
                  </div>
                </div>

                {/* Persistent In-Card Calendar Reminder Section */}
                <div className="rsvp-calendar-card">
                  <div className="rsvp-calendar-card__header">
                    <span className="rsvp-calendar-card__badge">CALENDAR REMINDER</span>
                    <h4 className="rsvp-calendar-card__title">Add to Your Calendar</h4>
                    <p className="rsvp-calendar-card__time">
                      {input.attendanceDate} &bull; 10:00 AM – 5:00 PM EAT
                    </p>
                  </div>
                  <div className="rsvp-calendar-card__buttons">
                    <a
                      href={generateGoogleCalendarUrl(input.attendanceDate)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cal-mini"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#b89758" strokeWidth="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="#b89758" strokeWidth="2" />
                      </svg>
                      <span>Google</span>
                    </a>
                    <button
                      type="button"
                      className="btn-cal-mini"
                      onClick={() => downloadIcsFile(input.attendanceDate)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.87 1.48-.61.71-1.14 1.88-1 2.99 1.07.08 2.22-.55 2.88-1.37z"/>
                      </svg>
                      <span>Apple / iCal</span>
                    </button>
                    <a
                      href={generateOutlookCalendarUrl(input.attendanceDate)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cal-mini"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#60a5fa" strokeWidth="2" />
                        <path d="M3 9h18M9 21V9" stroke="#60a5fa" strokeWidth="2" />
                      </svg>
                      <span>Outlook</span>
                    </a>
                  </div>
                </div>

                <p className="rsvp-status__reminder-note">
                  We look forward to welcoming you to the showroom.
                </p>
                <button type="button" className="btn btn--ghost rsvp-status__btn" onClick={handleReset}>
                  {rsvp.registerAnother}
                </button>
              </div>
            ) : (
              <form
                name={RSVP_FORM_NAME}
                onSubmit={handleSubmit}
                noValidate
                className="rsvp-form"
              >
                {/* Honeypot anti-spam field */}
                <input
                  type="checkbox"
                  name="botcheck"
                  checked={Boolean(honeypot)}
                  onChange={(e) => setHoneypot(e.target.checked ? 'bot' : '')}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: 'none' }}
                  aria-hidden="true"
                />

                {errorMessage && (
                  <div className="rsvp-error-banner" role="alert">
                    {errorMessage}
                  </div>
                )}

                {/* 1. Choose Reservation Date (The Two Options) */}
                <div className="form-group">
                  <label className="form-label">
                    CHOOSE RESERVATION DATE <span className="form-req" aria-hidden="true">•</span>
                  </label>
                  <div className="date-options-row" role="radiogroup" aria-label="Choose reservation date">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={input.attendanceDate === 'Monday, 2 November 2026'}
                      className={`date-option-btn ${input.attendanceDate === 'Monday, 2 November 2026' ? 'date-option-btn--active' : ''}`}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, attendanceDate: 'Monday, 2 November 2026' }));
                        if (errors.attendanceDate) setErrors((prev) => ({ ...prev, attendanceDate: undefined }));
                      }}
                      disabled={status === 'submitting'}
                    >
                      <span className="date-option-dot" aria-hidden="true" />
                      <span className="date-option-title">Monday, 2 November 2026</span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={input.attendanceDate === 'Tuesday, 3 November 2026'}
                      className={`date-option-btn ${input.attendanceDate === 'Tuesday, 3 November 2026' ? 'date-option-btn--active' : ''}`}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, attendanceDate: 'Tuesday, 3 November 2026' }));
                        if (errors.attendanceDate) setErrors((prev) => ({ ...prev, attendanceDate: undefined }));
                      }}
                      disabled={status === 'submitting'}
                    >
                      <span className="date-option-dot" aria-hidden="true" />
                      <span className="date-option-title">Tuesday, 3 November 2026</span>
                    </button>
                  </div>
                  {errors.attendanceDate && (
                    <p className="form-error" role="alert">{errors.attendanceDate}</p>
                  )}
                </div>

                {/* 2. Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    FULL NAME <span className="form-req" aria-hidden="true">•</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
                    placeholder="e.g. Maya Lin"
                    value={input.fullName}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="form-error" role="alert">{errors.fullName}</p>
                  )}
                </div>

                {/* 2. Profession */}
                <div className="form-group">
                  <label htmlFor="profession" className="form-label">
                    PROFESSION <span className="form-req" aria-hidden="true">•</span>
                  </label>
                  <div className="form-select-wrapper">
                    <select
                      id="profession"
                      name="profession"
                      required
                      aria-required="true"
                      aria-invalid={Boolean(errors.profession)}
                      aria-describedby={errors.profession ? 'profession-error' : undefined}
                      className={`form-select ${errors.profession ? 'form-input--error' : ''}`}
                      value={input.profession}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                    >
                      <option value="">Select your profession</option>
                      {PROFESSIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <span className="form-select-chevron" aria-hidden="true">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  {errors.profession && (
                    <p id="profession-error" className="form-error" role="alert">{errors.profession}</p>
                  )}
                </div>

                {/* Optional profession specification if Other */}
                {input.profession === 'Other' && (
                  <div className="form-group">
                    <label htmlFor="professionOther" className="form-label">
                      PLEASE SPECIFY YOUR ROLE / DISCIPLINE
                    </label>
                    <input
                      id="professionOther"
                      name="professionOther"
                      type="text"
                      className={`form-input ${errors.professionOther ? 'form-input--error' : ''}`}
                      placeholder="e.g. Interior Stylist, Project Director"
                      value={input.professionOther}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                    />
                  </div>
                )}

                {/* 3. Company / Firm */}
                <div className="form-group">
                  <label htmlFor="company" className="form-label">
                    COMPANY / FIRM <span className="form-opt">(optional)</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className={`form-input ${errors.company ? 'form-input--error' : ''}`}
                    placeholder="e.g. Studio Nexus Architects"
                    value={input.company}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                  />
                  {errors.company && (
                    <p id="company-error" className="form-error" role="alert">{errors.company}</p>
                  )}
                </div>

                {/* 4. Phone / WhatsApp */}
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    PHONE / WHATSAPP NUMBER <span className="form-req" aria-hidden="true">•</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                    placeholder="+255 791 261 881"
                    value={input.phone}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="form-error" role="alert">{errors.phone}</p>
                  )}
                </div>

                {/* 5. Email Address */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    EMAIL ADDRESS <span className="form-opt">(optional)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                    placeholder="e.g. maya@company.com"
                    value={input.email}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                  />
                  {errors.email && (
                    <p id="email-error" className="form-error" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* Submit button */}
                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="rsvp-submit-btn"
                    disabled={status === 'submitting'}
                  >
                    <span>{status === 'submitting' ? 'CONFIRMING...' : 'CONFIRM ATTENDANCE'}</span>
                    <span className="submit-arrow" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Luxury Calendar Reminder Modal */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        attendanceDate={input.attendanceDate}
        guestName={input.fullName}
      />
    </section>
  );
}
