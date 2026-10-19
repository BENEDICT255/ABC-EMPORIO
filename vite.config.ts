import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { eventConfig, metaConfig } from './src/config/event.ts';
import { brand } from './src/config/brand.ts';
import { slideshowConfig } from './src/config/slideshow.ts';

/** Escapes text for safe use inside HTML attribute values. */
const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Resolves the absolute site URL used for canonical / Open Graph tags. */
function resolveSiteUrl(): string | null {
  const url = eventConfig.siteUrl ?? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  return url ? url.replace(/\/+$/, '') : null;
}

function invitationHtml(): Plugin {
  return {
    name: 'abc-invitation-html',
    transformIndexHtml(html) {
      const site = resolveSiteUrl();
      const abs = (p: string) => (site ? `${site}${p}` : p);
      const firstSlide = slideshowConfig.slides[0] || {
        desktop: '/assets/showtell/hero/01_belvedere-black_desktop.webp',
        mobile: '/assets/showtell/hero/01_belvedere-black_mobile.webp',
      };

      const meta = [
        `<title>${attr(metaConfig.title)}</title>`,
        `<meta name="description" content="${attr(metaConfig.description)}" />`,
        `<meta name="theme-color" content="${metaConfig.themeColor}" />`,
        site ? `<link rel="canonical" href="${site}/" />` : '',
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${attr(brand.name)}" />`,
        `<meta property="og:title" content="${attr(metaConfig.title)}" />`,
        `<meta property="og:description" content="${attr(metaConfig.description)}" />`,
        site ? `<meta property="og:url" content="${site}/" />` : '',
        `<meta property="og:image" content="${abs(metaConfig.ogImage)}" />`,
        site?.startsWith('https://') ? `<meta property="og:image:secure_url" content="${abs(metaConfig.ogImage)}" />` : '',
        `<meta property="og:image:type" content="image/jpeg" />`,
        `<meta property="og:image:width" content="${metaConfig.ogImageWidth}" />`,
        `<meta property="og:image:height" content="${metaConfig.ogImageHeight}" />`,
        `<meta property="og:image:alt" content="${attr(metaConfig.ogImageAlt)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${attr(metaConfig.title)}" />`,
        `<meta name="twitter:description" content="${attr(metaConfig.description)}" />`,
        `<meta name="twitter:image" content="${abs(metaConfig.ogImage)}" />`,
        eventConfig.launchApproved ? '' : `<meta name="robots" content="noindex, nofollow" />`,
        // Preload first slideshow slide (LCP) for faster visual rendering
        `<link rel="preload" as="image" type="image/webp" fetchpriority="high" media="(max-width: 767px)" href="${firstSlide.mobile}" />`,
        `<link rel="preload" as="image" type="image/webp" fetchpriority="high" media="(min-width: 768px)" href="${firstSlide.desktop}" />`,
      ].filter(Boolean).join('\n    ');

      return html
        .replace('<!-- app:meta -->', meta)
        .replace('<!-- app:netlify-form -->', '');
    },
  };
}

/** Local dev middleware for /api/register and /api/export during `npm run dev` */
function localApiMiddleware(): Plugin {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const parsedUrl = new URL(req.url, 'http://localhost:5173');

        // /api/register handler
        if (parsedUrl.pathname === '/api/register' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}');

              // Basic honeypot
              if (body.honeypot) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ ok: true, message: 'Received' }));
              }

              const dataDir = path.join(process.cwd(), 'data');
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
              }
              const filePath = path.join(dataDir, 'registrations.json');
              const current = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];

              const record = {
                id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                fullName: body.fullName || '',
                profession: body.profession || '',
                professionOther: body.professionOther || '',
                company: body.company || '',
                phone: body.phone || '',
                email: body.email || '',
                submissionId: body.submissionId || `${Date.now()}`,
                createdAt: new Date().toISOString(),
              };

              current.push(record);
              fs.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf-8');

              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ ok: true, id: record.id, message: 'Registration confirmed' }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ ok: false, error: 'Registration failed' }));
            }
          });
          return;
        }

        // /api/export handler
        if (parsedUrl.pathname === '/api/export') {
          const token = parsedUrl.searchParams.get('token') || req.headers['x-organiser-token'];
          const format = parsedUrl.searchParams.get('format') || 'json';

          if (token !== 'ABC_SHOWTELL_2026') {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
          }

          const filePath = path.join(process.cwd(), 'data', 'registrations.json');
          const records = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];

          if (format === 'csv') {
            const header = 'ID,Full Name,Profession,Discipline,Company,Phone,Email,Created At\n';
            const rows = records.map((r: Record<string, unknown>) => {
              const clean = (val: unknown) => `"${String(val || '').replace(/"/g, '""')}"`;
              return [
                clean(r.id),
                clean(r.fullName),
                clean(r.profession),
                clean(r.professionOther),
                clean(r.company),
                clean(r.phone),
                clean(r.email),
                clean(r.createdAt),
              ].join(',');
            }).join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="abc-showtell-registrations.csv"');
            return res.end(header + rows);
          }

          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ ok: true, total: records.length, registrations: records }));
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), invitationHtml(), localApiMiddleware()],
  build: {
    target: 'es2020',
    cssMinify: true,
    assetsInlineLimit: 0,
  },
});
