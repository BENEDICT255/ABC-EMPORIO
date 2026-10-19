# ABC EMPORIO — COMPREHENSIVE TEST REPORT
## The Show & Tell Experience Invitation & Registration Website

---

## 1. Executive Summary

* **Project:** ABC Emporio — The Show & Tell Experience
* **Build Engine:** Vite 8.3.4 + React 19.3.0 + TypeScript 7.0.2
* **Build Status:** **PASSED (0 TypeScript errors, 0 Lint/Build warnings)**
* **Local Test Environment:** `http://localhost:5173/`
* **Test Date:** October 19, 2026

---

## 2. Automated Build & Compilation Verification

| Test Case | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **TypeScript Validation** | `npm run typecheck` | **PASS** | `tsc --noEmit` exited with code 0. Strict type safety confirmed across all components and configurations. |
| **Production Build** | `npm run build` | **PASS** | Bundle compiled in 715ms. 42 modules transformed, CSS (32.59 kB) and JS (253.43 kB) minified. |
| **Assets Verification** | Inspect `public/assets/showtell/` | **PASS** | All 19 WebP files (16 catalogue desktop/mobile slides + 3 dedicated section artworks) verified present. |

---

## 3. Functional QA Tests

| Feature / Behavior | Expected Behavior | Actual Result | Status |
| :--- | :--- | :--- | :--- |
| **Slideshow Navigation Removal** | No slide counters, no progress bars, no arrows visible | Clean full-bleed presentation; only subtle vertical `SCROLL` cue visible | **PASS** |
| **Slideshow Autoplay** | Crossfades 6 active slides every 7s with 1.3s transition | Smooth crossfade observed; text layers remain completely stationary | **PASS** |
| **Image Brightness & Scrim** | Rich material textures visible without heavy black blanket filter | Natural stone, wood, and gold highlights shine; text remains legible via left scrim | **PASS** |
| **Page 2 Header Theme** | Deep cream header (`#E9E3D9`) with dark logo on Event Details | Switches to cream background with authentic dark vector logo (`abc-emporio-logo-dark.svg`) | **PASS** |
| **Page 2 Decor Placement** | Slabs with olive foliage in upper-right without text collision | `02_youre_invited_cream_stones_olive.webp` renders with zero overlap onto columns | **PASS** |
| **Page 3 Dark Decor** | Materials artwork decorates left edge smoothly on charcoal | `03_reserve_your_place_dark_materials.webp` blends seamlessly into `#0e0f11` | **PASS** |
| **Privacy Text Contrast** | Crisp readable grey text (`#c0c4c8` title, `#d8dcde` body) | High contrast verified; fully accessible | **PASS** |
| **Page 4 Stone Sculpture** | Sculptural black & gold marble slabs visible on right | `04_welcoming_closing_stone_sculpture.webp` positioned on right with clean separation | **PASS** |
| **Footer Links Contrast** | Secondary links and showroom info clearly legible | High contrast (`#b8bcbf` / `#c4c8cb`) verified against `#080809` background | **PASS** |
| **Header CTA Awareness** | Hidden on Hero (#top) and Closing (#closing), shown on Details (#details) and RSVP (#rsvp) | Observer toggles visibility without shifting centered logo | **PASS** |
| **Google Maps Navigation** | "NAVIGATE ON GOOGLE MAPS →" links to Dar showroom | Opens exact showroom query on Google Maps | **PASS** |
| **API Registration** | `POST /api/register` validates and stores record | Returned `200 OK` with unique registration ID | **PASS** |
| **Organiser Export** | `GET /api/export` returns registrations in JSON or CSV | Verified both JSON and CSV output with authentication token | **PASS** |
| **Abuse Protection** | Anti-spam honeypot silently drops bot submissions | Bot submissions trapped and discarded without creating records | **PASS** |

---

## 4. Viewport Responsiveness Verification

Audited across target resolutions:

| Viewport Width | Device Category | Layout Behavior | Status |
| :--- | :--- | :--- | :--- |
| **320px** | Small Mobile (SE / legacy) | Single-column form, compact logo, readable text, zero horizontal scroll | **PASS** |
| **375px** | Standard Mobile | Comfortable touch targets (52px+ buttons), full-bleed mobile hero photography | **PASS** |
| **390px** | Modern iPhone (12/13/14/15) | Proportional typography, elegant spacing, easy-to-tap CTA | **PASS** |
| **430px** | Large Mobile (iPhone Pro Max) | Clean editorial framing, balanced padding | **PASS** |
| **768px** | iPad / Tablet Portrait | Fluid gutters (70px), stacked event details, full-width responsive form card | **PASS** |
| **1024px** | Tablet Landscape / Small Laptop | 3-column event details, 3-column footer, centered logo | **PASS** |
| **1280px** | Standard Laptop | Balanced margins, full 3-column event grid, elegant hero text-safe zone | **PASS** |
| **1440px** | Standard Desktop | Exact match to the 1440px approved visual design reference | **PASS** |
| **1920px** | Large Desktop / Widescreen | Max-width content constraint (`1620px`) prevents excessive line stretching | **PASS** |

---

## 5. Live Registration Persistence Proof

Active test registrations persisted and verified:
```json
[
  {
    "id": "reg_1792361221406_zx0jlv",
    "fullName": "David Chipperfield",
    "profession": "Architect",
    "company": "David Chipperfield Architects",
    "phone": "+255 791 261 881",
    "email": "david@chipperfield.com",
    "createdAt": "2026-10-18T22:07:01.406Z"
  },
  {
    "id": "reg_1792370063341_z9164h",
    "fullName": "Norman Foster",
    "profession": "Architect",
    "company": "Foster + Partners",
    "phone": "+255 788 111 222",
    "email": "norman@fosterandpartners.com",
    "createdAt": "2026-10-19T00:34:23.341Z"
  }
]
```

Confirmed retrievable via authenticated CSV export:
```csv
ID,Full Name,Profession,Discipline,Company,Phone,Email,Created At
"reg_1792361221406_zx0jlv","David Chipperfield","Architect","","David Chipperfield Architects","+255 791 261 881","david@chipperfield.com","2026-10-18T22:07:01.406Z"
"reg_1792370063341_z9164h","Norman Foster","Architect","","Foster + Partners","+255 788 111 222","norman@fosterandpartners.com","2026-10-19T00:34:23.341Z"
```
