# Niryana Jewels

A premium, mobile-first jewellery storefront for Niryana Jewels, Surat. Built with Next.js 14, TypeScript, Tailwind CSS, Zustand, Prisma/MySQL and Razorpay.

## Included

- Cinematic video-led homepage using the supplied Niryana campaign media
- Responsive shop, category filters, sorting, search and product detail galleries
- Persistent cart and wishlist (Zustand + localStorage)
- Cart, checkout flow, order confirmation and Razorpay create/verify endpoints
- Collections, brand story, contact, authentication UI and policy pages
- MySQL Prisma schema with relations, indexes and full-text product index
- SEO metadata, sitemap and robots routes
- Central media constants in `src/lib/assets.ts`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Database

Create a MySQL database and set `DATABASE_URL`, then run:

```bash
npm run db:generate
npm run db:push
SEED_ADMIN_PASSWORD='use-a-strong-password' npm run db:seed
```

`relationMode = "prisma"` supports PlanetScale-style databases. Remove it if you prefer database foreign keys on Railway/Aiven/local MySQL.

## Media

The original media repository URL in the brief currently returns 404, so this checkout packages the supplied, authentic brand images and videos under `public/media` for a reliable site. `src/lib/assets.ts` also exposes `GITHUB_BASE` and `githubAsset()`; after publishing `AksharGabani/Niryana-Jewels-assets`, set `NEXT_PUBLIC_GITHUB_ASSETS_BASE` and switch mappings to raw paths as needed.

## Admin portal

Open `/admin-login`. Authentication uses an HMAC-signed, HTTP-only, eight-hour session cookie. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a strong `ADMIN_SESSION_SECRET` in production. For local preview only, the fallback credentials are `admin@niryanajewels.com` / `NiryanaAdmin@2025`.

## Payments

Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID`. The backend creates amounts in paise and verifies signatures with a timing-safe HMAC comparison. The visual checkout intentionally remains in demo mode until credentials and persistent order storage are connected.

## Deploy to Render

This repository includes a production-ready `render.yaml` Blueprint for a Singapore-region Node web service.

1. Push the deployment branch to GitHub.
2. In Render, choose **New → Blueprint** and connect this repository.
3. Select `render.yaml` and enter the prompted environment variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the final Render URL (for example, `https://niryana-jewels.onrender.com`).
5. Deploy, then update `NEXT_PUBLIC_SITE_URL` if Render assigned a different hostname and redeploy once.

The service builds with `npm ci && npm run build`, starts with `npm start`, binds to Render's `PORT`, and uses `/` for health checks. Never paste production secrets into source control. Add Razorpay values only through Render's encrypted environment settings. Without Razorpay credentials, production payment creation correctly returns an unavailable response rather than simulating payment.

## Production checklist

- Configure all required environment variables in Render
- Replace the preview admin password and rotate any previously exposed test credentials
- Provision MySQL/PlanetScale and set `DATABASE_URL` before enabling persistent database features
- Retain the bundled media or publish the external media repository
- Configure Razorpay webhook verification and transactional email
- Connect authentication providers before enabling customer accounts

Brand contact: niryanajewels@gmail.com · +91 99251 79067
