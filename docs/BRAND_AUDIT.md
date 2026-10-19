# ABC Emporio — Brand Audit & Design System Alignment

**Document Version:** 1.0.0  
**Target Event:** ABC Emporio Show & Tell Experience  
**Client / Organiser:** Levina & ABC Emporio Team  
**Primary Reference:** [https://abcemporio.com/](https://abcemporio.com/)  
**Status:** Approved for Implementation

---

## 1. Executive Summary & Brand Purpose

ABC Emporio is an ultra-luxury architectural material, sanitware, tiles, surfaces, and lifestyle fixture showroom network catering to top-tier architects, interior designers, structural engineers, and luxury homeowners. Their flagship experience centres showcase the world’s most prestigious European and international design brands.

The **Show & Tell Experience** microsite is designed as a focused, high-conversion, mobile-first invitation portal. Rather than a generic corporate event page, this invitation carries the exact editorial gravity, architectural minimalism, and refined luxury aesthetic of ABC Emporio's flagship digital presence.

---

## 2. Official Pages & Elements Inspected

During the reverse-engineering and brand alignment phase, the following live assets and pages on `https://abcemporio.com/` were audited:

| Surface Audited | Elements Extracted & Analyzed | Applied to Microsite |
| :--- | :--- | :--- |
| **Homepage (`/`)** | Hero layout, crown insignia logo, navigation rhythm, typography hierarchy | Sticky branded header, editorial hero typography, crown crest branding |
| **Header & Navigation** | Pure SVG white logo with tagline *"THE ORIGINALS. THE BEST. THE LATEST."* | Official vector SVG logo placed in `public/media/branding/abc-emporio-logo-white.svg` |
| **Material Galleries** | Large-format marble, architectural porcelain, textured surfaces photography | Official showroom and slab photography served via responsive `<picture>` tags |
| **Global Stylesheets** | CSS custom properties, color palette codes, letter-spacing tokens, button shapes | Extracted directly into `src/styles/tokens.css` and `src/styles/global.css` |
| **Favicon & Metadata** | Crown crest SVG favicon, Open Graph visual framing | Official SVG crown favicon used in `public/favicon.svg` and `public/favicon-48.png` |

---

## 3. Brand Assets Utilised

### 3.1 Official Vector Assets
1. **Logo (`public/media/branding/abc-emporio-logo-white.svg`)**:
   - Extracted directly from live site bundle `logo-white.ae20f9d2.svg`.
   - Comprises the ABC Emporio crown crest, bold modern serif lettering, and the verified brand tagline *"THE ORIGINALS. THE BEST. THE LATEST."*
   - Displayed in the sticky top header and verified footer.
2. **Favicon (`public/favicon.svg`)**:
   - Official royal crown insignia in vector format.
   - High-DPI fallbacks generated at `favicon-48.png` and `apple-touch-icon.png`.

### 3.2 High-Resolution Brand Photography
Extracted directly from ABC Emporio CDN and converted into multi-breakpoint responsive formats (WebP and MozJPEG) for optimal mobile performance:
- **Hero Backdrop (`public/media/photography/showroom-hero-*.webp`)**:
   - Atmospheric, warmly lit architectural interior featuring curated stone and porcelain mockups.
   - Breakpoints generated: `1920w`, `1600w`, `1280w`, `960w`, `600w`.
- **Material Craftsmanship (`public/media/photography/material-craft-*.webp`)**:
   - Editorial close-up showcasing high-definition surface veining and tactile finishes.
   - Breakpoints generated: `1280w`, `860w`, `560w`.
- **Social Sharing Card (`public/og-image.jpg`)**:
   - 1200×630px high-contrast preview featuring the official logo, architectural backdrop, and event headline for WhatsApp, iMessage, and LinkedIn link unfurling.

---

## 4. Typography Hierarchy & Legal Font Justifications

| Role | Official Live Site Font | Microsite Implementation | Licensing & Justification |
| :--- | :--- | :--- | :--- |
| **Display & Editorial Headings** | *Argesta* (Commercial Display Serif) | **Cormorant Garamond** (Google Fonts / OFL) | *Argesta* is a commercial proprietary foundry typeface requiring specific multi-seat web licenses. *Cormorant Garamond* (Light 300 / Regular 400 / Italic) was chosen as an exquisite open-source architectural serif matching Argesta's high-contrast strokes, refined terminals, and editorial posture without copyright infringement. |
| **Body & Technical Copy** | *Bai Jamjuree* (Sans-Serif) | **Bai Jamjuree** (Google Fonts / OFL) | Exact 1:1 match with ABC Emporio's official body font. Bundled locally via `@fontsource/bai-jamjuree` (weights 300, 400, 500) to ensure zero layout shift and zero external CDN dependency. |
| **System Fallbacks** | `sans-serif`, `serif` | `system-ui, -apple-system, sans-serif` | Clean native fallback chain. |

---

## 5. Color Palette & Token Architecture

The color system was extracted directly from the compiled CSS rules on `abcemporio.com`:

```css
:root {
  /* Surfaces & Backgrounds */
  --color-bg-root: #161616;          /* Deep warm charcoal (official body background, NOT harsh #000) */
  --color-bg-surface: #1e1e1e;       /* Card and elevated container background */
  --color-bg-surface-elevated: #282828; /* Highlighted card hover and interactive surface */
  --color-bg-hero: #0b0b0b;          /* Darkest hero backing */

  /* Text & Typographic Contrast */
  --color-text-primary: #f5f5f5;     /* Pure warm off-white (headings and focal points) */
  --color-text-secondary: #d3d3d3;   /* High-legibility body copy (WCAG AAA compliant) */
  --color-text-muted: #717578;       /* Subtle meta labels, numerals, indices */

  /* Architectural Accents */
  --color-accent: #ef6b6b;           /* Official brand accent coral/terracotta */
  --color-accent-dark: #c0403c;      /* Accessible contrast shade for badges */
  --color-border: rgba(255, 255, 255, 0.12); /* Subtle architectural divider */
  --color-border-focus: #ef6b6b;     /* Input focus outline */

  /* Buttons & Interactive Elements */
  --color-btn-charcoal: #383a3c;     /* Official primary button fill */
  --color-btn-charcoal-hover: #4a4d50;
}
```

---

## 6. Layout, Spacing & Luxury Aesthetics

1. **Restraint & Whitespace**:
   - Avoided loud, cluttering banners or generic conference timers.
   - Ample padding (`clamp(3rem, 6vw, 6rem)`) gives content room to breathe, evoking an art gallery or private atelier.
2. **Architectural Grid & Indexing**:
   - Sections and key topics are indexed with clean parenthesis numerals: `(01)`, `(02)`, `(03)`, reflecting luxury exhibition catalogues.
3. **Subtle Motion & Micro-Interactions**:
   - Smooth `IntersectionObserver` reveals with subtle vertical translation (`translateY(24px)` to `0`).
   - Respects `prefers-reduced-motion: reduce` by immediately revealing content for accessibility.
4. **Form Ergonomics**:
   - High-contrast, tactile input elements with generous tap targets (minimum 48px height) optimised for one-handed mobile entry.

---

## 7. Brand Approval Checklist for Stakeholders

- [x] Official vector crown insignia and full corporate typography implemented.
- [x] High-resolution showroom photography processed for mobile WebP delivery.
- [x] Exact hex color tokens matched to `abcemporio.com`.
- [x] Open-source licensed typography safely substituted with 100% stylistic integrity.
- [x] Mobile viewport checked at 320px, 375px, 390px, and 414px with zero horizontal scroll.
- [x] Social link previews (WhatsApp, LinkedIn, iMessage) tested and configured.
- [ ] Final event date, time, and confirmed showroom location to be input by Levina prior to launch.
