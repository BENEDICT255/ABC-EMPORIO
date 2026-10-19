import { useState, type FormEvent, type ChangeEvent } from 'react';
import { content } from '../config/content';
import { eventConfig } from '../config/event';
import {
  HONEYPOT_FIELD,
  PROFESSIONS,
  RSVP_FORM_NAME,
  createSubmissionId,
  rememberSubmission,
  submitRsvp,
  validateRsvp,
  wasSubmittedThisSession,
  type EditableField,
  type FieldErrors,
  type Profession,
  type RsvpInput,
} from '../lib/registration';
import { getRegistrationState } from '../lib/schedule';
import { Arrow } from './ui';
import './RSVPForm.css';

const initialInput: RsvpInput = {
  fullName: '',
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
  };

  return (
    <section className="section section--dark rsvp-section" id="rsvp" aria-labelledby="rsvp-heading">
      {/* Dedicated decorative dark materials artwork on left edge matching approved Page 3 UI */}
      <div className="rsvp-decor-wrap" aria-hidden="true">
        <img
          src="/assets/showtell/03_reserve_your_place_dark_materials.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="rsvp-decor-img"
        />
      </div>

      <div className="container rsvp-container">
        <div className="rsvp-grid">
          {/* Left column: Context & Privacy */}
          <div className="rsvp-info reveal">
            <p className="label rsvp__label">{rsvp.label}</p>
            <h2 id="rsvp-heading" className="display rsvp__heading">Reserve Your Place.</h2>
            <p className="lead rsvp__intro">{rsvp.intro}</p>

            <div className="rsvp-privacy">
              <h3 className="rsvp-privacy__title">HOW WE USE YOUR DETAILS</h3>
              <p className="rsvp-privacy__text">
                Your details are collected by ABC Emporio solely to manage your attendance at the Show &amp; Tell Experience — for example, to confirm your place or share event updates. They are stored securely with our website and form provider, and are not used for general marketing or added to any mailing list.
              </p>
              <a href="#details" className="rsvp-privacy__link text-link">
                <span>Full privacy information</span>
                <Arrow />
              </a>
            </div>
          </div>

          {/* Right column: Form Card */}
          <div className="rsvp-form-card reveal">
            {isClosed ? (
              <div className="rsvp-status rsvp-status--closed">
                <h3 className="h3 rsvp-status__title">{rsvp.closedHeading}</h3>
                <p className="rsvp-status__body">{rsvp.closedBody}</p>
              </div>
            ) : status === 'success' ? (
              <div className="rsvp-status rsvp-status--success" role="status" aria-live="polite">
                <div className="rsvp-status__icon" aria-hidden="true">&#10003;</div>
                <h3 className="h3 rsvp-status__title">Thank you for registering.</h3>
                <p className="rsvp-status__body">
                  Your registration for the ABC Emporio Show &amp; Tell Experience has been received.
                </p>
                <p className="rsvp-status__closing">We look forward to welcoming you.</p>
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
                <div className="visually-hidden" aria-hidden="true">
                  <label htmlFor="bot-field">Do not fill this field</label>
                  <input
                    id="bot-field"
                    type="text"
                    name={HONEYPOT_FIELD}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <p className="rsvp-form__note">Fields marked * are required.</p>

                {errorMessage && (
                  <div className="rsvp-error-banner" role="alert">
                    {errorMessage}
                  </div>
                )}

                {/* Full name */}
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    FULL NAME <span className="form-req" aria-hidden="true">*</span>
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

                {/* Profession */}
                <div className="form-group">
                  <label htmlFor="profession" className="form-label">
                    PROFESSION <span className="form-req" aria-hidden="true">*</span>
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
                      {PROFESSIONS.map((p: Profession) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  {errors.profession && (
                    <p id="profession-error" className="form-error" role="alert">{errors.profession}</p>
                  )}
                </div>

                {/* Clarification if Other */}
                {(input.profession === 'Other' || input.profession === 'Others') && (
                  <div className="form-group">
                    <label htmlFor="professionOther" className="form-label">
                      PLEASE SPECIFY YOUR ROLE / DISCIPLINE
                    </label>
                    <input
                      id="professionOther"
                      name="professionOther"
                      type="text"
                      className={`form-input ${errors.professionOther ? 'form-input--error' : ''}`}
                      placeholder="e.g. Interior Designer, Project Director"
                      value={input.professionOther}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                    />
                    {errors.professionOther && (
                      <p id="professionOther-error" className="form-error" role="alert">{errors.professionOther}</p>
                    )}
                  </div>
                )}

                {/* Company / Firm */}
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

                {/* Phone / WhatsApp */}
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    PHONE / WHATSAPP NUMBER <span className="form-req" aria-hidden="true">*</span>
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
                    aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
                    className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                    placeholder="+255 791 261 881"
                    value={input.phone}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                  />
                  <span id="phone-hint" className="form-hint">
                    Please include your country code (e.g. +255 for Tanzania, +971 for UAE, +44 for UK).
                  </span>
                  {errors.phone && (
                    <p id="phone-error" className="form-error" role="alert">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
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

                <div className="rsvp-form__submit-row">
                  <button
                    type="submit"
                    className="btn rsvp-form__submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? rsvp.submitting : 'CONFIRM ATTENDANCE'}
                    {status !== 'submitting' && <Arrow />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
