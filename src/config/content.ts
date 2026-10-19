/**
 * CONTENT — customer-editable section copy.
 *
 * STATUS: WORKING COPY. None of this wording has yet been approved by ABC Emporio or the organiser.
 * Review and approve before publication, then set `eventConfig.launchApproved = true`.
 * Event facts (date, time, venue, RSVP status) live in ./event.ts — do not hard-code them here.
 */
import type { ResponsiveImage } from './brand';
import { brand } from './brand';

export interface Highlight {
  title: string;
  text: string;
  image: ResponsiveImage;
  /** When set, the highlight only renders if this returns true. */
  requires?: 'teamPresenceConfirmed';
}

export const content = {
  header: {
    descriptor: 'Show & Tell',
    cta: 'Reserve your place',
    ctaClosed: 'Event details',
  },

  hero: {
    primaryCta: 'Reserve your place',
    secondaryCta: 'Event details',
    brandLine: 'ABC Emporio',
  },

  introduction: {
    label: 'The Invitation',
    heading: 'Discover Materials in Person',
    body: 'Join ABC Emporio for a closer look at the materials and details that bring exceptional spaces to life. Explore selected products, appreciate their textures and finishes, and discover possibilities for your next project.',
  },

  experience: {
    label: 'The Experience',
    heading: 'What to Expect',
    featuredLabel: 'On show',
    highlights: [
      {
        title: 'Explore the collections',
        text: 'Discover a curated selection of materials and products.',
        image: brand.images.collections,
      },
      {
        title: 'Experience the details',
        text: 'See textures, finishes, colours and craftsmanship up close.',
        image: brand.images.details,
      },
      {
        title: 'Discover possibilities',
        text: 'Explore how carefully selected materials can shape architectural spaces.',
        image: brand.images.spaces,
      },
      {
        title: 'Connect with the team',
        text: 'Meet the ABC Emporio team and ask questions about the showcased products.',
        image: brand.images.surfaces,
        requires: 'teamPresenceConfirmed',
      },
    ] satisfies Highlight[],
  },

  details: {
    label: 'The Details',
    heading: 'You’re Invited',
    intro: 'We would be delighted to welcome you to an ABC Emporio showroom for a showcase dedicated to materials, finishes and design.',
    pending: 'To be announced',
    venuePending: 'ABC Emporio showroom, location to be confirmed',
    pendingNote: 'Directions and calendar details will appear here as soon as they are confirmed.',
    directions: 'Get directions',
    calendarIcs: 'Add to calendar',
    calendarGoogle: 'Google Calendar',
  },

  rsvp: {
    label: 'RSVP',
    heading: 'Reserve Your Place',
    intro: 'We look forward to welcoming you. Please complete the form below to confirm your attendance.',
    requiredNote: 'Fields marked * are required.',
    submit: 'Confirm attendance',
    submitting: 'Sending…',
    closedHeading: 'Registration is now closed',
    closedBody: 'Thank you for your interest in the ABC Emporio Show & Tell Experience. Registration for this event is no longer open.',
    successHeading: 'Thank You for Registering.',
    successBodyRequest: 'Your registration for the ABC Emporio Show & Tell Experience has been received.',
    successBodyConfirmed: 'Your registration for the ABC Emporio Show & Tell Experience has been received.',
    successClosing: 'We look forward to welcoming you.',
    registerAnother: 'Register another guest',
    errorNetwork: "We couldn't complete your registration. Please check your connection and try again.",
    errorProvider: "We couldn't complete your registration. Please check your connection and try again.",
    errorDuplicate: 'These details have already been registered from this device. If you are registering a different guest, please use their own name.',
  },

  /** Privacy wording — requires customer approval. */
  privacy: {
    heading: 'How we use your details',
    body: 'Your details are collected by ABC Emporio solely to manage your attendance at the Show & Tell Experience — for example, to confirm your place or share event updates. They are stored securely with our website and form provider, and are not used for general marketing or added to any mailing list.',
    contactFallback: 'To update or remove your registration, please contact the person who sent you this invitation.',
  },

  closing: {
    label: 'Until Then',
    heading: 'We Look Forward to Welcoming You.',
    body: 'Discover the details. Explore new possibilities. Experience ABC Emporio.',
    cta: 'Reserve your place',
  },

  footer: {
    officialSite: 'Official website',
    privacyLink: 'Registration privacy',
    rights: 'All rights reserved.',
  },

  previewNotice: 'Preview — event details and wording are awaiting confirmation',
} as const;
