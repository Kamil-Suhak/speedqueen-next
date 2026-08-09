# Speed Queen Kraków – Modern Commercial Web Application

A high-performance, multilingual commercial web application built for the **Speed Queen** self-service laundromat franchise in Kraków (3 locations). Built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**, deployed serverless on **Cloudflare Workers / Pages** via **OpenNext**.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Dynamic Route Segments) + [React 19](https://react.dev/)
- **Language**: TypeScript
- **Styling & Animations**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`), CSS `@theme` tokens, custom keyframes, [Framer Motion](https://www.framer.com/motion/)
- **Database & Storage**: [Neon Serverless PostgreSQL](https://neon.tech/) (`@neondatabase/serverless`) + [Cloudflare R2 Object Storage](https://www.cloudflare.com/products/r2/)
- **Deployment & Edge Runtime**: Cloudflare Workers / Pages via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (`nodejs_compat` runtime)
- **Email Delivery**: [Resend](https://resend.com/) + [React Email](https://react.email/) (`@react-email/render`)
- **External APIs**: [Google Places API](https://developers.google.com/maps/documentation/places/web-service) (Ratings & Customer Reviews) + Browser Geolocation API
- **Icons & Typography**: `lucide-react`, `next/font/google` (Inter, Montserrat)

---

## Technical Highlights & Architecture

### 1. High-Concurrency Promo Distribution & Cloudflare R2 Streaming

- **Atomic Queue Claiming**: Implemented a transactional discount claim action ([`claimDiscount.ts`](src/actions/claimDiscount.ts)) using PostgreSQL's `FOR UPDATE SKIP LOCKED` locking mechanism. Under high concurrent traffic, multiple users are allocated unique promo codes simultaneously without race conditions or deadlocks.
- **Privacy-Preserving Hashing**: User emails are salted and hashed via SHA-256 (`crypto.createHash`) before storage in the PostgreSQL `discounts` table, ensuring GDPR compliance while enforcing single-claim limits per user.
- **Failure-Compensating Rollback**: If the downstream transactional email dispatch (Resend API) encounters an error, the database claim is rolled back automatically, returning the promo code back to the available pool.
- **Statistical Lottery Mechanism**: Built an atomic visit counter endpoint ([`app/api/promo-check/route.ts`](app/api/promo-check/route.ts)) using a SQL `CASE` statement to reset every $N$ visits, controlling promotional modal trigger frequency server-side.
- **Edge Blob Streaming**: QR code assets stored in Cloudflare R2 buckets are streamed directly through Next.js route handlers ([`app/api/qr/[key]/route.ts`](app/api/qr/[key]/route.ts)) using `@opennextjs/cloudflare` context with immutable HTTP caching headers.

### 2. Multi-Layer Anti-Spam & Email Validation Pipeline

- **DNS MX-Record Verification**: The server action resolves DNS Mail Exchange records for user domains ([`emailValidation.ts`](src/lib/emailValidation.ts)) using a non-blocking `Promise.race` 1000ms timeout to reject non-existent email domains before dispatch.
- **Typo Detection Dictionary**: Includes an automated typo detector matching common international and Polish email domains (e.g., `gmial.com` $\to$ `gmail.com`, `wp.pll` $\to$ `wp.pl`).
- **Bot Mitigation & Content Heuristics**:
  - **Honeypot Trap**: Invisible field (`do_not_fill`) silently trapping automated bots with mock successful responses.
  - **String Anomaly Filtering**: Server-side checks rejecting word lengths $>25$ characters, fewer than 3 words, or unauthorized URLs.

### 3. Edge-Native Deployment & Cloudflare Image Pipeline

- **OpenNext Adapter**: Fully configured for serverless execution on Cloudflare Workers via [`open-next.config.ts`](open-next.config.ts) and [`wrangler.toml`](wrangler.toml).
- **Edge Image Resizing**: Custom Next.js image loader ([`image-loader-cloudflare.ts`](src/lib/image-loader-cloudflare.ts)) that delegates image resizing, WebP/AVIF transcoding, and caching to Cloudflare's `/cdn-cgi/image/` edge infrastructure in production, with seamless raw fallback in local development.

### 4. Edge Middleware & Dynamic i18n Architecture

- **Language Detection**: Custom Edge Middleware ([`middleware.ts`](middleware.ts)) evaluates `Accept-Language` headers and automatically rewrites/redirects users to `/pl` or `/en` subpaths.
- **Modular Dictionary Loader**: Server components load namespace-specific dictionaries ([`generate-dictionaries.ts`](src/lib/generate-dictionaries.ts)) at render time, preventing client-bundle bloat.
- **Rich Structured Data (JSON-LD)**: Dynamic schema generators ([`src/components/seo/`](src/components/seo/)) output schema.org compliant `LocalBusiness` (for all 3 physical locations with geo coordinates and opening hours), `FAQPage`, `Service`, and `ImageGallery` schemas.

### 5. Interactive UI Systems & Real-time Integrations

- **Geolocation-Aware CTA**: Hero section ([`directions.ts`](src/lib/directions.ts)) calculates Euclidean/Haversine distance between the user's browser coordinates and the 3 laundry facilities, automatically opening Google Maps navigation to the closest location.
- **Live Google Reviews Aggregation**: Server Action ([`getReviews.ts`](src/actions/getReviews.ts)) queries the Google Places API for all Kraków branches, applies a 24-hour Incremental Static Regeneration cache (`revalidate: 86400`), merges duplicates, and runs a custom scoring algorithm prioritizing comprehensive, highly-rated reviews.
- **Interactive Multi-Location Pricing Matrix**: Dynamic tabbed pricing component ([`PricingTabs.tsx`](src/components/sections/PricingTabs.tsx)) filtering machine inventory, wash cycle durations, and Speed Queen loyalty card discounts per branch with smooth Framer Motion transitions.
- **Custom Inline Micro-Markup Parser**: Lightweight regex tokenizer ([`FormattedText.tsx`](src/components/ui/FormattedText.tsx), [`config-formatter.ts`](src/config/config-formatter.ts)) that parses custom token delimiters (`[[...]]`, `{{...}}`, `!!...!!`) to inject branded styles and tags directly into localized string configurations without external markdown dependencies.
- **Hardware-Accelerated Infinite Collage**: Optimized dual-track background marquee ([`CollageBackground.tsx`](src/components/ui/CollageBackground.tsx)) utilizing GPU transforms (`translateZ(0)`, `backface-visibility: hidden`) with responsive aspect configurations across mobile and desktop.

---

## Project Structure

```text
speedqueen-next/
├── app/
│   ├── [lang]/                     # Localized route tree (/pl, /en)
│   │   ├── gallery/                # Photo gallery route
│   │   │   └── page.tsx
│   │   ├── layout.tsx              # Root layout (fonts, navigation, JSON-LD, metadata)
│   │   ├── opengraph-image.jpg     # Dynamic OpenGraph cover
│   │   └── page.tsx                # Main landing page composition
│   ├── api/
│   │   ├── promo-check/            # Statistical visit counter endpoint
│   │   └── qr/[key]/               # Cloudflare R2 QR code streaming endpoint
│   ├── favicon.ico
│   ├── robots.ts                   # Dynamic robots.txt
│   └── sitemap.ts                  # Dynamic sitemap.xml
├── discount_qr_codes/              # Source BMP promotional QR code assets
├── public/                         # Static images and icons
├── scripts/                        # Database seeding & verification utilities (Neon, R2)
│   ├── check-db.js
│   ├── seed-discounts.js
│   └── seed-visit-counter.js
├── src/
│   ├── actions/                    # Next.js Server Actions (promo claim, email, reviews)
│   ├── components/
│   │   ├── emails/                 # React Email templates (ContactFormEmail)
│   │   ├── layout/                 # Navbar, Footer, SocialSidebar
│   │   ├── modals/                 # PromoModal, BaseModal, StatusModal, DiscountClaim
│   │   ├── sections/               # Hero, Instructions, PricingTabs, Faq, Contact, Gallery
│   │   ├── seo/                    # Structured data components (JsonLdBase, JsonLdHomePage)
│   │   └── ui/                     # FormattedText, AnnouncementBar, Backgrounds, Buttons
│   ├── config/                     # Static site configurations & i18n dictionaries (en, pl)
│   ├── hooks/                      # Custom React hooks (useActiveSection)
│   ├── lib/                        # Helpers (validation, directions, Cloudflare loader)
│   └── styles/                     # Tailwind CSS v4 theme and keyframe definitions
├── middleware.ts                   # Edge middleware (Accept-Language locale routing)
├── next.config.ts                  # Next.js configuration & custom image loaders
├── open-next.config.ts             # OpenNext Cloudflare integration config
├── package.json
├── tsconfig.json
└── wrangler.toml                   # Cloudflare Workers / R2 binding configuration
```

---

## Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-sample-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
# Transactional Email (Resend)
RESEND_API_KEY=re_123456789
RESEND_TO_EMAIL=kontakt@speedqueenkrk.pl
ADMIN_EMAIL=admin@speedqueenkrk.pl
# Google Places API (Location Reviews & Ratings)
GOOGLE_PLACES_API_KEY=AIzaSySampleKey123456789
NEXT_PUBLIC_GOOGLE_PLACEID_ORLINSKIEGO=ChIJXw81dFBbFkcR37QA2sxXPU0
NEXT_PUBLIC_GOOGLE_PLACEID_PAWIA=ChIJ5zIcehhbFkcRg5JAJS7ICZo
NEXT_PUBLIC_GOOGLE_PLACEID_SLOWACKIEGO=ChIJLzFV3tFbFkcRri72hyj1PCI
# Application & Security
NEXT_PUBLIC_BASE_URL=https://speedqueenkrk.pl
HASH_SALT=your-cryptographic-hash-salt
# Promotional Campaign Schedule (ISO 8601)
PROMO_START_DATE=2026-03-30T00:00:00+01:00
PROMO_END_DATE=2026-06-30T23:59:59+02:00
# Cloudflare R2 Credentials (for local database & asset seeding scripts)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
```

---

## Development & Deployment

```sh
# Install dependencies
npm install
# Start local development server
npm run dev
# Run ESLint validation
npm run lint
# Generate Cloudflare Worker TypeScript bindings
npm run cf-typegen
# Build & preview Cloudflare Workers bundle locally
npm run preview
# Deploy to Cloudflare Workers / Pages
npm run deploy
```
