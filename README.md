# ABC Emporio — Show & Tell Experience Invitation Microsite

A bespoke, mobile-first event invitation and RSVP website engineered for **ABC Emporio**'s exclusive Show & Tell Experience for architects, designers, and engineers at their Dar es Salaam showroom.

Main ABC Emporio Website [https://abcemporio.com/](https://abcemporio.com/).

---

## 🏛️ Project Highlights

- **Authentic Brand Fidelity**: Utilises the official vector crown insignia (`abc-emporio-logo-white.svg`), official SVG favicon, real showroom and catalogue photography, and exact CSS token colors (`#161616`, `#0b0b0b`, `#fbf9f5`, `#ef6b6b`).
- **Approved 4-Screen Continuous Experience**:
  1. **The Show & Tell Experience (Hero)**: Full-bleed 6-slide catalogue slideshow with smooth 1.3s crossfade every 7s, stationary typography, and custom slide counter.
  2. **You're Invited (Event Details)**: Warm ivory palette, 3-column `WHEN | WHERE | HOST` grid with verified Google Maps navigation.
  3. **Reserve Your Place (RSVP)**: Deep charcoal registration section, client/server validation, spam honeypot, and idempotency safeguards.
  4. **We Look Forward to Welcoming You (Closing & Footer)**: Near-black luxury finish, secondary RSVP action, and 3-column showroom footer with verified Dar es Salaam contact details.
- **Vercel & Neon Postgres Backend**: Serverless API `/api/register` with Neon Postgres database integration and local JSON fallback for offline development.
- **One-Click Organiser Export**: Instant attendee export in CSV/Excel and JSON via `/api/export?token=ABC_SHOWTELL_2026`.
- **Mobile-First & Touch-Optimised**: Verified across 320px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, and 1920px viewports with zero horizontal overflow.
- **Rich Social Previews**: Open Graph metadata and high-definition card (`og-image.jpg`, 1200×630px) for WhatsApp, iMessage, and LinkedIn sharing.
- **Zero-Latency Typography**: Self-hosted WOFF2 fonts (*Cormorant Garamond* and *Bai Jamjuree*) to guarantee lightning-fast load times.

---

## 📂 Project Architecture

```
ABC EMPORIAL/
├── api/
│   ├── register.ts             # Vercel serverless function for RSVP (Neon Postgres)
│   └── export.ts               # Authenticated CSV / JSON export for organisers
├── data/
│   └── registrations.json      # Local offline persistence fallback store
├── docs/
│   ├── BRAND_AND_ASSETS.md     # Official brand inspection, catalogue images, fonts
│   ├── BRAND_AUDIT.md          # Visual hierarchy and styling tokens
│   ├── CUSTOMER_HANDOVER.md    # Non-technical guide for ABC Emporio team
│   ├── DEPLOYMENT.md           # Vercel hosting, Neon setup, domain & DNS guide
│   ├── REGISTRATION_GUIDE.md   # Attendee management and CSV export handbook
│   └── TEST_REPORT.md          # QA verification, test matrix, and persistent proofs
├── hero/                       # Source catalogue imagery (desktop & mobile WebP)
├── public/
│   ├── favicon.svg             # Official ABC Emporio crown crest favicon
│   ├── og-image.jpg            # 1200x630 social link preview card
│   └── assets/
│       ├── branding/           # Vector SVG logos
│       └── showtell/hero/      # Production-ready 8-slide catalogue WebP assets
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Mathematically centered logo with section-aware CTA
│   │   ├── Hero.tsx            # Full-bleed 6-slide photographic hero with crossfade
│   │   ├── EventDetails.tsx    # Warm ivory 3-column event facts and Google Maps link
│   │   ├── RSVPForm.tsx        # Accessible form with real-time validation and confirmations
│   │   ├── Closing.tsx         # Closing statement and 3-column showroom footer
│   │   └── *.css               # Modular component styling sheets
│   ├── config/
│   │   ├── brand.ts            # Brand assets, Instagram (@abcceramics_tanzania), phone
│   │   ├── event.ts            # Central typed source of truth (dates, venue, contact)
│   │   ├── links.ts            # External links, Google Maps URL, WhatsApp
│   │   └── slideshow.ts        # 8 slides configuration (01-06 active, 07-08 alternative)
│   ├── styles/
│   │   ├── tokens.css          # Color, typography, spacing, and radius variables
│   │   └── global.css          # Base styles, resets, typography scales, utility classes
│   ├── App.tsx                 # Root layout rendering the 4 continuous sections
│   └── main.tsx                # React 19 entry point and font loaders
├── index.html                  # HTML entry point with meta tags and preconnect hints
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vercel.json                 # Vercel configuration (routes, caching, API functions)
└── vite.config.ts              # Vite config with local dev API middleware & preloading
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20.0.0 or higher
- npm 9.0.0 or higher

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start local development server (includes local API middleware)
npm run dev

# 3. Open browser at http://localhost:5173
```

### Production Build & Type Check
```bash
# Run strict TypeScript verification and compile production bundle
npm run build

# Preview compiled bundle locally
npm run preview
```

---

## ⚙️ Customisation & Event Configuration

All core event variables are configured in `src/config/event.ts`:

- `date`: `Monday, 2 November 2026`
- `startTime`: Pending confirmation indicator (until organizer approves exact hour).
- `venue`: `ABC Emporio — Dar es Salaam`, `Next to Vodacom Head Office, Bagamoyo Rd, Dar es Salaam`.
- `googleMapsUrl`: Direct link to the Dar es Salaam showroom on Google Maps.
- `phone`: `+255 685 289 679` (click-to-call: `tel:+255685289679`).
- `instagram`: `@abcceramics_tanzania` (`https://www.instagram.com/abcceramics_tanzania/`).

---

## 🌐 Vercel Production Deployment

1. Connect this repository to **Vercel**.
2. Vercel automatically detects the Vite framework preset:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In **Project Settings > Environment Variables**, configure:
   - `DATABASE_URL`: Your Neon Postgres pooled connection string.
   - `ORGANISER_EXPORT_TOKEN`: Secret key for attendee downloads (e.g. `ABC_SHOWTELL_2026`).
4. Connect a Neon database via the **Vercel Storage** tab or provide an external Neon connection string.
5. Refer to [docs/DEPLOYMENT.md](file:///c:/Users/surface%20laptop/Downloads/ABC%20EMPORIAL/docs/DEPLOYMENT.md) for detailed deployment steps.

---

## 📊 Exporting Registrations

Organisers and sales managers can export the complete attendee list anytime:

- **Excel / CSV Format**:
  `https://<your-domain>/api/export?token=ABC_SHOWTELL_2026&format=csv`
- **JSON Format**:
  `https://<your-domain>/api/export?token=ABC_SHOWTELL_2026&format=json`

See [docs/REGISTRATION_GUIDE.md](file:///c:/Users/surface%20laptop/Downloads/ABC%20EMPORIAL/docs/REGISTRATION_GUIDE.md) for full instructions.

---

## 📄 Handover Documentation

- [docs/CUSTOMER_HANDOVER.md](file:///c:/Users/surface%20laptop/Downloads/ABC%20EMPORIAL/docs/CUSTOMER_HANDOVER.md) — Plain English summary for the ABC Emporio sales team.
- [docs/BRAND_AND_ASSETS.md](file:///c:/Users/surface%20laptop/Downloads/ABC%20EMPORIAL/docs/BRAND_AND_ASSETS.md) — Asset register, catalogue details, slide ordering.
- [docs/DEPLOYMENT.md](file:///c:/Users/surface%20laptop/Downloads/ABC%20EMPORIAL/docs/DEPLOYMENT.md) — Technical deployment and database setup guide.
- [docs/REGISTRATION_GUIDE.md](file:///c:/Users/surface%20laptop/Downloads/ABC%20EMPORIAL/docs/REGISTRATION_GUIDE.md) — Guest list management and export guide.
- [docs/TEST_REPORT.md](file:///c:/Users/surface%20laptop/Downloads/ABC%20EMPORIAL/docs/TEST_REPORT.md) — Full QA and verification report.
