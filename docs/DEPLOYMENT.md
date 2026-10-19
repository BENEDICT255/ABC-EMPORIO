# ABC EMPORIO — VERCEL DEPLOYMENT GUIDE
## Production Deployment & Neon Postgres Database Setup

---

## 1. Hosting Architecture Overview

* **Frontend:** React 19 + TypeScript + Vite Single Page Application.
* **Backend:** Vercel Serverless Functions (`/api/register`, `/api/export`).
* **Database:** Neon Postgres (provisioned via Vercel Marketplace or Neon.tech).
* **CDN & Edge Network:** Vercel Global Edge Network with SSL and asset caching.

---

## 2. Vercel Project Configuration

When importing this repository into Vercel:

| Setting | Configuration Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | `20.x` or `22.x` |

The repository contains `vercel.json` which automatically configures:
- SPA client-side fallback routes to `index.html`.
- Serverless API routing for `/api/*`.
- 1-year immutable caching for static assets in `/assets/`.

---

## 3. Environment Variables Setup

Configure the following variables in **Vercel Project Settings > Environment Variables**:

| Variable Name | Environment | Description / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Production, Preview | Neon Postgres pooled connection string: `postgres://user:pass@ep-pooler.neon.tech/neondb?sslmode=require` |
| `ORGANISER_EXPORT_TOKEN` | Production, Preview | Secret key used to access `/api/export` (e.g. `ABC_SHOWTELL_2026`) |
| `SITE_URL` | Production | Canonical site URL (e.g. `https://showandtell.abcemporio.com`) |

---

## 4. Connecting Neon Postgres

1. In your Vercel Dashboard, go to the **Storage** tab.
2. Click **Connect Database** and select **Neon** (or create a project directly on [Neon.tech](https://neon.tech/)).
3. Vercel automatically injects the `DATABASE_URL` (or `POSTGRES_URL`) into your project's environment variables.
4. The serverless function `/api/register` will automatically create the `registrations` table on its first execution if not already present:

```sql
CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  profession VARCHAR(80) NOT NULL,
  profession_other VARCHAR(100),
  company VARCHAR(150),
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255),
  event_key VARCHAR(100) NOT NULL,
  submission_id VARCHAR(64) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Deploying via Vercel CLI or GitHub

### Option A: Using Vercel CLI
```bash
# 1. Login to Vercel
npx vercel login

# 2. Deploy Preview
npx vercel

# 3. Deploy Production
npx vercel --prod
```

### Option B: Deploying via Git
1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New... > Project** and import the repository.
3. Add the environment variables and click **Deploy**.

---

## 6. Post-Deployment Verification Checklist

1. **Verify HTTPS & Homepage:** Open the production URL; verify that the 6-slide catalogue hero auto-plays smoothly.
2. **Verify Header CTA Behavior:** Confirm the top-right RSVP button is hidden on Hero and Closing, and shown on Event Details and RSVP.
3. **Verify Google Maps Link:** Click "NAVIGATE ON GOOGLE MAPS →" and verify it opens the showroom location.
4. **Submit a Live Test RSVP:**
   - Enter name, profession, phone number, and firm.
   - Click "CONFIRM ATTENDANCE →".
   - Confirm immediate "Thank you for registering" success screen.
5. **Verify Database Persistence:**
   - Navigate to `/api/export?token=ABC_SHOWTELL_2026` and verify your test entry appears.
