/**
 * BRAND CONFIGURATION — logo, imagery and reference links.
 * All photography is official ABC Emporio imagery sourced from abcemporio.com and re-encoded locally.
 * Usage for this invitation must be approved by ABC Emporio (see docs/BRAND_AUDIT.md).
 */

export interface ResponsiveImage {
  /** Path prefix inside /public, without the `-{width}.{ext}` suffix. */
  base: string;
  widths: number[];
  /** Intrinsic aspect ratio (width / height) of the largest rendition. */
  width: number;
  height: number;
  alt: string;
}

export const brand = {
  name: 'ABC Emporio',
  slogan: 'The Originals. The Best. The Latest.',
  officialUrl: 'https://abcemporio.com/',
  officialUrlLabel: 'abcemporio.com',
  tanzaniaUrl: 'https://abctanzania.com/',
  tanzaniaUrlLabel: 'abctanzania.com',
  instagramTz: 'https://www.instagram.com/abcceramics_tanzania/',
  instagramTzHandle: '@abcceramics_tanzania',
  instagramGlobal: 'https://www.instagram.com/abcemporio/',
  instagramGlobalHandle: '@abcemporio',
  phone: '+255 685 289 679',
  phoneFormatted: '+255 685 289 679',
  phoneTel: 'tel:+255685289679',
  location: 'Next to Vodacom Head Office, Bagamoyo Rd, Dar es Salaam',
  plusCode: '67C6+R6',
  hours: 'Open · Closes 5:30 pm',
  rating: '4.8 (261 reviews)',

  logo: {
    /** Official white logo SVG (crown, wordmark and slogan), copied verbatim. viewBox 279.09 × 85.09 */
    light: '/media/branding/abc-emporio-logo-white.svg',
    /** Authentic dark logo variant for light/cream backgrounds */
    dark: '/media/branding/abc-emporio-logo-dark.svg',
    aspectRatio: 279.09 / 85.09,
    alt: 'ABC Emporio — The Originals. The Best. The Latest.',
  },

  images: {
    hero: {
      base: '/media/photography/hero',
      widths: [1280, 1920],
      width: 1920,
      height: 1004,
      alt: 'Architectural material samples — glass mosaic, textured stone and terracotta tiles — arranged on a black surface',
    },
    heroMobile: {
      base: '/media/photography/hero-mobile',
      widths: [600, 860],
      width: 860,
      height: 1004,
      alt: 'Architectural material samples arranged on a black surface',
    },
    showroom: {
      base: '/media/photography/showroom',
      widths: [960, 1600],
      width: 1600,
      height: 837,
      alt: 'Bathroom fittings, basins and a freestanding bath displayed in a softly lit showroom',
    },
    collections: {
      base: '/media/photography/collections',
      widths: [960, 1600],
      width: 1600,
      height: 837,
      alt: 'Matte black kitchen faucets with knurled brass handles in dramatic low light',
    },
    details: {
      base: '/media/photography/details',
      widths: [560, 840],
      width: 840,
      height: 804,
      alt: 'Close view of glass mosaic, textured stone and natural rock samples',
    },
    spaces: {
      base: '/media/photography/spaces',
      widths: [600, 915],
      width: 915,
      height: 690,
      alt: 'A bathroom with a freestanding bath, timber floor and a planted courtyard beyond floor-to-ceiling glass',
    },
    surfaces: {
      base: '/media/photography/surfaces',
      widths: [547],
      width: 547,
      height: 310,
      alt: 'A kitchen island with a veined stone worktop and integrated lighting',
    },
    closing: {
      base: '/media/photography/closing',
      widths: [700, 1140],
      width: 1140,
      height: 1004,
      alt: '',
    },
  } satisfies Record<string, ResponsiveImage>,
} as const;

export function srcSet(img: ResponsiveImage, ext: 'webp' | 'jpg'): string {
  return img.widths.map((w) => `${img.base}-${w}.${ext} ${w}w`).join(', ');
}

export function fallbackSrc(img: ResponsiveImage): string {
  return `${img.base}-${img.widths[img.widths.length - 1]}.jpg`;
}
