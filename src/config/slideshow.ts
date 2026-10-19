/**
 * SLIDESHOW CONFIGURATION — Catalogue-derived photographs from ABC Emporio.
 * Sourced directly from local catalogue extracts in /hero.
 */

export interface SlideItem {
  id: string;
  indexFormatted: string;
  name: string;
  brand: string;
  desktop: string;
  mobile: string;
  alt: string;
  active: boolean;
  objectPositionDesktop?: string;
  objectPositionMobile?: string;
}

export const slideshowConfig = {
  /** Display duration per slide in milliseconds (~7 seconds) */
  slideDuration: 7000,
  /** Crossfade transition duration in milliseconds (~1.3 seconds) */
  crossfadeDuration: 1300,
  slides: [
    {
      id: '01',
      indexFormatted: '01',
      name: 'Armani Dove Dining',
      brand: 'Granitogres',
      desktop: '/assets/showtell/01_armani_dove_dining_desktop.webp',
      mobile: '/assets/showtell/01_armani_dove_dining_mobile.webp',
      alt: 'Armani Dove Dining — Granitogres luxury surface & dining setting',
      active: true,
      objectPositionDesktop: 'center center',
      objectPositionMobile: 'center center',
    },
    {
      id: '02',
      indexFormatted: '02',
      name: 'Kohler Modern Vanity',
      brand: 'Kohler',
      desktop: '/assets/showtell/02_kohler_modern_vanity_desktop.webp',
      mobile: '/assets/showtell/02_kohler_modern_vanity_mobile.webp',
      alt: 'Kohler Modern Vanity — designer washroom vanity and basin',
      active: true,
      objectPositionDesktop: '68% center',
      objectPositionMobile: 'center center',
    },
    {
      id: '03',
      indexFormatted: '03',
      name: 'Belvedere Black Stone',
      brand: 'Granitogres',
      desktop: '/assets/showtell/03_belvedere_black_stone_desktop.webp',
      mobile: '/assets/showtell/03_belvedere_black_stone_mobile.webp',
      alt: 'Belvedere Black Stone — Granitogres architectural surface',
      active: true,
      objectPositionDesktop: 'center center',
      objectPositionMobile: 'center center',
    },
    {
      id: '04',
      indexFormatted: '04',
      name: 'Nolte Gold Lounge',
      brand: 'Nolte',
      desktop: '/assets/showtell/04_nolte_gold_lounge_desktop.webp',
      mobile: '/assets/showtell/04_nolte_gold_lounge_mobile.webp',
      alt: 'Nolte Gold Lounge — luxury interior cabinetry and living space',
      active: true,
      objectPositionDesktop: '60% center',
      objectPositionMobile: 'center center',
    },
    {
      id: '05',
      indexFormatted: '05',
      name: 'Bella Crema Living',
      brand: 'Granitogres',
      desktop: '/assets/showtell/05_bella_crema_living_desktop.webp',
      mobile: '/assets/showtell/05_bella_crema_living_mobile.webp',
      alt: 'Bella Crema Living — warm stone interior floor and wall surfaces',
      active: true,
      objectPositionDesktop: '65% center',
      objectPositionMobile: 'center center',
    },
    {
      id: '06',
      indexFormatted: '06',
      name: 'Kohler Strayt Washroom',
      brand: 'Kohler',
      desktop: '/assets/showtell/06_kohler_strayt_washroom_desktop.webp',
      mobile: '/assets/showtell/06_kohler_strayt_washroom_mobile.webp',
      alt: 'Kohler Strayt Washroom — contemporary sanitary architecture',
      active: true,
      objectPositionDesktop: '72% center',
      objectPositionMobile: 'center center',
    },
    // Inactive alternative slides kept in configuration for future rotation
    {
      id: '07',
      indexFormatted: '07',
      name: 'Onyx Beauty Blue',
      brand: 'Granitogres',
      desktop: '/assets/showtell/07_onyx_beauty_blue_desktop.webp',
      mobile: '/assets/showtell/07_onyx_beauty_blue_mobile.webp',
      alt: 'Onyx Beauty Blue — Granitogres translucent mineral slab',
      active: false,
      objectPositionDesktop: 'center center',
      objectPositionMobile: 'center center',
    },
    {
      id: '08',
      indexFormatted: '08',
      name: 'Kohler Vessels Terracotta',
      brand: 'Kohler',
      desktop: '/assets/showtell/08_kohler_vessels_terracotta_desktop.webp',
      mobile: '/assets/showtell/08_kohler_vessels_terracotta_mobile.webp',
      alt: 'Kohler Vessels Terracotta — artisanal vessel basins',
      active: false,
      objectPositionDesktop: 'center center',
      objectPositionMobile: 'center center',
    },
  ] as SlideItem[],
};
